/**
 * MapBox — stylized map placeholder (roads + me pin), no external assets and
 * no fake "product screenshot." The only acceptable "map preview."
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette, r } from '../../design';
import { PulseDot } from '../../design';
import { Icon } from '../../icons';

export function MapBox({ h = 160, pin = true, style }: { h?: number; pin?: boolean; style?: any }) {
  return (
    <View style={[styles.map, { height: h }, style]}>
      <View style={[styles.road, { left: 0, right: 0, top: '45%', height: 14 }]} />
      <View style={[styles.road, { top: 0, bottom: 0, right: '40%', width: 12 }]} />
      <View style={[styles.roadSoft, { top: '18%', left: 0, right: 0, height: 6 }]} />
      <View style={[styles.roadSoft, { top: 0, bottom: 0, left: '18%', width: 6 }]} />
      {pin ? (
        <View style={styles.pin}>
          <Icon name="pin" size={22} color="#FFFFFF" />
        </View>
      ) : null}
      <View style={styles.me}>
        <PulseDot color={palette.accent} size={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    borderRadius: r.card,
    overflow: 'hidden',
    backgroundColor: palette.bg2,
    borderWidth: 1,
    borderColor: palette.border,
  },
  road: { position: 'absolute', backgroundColor: palette.surfaceHi },
  roadSoft: { position: 'absolute', backgroundColor: palette.surface },
  pin: {
    position: 'absolute',
    left: '58%',
    top: '40%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00030C',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  me: { position: 'absolute', right: '28%', top: '58%' },
});
