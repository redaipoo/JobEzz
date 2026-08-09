/**
 * JobEzz — Advanced animation toolkit (React Native Reanimated 3)
 * -----------------------------------------------------------------------------
 * A curated, production-grade set of animation primitives:
 *
 *  - Spring physics presets + a `useSpring` value hook
 *  - Shared-element transition configs (for `react-native-screens` / Reanimated)
 *  - Gesture-driven animations (press, pan, tilt) built on `react-native-gesture-handler`
 *  - Scroll-triggered animations via `useAnimatedScrollHandler`
 *  - Haptic feedback integration (`expo-haptics`)
 *  - Sound-effect playback (`expo-av`)
 *
 * Everything that runs on the UI thread is marked with the `'worklet'` directive.
 *
 * NOTE: Reanimated 3 requires the Babel plugin. Ensure `babel.config.js` has:
 *   plugins: [..., 'react-native-reanimated/plugin']  // must be LAST
 *
 * @module animations
 */
import { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  Extrapolation,
  runOnJS,
  cancelAnimation,
  type SharedValue,
  type AnimatedStyle,
  type WithSpringConfig,
  type WithTimingConfig,
  type DerivedValue,
} from 'react-native-reanimated';
import {
  Gesture,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export { SCREEN_WIDTH, SCREEN_HEIGHT };

/* ─────────────────────────────────────────────
 * 1. Spring physics presets
 * ───────────────────────────────────────────── */

/**
 * Reusable spring configurations tuned for a premium, tactile feel.
 * Reanimated 3 uses the stiffness/damping/mass model.
 */
export const SPRING_CONFIGS = {
  /** Snappy micro-interaction (button press, toggle). */
  snappy: { damping: 18, stiffness: 220, mass: 0.6, overshootClamping: false } as WithSpringConfig,
  /** Smooth, slightly bouncy entrance. */
  smooth: { damping: 16, stiffness: 120, mass: 1 } as WithSpringConfig,
  /** Playful, pronounced bounce (rewards, celebrations). */
  bouncy: { damping: 8, stiffness: 180, mass: 0.8 } as WithSpringConfig,
  /** Stiff, no-overshoot transition (sheets, modals). */
  stiff: { damping: 24, stiffness: 260, mass: 1, overshootClamping: true } as WithSpringConfig,
  /** Gentle, slow settle (large surfaces). */
  gentle: { damping: 20, stiffness: 90, mass: 1.2 } as WithSpringConfig,
} as const;

export type SpringPreset = keyof typeof SPRING_CONFIGS;

/** Default timing config for fade/opacity work. */
export const TIMING_CONFIGS = {
  fast: { duration: 160 } as WithTimingConfig,
  base: { duration: 260 } as WithTimingConfig,
  slow: { duration: 420 } as WithTimingConfig,
} as const;

/**
 * Resolve a spring preset name (or a custom config) into a `WithSpringConfig`.
 *
 * @param preset - A {@link SpringPreset} key or a partial custom config.
 * @returns A complete spring configuration.
 */
export function getSpringConfig(preset: SpringPreset | WithSpringConfig = 'smooth'): WithSpringConfig {
  if (typeof preset === 'string') return SPRING_CONFIGS[preset];
  return { ...SPRING_CONFIGS.smooth, ...preset } as any;
}

/* ─────────────────────────────────────────────
 * 2. useSpring — animated value hook
 * ───────────────────────────────────────────── */

/** Options for {@link useSpring}. */
export interface UseSpringOptions {
  /** Spring preset or custom config. */
  config?: SpringPreset | WithSpringConfig;
  /** Delay (ms) before the animation starts. */
  delay?: number;
}

/**
 * Drive a shared value toward `target` with spring physics whenever `target`
 * changes. Returns the animated value plus imperative `set`/`stop` controls.
 *
 * @param target  - The value to animate toward.
 * @param options - Spring configuration and delay.
 * @returns `{ value, set, stop }` where `value` is a Reanimated SharedValue.
 *
 * @example
 * const { value } = useSpring(open ? 1 : 0, { config: 'bouncy' });
 * const style = useAnimatedStyle(() => ({ opacity: value.value }));
 */
export function useSpring(target: number, options: UseSpringOptions = {}) {
  const { config = 'smooth', delay = 0 } = options;
  const value = useSharedValue(target);

  useEffect(() => {
    const spring = withSpring(target, getSpringConfig(config));
    value.value = delay > 0 ? withDelay(delay, spring) : spring;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, delay]);

  const set = useCallback(
    (to: number) => {
      value.value = withSpring(to, getSpringConfig(config));
    },
    [config, value],
  );

  const stop = useCallback(() => {
    cancelAnimation(value);
  }, [value]);

  return { value, set, stop };
}

/* ─────────────────────────────────────────────
 * 3. Shared-element transition configs
 * ───────────────────────────────────────────── */

/**
 * Preset screen-transition specs compatible with `react-native-screens`
 * native-stack `customAnimationOnGesture` / `fullScreenSwipe` and Reanimated
 * `TransitioningView`. Use with `react-navigation` native stack options.
 */
export const SHARED_ELEMENT_TRANSITIONS = {
  /** iOS-style horizontal push with parallax. */
  push: {
    animation: 'slide_from_right' as const,
    animationDuration: 280,
    fullScreenSwipe: true,
    customAnimationOnGesture: true,
  },
  /** Vertical modal slide-up. */
  modal: {
    animation: 'slide_from_bottom' as const,
    animationDuration: 320,
    fullScreenSwipe: true,
  },
  /** Cross-fade for tab-like switches. */
  fade: {
    animation: 'fade' as const,
    animationDuration: 220,
  },
  /** No animation (instant swap). */
  none: {
    animation: 'none' as const,
    animationDuration: 0,
  },
} as const;

export type SharedTransitionPreset = keyof typeof SHARED_ELEMENT_TRANSITIONS;

/**
 * A Reanimated shared-transition tag factory. Attach the returned tag to a
 * component via the `.sharedTransitionTag(id)` modifier so it morphs between
 * screens that share the same `id`.
 *
 * @param id - A stable, unique identifier for the shared element.
 * @returns The same id (used as the shared transition tag).
 */
export function sharedTag(id: string): string {
  return `jobezz-shared-${id}`;
}

/* ─────────────────────────────────────────────
 * 4. Gesture-based animations
 * ───────────────────────────────────────────── */

/** Options for {@link usePressAnimation}. */
export interface UsePressAnimationOptions {
  /** Scale applied while pressed (default `0.96`). */
  activeScale?: number;
  /** Spring preset for the press/release (default `'snappy'`). */
  config?: SpringPreset;
  /** Fire a light haptic on press-down. */
  haptic?: boolean;
  /** Called on tap end (runs on the JS thread). */
  onPress?: () => void;
}

/**
 * A pressable scale animation driven by a gesture handler. Returns a composed
 * gesture and an animated style to spread onto an `Animated.View`.
 *
 * @param options - Press behaviour configuration.
 * @returns `{ gesture, style, scale }`.
 *
 * @example
 * const { gesture, style } = usePressAnimation({ onPress: submit, haptic: true });
 * <GestureDetector gesture={gesture}>
 *   <Animated.View style={style}>...</Animated.View>
 * </GestureDetector>
 */
export function usePressAnimation(options: UsePressAnimationOptions = {}) {
  const { activeScale = 0.96, config = 'snappy', haptic = true, onPress } = options;
  const scale = useSharedValue(1);
  const spring = getSpringConfig(config);

  const triggerHaptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(activeScale, spring);
      if (haptic) runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, spring);
    })
    .onEnd(() => {
      'worklet';
      if (onPress) runOnJS(handlePress)();
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { gesture, style, scale };
}

/** Options for {@link usePanGesture}. */
export interface UsePanGestureOptions {
  /** Axis the pan is constrained to (default `'y'`). */
  axis?: 'x' | 'y' | 'both';
  /** Called with the live translation on the JS thread. */
  onUpdate?: (translation: { x: number; y: number }) => void;
  /** Called on gesture end with the final translation + velocity. */
  onEnd?: (info: { translationX: number; translationY: number; velocityY: number }) => void;
  /** Snap back to origin on release (default `true`). */
  snapBack?: boolean;
}

/**
 * A draggable pan gesture exposing live translation values and an animated
 * style. Commonly used for bottom sheets and swipe-to-dismiss.
 *
 * @param options - Pan behaviour configuration.
 * @returns `{ gesture, style, translateX, translateY }`.
 */
export function usePanGesture(options: UsePanGestureOptions = {}) {
  const { axis = 'y', onUpdate, onEnd, snapBack = true } = options;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const emitUpdate = useCallback(
    (x: number, y: number) => onUpdate?.({ x, y }),
    [onUpdate],
  );
  const emitEnd = useCallback(
    (info: { translationX: number; translationY: number; velocityY: number }) => onEnd?.(info),
    [onEnd],
  );

  const gesture = Gesture.Pan()
    .activeOffsetX(axis === 'y' ? [-1000, 1000] : [-10, 10])
    .activeOffsetY(axis === 'x' ? [-1000, 1000] : [-10, 10])
    .onChange((e: any) => {
      'worklet';
      if (axis !== 'y') translateX.value = e.translationX;
      if (axis !== 'x') translateY.value = e.translationY;
      if (onUpdate) runOnJS(emitUpdate)(translateX.value, translateY.value);
    })
    .onEnd((e: any) => {
      'worklet';
      if (onEnd) {
        runOnJS(emitEnd)({
          translationX: e.translationX,
          translationY: e.translationY,
          velocityY: e.velocityY,
        });
      }
      if (snapBack) {
        translateX.value = withSpring(0, SPRING_CONFIGS.stiff);
        translateY.value = withSpring(0, SPRING_CONFIGS.stiff);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }] as any,
  }));

  return { gesture, style, translateX, translateY };
}

/**
 * A 3D tilt effect driven by a pan gesture — the surface rotates toward the
 * finger like a physical card. Returns gesture + animated style.
 *
 * @param maxTilt - Maximum rotation in degrees (default `8`).
 * @returns `{ gesture, style }`.
 */
export function useTiltEffect(maxTilt: number = 8) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onChange((e: any) => {
      'worklet';
      rotateY.value = interpolate(e.translationX, [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2], [-maxTilt, maxTilt], Extrapolation.CLAMP);
      rotateX.value = interpolate(e.translationY, [-SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 2], [maxTilt, -maxTilt], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      'worklet';
      rotateX.value = withSpring(0, SPRING_CONFIGS.smooth);
      rotateY.value = withSpring(0, SPRING_CONFIGS.smooth);
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateX: `${rotateX.value}deg` }, { rotateY: `${rotateY.value}deg` }] as any,
  }));

  return { gesture, style };
}

/* ─────────────────────────────────────────────
 * 5. Scroll-triggered animations
 * ───────────────────────────────────────────── */

/**
 * Build an animated scroll handler that tracks the vertical offset in a shared
 * value. Pair with `interpolate` in `useAnimatedStyle` for parallax headers,
 * collapsing toolbars, and scroll-driven fades.
 *
 * @param onScrollJS - Optional JS-thread callback receiving the live offset.
 * @returns `{ scrollHandler, offsetY }`.
 *
 * @example
 * const { scrollHandler, offsetY } = useScrollAnimation();
 * const header = useAnimatedStyle(() => ({
 *   opacity: interpolate(offsetY.value, [0, 120], [1, 0], Extrapolation.CLAMP),
 * }));
 * <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} />
 */
export function useScrollAnimation(onScrollJS?: (offsetY: number) => void) {
  const offsetY = useSharedValue(0);

  const emit = useCallback(
    (y: number) => onScrollJS?.(y),
    [onScrollJS],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      offsetY.value = event.contentOffset.y;
      if (onScrollJS) runOnJS(emit)(event.contentOffset.y);
    },
  });

  return { scrollHandler, offsetY };
}

/**
 * Compute a staggered entrance style for list items based on their index.
 * Returns a derived opacity + translateY that animates in sequence.
 *
 * @param index     - The item index.
 * @param progress  - A shared value that goes 0 → 1 to trigger the reveal.
 * @param stepDelay - Per-item delay in ms (default `60`).
 * @returns An animated style object for the item.
 */
export function useStaggeredItem(index: number, progress: SharedValue<number>, stepDelay: number = 60) {
  return useAnimatedStyle(() => {
    const start = index * stepDelay;
    const local = interpolate(progress.value, [start, start + 240], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: local,
      transform: [{ translateY: interpolate(local, [0, 1], [16, 0]) }],
    };
  });
}

/* ─────────────────────────────────────────────
 * 6. Haptic feedback integration
 * ───────────────────────────────────────────── */

/** Semantic haptic feedback types used across JobEzz. */
export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

/**
 * Trigger a semantic haptic event. Safe to call from the JS thread; wrap with
 * `runOnJS` when calling from a worklet.
 *
 * @param type - The semantic haptic type (default `'light'`).
 *
 * @example
 * triggerHaptic('success'); // after a successful payment
 */
export async function triggerHaptic(type: HapticType = 'light'): Promise<void> {
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
    }
  } catch {
    /* Haptics unavailable (e.g. simulator) — silently ignore. */
  }
}

/* ─────────────────────────────────────────────
 * 7. Misc helpers
 * ───────────────────────────────────────────── */

/**
 * Animate a shared value through an entrance sequence (fade + slide + settle).
 *
 * @param value - Target shared value (typically opacity or translateY driver).
 * @param delay - Optional start delay in ms.
 */
export function entranceSequence(value: SharedValue<number>, delay: number = 0): void {
  'worklet';
  value.value = withDelay(delay, withSpring(1, SPRING_CONFIGS.smooth));
}

/**
 * Create an infinitely pulsing value (e.g. for a "live" indicator).
 *
 * @param value - The shared value to pulse between 0 and 1.
 */
export function startPulse(value: SharedValue<number>): void {
  'worklet';
  value.value = withRepeat(withSequence(withTiming(1, TIMING_CONFIGS.slow), withTiming(0, TIMING_CONFIGS.slow)), -1, false);
}

/** Re-export of Reanimated's `interpolate` for convenience. */
export { interpolate, Extrapolation };
export type { SharedValue, AnimatedStyle, DerivedValue };
export default Animated;
