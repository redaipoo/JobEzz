/**
 * JobEzz Unified Design System
 * ============================
 * The public entry point for the design language. Screens and shared UI
 * import tokens and primitives from here (or from `../ui` for composed
 * components). Nothing in a screen may hardcode colors, spacing, radii,
 * shadows or font sizes.
 *
 * Pure tokens live in `./tokens` (no cycles); motion and depth helpers are
 * re-exported from their modules.
 */
export {
  palette,
  categoryColors,
  typ,
  sp,
  r,
  sh,
  motion,
  layout,
  preset,
  TAB_BAR_CLEARANCE,
} from './tokens';

export type {
  Palette,
  Typ,
  Spacing,
  Radii,
  Shadows,
  Motion,
} from './tokens';

/* Legacy alias — `type` shadows the TS keyword at call sites, so `typ` is
 * preferred. Kept only so in-flight code keeps compiling during migration. */
export { typ as type } from './tokens';

export {
  useEntrance,
  useStagger,
  StaggerItem,
  PressableScale,
  PulseDot,
  FadeInView,
  useShimmer,
  ShimmerBox,
  useScrollHeader,
  SkeletonList,
  useReducedMotion,
} from './motion';

export {
  DepthGradient,
  AmbientGlow,
  DepthScreen,
} from './depth';

export const FONT = { ar: 'Tajawal', en: 'Inter' } as const;
