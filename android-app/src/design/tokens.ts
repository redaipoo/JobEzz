/**
 * JobEzz Design Tokens
 * ====================
 * Single source of truth for the app's visual language. Pure constants only:
 * palette, typography, spacing, radii, elevation, motion and layout.
 *
 * The identity is an evolved "deep navy night": layered off-black blues,
 * a single luminous blue accent, and gold reserved strictly for
 * provider / premium moments. No purple, no AI gradient slop, no pure #000.
 *
 * Rules enforced here:
 *  - One radius scale (8/12/16/20/24). Nothing hardcodes radii elsewhere.
 *  - One shadow scale, tinted off-black (never pure black).
 *  - One accent; semantic colors are muted/desaturated for dark surfaces.
 *  - Type scale uses the installed Tajawal family for Arabic-first rendering.
 *
 * This module must never import from other design modules (no cycles).
 */
import { StyleSheet } from 'react-native';

/* ═══════════════════════════════════════════════
 * 1. PALETTE
 * ═══════════════════════════════════════════════ */

export const palette = {
  /* Backgrounds (deep navy night, darkest first) */
  bg0: '#070C16',
  bg1: '#0B1120',
  bg2: '#101A2E',
  bg3: '#17223A',
  bg4: '#1E2B47',

  /* Translucent surfaces on dark */
  surface:    'rgba(255,255,255,0.05)',
  surfaceHi:  'rgba(255,255,255,0.09)',
  surfaceTop: 'rgba(255,255,255,0.14)',

  /* Borders / dividers */
  border:        'rgba(255,255,255,0.08)',
  borderHi:      'rgba(255,255,255,0.15)',
  borderAccent:  'rgba(91,157,255,0.42)',
  divider:       'rgba(255,255,255,0.06)',

  /* Text (measured on bg1) */
  textHi:       '#F4F8FF',
  text:         '#D6E0EE',
  textMid:      '#9FB3CC',
  textLow:      '#7C90AB',
  textDisabled: 'rgba(214,224,238,0.35)',

  /* Accent (one luminous blue) */
  accent:     '#5B9DFF',
  accent600:  '#3B7DE8',
  accent100:  '#9CC2FF',
  accentGlow: 'rgba(91,157,255,0.22)',
  accentSoft: 'rgba(91,157,255,0.10)',

  /* Semantic */
  success:   '#3ECF8E',
  successBg: 'rgba(62,207,142,0.15)',
  warning:   '#F0A43C',
  warningBg: 'rgba(240,164,60,0.15)',
  danger:    '#F26D6D',
  dangerBg:  'rgba(242,109,109,0.14)',
  gold:      '#E8C26E',
  goldBg:    'rgba(232,194,110,0.15)',

  /* Trade-category accents (luminous on dark), applied via categoryColors */
  catBlue:      '#5CA8FF',
  catAmber:     '#F5A94C',
  catTeal:      '#4AD6BC',
  catViolet:    '#B085F5',
  catGreen:     '#4ECF7E',
  catRose:      '#FF7A93',
  catSlate:     '#8FA3BC',
  catGold:      '#E3C778',
  catMason:     '#A8B7C8',
  catTiler:     '#6FB7F0',
  catGypsum:    '#C6CFDB',
  catSatellite: '#5EA3E8',
  catLocksmith: '#F7B94E',
  catAluminum:  '#9DB2C6',
  catGenerator: '#7E93B0',
  catSolar:     '#F7DD5A',
  catTailor:    '#C085E8',

  /* Gradients */
  gradientHero:    ['#16294E', '#0C1425'] as [string, string],
  gradientScreen:  ['#0B1120', '#0D1524'] as [string, string],
  gradientAccent:  ['#5B9DFF', '#3B7DE8'] as [string, string],
  gradientCard:    ['#1C2946', '#141C30'] as [string, string],
  gradientWarm:    ['#3A2C17', '#2C2110'] as [string, string],
  gradientGold:    ['#E8C26E', '#C99B3F'] as [string, string],
  gradientService: ['#F5A94C', '#E8842E'] as [string, string],
} as const;

export type Palette = typeof palette;

/* Category accent map (services + jobs) — single source of truth. */
export const categoryColors: Record<string, string> = {
  plumber:    palette.catBlue,
  electrician: palette.catAmber,
  carpenter:  palette.catGold,
  painter:    palette.catViolet,
  ac:         palette.catTeal,
  mechanic:   palette.catSlate,
  appliance:  palette.catGreen,
  mason:      palette.catMason,
  welder:     palette.catRose,
  tiler:      palette.catTiler,
  gypsum:     palette.catGypsum,
  satellite:  palette.catSatellite,
  locksmith:  palette.catLocksmith,
  aluminum:   palette.catAluminum,
  generator:  palette.catGenerator,
  solar:      palette.catSolar,
  mover:      palette.catAmber,
  water:      palette.catTiler,
  cargo:      palette.catMason,
  cleaning:   palette.success,
  pest:       palette.catRose,
  garden:     palette.catGreen,
  tailor:     palette.catTailor,
  photo:      palette.catRose,
  tutor:      palette.catTiler,
  driver:     palette.catLocksmith,
  chef:       palette.catRose,
  event:      palette.catViolet,
  barber:     palette.catTeal,
};

/* ═══════════════════════════════════════════════
 * 2. TYPOGRAPHY (Arabic-first Tajawal)
 * ═══════════════════════════════════════════════ */

export const typ = {
  displayLg: { fontFamily: 'Tajawal_800ExtraBold', fontSize: 34, lineHeight: 42, letterSpacing: -0.2 },
  display:   { fontFamily: 'Tajawal_800ExtraBold', fontSize: 29, lineHeight: 38, letterSpacing: 0 },
  h1:        { fontFamily: 'Tajawal_800ExtraBold', fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  h2:        { fontFamily: 'Tajawal_700Bold',      fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  h3:        { fontFamily: 'Tajawal_700Bold',      fontSize: 17, lineHeight: 24, letterSpacing: 0 },
  h4:        { fontFamily: 'Tajawal_700Bold',      fontSize: 15, lineHeight: 21, letterSpacing: 0 },
  body:      { fontFamily: 'Tajawal_400Regular',   fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  bodyS:     { fontFamily: 'Tajawal_400Regular',   fontSize: 13, lineHeight: 20, letterSpacing: 0 },
  caption:   { fontFamily: 'Tajawal_500Medium',    fontSize: 11, lineHeight: 16, letterSpacing: 0.2 },
  label:     { fontFamily: 'Tajawal_700Bold',      fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  button:    { fontFamily: 'Tajawal_700Bold',      fontSize: 16, lineHeight: 22, letterSpacing: 0.3 },
  overline:  { fontFamily: 'Tajawal_800ExtraBold', fontSize: 10, lineHeight: 14, letterSpacing: 1.5 },
} as const;

export type Typ = typeof typ;

/* ═══════════════════════════════════════════════
 * 3. SPACING (8pt grid)
 * ═══════════════════════════════════════════════ */

export const sp = {
  xs:    4,
  sm:    8,
  md:    12,
  base:  16,
  lg:    20,
  xl:    24,
  xxl:   32,
  xxxl:  48,
  screen:  20,
  section: 32,
} as const;

export type Spacing = typeof sp;

/* ═══════════════════════════════════════════════
 * 4. RADII (one locked scale)
 * ═══════════════════════════════════════════════ */

export const r = {
  xs:   8,
  sm:   12,
  md:   16,
  lg:   20,
  xl:   24,
  pill: 999,
  card: 20,
  thumb: 12,
} as const;

export type Radii = typeof r;

/* ═══════════════════════════════════════════════
 * 5. ELEVATION (tinted off-black, never pure #000)
 * ═══════════════════════════════════════════════ */

const shadow = (
  elevation: number,
  opacity: number,
  radius: number,
  y: number,
  color = '#00030C',
) => ({
  elevation,
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
}) as const;

export const sh = {
  flat:     shadow(0, 0, 0, 0),
  sm:       shadow(2, 0.30, 8, 2),
  md:       shadow(4, 0.40, 14, 4),
  lg:       shadow(8, 0.50, 22, 6),
  xl:       shadow(14, 0.60, 30, 10),
  glow:     shadow(10, 0.40, 24, 0, '#5B9DFF'),
  glowSoft: shadow(3, 0.32, 8, 0, '#5B9DFF'),
  goldGlow: shadow(10, 0.38, 24, 0, '#E8C26E'),
} as const;

export type Shadows = typeof sh;

/* ═══════════════════════════════════════════════
 * 6. MOTION
 * ═══════════════════════════════════════════════ */

export const motion = {
  duration: { micro: 120, fast: 200, normal: 300, slow: 450, xslow: 600 },
  spring: {
    soft:   { damping: 18, stiffness: 220, mass: 0.9 },
    snap:   { damping: 26, stiffness: 380, mass: 0.8 },
    bounce: { damping: 12, stiffness: 150, mass: 1.0 },
    smooth: { damping: 22, stiffness: 180, mass: 1.0 },
  },
  stagger: { card: 70, list: 50, hero: 90 },
  ease: {
    out:    [0.16, 1, 0.3, 1]    as [number, number, number, number],
    inOut:  [0.65, 0, 0.35, 1]   as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
} as const;

export type Motion = typeof motion;

/* ═══════════════════════════════════════════════
 * 7. LAYOUT / SAFE AREA
 * ═══════════════════════════════════════════════ */

export const layout = {
  tapMin:          44,
  headerH:         54,
  bottomNavH:      64,
  bottomNavPad:    8,
  maxContentW:     520,
  screenPadX:      sp.screen,
  screenPadBottom: sp.xxxl + 8,
} as const;

/* Extra clearance so content scrolls above the floating tab bar. */
export const TAB_BAR_CLEARANCE = layout.bottomNavH + layout.bottomNavPad + sp.lg;

/* ═══════════════════════════════════════════════
 * 8. SHARED STYLE PRESETS (fragments screens compose)
 * ═══════════════════════════════════════════════ */

export const preset = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: palette.bg1 },
  screenPad:  { paddingHorizontal: sp.screen },

  card: {
    backgroundColor: palette.bg3,
    borderRadius: r.card,
    padding: sp.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardElevated: { backgroundColor: palette.bg4, borderColor: palette.borderHi },
  cardFlat:     { backgroundColor: palette.surface, borderColor: palette.border },

  glass: {
    backgroundColor: palette.surfaceHi,
    borderRadius: r.lg,
    borderWidth: 1,
    borderColor: palette.borderHi,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sp.md,
    paddingVertical: sp.xs + 2,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pillActive: { backgroundColor: palette.accent, borderColor: palette.accent },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: r.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textHi:    { color: palette.textHi },
  textBody:  { color: palette.text,   ...typ.body },
  textMid:   { color: palette.textMid, ...typ.bodyS },
  textLow:   { color: palette.textLow, ...typ.bodyS },
  textLabel: { color: palette.textMid, ...typ.label },

  divider: { height: 1, backgroundColor: palette.divider, marginVertical: sp.md },

  btn: {
    borderRadius: r.md,
    paddingVertical: sp.base + 2,
    paddingHorizontal: sp.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
