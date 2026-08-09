/**
 * MatchScore + KpiRow — the "intelligence" stat pill and 3-tile stat row.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typ, r, sp } from '../../design';
import { Icon } from '../../icons';

function scoreTone(s: number) {
  return s >= 80 ? palette.success : s >= 50 ? palette.warning : palette.textLow;
}

export function MatchScore({ score }: { score: number }) {
  const c = scoreTone(score);
  return (
    <View style={[styles.match, { borderColor: c + '35', backgroundColor: c + '12' }]}>
      <Icon name="sparkle" size={11} color={c} />
      <Text style={[styles.num, { color: c }]}>{score}%</Text>
    </View>
  );
}

export function Kpi({ value, label, icon, color = palette.accent }: { value: string; label: string; icon?: string; color?: string }) {
  return (
    <View style={styles.kpi}>
      {icon ? (
        <View style={[styles.kpiIcon, { backgroundColor: color + '16' }]}>
          <Icon name={icon} size={16} color={color} />
        </View>
      ) : null}
      <Text style={[styles.kpiValue, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.kpiLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

export function KpiRow({ items }: { items: Array<{ value: string; label: string; icon?: string; color?: string }> }) {
  return (
    <View style={styles.kpiRow}>
      {items.map((it) => (
        <Kpi key={it.label} {...it} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  match: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: r.pill,
    borderWidth: 1,
  },
  num: { ...typ.caption, fontSize: 11, fontWeight: '800' },

  kpiRow: { flexDirection: 'row', gap: sp.md },
  kpi: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: palette.bg3,
    borderRadius: r.md,
    paddingVertical: sp.md,
    paddingHorizontal: sp.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  kpiIcon: {
    width: 30,
    height: 30,
    borderRadius: r.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiValue: { ...typ.h2, fontSize: 21, lineHeight: 24, color: palette.textHi },
  kpiLabel: { ...typ.caption, color: palette.textLow, marginTop: 3, textAlign: 'center' },
});
