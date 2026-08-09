/**
 * Card — the single contained surface.
 *
 * One radius (r.card), one border (1px, palette.border), one soft shadow.
 * No per-screen shadow overrides, no custom radii.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, sp, r, sh, PressableScale } from '../../design';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  flat?: boolean;
  glow?: 'accent' | 'gold';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, flat = false, glow, style, contentStyle }: CardProps) {
  const body = (
    <View
      style={[
        styles.card,
        flat ? styles.flat : sh.sm,
        glow === 'accent' && sh.glow,
        glow === 'gold' && sh.goldGlow,
        contentStyle,
      ]}
    >
      <View pointerEvents="none" style={styles.edge} />
      {children}
    </View>
  );

  return onPress ? (
    <PressableScale onPress={onPress} activeScale={0.98} style={style}>
      {body}
    </PressableScale>
  ) : (
    <View style={style}>{body}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.bg3,
    borderRadius: r.card,
    padding: sp.lg,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  flat: { backgroundColor: palette.surface, borderColor: palette.border },
  edge: {
    position: 'absolute',
    top: 0,
    left: r.card + 8,
    right: r.card + 8,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
});
