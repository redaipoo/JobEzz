/**
 * IconTile — the square rounded container that wrapped an icon inline ~12
 * times across screens. One component, one radius, one tint math.
 * RowEdge — the trailing indicator cell (chevron / info) used by every
 * list row and menu item.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, r } from '../../design';
import { Icon } from '../../icons';

export function IconTile({
  icon, size = 44, color = palette.accent, rounded = 'md', style,
}: { icon: string; size?: number; color?: string; rounded?: 'sm' | 'md' | 'pill'; style?: StyleProp<ViewStyle> }) {
  const radius = rounded === 'pill' ? size / 2 : rounded === 'sm' ? r.sm : r.md;
  const bg = color + '1F';
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: radius, backgroundColor: bg }, style]}>
      <Icon name={icon} size={size * 0.42} color={color} />
    </View>
  );
}

export function RowEdge({ icon = 'back', color = palette.textLow }: { icon?: string; color?: string; }) {
  return (
    <View style={styles.edge}>
      <Icon name={icon} size={15} color={color} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  edge: {
    width: 30,
    height: 30,
    borderRadius: r.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
});
