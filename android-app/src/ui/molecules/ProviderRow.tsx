/**
 * ProviderRow — the technician/provider summary row reused by ServiceMatch,
 * ServiceTrack, and the Services home feed. Avatar + name + verified + rating
 * + distance/price in one predictable layout.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Avatar, Verified } from '../atoms/Avatar';
import { PulseDot } from '../../design';
import { Stars } from '../atoms/Stars';

export interface ProviderLike {
  id: string;
  name: string;
  cat?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  dist?: string;
  online?: boolean;
  verified?: boolean;
  icon?: string;
}

export function ProviderRow({
  p, right,
}: { p: ProviderLike; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        <Avatar name={p.name} size={46} />
        {p.online ? <PulseDot color={palette.success} size={10} style={styles.onlineDot} /> : null}
      </View>
      <View style={styles.mid}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
          {p.verified ? <Verified size={14} /> : null}
        </View>
        <Text style={styles.cat} numberOfLines={1}>{p.cat}</Text>
        {typeof p.rating === 'number' && (
          <View style={styles.stars}>
            <Stars value={p.rating} size={11} />
            <Text style={styles.reviews}>({p.reviews ?? 0})</Text>
          </View>
        )}
      </View>
      <View style={styles.right}>
        {right}
        {p.price ? <Text style={styles.price}>{p.price}</Text> : null}
        {p.dist ? <Text style={styles.dist}>{p.dist}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  avatarWrap: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: -1, left: -1 },
  mid: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...typ.h4, color: palette.textHi, flexShrink: 1 },
  cat: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  reviews: { ...typ.caption, color: palette.textLow, fontSize: 10 },
  right: { alignItems: 'flex-end', gap: 2 },
  price: { ...typ.label, color: palette.accent, fontSize: 12 },
  dist: { ...typ.caption, color: palette.textLow },
});
