/**
 * Profile — identity hero, completion, stats, quick actions and menu.
 *
 * - Hero (tone hero Header) + Avatar + verified + roles chips.
 * - Profile-completion card via ProgressLine (real USER.profileCompletion).
 * - KpiRow with REAL values: wallet / avgRating / completedJobs from the
 *   store-backed user (fallbacks to '--' when the field is absent).
 * - Role-gated items come from store roles; Admin appears only for the
 *   'admin' role or prototype user u1.
 * - Logout → Dialog confirm → signOut() → reset to Onboarding.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  palette, sp, r, typ,
  PressableScale, useEntrance, DepthGradient, AmbientGlow,
} from '../../design';
import {
  Header, Card, Chip, Avatar, Verified, ListItem, IconTile,
  KpiRow, ProgressLine, Dialog, Toggle, useTabBarClearance, useToast,
} from '../../ui';
import { Icon } from '../../icons';
import { useAppStore } from '../../store';
import { useT } from '../../i18n';
import { USER } from '../../data';
import type { User } from '../../types';

const ROLE_AR: Record<string, string> = {
  customer: 'عميل',
  jobseeker: 'باحث عن عمل',
  student: 'طالب',
  provider: 'مزوّد خدمة',
  employer: 'صاحب عمل',
  instructor: 'مدرّب',
  admin: 'مدير',
};

function QuickAction({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} activeScale={0.94} style={styles.quickAction}>
      <View style={[styles.quickIcon, { backgroundColor: color + '16' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </PressableScale>
  );
}

export function Profile({ navigation }: any) {
  const user: User = useAppStore((s) => s.user) ?? (USER as User);
  const roles = useAppStore((s) => s.roles);
  const providerMode = useAppStore((s) => s.providerMode);
  const setProviderMode = useAppStore((s) => s.setProviderMode);
  const lang = useAppStore((s) => s.lang);
  const t = useT(lang);
  const toast = useToast();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const fade = useEntrance(0, 14);
  const clearance = useTabBarClearance();

  const profilePct = user.profileCompletion ?? 0;
  const rating = user.avgRating ?? user.rating;
  const ratingText = rating != null ? String(rating) : '--';
  const jobsText = user.completedJobs != null ? String(user.completedJobs) : '--';

  const completionSuggestions = [
    { done: !!user.bio, label: 'أضف نبذة شخصية', icon: 'user' },
    { done: !!user.skills && user.skills.length > 0, label: 'أضف مهاراتك', icon: 'jobs' },
    { done: !!user.experience, label: 'أضف خبراتك', icon: 'building' },
    { done: user.verified, label: 'تحقق من هويتك', icon: 'shield' },
  ];

  const isProvider = roles.includes('provider');
  const isEmployer = roles.includes('employer');
  const isInstructor = roles.includes('instructor');
  const isAdmin = roles.includes('admin') || user.id === 'u1';

  const onLogout = async () => {
    setLogoutOpen(false);
    await useAppStore.getState().signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topRight" color={palette.accent} size={280} opacity={0.07} />

      <Header title="حسابي" tone="hero" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={fade}>
          {/* ── Identity hero ── */}
          <View style={styles.identity}>
            <View style={styles.avatarWrap}>
              <Avatar name={user.name} size={76} />
              {user.verified ? <View style={styles.verifiedBadge}><Verified size={16} /></View> : null}
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userMeta}>{user.phone || user.city}</Text>
            <View style={styles.chipRow}>
              {user.roles.map((role) => (
                <Chip key={role} label={ROLE_AR[role] ?? role} />
              ))}
            </View>
          </View>

          {/* ── Profile completion ── */}
          <Card style={styles.block}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>أكمل ملفك الشخصي</Text>
              <Text style={[styles.pct, { color: profilePct >= 80 ? palette.success : palette.accent }]}>{profilePct}%</Text>
            </View>
            <View style={styles.progressWrap}>
              <ProgressLine percent={profilePct} />
            </View>
            <View style={styles.suggestions}>
              {completionSuggestions.map((s, i) => (
                <View key={i} style={styles.suggestionRow}>
                  <IconTile
                    icon={s.done ? 'check' : s.icon}
                    size={28}
                    rounded="sm"
                    color={s.done ? palette.success : palette.textLow}
                  />
                  <Text style={[styles.suggestionLabel, s.done && styles.suggestionDone]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* ── Stats (real values) ── */}
          <KpiRow items={[
            { value: ratingText, label: 'التقييم', icon: 'starFill', color: palette.warning },
            { value: jobsText, label: 'مهام مكتملة', icon: 'check', color: palette.success },
            { value: `${user.wallet} د.ل`, label: 'المحفظة', icon: 'wallet', color: palette.accent },
          ]} />

          {/* ── Quick actions ── */}
          <View style={styles.quickRow}>
            <QuickAction icon="wallet" label="المحفظة" color={palette.accent} onPress={() => navigation.navigate('Wallet')} />
            <QuickAction icon="chat" label="الرسائل" color={palette.success} onPress={() => navigation.navigate('ChatList')} />
            <QuickAction icon="flag" label="التقييمات" color={palette.warning} onPress={() => navigation.navigate('Reviews', {})} />
          </View>

          {/* ── Professional tools (role-gated) ── */}
          {(isProvider || isEmployer || isInstructor) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الأدوات المهنية</Text>
              {isProvider && (
                <Card style={styles.block}>
                  <View style={styles.toggleRow}>
                    <IconTile icon="services" size={40} color={providerMode ? palette.success : palette.accent} />
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
              )}
              {isEmployer && (
                <ListItem
                  icon="building"
                  iconColor={palette.accent}
                  title={t('employerDash')}
                  body="وظائفي وطلبات التقديم"
                  onPress={() => navigation.navigate('EmployerJobs')}
                />
              )}
              {isInstructor && (
                <ListItem
                  icon="school"
                  iconColor={palette.warning}
                  title={t('instructorDash')}
                  body="دوراتك وإحصائياتها"
                  onPress={() => navigation.navigate('InstructorDashboard')}
                />
              )}
            </View>
          )}

          {/* ── Account menu ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>حسابي</Text>
            <ListItem
              icon="doc"
              iconColor={palette.catViolet}
              title={t('saved')}
              body={user.savedJobs && user.savedJobs.length > 0 ? `${user.savedJobs.length} وظيفة محفوظة` : 'لا توجد وظائف محفوظة بعد'}
              onPress={() => navigation.navigate('SavedJobs')}
            />
            <ListItem
              icon="jobs"
              iconColor={palette.success}
              title={t('myApps')}
              body="تتبع طلبات التقديم"
              onPress={() => navigation.navigate('Applications')}
            />
            <ListItem
              icon="flag"
              iconColor={palette.warning}
              title="التقييمات"
              body="مراجعات وملاحظات"
              onPress={() => navigation.navigate('Reviews', {})}
            />
            <ListItem
              icon="wallet"
              iconColor={palette.accent}
              title={t('wallet')}
              body={`الرصيد ${user.wallet} د.ل`}
              onPress={() => navigation.navigate('Wallet')}
            />
            <ListItem
              icon="settings"
              iconColor={palette.textMid}
              title={t('settings')}
              body="اللغة، الإشعارات والمزيد"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>

          {/* ── Legal ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>القانونية</Text>
            <ListItem
              icon="lock"
              iconColor={palette.catTeal}
              title="سياسة الخصوصية"
              onPress={() => navigation.navigate('Legal', { section: 'privacy' })}
            />
            <ListItem
              icon="doc"
              iconColor={palette.catViolet}
              title="شروط الاستخدام"
              onPress={() => navigation.navigate('Legal', { section: 'terms' })}
            />
          </View>

          {/* ── Admin (role-gated) ── */}
          {isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>النظام</Text>
              <ListItem
                icon="shield"
                iconColor={palette.danger}
                title="لوحة الأدمن"
                body="إدارة المنصة والاشتراكات"
                onPress={() => navigation.navigate('Admin')}
              />
            </View>
          )}

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
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  body: { paddingHorizontal: sp.screen, paddingTop: sp.base },
  section: { marginTop: sp.section },
  sectionTitle: { ...typ.label, color: palette.textMid, marginBottom: sp.md },
  block: { marginBottom: sp.base },

  identity: { alignItems: 'center', marginTop: sp.md },
  avatarWrap: { position: 'relative' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    end: 0,
  },
  userName: { ...typ.h2, color: palette.textHi, marginTop: sp.md },
  userMeta: { ...typ.bodyS, color: palette.textLow, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, justifyContent: 'center', marginTop: sp.md },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typ.h4, color: palette.textHi },
  pct: { ...typ.h4, color: palette.accent, fontWeight: '800' },
  progressWrap: { marginTop: sp.base },
  suggestions: { marginTop: sp.base, gap: sp.sm },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  suggestionLabel: { ...typ.bodyS, color: palette.textLow, flex: 1 },
  suggestionDone: { color: palette.textLow, textDecorationLine: 'line-through' },

  quickRow: { flexDirection: 'row', gap: sp.md, marginTop: sp.lg },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: palette.bg3,
    borderRadius: r.md,
    paddingVertical: sp.md,
    gap: sp.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  quickIcon: { width: 40, height: 40, borderRadius: r.sm, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { ...typ.caption, color: palette.text, fontWeight: '700' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  rowTitle: { ...typ.h4, color: palette.textHi },
  rowBody: { ...typ.caption, color: palette.textLow, marginTop: 2 },

  logoutRow: { marginTop: sp.xxxl },
});
