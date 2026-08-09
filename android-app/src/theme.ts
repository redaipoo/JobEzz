/**
 * JobEzz — Premium Design System v2 (LEGACY COMPATIBILITY LAYER)
 * ═══════════════════════════════════════════════════════════════════
 * The canonical design tokens live in `src/design/tokens.ts` and are the
 * single source of truth. This module keeps the legacy `COLORS / R / GLASS /
 * NEO / PREMIUM_COLORS / CATEGORY_COLORS / GRADIENTS` names for existing
 * screens/components. New code must import from `src/design` directly.
 *
 * Shared values (accent, semantic colors, category colors) are referenced
 * from the tokens — never duplicated here.
 * ═══════════════════════════════════════════════════════════════════
 */
import { palette, categoryColors } from './design/tokens';
import type {
  Theme, ThemeColors, SpacingScale, TypographyScale, RadiiScale, ShadowDef, ColorScheme,
} from './types';

/* ─────────────────────────────────────────────
 * Color Palettes — Deep Navy Gradient System
 * ───────────────────────────────────────────── */

const lightColors: ThemeColors = {
  navy: '#0F2744',
  navy700: '#0A1929',
  navy600: '#153A5F',
  blue: '#4AA3E0',
  blue600: '#2E8BD0',
  blue100: '#E4F1FB',
  white: '#FFFFFF',
  grayBg: '#F0F2F5',
  gray100: '#F3F5F7',
  gray200: '#E2E6EB',
  gray300: '#D1D6DD',
  gray500: '#7A8694',
  gray700: '#4A5560',
  ink: '#0F1A24',
  success: '#2ECC71',
  successBg: '#E7F9EF',
  warning: '#F5A623',
  warningBg: '#FEF4E3',
  danger: '#E74C3C',
  dangerBg: '#FDECEA',
  cardBg: '#FFFFFF',
  text: '#0F1A24',
  textSecondary: '#7A8694',
  border: '#E2E6EB',
  tabBarBg: '#FFFFFF',
};

const darkColors: ThemeColors = {
  navy: '#4AA3E0',
  navy700: '#2E8BD0',
  navy600: '#1A5276',
  blue: palette.accent,
  blue600: '#3B7DE8',
  blue100: '#1A2B45',
  white: '#17223A',
  grayBg: '#0B1120',
  gray100: '#101A2E',
  gray200: '#1A2B45',
  gray300: '#2A3B5C',
  gray500: '#8FA3BC',
  gray700: '#D6E0EE',
  ink: '#F4F8FF',
  success: palette.success,
  successBg: 'rgba(62,207,142,0.12)',
  warning: palette.warning,
  warningBg: 'rgba(240,164,60,0.12)',
  danger: palette.danger,
  dangerBg: 'rgba(242,109,109,0.12)',
  cardBg: '#17223A',
  text: '#F4F8FF',
  textSecondary: '#9FB3CC',
  border: 'rgba(255,255,255,0.12)',
  tabBarBg: '#0B1120',
};

/* ─────────────────────────────────────────────
 * Spacing Scale (4px base, tripled negative space)
 * ───────────────────────────────────────────── */

export const SPACING: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/* ─────────────────────────────────────────────
 * Typography Scale — Professional Arabic Hierarchy
 * ───────────────────────────────────────────── */

export const TYPOGRAPHY: TypographyScale = {
  h1: { fontSize: 30, fontWeight: '800', lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 18, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  bodyBold: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 17 },
  button: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
};

/* ─────────────────────────────────────────────
 * Border Radii — Precise R System
 * R=20 large cards, R=14 medium, R=8 badges, R=0 panels
 * ───────────────────────────────────────────── */

export const RADII: RadiiScale = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 999,
};

/* ─────────────────────────────────────────────
 * Shadows — Neomorphic Depth System
 * Raised elements: dark outer + subtle light inner
 * ───────────────────────────────────────────── */

const makeShadow = (
  elevation: number,
  opacity: number,
  radius: number,
  offsetY: number,
  color = '#000000',
): ShadowDef => ({
  elevation,
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: offsetY },
});

export const SHADOWS: Record<'sm' | 'md' | 'lg' | 'neo' | 'neoInset', ShadowDef> = {
  sm: makeShadow(3, 0.12, 6, 2),
  md: makeShadow(6, 0.18, 12, 4),
  lg: makeShadow(12, 0.24, 24, 8),
  neo: makeShadow(8, 0.35, 16, 4, '#000000'),
  neoInset: makeShadow(0, 0, 0, 0),
};

/* ─────────────────────────────────────────────
 * Composed Theme Objects
 * ───────────────────────────────────────────── */

export const lightTheme: Theme = {
  colors: lightColors,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  radii: RADII,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  shadows: {
    sm: makeShadow(3, 0.22, 6, 2, '#000000'),
    md: makeShadow(6, 0.32, 12, 4, '#000000'),
    lg: makeShadow(12, 0.44, 24, 8, '#000000'),
    neo: makeShadow(10, 0.50, 20, 6, '#000000'),
    neoInset: makeShadow(0, 0, 0, 0),
  },
  radii: RADII,
};

export function getTheme(scheme: ColorScheme): Theme {
  return scheme === 'dark' ? darkTheme : lightTheme;
}

/* ─────────────────────────────────────────────
 * Backward-compatible exports
 * ───────────────────────────────────────────── */

export const COLORS = darkColors;
export const FONT = { ar: 'Tajawal', en: 'Inter' } as const;
export const R = RADII;
export const SH = SHADOWS;

/* ─────────────────────────────────────────────
 * Premium Design System — v2
 * ───────────────────────────────────────────── */

/** Deep navy gradient stops for background */
export const GRADIENTS = {
  navyDeep: ['#070E1A', '#0A1929', '#0F2744'],
  navyMid: ['#0A1929', '#0F2744', '#153A5F'],
  hero: ['#0A1420', '#0F2744'],
  header: ['#0C1824', '#122030'],
  card: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)'],
  warmIndigo: ['#1A1040', '#0F2744', '#0A3D5C'],
} as const;

/** Frosted glass styles */
export const GLASS = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  darkRaised: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  navy: {
    backgroundColor: 'rgba(18, 59, 94, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  elevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

/** Premium accent colors */
export const PREMIUM_COLORS = {
  gold: '#D4A843',
  goldLight: '#F5E6C3',
  goldMuted: 'rgba(212, 168, 67, 0.15)',
  navyDeep: '#070E1A',
  navyMid: '#0A1929',
  navyLight: '#0F2744',
  blueBright: '#4AA3E0',
  blueGlow: 'rgba(74, 163, 224, 0.15)',
  gradientStart: '#123B5E',
  gradientEnd: '#1A5276',
} as const;

/** Category-specific accent colors — canonical map lives in design/tokens */
export const CATEGORY_COLORS: Record<string, string> = categoryColors;

/* ─────────────────────────────────────────────
 * Neomorphic Utility Styles (inline helpers)
 * ───────────────────────────────────────────── */

export const NEO = {
  /** Raised neomorphic card on dark bg */
  raised: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  /** Elevated neomorphic card */
  elevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  /** Subtle flat card */
  flat: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
  },
  /** Pressed/sunken effect */
  inset: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
  },
  /** Badge/Tag style */
  badge: {
    backgroundColor: 'rgba(74, 163, 224, 0.12)',
    borderColor: 'rgba(74, 163, 224, 0.18)',
    borderWidth: 1,
  },
} as const;
