/**
 * Auth + Otp — phone-based sign-in. Uses the shared Input component (label,
 * helper, error) and Button, real loading states, keyboard handling, and
 * safe-area bottom awareness.
 */
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, sp, r, typ, FadeInView, PressableScale, DepthGradient,
} from '../../design';
import { Button, Input, IconTile } from '../../ui';
import { normalizeLibyanPhone, isValidLibyanPhone, signInWithPhone, verifyPhoneOtp, resendOtp } from '../../lib/auth';
import { useAppStore } from '../../store';

export function Auth({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr('');
    if (!phone.trim()) { setErr('أدخل رقم هاتفك أولاً'); return; }
    if (!isValidLibyanPhone(phone)) {
      setErr('الرقم غير صحيح. الصيغة: 0912345678 أو +218912345678'); return;
    }
    setBusy(true);
    const res = await signInWithPhone(phone);
    setBusy(false);
    if (!res.ok) { setErr(res.message); return; }
    navigation.navigate('Otp', { phone: normalizeLibyanPhone(phone) });
  };

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + sp.lg, paddingBottom: insets.bottom + sp.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView>
            <Text style={styles.wordmark}>JobEzz</Text>

            <View style={styles.card}>
              <View style={styles.glyph}>
                <IconTile icon="phone" size={52} color={palette.accent} />
              </View>
              <Text style={styles.title}>سجّل الدخول</Text>
              <Text style={styles.sub}>أدخل رقم هاتفك الليبي وسنرسل لك رمز تحقق.</Text>

              <Input
                label="رقم الهاتف"
                placeholder="091 234 5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                autoFocus
                error={err || undefined}
                hint="سنرسل رمزاً عبر رسالة نصية"
                icon="phone"
              />

              <Button
                label={busy ? 'جارٍ الإرسال…' : 'إرسال الرمز'}
                onPress={submit}
                loading={busy}
                size="lg"
                style={{ marginTop: sp.sm }}
              />

              <PressableScale onPress={() => navigation.goBack()} activeScale={0.9} style={styles.back} accessibilityLabel="رجوع">
                <Text style={styles.backText}>رجوع</Text>
              </PressableScale>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function Otp({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const phone: string = route?.params?.phone ?? '';
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const hydrateAuth = useAppStore((s) => s.hydrateAuth);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const complete = digits.every((d) => d !== '');

  const submit = async () => {
    if (!complete) return;
    setErr('');
    setBusy(true);
    const res = await verifyPhoneOtp(phone, digits.join(''));
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      setDigits(['', '', '', '']);
      refs[0].current?.focus();
      return;
    }
    setAuthenticated(true);
    await hydrateAuth();
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as any, params: { screen: 'Home' } }] });
  };

  const onResend = async () => {
    setErr('');
    setBusy(true);
    const res = await resendOtp(phone);
    setBusy(false);
    setResent(res.ok);
    if (!res.ok) setErr(res.message);
  };

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + sp.lg, paddingBottom: insets.bottom + sp.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView>
            <Text style={styles.wordmark}>JobEzz</Text>

            <View style={styles.card}>
              <View style={styles.glyph}>
                <IconTile icon="shield" size={52} color={palette.accent} />
              </View>
              <Text style={styles.title}>أدخل الرمز</Text>
              <Text style={styles.sub}>أرسلنا رمز تحقق من 4 أرقام إلى {phone}</Text>

              <View style={styles.otpRow} accessibilityLabel="رمز التحقق">
                {digits.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={refs[i]}
                    style={[styles.otp, d ? styles.otpFilled : undefined, err !== '' ? styles.otpError : undefined]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={d}
                    onChangeText={(v) => {
                      const next = [...digits];
                      next[i] = v;
                      setDigits(next);
                      if (v && i < 3) refs[i + 1].current?.focus();
                      if (complete && v && i === 3) submit();
                    }}
                    onKeyPress={(e) => {
                      if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
                    }}
                  />
                ))}
              </View>

              {err ? <Text style={styles.error} accessibilityLiveRegion="polite">{err}</Text> : null}
              {resent && !err ? <Text style={styles.success}>تم إرسال رمز جديد</Text> : null}

              <Button
                label={busy ? 'جارٍ التحقق…' : 'تأكيد'}
                onPress={submit}
                loading={busy}
                disabled={!complete}
                size="lg"
                style={{ marginTop: sp.base }}
              />

              <PressableScale onPress={onResend} disabled={busy} activeScale={0.9} style={styles.back} accessibilityLabel="إعادة إرسال الرمز">
                <Text style={styles.backText}>لم يصلك الرمز؟ أرسله مرة أخرى</Text>
              </PressableScale>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: sp.screen },
  wordmark: { ...typ.h2, color: palette.textHi, letterSpacing: 1, marginBottom: sp.lg },
  card: {
    backgroundColor: palette.bg2,
    borderRadius: r.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: sp.xl,
  },
  glyph: { alignItems: 'flex-start', marginBottom: sp.base },
  title: { ...typ.display, color: palette.textHi },
  sub: { ...typ.bodyS, color: palette.textMid, marginTop: 4, marginBottom: sp.xl, lineHeight: 20 },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: sp.sm,
    marginTop: sp.xs,
  },
  otp: {
    width: 58,
    height: 62,
    borderRadius: r.md,
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.bg3,
    color: palette.textHi,
    textAlign: 'center',
    fontSize: 26,
    fontFamily: 'Tajawal_700Bold',
  },
  otpFilled: { borderColor: palette.accent },
  otpError: { borderColor: palette.danger },

  error: { ...typ.caption, color: palette.danger, marginTop: sp.md, textAlign: 'center' },
  success: { ...typ.caption, color: palette.success, marginTop: sp.md, textAlign: 'center' },
  back: { alignSelf: 'center', marginTop: sp.lg, padding: 4 },
  backText: { ...typ.bodyS, color: palette.textMid },
});
