/**
 * Chip — selectable filter/stacked label. The ONE chip system; every screen
 * uses this instead of hand-rolled variants.
 */
import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, typ, r, sp, PressableScale } from '../../design';
import { Icon } from '../../icons';

export interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, active = false, onPress, icon, style }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.94}
      disabled={!onPress}
      style={[styles.base, active && styles.active, style]}
      accessibilityState={{ selected: active }}
    >
      {icon && (
        <Icon
          name={icon}
          size={12}
          color={active ? palette.bg0 : palette.textMid}
          strokeWidth={active ? 2.4 : 1.8}
        />
      )}
      <Text style={[typ.caption, styles.text, active && styles.textActive]} numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: sp.base,
    paddingVertical: sp.sm + 1,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  active: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  text: { color: palette.textMid, fontSize: 11 },
  textActive: { color: palette.bg0, fontWeight: '800' },
});
