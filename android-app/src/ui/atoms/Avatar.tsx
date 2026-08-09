/**
 * Avatar + Verified — identity surfaces. BrandLetterAvatar kills the 5
 * copy-pasted "colored square with one letter" implementations.
 */
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, r } from '../../design';
import { Icon } from '../../icons';

export interface AvatarProps {
  name?: string;
  size?: number;
  color?: string;   /* tint override, defaults to accent */
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name = '', size = 44, color = palette.accent, style }: AvatarProps) {
  const initial = name.trim().charAt(0) || '؟';
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, borderColor: color + '55' },
        style,
      ]}
    >
      <View style={[styles.fill, { borderRadius: size / 2, backgroundColor: color + '1A' }]}>
        <Text style={[styles.text, { fontSize: size * 0.36, color }]} numberOfLines={1}>
          {initial}
        </Text>
      </View>
    </View>
  );
}

/** Square, softly-routed variant — companies, services, categories. */
export function BrandLetterAvatar({ name = '', size = 48, color = palette.accent, style }: AvatarProps) {
  const initial = name.trim().charAt(0) || '؟';
  return (
    <View
      style={[
        styles.square,
        { width: size, height: size, borderRadius: r.md, backgroundColor: color + '20' },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.42, color }]} numberOfLines={1}>
        {initial}
      </Text>
    </View>
  );
}

export function Verified({ size = 15 }: { size?: number }) {
  return (
    <View style={[styles.verified, { width: size + 3, height: size + 3 }]}>
      <Icon name="verified" size={size} color={palette.accent} strokeWidth={2.4} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  square: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'Tajawal_800ExtraBold' },
  verified: {
    borderRadius: 999,
    backgroundColor: palette.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
