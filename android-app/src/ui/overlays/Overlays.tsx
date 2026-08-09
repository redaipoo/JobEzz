/**
 * BottomSheet + Dialog — the two overlay surfaces used for filters, pickers,
 * and blocking choices. Both are mounts-on-demand, backdropped, and
 * press-dismissable. Both slide via Reanimated. Both honor safe-area.
 */
import React, { useEffect } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
} from 'react-native-reanimated';
import { palette, sp, r, typ, sh, motion } from '../../design';
import { Icon } from '../../icons';
import { Button } from '../atoms/Button';

/* ── BottomSheet ── */

export function BottomSheet({
  visible, onClose, title, children, contentStyle,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = visible
      ? withSpring(1, motion.spring.soft)
      : withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) });
  }, [visible, p]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - p.value) * 120 }],
    opacity: p.value,
  }));
  const backdrop = useAnimatedStyle(() => ({ opacity: p.value * 0.55 }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdropWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdrop]} />
        </Pressable>
        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + sp.lg }, sheetStyle, contentStyle]}>
          <View style={styles.grabber} />
          {title ? (
            <View style={styles.header}>
              <Text style={styles.headerText}>{title}</Text>
              <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="إغلاق">
                <Icon name="close" size={15} color={palette.textMid} />
              </Pressable>
            </View>
          ) : null}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ── Dialog ── */

export function Dialog({
  visible, onCancel, onConfirm, title, body, confirmLabel = 'تأكيد', cancelLabel = 'إلغاء',
  variant = 'primary', icon,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  icon?: string;
}) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = visible
      ? withSpring(1, motion.spring.snap)
      : withTiming(0, { duration: 180, easing: Easing.in(Easing.quad) });
  }, [visible, p]);

  const boxStyle = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: 0.92 + p.value * 0.08 }],
  }));
  const backdrop = useAnimatedStyle(() => ({ opacity: p.value * 0.6 }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.dialogWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
          <Animated.View style={[styles.backdrop, backdrop]} />
        </Pressable>
        <Animated.View style={[styles.dialog, boxStyle]}>
          {icon ? (
            <View style={[styles.dialogIcon, { backgroundColor: variant === 'danger' ? palette.dangerBg : palette.accentSoft }]}>
              <Icon name={icon} size={26} color={variant === 'danger' ? palette.danger : palette.accent} />
            </View>
          ) : null}
          <Text style={styles.dialogTitle}>{title}</Text>
          {body ? <Text style={styles.dialogBody}>{body}</Text> : null}
          <View style={styles.dialogActions}>
            <Button label={confirmLabel} onPress={onConfirm} variant={variant === 'danger' ? 'danger' : 'primary'} size="md" style={{ flex: 1 }} />
            <Button label={cancelLabel} onPress={onCancel} variant="ghost" size="md" style={{ flex: 1 }} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropWrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: palette.bg0 },
  sheet: {
    borderTopLeftRadius: r.xl,
    borderTopRightRadius: r.xl,
    backgroundColor: palette.bg2,
    borderTopWidth: 1,
    borderColor: palette.borderHi,
    maxHeight: '90%',
    ...sh.xl,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.surfaceTop,
    marginVertical: sp.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp.screen,
    paddingBottom: sp.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  headerText: { ...typ.h3, color: palette.textHi },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sheetBody: { paddingHorizontal: sp.screen, paddingTop: sp.base },

  dialogWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: sp.screen },
  dialog: {
    borderRadius: r.lg,
    backgroundColor: palette.bg2,
    borderWidth: 1,
    borderColor: palette.borderHi,
    padding: sp.xl,
    alignItems: 'center',
    ...sh.xl,
  },
  dialogIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.base,
  },
  dialogTitle: { ...typ.h2, color: palette.textHi, textAlign: 'center' },
  dialogBody: { ...typ.bodyS, color: palette.textMid, textAlign: 'center', marginTop: sp.sm, lineHeight: 20 },
  dialogActions: {
    flexDirection: 'row',
    gap: sp.md,
    marginTop: sp.lg,
    alignSelf: 'stretch',
  },
});
