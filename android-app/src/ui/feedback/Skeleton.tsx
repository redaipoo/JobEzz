/**
 * Skeletons — loading placeholders that mirror the final layout's shape.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, sp, r } from '../../design';
import { ShimmerBox } from '../../design';

export function SkeletonCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <ShimmerBox width={48} height={48} radius={r.md} />
      <View style={styles.lines}>
        <ShimmerBox width="70%" height={14} />
        <ShimmerBox width="50%" height={12} />
        <ShimmerBox width="38%" height={12} />
      </View>
    </View>
  );
}

export function SkeletonRow({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.rowItem, style]}>
      <ShimmerBox width={44} height={44} radius={22} />
      <View style={styles.lines}>
        <ShimmerBox width="45%" height={14} />
        <ShimmerBox width="65%" height={11} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 4, kind = 'card' }: { count?: number; kind?: 'card' | 'row' }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        kind === 'card' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: sp.md },
  card: {
    flexDirection: 'row',
    gap: sp.md,
    backgroundColor: palette.bg3,
    borderRadius: r.md,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
  },
  rowItem: {
    flexDirection: 'row',
    gap: sp.md,
    alignItems: 'center',
    paddingVertical: sp.sm,
  },
  lines: { flex: 1, gap: sp.sm },
});
