/**
 * Toggle — animated switch (Reanimated, UI-thread). The single toggle;
 * replaces the 2 hand-rolled divergent ones in Core.tsx.
 */
import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolateColor, Easing,
} from 'react-native-reanimated';
import { palette, r, sp, typ, sh, PressableScale } from '../../design';

export function Toggle({
  value, onChange, label, disabled = false,
}: { value: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  const p = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(value ? 1 : 0, { duration: 180, easing: Easing.out(Easing.cubic) });
  }, [value, p]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [palette.surfaceTop, palette.accent]),
  }));
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: 2 + p.value * 20 }], // RTL: physical translation, track is LTR-laid
  }));

  const body = (
    <Animated.View style={[styles.track, track]}>
      <Animated.View style={[styles.thumb, thumb]} />
    </Animated.View>
  );

  if (!label) {
    return (
      <PressableScale
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
        activeScale={0.92}
        style={disabled && styles.off}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      >
        {body}
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      activeScale={0.98}
      style={[styles.row, disabled && styles.off]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={styles.label}>{label}</Text>
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sp.sm + 2,
  },
  label: { ...typ.bodyS, color: palette.text, flex: 1 },
  track: {
    width: 46,
    height: 27,
    borderRadius: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.borderHi,
    overflow: 'hidden',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    ...sh.sm,
  },
  off: { opacity: 0.4 },
});
