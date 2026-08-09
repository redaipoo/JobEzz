/**
 * Button — canonical action element.
 *
 * Variants: primary | secondary | ghost | danger | gold
 * Sizes:    sm | md | lg
 *
 * Rules enforced here:
 *  - One-line labels only (numberOfLines={1}) so CTAs never wrap.
 *  - Locks the global radius to r.md (shape-consistency lock).
 *  - Built on PressableScale, so every tap gets spring feedback on the UI thread.
 *  - Never renders white-on-white; `fg` is paired with `bg` in variant map.
 */
import React from 'react';
import { Text, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, typ, r, sp, layout, PressableScale } from '../../design';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary:   { bg: palette.accent,      fg: '#FFFFFF',        border: palette.accent },
  secondary: { bg: palette.surfaceHi,   fg: palette.text,     border: palette.borderHi },
  ghost:     { bg: 'transparent',       fg: palette.textMid,  border: palette.border },
  danger:    { bg: palette.danger,      fg: '#FFFFFF',        border: palette.danger },
  gold:      { bg: palette.gold,        fg: palette.bg0,      border: palette.gold },
};

const SIZES: Record<ButtonSize, { height: number; padH: number; text: keyof typeof typ }> = {
  sm: { height: 36, padH: sp.base, text: 'label' },
  md: { height: 50, padH: sp.lg,  text: 'button' },
  lg: { height: 56, padH: sp.xl,  text: 'button' },
};

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  disabled = false, loading = false, compact = false, style,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const off = disabled || loading;
  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      activeScale={0.97}
      style={[
        styles.base,
        { height: s.height, paddingHorizontal: s.padH, backgroundColor: v.bg, borderColor: v.border },
        compact && styles.compact,
        off && styles.off,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <Text style={[typ[s.text], { color: v.fg }]} numberOfLines={1}>{label}</Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: r.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.tapMin,
    overflow: 'hidden',
  },
  compact: { alignSelf: 'flex-start' },
  off: { opacity: 0.45 },
});
