/**
 * Stars + RateStars — vector rating display (complete 1-5 scale incl. halves)
 * and the single interactive star input used by ServiceRate and Reviews.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette } from '../../design';
import { Icon } from '../../icons';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

/* Half-filled star via a clipped gradient — zero guesswork. */
function Star({ fill, size, stroke = false }: { fill: number; size: number; stroke?: boolean }) {
  const d = 'M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z';
  const pct = Math.max(0, Math.min(1, fill));
  const id = React.useId().replace(/[:#]/g, 'x');
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset={pct} stopColor={palette.warning} />
          <Stop offset={pct} stopColor="transparent" />
        </SvgGradient>
      </Defs>
      {/* Outline pass so empty stars don't vanish on dark surfaces. */}
      <Path
        d={d}
        stroke={stroke || pct === 0 ? palette.textLow : palette.warning}
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill={pct > 0 ? `url(#${id})` : 'none'}
      />
    </Svg>
  );
}

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`${value} من 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={Math.max(0, Math.min(1, value - i))} size={size} />
      ))}
    </View>
  );
}

/* Interactive input: tap a star to set a whole rating. */
export function RateStars({ value, onChange, size = 34 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <View style={styles.row}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} onTouchEnd={() => onChange(i + 1)} style={{ padding: 8 }}>
          <Star fill={i < value ? 1 : 0} size={size} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 3 } });
