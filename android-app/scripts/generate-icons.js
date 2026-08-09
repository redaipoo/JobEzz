/**
 * JobEzz — Icon/Splash asset generator (pure Node, no deps)
 * Produces:
 *   assets/icon.png            — 1024×1024 legacy full-bleed app icon
 *   assets/adaptive-icon.png   — 1024×1024 transparent foreground (Android safe-zone)
 *   assets/splash-icon.png     — 1024×1024 transparent mark for native splash
 */
/* eslint-env node */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const S = 1024; // canvas size

/* ── PNG encoder ─────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  const src = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter: none
    src.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ── Palette (matches design/tokens) ─────────── */
const NAVY_TOP = [18, 59, 94];    // #123B5E
const NAVY_BOTTOM = [10, 25, 41]; // #0A1929
const ACCENT = [74, 163, 224];    // #4AA3E0
const GOLD = [212, 168, 67];      // #D4A843

/* ── Geometry helpers (unit space: canvas 1000, origin = mark center) ── */
// mark bounds in unit space:
const MARK = {
  stem:  { a: [-115, -230], b: [-115, 110], r: 88 },      // left vertical
  bowl:  { a: [-115, 135], b: [25, 135], r: 88 },          // bottom hook
  tick:  { a: [25, 135], b: [25, 65], r: 78 },             // upward tick
  dot:   { cx: 160, cy: -180, r: 60 },                     // gold accent dot
};
const MARK_MIN_Y = -318; // -230-88
const MARK_MAX_Y = 223;  // 135+88
const MARK_CY = (MARK_MIN_Y + MARK_MAX_Y) / 2;

function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function sdRoundRect(px, py, cx, cy, hw, hh, rad) {
  const qx = Math.abs(px - cx) - (hw - rad);
  const qy = Math.abs(py - cy) - (hh - rad);
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - rad;
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));
// 1px anti-aliased coverage
const cov = (d) => clamp01(0.5 - d);

/* ── Renderers ───────────────────────────────── */
function newCanvas() {
  return { w: S, h: S, px: new Uint8Array(S * S * 4) };
}
function put(canvas, x, y, rgba) {
  const i = (y * canvas.w + x) * 4;
  const a = rgba[3] / 255;
  if (a <= 0) return;
  if (a >= 1) {
    canvas.px[i] = rgba[0]; canvas.px[i + 1] = rgba[1];
    canvas.px[i + 2] = rgba[2]; canvas.px[i + 3] = 255;
  } else {
    const ia = 1 - a;
    canvas.px[i] = Math.round(rgba[0] * a + canvas.px[i] * ia);
    canvas.px[i + 1] = Math.round(rgba[1] * a + canvas.px[i + 1] * ia);
    canvas.px[i + 2] = Math.round(rgba[2] * a + canvas.px[i + 2] * ia);
    canvas.px[i + 3] = Math.round(255 * a + canvas.px[i + 3] * ia);
  }
}

// fill full canvas with a color/gradient via per-pixel fn (x,y in px) -> rgba or null
function fill(canvas, fn) {
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const c = fn(x, y);
      if (c) put(canvas, x, y, c);
    }
  }
}

// draw the J mark centered at (cx, cy) with scale s (unit→px)
function drawMark(canvas, cx, cy, s, color = [255, 255, 255]) {
  const T = (x, y) => [cx + x * s, cy + (y - MARK_CY) * s];
  const capsules = [MARK.stem, MARK.bowl, MARK.tick];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let d = Infinity;
      for (const cp of capsules) {
        const [ax, ay] = T(cp.a[0], cp.a[1]);
        const [bx, by] = T(cp.b[0], cp.b[1]);
        d = Math.min(d, distSeg(x, y, ax, ay, bx, by) - cp.r * s);
      }
      const [dx, dy] = T(MARK.dot.cx, MARK.dot.cy);
      const dd = Math.hypot(x - dx, y - dy) - MARK.dot.r * s;
      const a = cov(d);
      const ad = cov(dd);
      if (a > 0) put(canvas, x, y, [color[0], color[1], color[2], Math.round(a * 255)]);
      if (ad > 0) put(canvas, x, y, [GOLD[0], GOLD[1], GOLD[2], Math.round(ad * 255)]);
    }
  }
}

// soft accent glow behind the mark
function drawGlow(canvas, cx, cy, s, radius, alpha) {
  const R = radius * s;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > R) continue;
      const g = 1 - d / R;
      put(canvas, x, y, [ACCENT[0], ACCENT[1], ACCENT[2], Math.round(g * g * alpha * 255)]);
    }
  }
}

/* ── 1. Legacy full-bleed icon ───────────────── */
{
  const c = newCanvas();
  fill(c, (x, y) => {
    const t = (x + y) / (2 * S);
    const d = sdRoundRect(x, y, S / 2, S / 2, S / 2, S / 2, 220);
    const a = cov(d);
    if (a <= 0) return null;
    const r = Math.round(NAVY_TOP[0] + (NAVY_BOTTOM[0] - NAVY_TOP[0]) * t);
    const g = Math.round(NAVY_TOP[1] + (NAVY_BOTTOM[1] - NAVY_TOP[1]) * t);
    const b = Math.round(NAVY_TOP[2] + (NAVY_BOTTOM[2] - NAVY_TOP[2]) * t);
    return [r, g, b, Math.round(a * 255)];
  });
  // subtle inner ring
  fill(c, (x, y) => {
    const d = Math.abs(sdRoundRect(x, y, S / 2, S / 2, S / 2 - 14, S / 2 - 14, 206)) - 3;
    const a = cov(d) * 0.35;
    return a > 0 ? [255, 255, 255, Math.round(a * 255)] : null;
  });
  drawMark(c, S / 2, S / 2 + 6, 1.02);
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'icon.png'), encodePNG(S, S, c.px));
  console.log('icon.png written');
}

/* ── 2. Adaptive foreground (transparent) ────── */
{
  const c = newCanvas();
  drawGlow(c, S / 2, S / 2, 420, 0.75, 0.30);
  drawMark(c, S / 2, S / 2 + 8, 0.62);
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'adaptive-icon.png'), encodePNG(S, S, c.px));
  console.log('adaptive-icon.png written');
}

/* ── 3. Splash mark (transparent) ────────────── */
{
  const c = newCanvas();
  drawGlow(c, S / 2, S / 2, 480, 0.85, 0.35);
  drawMark(c, S / 2, S / 2 + 10, 0.88);
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'splash-icon.png'), encodePNG(S, S, c.px));
  console.log('splash-icon.png written');
}
