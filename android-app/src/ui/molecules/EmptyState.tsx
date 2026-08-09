/**
 * EmptyState + ErrorState — non-hero states, one look, one rhythm.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typ, sp, r, sh } from '../../design';
import { Icon } from '../../icons';
import { Button } from '../atoms/Button';

export function EmptyState({
  icon, title, body, actionLabel, onAction, style,
}: { icon: string; title: string; body?: string; actionLabel?: string; onAction?: () => void; style?: any }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={30} color={palette.accent} strokeWidth={1.6} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} />
      ) : null}
    </View>
  );
}

export function ErrorState({
  title, body, onRetry, style,
}: { title: string; body?: string; onRetry?: () => void; style?: any }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.iconWrap, styles.errorWrap]}>
        <Icon name="alert" size={30} color={palette.danger} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {onRetry ? <Button label="إعادة المحاولة" onPress={onRetry} variant="danger" size="sm" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: sp.xl, paddingVertical: sp.xxxl },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.accentSoft,
    borderWidth: 1,
    borderColor: palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.base,
    ...sh.glowSoft,
  },
  errorWrap: { backgroundColor: palette.dangerBg, borderColor: 'rgba(242,109,109,0.22)', ...sh.sm },
  title: { ...typ.h3, color: palette.textHi, textAlign: 'center' },
  body: { ...typ.bodyS, color: palette.textMid, textAlign: 'center', marginTop: sp.sm, lineHeight: 20 },
  action: { marginTop: sp.lg },
});
