/**
 * Badge + Tag — semantic status pills and inline icon tags.
 */
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, typ, r, sp } from '../../design';
import { Icon } from '../../icons';

export type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'gold' | 'solid';

const BADGES: Record<BadgeVariant, { bg: string; fg: string; border: string }> = {
  accent:  { bg: palette.accentGlow,  fg: palette.accent,    border: palette.borderAccent },
  success: { bg: palette.successBg,   fg: palette.success,   border: 'transparent' },
  warning: { bg: palette.warningBg,   fg: palette.warning,   border: 'transparent' },
  danger:  { bg: palette.dangerBg,    fg: palette.danger,    border: 'transparent' },
  neutral: { bg: palette.surface,     fg: palette.textMid,   border: palette.border },
  gold:    { bg: palette.goldBg,      fg: palette.gold,      border: 'transparent' },
  solid:   { bg: palette.accent,      fg: '#FFFFFF',         border: palette.accent },
};

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, variant = 'accent', icon, style }: BadgeProps) {
  const c = BADGES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      {icon && <Icon name={icon} size={10} color={c.fg} />}
      <Text style={[typ.caption, { color: c.fg, fontWeight: '800', fontSize: 10.5 }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export interface TagProps {
  label?: string;
  children?: React.ReactNode;
  icon?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tag({ label, children, icon, color = palette.textMid, style }: TagProps) {
  const content = label ?? children;
  return (
    <View style={[styles.tag, style]}>
      {icon && <Icon name={icon} size={11} color={color} strokeWidth={1.8} />}
      {content != null && <Text style={[typ.caption, { color }]} numberOfLines={1}>{content}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: r.pill,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: r.xs,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignSelf: 'flex-start',
  },
});
