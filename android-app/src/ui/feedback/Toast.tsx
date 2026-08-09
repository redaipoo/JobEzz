/**
 * Toast — transient confirmations; never a generic Alert for async acts.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
} from 'react-native-reanimated';
import { palette, typ, sp, r, sh } from '../../design';
import { Icon } from '../../icons';

export type ToastVariant = 'success' | 'error' | 'info';
interface ToastData { id: number; message: string; variant: ToastVariant; }

const ToastContext = createContext<{ show: (message: string, variant?: ToastVariant) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ToastData | null>(null);
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, variant: ToastVariant = 'success') => {
    seq.current += 1;
    setActive({ id: seq.current, message, variant });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(null), 2600);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {active && <Toast key={active.id} message={active.message} variant={active.variant} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const VARIANT_CFG = {
  success: { icon: 'checkCircle', color: palette.success, border: 'rgba(62,207,142,0.35)' },
  error:   { icon: 'alert',       color: palette.danger,  border: 'rgba(242,109,109,0.35)' },
  info:    { icon: 'info',        color: palette.accent,  border: palette.borderAccent },
} as const;

function Toast({ message, variant }: { message: string; variant: ToastVariant }) {
  const insets = useSafeAreaInsets();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withSpring(1, { damping: 18, stiffness: 220, mass: 0.9 });
    return () => { p.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) }); };
  }, [p]);
  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * -20 }],
  }));
  const cfg = VARIANT_CFG[variant];
  return (
    <Animated.View style={[styles.wrap, { top: insets.top + sp.sm, borderColor: cfg.border }, style]}>
      <View style={[styles.icon, { backgroundColor: cfg.color + '1F' }]}>
        <Icon name={cfg.icon} size={16} color={cfg.color} />
      </View>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.sm + 2,
    paddingHorizontal: sp.lg,
    paddingVertical: sp.sm + 4,
    borderRadius: r.pill,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    zIndex: 999,
    ...sh.lg,
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { ...typ.label, color: palette.textHi },
});
