/**
 * JobEzz Splash
 *
 * Brand-true boot screen: the real packaged logo on a deep navy vignette,
 * a soft ambient halo, staggered wordmark reveal, then a graceful hand-off
 * into the app. No approximate SVG geometry, no particles, no invented marks.
 * Reduced-motion is honored by skipping to the final state.
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { palette, typ, sp, useReducedMotion } from '../design';

const ANIM_MS = 1800;
const HOLD_MS = 650;

export function SplashScreen({ onDone }: { onDone?: () => void }) {
  /* Keep the callback in a ref so the worklet captures a stable function. */
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const done = useCallback(() => {
    const cb = doneRef.current;
    if (typeof cb === 'function') cb();
  }, []);
  const { width } = useWindowDimensions();
  const reduce = useReducedMotion();
  const p = useSharedValue(reduce ? 1 : 0);
  const exit = useSharedValue(0);

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(done, 300);
      return () => clearTimeout(t);
    }
    p.value = withTiming(1, { duration: ANIM_MS, easing: Easing.out(Easing.cubic) });
    const t = setTimeout(() => {
      exit.value = withTiming(1, { duration: 420, easing: Easing.in(Easing.cubic) }, (fin) => {
        'worklet';
        if (fin) runOnJS(done)();
      });
    }, ANIM_MS + HOLD_MS);
    return () => clearTimeout(t);
  }, [done, p, exit, reduce]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [
      { scale: 0.86 + p.value * 0.14 },
      { translateY: (1 - p.value) * 14 },
    ],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: p.value * 0.55,
    transform: [{ scale: 0.7 + p.value * 0.5 }],
  }));

  const exitStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
    transform: [{ scale: 1 - exit.value * 0.05 }],
  }));

  const size = useMemo(() => Math.min(Math.round(width * 0.52), 168), [width]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, exitStyle]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[palette.bg0, palette.bg1, palette.bg0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.halo, haloStyle]}>
        <LinearGradient
          colors={[palette.accentGlow, 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={styles.haloFill}
        />
      </Animated.View>

      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={[styles.logoTile, { width: size, height: size, borderRadius: size * 0.28 }]}>
          <Image
            source={require('../../assets/splash-icon.png')}
            style={{ width: size, height: size }}
            resizeMode="contain"
            accessibilityLabel="JobEzz"
          />
        </View>
      </Animated.View>

      <Wordmark p={p} />
    </Animated.View>
  );
}

const LETTERS = 'JobEzz'.split('');

function Wordmark({ p }: { p: { value: number } }) {
  return (
    <View style={styles.wordWrap}>
      {LETTERS.map((ch, i) => (
        <WordLetter key={i} ch={ch} index={i} p={p} />
      ))}
    </View>
  );
}

function WordLetter({ ch, index, p }: { ch: string; index: number; p: { value: number } }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      500 + index * 55,
      withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }),
    );
  }, [index, v]);
  const s = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ translateY: (1 - v.value) * 10 }],
  }));
  return (
    <Animated.Text style={[styles.letter, s]} allowFontScaling={false}>
      {ch}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: palette.bg0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 99,
  },
  halo: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloFill: { flex: 1, width: '100%', borderRadius: 210 },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  logoTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bg2,
    borderWidth: 1,
    borderColor: palette.borderHi,
    shadowColor: palette.accent,
    shadowOpacity: 0.28,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
  wordWrap: {
    flexDirection: 'row',
    marginTop: sp.xl,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  letter: {
    ...typ.display,
    color: palette.textHi,
    letterSpacing: 1.5,
    fontFamily: 'Tajawal_800ExtraBold',
  },
});
