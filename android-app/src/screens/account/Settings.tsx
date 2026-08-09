/**
 * Settings — language, appearance, provider mode, notifications, legal and
 * logout. RTL is forced app-wide (App.tsx), so the language switch only
 * affects strings that pass through the i18n layer; dark mode is the app
 * identity, so the toggle is shown locked.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { palette, sp, r, typ, DepthGradient } from '../../design';
import {
  Header, Card, Button, Badge, ListItem, Toggle, Dialog, useTabBarClearance, useToast,
} from '../../ui';
import { useAppStore } from '../../store';
import { useT } from '../../i18n';
import { getNotificationPermission, requestNotificationPermission } from '../../notifications';

type Perm = 'granted' | 'denied' | 'undetermined' | 'unknown';

export function Settings({ navigation }: any) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const darkMode = useAppStore((s) => s.darkMode);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const providerMode = useAppStore((s) => s.providerMode);
  const setProviderMode = useAppStore((s) => s.setProviderMode);
  const t = useT(lang);
  const toast = useToast();

  const [perm, setPerm] = useState<Perm>('unknown');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const clearance = useTabBarClearance();

  useEffect(() => {
    let active = true;
    getNotificationPermission().then((s) => {
      if (active) setPerm(s);
    });
    return () => {
      active = false;
    };
  }, []);

  const ask = async () => {
    const ok = await requestNotificationPermission();
    setPerm(ok ? 'granted' : 'denied');
    toast.show(ok ? 'تم تفعيل الإشعارات' : 'لم يتم منح إذن الإشعارات', ok ? 'success' : 'error');
  };

  const onLogout = async () => {
    setLogoutOpen(false);
    await useAppStore.getState().signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />

      <Header title={t('settings')} onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Language ── */}
        <Text style={styles.sectionTitle}>اللغة</Text>
        <Card style={styles.block}>
          <View style={styles.langRow}>
            <Button
              label="العربية"
              variant={lang === 'ar' ? 'primary' : 'ghost'}
              style={styles.langBtn}
              onPress={() => setLang('ar')}
            />
            <Button
              label="English"
              variant={lang === 'en' ? 'primary' : 'ghost'}
              style={styles.langBtn}
              onPress={() => setLang('en')}
            />
          </View>
          <Text style={styles.hint}>
            الواجهة عربية بالكامل (RTL) — تغيير اللغة يؤثر على النصوص المدعومة بالترجمة فقط.
          </Text>
        </Card>

        {/* ── Appearance (dark is the identity — locked) ── */}
        <Text style={styles.sectionTitle}>المظهر</Text>
        <Card style={styles.block}>
          <View style={styles.toggleRow}>
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>الوضع الداكن</Text>
              <Text style={styles.rowBody}>الوضع الداكن هو هوية JobEzz في هذه النسخة</Text>
            </View>
            <Toggle value={darkMode} onChange={setDarkMode} disabled />
          </View>
        </Card>

        {/* ── Account ── */}
        <Text style={styles.sectionTitle}>الحساب</Text>
        <Card style={styles.block}>
          <View style={styles.toggleRow}>
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{t('providerMode')}</Text>
              <Text style={styles.rowBody}>استقبل طلبات العملاء حولك</Text>
            </View>
            <Toggle
              value={providerMode}
              onChange={(v) => {
                setProviderMode(v);
                toast.show(v ? 'تم تفعيل وضع المزوّد' : 'تم إيقاف وضع المزوّد', 'info');
              }}
            />
          </View>
        </Card>

        {/* ── Notifications ── */}
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        <ListItem
          icon="bell"
          iconColor={palette.warning}
          title={t('notifs')}
          body={
            perm === 'granted'
              ? 'الإشعارات مفعلة'
              : perm === 'denied'
                ? 'الإشعارات معطلة — اضغط لإعادة الطلب'
                : 'اضغط لتفعيل الإشعارات'
          }
          badge={
            <Badge
              label={perm === 'granted' ? 'مفعل' : perm === 'denied' ? 'معطل' : perm === 'unknown' ? 'جاري الفحص' : 'غير محدد'}
              variant={perm === 'granted' ? 'success' : perm === 'denied' ? 'danger' : 'neutral'}
            />
          }
          onPress={perm === 'granted' ? undefined : ask}
        />

        {/* ── Legal / about ── */}
        <Text style={styles.sectionTitle}>القانونية</Text>
        <ListItem
          icon="lock"
          iconColor={palette.catTeal}
          title="سياسة الخصوصية"
          onPress={() => navigation.navigate('Legal', { section: 'privacy' })}
        />
        <ListItem
          icon="info"
          iconColor={palette.textMid}
          title="عن التطبيق"
          body="JobEzz • النسخة 3.0"
          onPress={() => navigation.navigate('Legal', { section: 'terms' })}
        />

        {/* ── Logout ── */}
        <ListItem
          destructive
          icon="logout"
          title={t('logout')}
          body="إنهاء الجلسة الحالية"
          onPress={() => setLogoutOpen(true)}
          style={styles.logoutRow}
        />

        <Dialog
          visible={logoutOpen}
          title="تسجيل الخروج؟"
          body="سيتعين عليك تسجيل الدخول مجدداً للوصول إلى حسابك."
          confirmLabel="تسجيل الخروج"
          cancelLabel="إلغاء"
          variant="danger"
          icon="logout"
          onCancel={() => setLogoutOpen(false)}
          onConfirm={onLogout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  body: { paddingHorizontal: sp.screen, paddingTop: sp.base },
  sectionTitle: { ...typ.label, color: palette.textMid, marginBottom: sp.md, marginTop: sp.section },
  block: { marginBottom: sp.base },

  langRow: { flexDirection: 'row', gap: sp.md },
  langBtn: { flex: 1 },
  hint: { ...typ.caption, color: palette.textLow, marginTop: sp.md, lineHeight: 18 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  rowTitle: { ...typ.h4, color: palette.textHi },
  rowBody: { ...typ.caption, color: palette.textLow, marginTop: 2 },

  logoutRow: { marginTop: sp.xxxl },
});
