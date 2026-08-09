import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typ, sp, PressableScale } from '../../design';
import { Icon } from '../../icons';

/**
 * SectionTitle — single section header (accent tick + title + optional "see all").
 */
export function SectionTitle({
  title, sub, actionLabel, onAction, style,
}: { title: string; sub?: string; actionLabel?: string; onAction?: () => void; style?: any }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.lead}>
        <View style={styles.tick} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} activeScale={0.92} style={styles.action} accessibilityRole="button">
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Icon name="back" size={11} color={palette.accent} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: sp.section, marginBottom: sp.md },
  lead: { flexDirection: 'row', alignItems: 'center' },
  tick: {
    width: 3, height: 16, borderRadius: 2, backgroundColor: palette.accent, marginEnd: sp.sm,
  },
  title: { ...typ.h3, color: palette.textHi },
  sub: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { ...typ.caption, color: palette.accent, fontWeight: '800' },
});
