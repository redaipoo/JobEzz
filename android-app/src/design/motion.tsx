/**
 * JobEzz — Premium Motion System
 * ═══════════════════════════════════════════════════════════════
 * Reusable Reanimated-based hooks + components for consistent,
 * UI-thread animations throughout the app.
 *
 * Exports:
 *  - useEntrance        : Fade + translateY entrance (single element)
 *  - useStagger         : Staggered list entrance (returns delays for items)
 *  - PressableScale     : TouchableOpacity-style with spring press feedback
 *  - useShimmer         : Skeleton shimmer shared value
 *  - ShimmerBox         : Skeleton placeholder with shimmer sweep
 *  - useScrollHeader    : Header-bg opacity based on scroll offset
 *
 * Every animation runs on the UI thread (uses worklet).
 * Durations kept short and responsive (120-450ms).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  cancelAnimation,
} from 'react-native-reanimated';
import { motion, palette, r, sp } from './tokens';

/* ─────────────────────────────────────────────
 * 0. useReducedMotion — accessibility gate
 * Respects the OS "reduce motion" setting; all
 * entrance hooks collapse to a static final state.
 * ───────────────────────────────────────────── */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setReduced(v));
    return () => {
      mounted = false;
      sub?.remove();
    };
  }, []);
  return reduced;
}

/* ─────────────────────────────────────────────
 * 1. useEntrance — single-element fade + slide-in
 * ───────────────────────────────────────────── */

export function useEntrance(delay = 0, distance = 18) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: motion.duration.slow + 100, easing: Easing.out(Easing.cubic) }),
    );
    return () => cancelAnimation(progress);
  }, [delay, progress, reduced]);
  return useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: [
        { translateY: interpolate(p, [0, 1], [distance, 0]) },
        { scale: interpolate(p, [0, 1], [0.96, 1]) },
      ] as any,
    };
  });
}

/* ─────────────────────────────────────────────
 * 2. StaggerItem — per-item entrance (safe, hooks-compliant)
 * Wrap this around any list item; it self-delays via `index`.
 * ───────────────────────────────────────────── */

export function StaggerItem({ index, delay = 24, style, children }: { index: number; delay?: number; style?: ViewStyle; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(index * 60, withTiming(1, { duration: motion.duration.slow, easing: Easing.bezier(...motion.ease.out) }));
    return () => cancelAnimation(progress);
  }, [index, progress, reduced]);
  const anim = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [delay, 0]) }],
  }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

/**
 * Legacy useStagger — kept for backward compatibility.
 * Returns progress; caller wraps with <StaggerItem>.
 * @deprecated Use <StaggerItem> instead.
 */
export function useStagger(itemCount: number, perItem?: number) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: motion.duration.slow, easing: Easing.bezier(...motion.ease.out) });
    return () => cancelAnimation(progress);
  }, [progress]);
  return progress;
}

/* ─────────────────────────────────────────────
 * 3. PressableScale — premium button/card press feedback
 * Drop-in for TouchableOpacity with a subtle spring scale-down on press.
 * ───────────────────────────────────────────── */

type PressableScaleProps = {
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;          /* default 0.97 */
  haptic?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  accessibilityRole?: 'button' | 'switch' | 'none';
  accessibilityState?: { selected?: boolean; checked?: boolean; disabled?: boolean };
  accessibilityLabel?: string;
};

export function PressableScale({
  onPress,
  onLongPress,
  style,
  activeScale = 0.97,
  disabled = false,
  children,
  accessibilityRole = 'button',
  accessibilityState,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const pressOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: pressOpacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(activeScale, { damping: 12, stiffness: 400, mass: 0.8 });
          pressOpacity.value = withTiming(0.85, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 300, mass: 0.8 });
          pressOpacity.value = withTiming(1, { duration: 120 });
        }}
        activeOpacity={1}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
        style={{ flexGrow: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ─────────────────────────────────────────────
 * 4. Shimmer — skeleton loading sweep
 * ───────────────────────────────────────────── */

export function useShimmer() {
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withRepeat(
      withTiming(1, { duration: motion.duration.slow * 2, easing: Easing.bezier(...motion.ease.inOut) }),
      -1,
      true,
    );
    return () => cancelAnimation(x);
  }, [x]);
  return x;
}

export function ShimmerBox({ width, height, radius = r.sm, style }: { width: number | string; height: number; radius?: number; style?: ViewStyle }) {
  const x = useShimmer();
  const anim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(x.value, [-1, 0, 1], ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)']),
  }));
  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius: radius }, anim, style]}
    />
  );
}

/* ─────────────────────────────────────────────
 * 5. useScrollHeader — header bg opacity tied to scroll
 * Pass to onScroll of any Scrollview; returns style for the header overlay.
 * ───────────────────────────────────────────── */

export function useScrollHeader(threshold = 40) {
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { y.value = e.contentOffset.y; },
  });
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(y.value, [0, threshold], [0, 1]),
  }));
  return { onScroll, headerStyle };
}

/* ─────────────────────────────────────────────
 * 6. SkeletonList — premium loading placeholder
 * ───────────────────────────────────────────── */

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={{ gap: sp.md, padding: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={skeletonStyles.card}>
          <ShimmerBox width={48} height={48} radius={r.md} />
          <View style={{ flex: 1, gap: 10 }}>
            <ShimmerBox width="70%" height={14} />
            <ShimmerBox width="50%" height={12} />
            <ShimmerBox width="35%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * 7. Pulse — soft pulsing badge/dot animation
 * ───────────────────────────────────────────── */

export function PulseDot({ color = palette.danger, size = 8, style }: { color?: string; size?: number; style?: ViewStyle }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.9, { duration: 900, easing: Easing.out(Easing.ease) }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 900, easing: Easing.out(Easing.ease) }), -1, false);
    return () => { cancelAnimation(scale); cancelAnimation(opacity); };
  }, [scale, opacity]);
  const ring = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: color,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Animated.View style={ring} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

/* ─────────────────────────────────────────────
 * 8. FadeIn — simple fade-in wrapper (no offset)
 * ───────────────────────────────────────────── */

export function FadeInView({ children, delay = 0, duration = 450, style }: { children: React.ReactNode; delay?: number; duration?: number; style?: ViewStyle }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    return () => cancelAnimation(progress);
  }, [delay, duration, progress]);
  const anim = useAnimatedStyle(() => ({ opacity: progress.value }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: r.card,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    borderColor: palette.border,
  },
});
