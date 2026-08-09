/**
 * StatRow — icon-tinted label/value row used in finance, review, admin screens.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typ, sp, r } from '../../design';
import { Icon } from '../../icons';

export function StatRow({
  icon, label, value, color = palette.accent,
}: { icon: string; label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: color + '1A' }]}>
        <Icon name={icon} size={15} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: palette.textHi }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.md,
    paddingVertical: sp.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: r.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typ.bodyS, color: palette.textMid, flex: 1 },
  value: { ...typ.label, color: palette.textHi },
});
