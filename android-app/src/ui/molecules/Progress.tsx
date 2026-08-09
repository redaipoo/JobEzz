/**
 * Progress — linear, stepped and ring progress surfaces.
 * Track uses transform scaleX from the right edge (RTL-safe).
 */
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, typ, sp, r } from '../../design';
import { Icon } from '../../icons';

function pctToColor(p: number) {
  return p >= 80 ? palette.success : p >= 45 ? palette.accent : palette.warning;
}

export function ProgressBar({ percent, height = 6, color, style }: { percent: number; height?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const c = color ?? pctToColor(percent);
  const frac = Math.min(1, Math.max(0, percent / 100));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      {/* Clip container so the fill never bleeds outside rounded track */}
      <View style={[StyleSheet.absoluteFill, { borderRadius: height / 2, overflow: 'hidden' }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: c,
              transform: [{ scaleX: frac }],
            },
          ]}
        />
      </View>
    </View>
  );
}

export function ProgressLine({ label, percent, size = 'md' }: { label?: string; percent: number; size?: 'sm' | 'md' }) {
  const c = pctToColor(percent);
  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.label, styles.labelPct, { color: c }]}>{percent}%</Text>
        </View>
      ) : null}
      <ProgressBar percent={percent} height={size === 'sm' ? 4 : 6} color={c} />
    </View>
  );
}

/**
 * StepIndicator — horizontal step train. Active step emits a soft glow.
 * In RTL the visual order is handled by the parent row; current is always "filled".
 */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={styles.stepsRow}>
      {steps.map((label, i) => {
        const reached = i < current;
        const active = i === current;
        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.dot,
                reached && styles.dotDone,
                active && styles.dotActive,
              ]}
            >
              {reached ? (
                <Icon name="check" size={13} color="#FFFFFF" />
              ) : (
                <Text style={[styles.dotText, active && styles.dotTextActive]}>{i + 1}</Text>
              )}
            </View>
            <Text
              style={[styles.dotLabel, (reached || active) && styles.dotLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {i < steps.length - 1 && (
              <View style={[styles.line, (reached || active) && styles.lineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  label: { ...typ.label, color: palette.textMid },
  labelPct: { color: palette.accent },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.surfaceHi,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transformOrigin: 'right center' as any,
  },

  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sp.sm,
  },
  stepItem: { flex: 1, alignItems: 'center' },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: palette.borderHi,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bg1,
  },
  dotDone: { backgroundColor: palette.success, borderColor: palette.success },
  dotActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
    shadowColor: palette.accent,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  dotText: { ...typ.caption, color: palette.textLow, fontSize: 11 },
  dotTextActive: { color: '#FFFFFF', fontWeight: '800' },
  dotLabel: {
    marginTop: 8,
    ...typ.caption,
    fontSize: 10,
    color: palette.textLow,
    textAlign: 'center',
    minWidth: 60,
  },
  dotLabelActive: { color: palette.text },
  line: {
    position: 'absolute',
    top: 13,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: palette.borderHi,
    zIndex: -1,
  },
  lineDone: { backgroundColor: palette.accent },
});
