/**
 * TrustBadge — pill affirming provider verification.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, r } from '../../design';
import { Icon } from '../../icons';

export function TrustBadge({ label, icon = 'shield' }: { label: string; icon?: string }) {
  return (
    <View style={styles.trust}>
      <Icon name={icon} size={10} color={palette.accent} />
      <Text style={styles.text} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: r.pill,
    backgroundColor: palette.accentGlow,
    borderWidth: 1,
    borderColor: palette.borderAccent,
  },
  text: { color: palette.accent, fontSize: 10, fontWeight: '800', fontFamily: 'Tajawal_700Bold' },
});
