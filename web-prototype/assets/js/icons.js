/* ============================================================
   JobEzz — Professional SVG icon system (brand-consistent)
   Line icons (navy/blue) + 29 service-category drawings.
   Replaces emoji UI icons; emoji remain in friendly copy only.
   ============================================================ */
function svgWrap(inner, size, color, sw) {
  size = size || 24; color = color || '#123B5E'; sw = sw || 2;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

/* Failsafe fallback definitions */
window.ico = function(name, size, color, sw) {
  if (typeof ICON_INNER !== 'undefined' && ICON_INNER[name]) {
    return svgWrap(ICON_INNER[name], size || 24, color || '#123B5E', sw || 2);
  }
  return '';
};
window.catIcon = function(id, size, color) {
  if (typeof CAT_INNER !== 'undefined' && (CAT_INNER[id] || CAT_INNER.plumber)) {
    return svgWrap(CAT_INNER[id] || CAT_INNER.plumber, size || 24, color || '#123B5E', 1.8);
  }
  return '';
};

/* ---- Navigation + action icons (inner SVG) ---- */
var ICON_INNER = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/>',
  jobs: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  services: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/><path d="M12 12v3"/>',
  courses: '<path d="M4 5h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M15 8h4a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2"/><path d="M8 4v3M11 4v3"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  back: '<path d="M14 6l-6 6 6 6"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  pin: '<path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  star: '<path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z" fill="#F5A623" stroke="none"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  play: '<path d="M8 5v14l11-7z" fill="#123B5E" stroke="none"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h6"/>',
  gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.5 4.5 12 8M12 8s2-5 4.5-3.5S12 8 12 8z"/>',
  flag: '<path d="M4 21V4h13l-2 4 2 4H4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h.01M21 10V8a2 2 0 0 0-2-2H5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.3-1.3L14 3h-4l-.3 2.4a7 7 0 0 0-2.3 1.3l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-1c.7.6 1.5 1 2.3 1.3L10 21h4l.3-2.4c.8-.3 1.6-.7 2.3-1.3l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M11 18h2v4"/>',
  school: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>'
};

/* ---- 29 service-category drawings (inner SVG) ---- */
var CAT_INNER = {
  plumber: '<path d="M15 4a4 4 0 0 0-4.5 5.2L8 12l3 3 2.8-2.5A4 4 0 0 0 19 8a4 4 0 0 0-4-4z"/><path d="M6 18l2.5-2.5"/><path d="M12 2c1 1.6 1.8 2.6 1.8 3.6a1.8 1.8 0 0 1-3.6 0C10.2 4.6 11 3.6 12 2z"/>',
  electrician: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  carpenter: '<path d="M3 20h18"/><path d="M6 20l4-9 3 3 2-6 2 1-1 6 4 1-1 3-3-1-1 3z"/>',
  painter: '<rect x="4" y="4" width="7" height="4" rx="1"/><path d="M7.5 8v8M5 20h5"/>',
  ac: '<path d="M12 2v20M12 6l-3-3M12 6l3-3M12 12l-3-3M12 12l3-3M12 18l-3-3M12 18l3-3"/><circle cx="12" cy="12" r="2"/>',
  mechanic: '<path d="M5 13l2-2 4 4-2 2zM3 16l2 2 3-3M14 6l4 4M16 4l4 4-9 9-4-4z"/>',
  appliance: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 9h12M9 6v2M9 13h6v5H9z"/>',
  mason: '<rect x="3" y="9" width="8" height="4"/><rect x="13" y="9" width="8" height="4"/><rect x="3" y="15" width="8" height="4"/><rect x="13" y="15" width="8" height="4"/><rect x="11" y="3" width="2" height="4"/>',
  welder: '<path d="M12 3v4M9 7h6l-1 4h-4zM12 11v3M8 18h8M10 18l-1 3M14 18l1 3"/>',
  tiler: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  gypsum: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 10h16M10 4v16"/>',
  satellite: '<path d="M4 14a8 8 0 0 1 8-8M6 12a4 4 0 0 1 4-4"/><circle cx="12" cy="12" r="2"/><path d="M12 12l8-5M12 12l-5 8"/>',
  locksmith: '<circle cx="9" cy="9" r="4"/><path d="M11 11l8 8M16 16l2-2M14 18l-2 2"/>',
  aluminum: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16M3 12h18"/>',
  generator: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  solar: '<rect x="3" y="5" width="18" height="10" rx="1"/><path d="M3 9h18M3 13h18M9 5v10M15 5v10M12 15v5M9 20h6"/>',
  mover: '<path d="M3 7l3-3h11l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M8 20a2 2 0 1 0 0-.01M18 20a2 2 0 1 0 0-.01"/><path d="M8 12h8"/>',
  water: '<path d="M3 7l3-3h9l3 3v9H3z"/><path d="M7 16a2 2 0 1 0 0 .01M16 16a2 2 0 1 0 0 .01"/><path d="M10 3c1 1.4 1.6 2.2 1.6 3a1.6 1.6 0 0 1-3.2 0C8.4 5.2 9 4.4 10 3z"/>',
  cargo: '<path d="M2 6h11v9H2zM13 9h5l3 3v3h-8z"/><circle cx="6" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
  cleaning: '<path d="M14 3l3 3-7 7-3-3zM11 13l-5 5M7 17l-2 2M16 8l3 3"/>',
  pest: '<circle cx="12" cy="12" r="3"/><path d="M12 9V5M12 15v4M9 11H5M15 11h4M9.5 9.5 6 6M14.5 9.5 18 6M14.5 14.5 18 18"/>',
  garden: '<path d="M12 21V11"/><path d="M12 11C8 11 5 8 5 4c4 0 7 3 7 7zM12 11c4 0 7-3 7-7-4 0-7 3-7 7z"/>',
  tailor: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7l8 4-8 4"/>',
  photo: '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 5"/>',
  tutor: '<path d="M4 5h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M15 8h4v9a2 2 0 0 1-2 2"/><path d="M8 4v3M11 4v3"/>',
  driver: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="7"/>',
  chef: '<path d="M5 11a2 2 0 0 1 4 0 2 2 0 0 1 4 0 2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M12 16v5"/>',
  event: '<path d="M12 3v4M8 5h8"/><path d="M5 9l2 8 5-3 5 3 2-8z"/>',
  barber: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7l8 4-8 4"/>'
};
CAT_INNER.default = CAT_INNER.plumber;

/* Global alias so CATS is NEVER undefined */
var CATS = CAT_INNER;
window.CATS = CATS;

/* ---- Professional illustrations (onboarding + empty states) ---- */
var ILL_INNER = {
  jobs: '<rect x="3" y="8" width="18" height="12" rx="2" stroke="#123B5E"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#123B5E"/><path d="M3 12h18" stroke="#4AA3E0"/><circle cx="12" cy="15" r="1.6" fill="#4AA3E0" stroke="none"/>',
  services: '<circle cx="12" cy="12" r="9" stroke="#123B5E"/><path d="M15 4a4 4 0 0 0-4.5 5.2L8 12l3 3 2.8-2.5A4 4 0 0 0 19 8a4 4 0 0 0-4-4z" stroke="#4AA3E0"/><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" stroke="#4AA3E0"/><path d="M12 10.5a1.5 1.5 0 0 1 0 3" stroke="#4AA3E0"/>',
  courses: '<path d="M3 8l9-4 9 4-9 4z" stroke="#123B5E"/><path d="M7 10v5c0 1 2 2 5 2s5-1 5-2v-5" stroke="#4AA3E0"/><path d="M21 8v5" stroke="#4AA3E0"/>',
  empty: '<circle cx="12" cy="12" r="9" stroke="#8A97A3"/><path d="M8 14c1.5 1.5 6.5 1.5 8 0" stroke="#8A97A3"/><circle cx="9" cy="10" r="1" fill="#8A97A3" stroke="none"/><circle cx="15" cy="10" r="1" fill="#8A97A3" stroke="none"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#8A97A3"/>'
};
window.ILLUSTRATIONS = {};
Object.keys(ILL_INNER).forEach(function (k) { window.ILLUSTRATIONS[k] = svgWrap(ILL_INNER[k], 120, '#123B5E', 1.6); });
window.ill = function (name, size, color) { return svgWrap(ILL_INNER[name] || ILL_INNER.empty, size || 120, color || '#123B5E', 1.6); };

/* ---- public API ---- */
window.ICONS = {};
Object.keys(ICON_INNER).forEach(function (k) { window.ICONS[k] = svgWrap(ICON_INNER[k]); });
window.ICONS.star = svgWrap(ICON_INNER.star, 24, '#F5A623', 0);
window.ICONS.play = svgWrap(ICON_INNER.play, 24, '#123B5E', 0);
window.catInner = CAT_INNER;
window.catIcon = function (id, size, color) {
  var inner = CAT_INNER[id] || CAT_INNER.default;
  return svgWrap(inner, size || 24, color || '#123B5E', 1.8);
};
window.ico = function (name, size, color, sw) {
  if (!ICON_INNER[name]) return '';
  return svgWrap(ICON_INNER[name], size || 24, color || '#123B5E', sw || 2);
};
