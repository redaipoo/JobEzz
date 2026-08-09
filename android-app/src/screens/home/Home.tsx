/**
 * Home — the adaptive hub (tab #1).
 * Hero: brand strip + greeting + search + the two intent gates.
 * Content is role-driven on top of a universal base:
 *   - jobseeker  → matching jobs (JobCard) + fresh jobs rail
 *   - provider   → real KpiRow (wallet / rating / completed jobs) + incoming CTA
 *   - employer   → quick actions (post / my jobs / applicants)
 *   - student    → continue learning (MY_COURSES ⋈ COURSES)
 *   - universal  → popular categories, top-rated technicians (live data with
 *                  skeleton), trusted artisans strip
 *
 * All values derive from the store / fixtures — no invented numbers.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  palette, sp, r, sh, typ, categoryColors,
  PressableScale, useEntrance, StaggerItem, PulseDot,
  DepthGradient, AmbientGlow,
} from '../../design';
import {
  useTabBarClearance, SectionTitle, JobCard, KpiRow, Card, Avatar, Stars,
  EmptyState, SkeletonList, IconTile, RowEdge, ProgressLine,
} from '../../ui';
import { Icon, CategoryIcon } from '../../icons';
import { useAppStore } from '../../store';
import { useLiveProviders } from '../../lib/queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import { jobMatchScore } from '../../utils';
import { greetingAr } from '../../utils/greeting';
import {
  USER, JOBS, TECHNICIANS, CATEGORIES, MY_COURSES, COURSES, NOTIFS, FEATURED_ARTISANS,
} from '../../data';
import type { User } from '../../types';

/* ── IntentGate · asymmetric gradient gateway card ─────────────────────── */

function IntentGate({
  flex, title, subtitle, icon, colors, dark, cta, onPress,
}: {
  flex: number;
  title: string;
  subtitle: string;
  icon: string;
  colors: readonly [string, string];
  dark?: boolean;
  cta: string;
  onPress: () => void;
}) {
  const fg = dark ? palette.bg0 : palette.textHi;
  return (
    <PressableScale onPress={onPress} activeScale={0.96} style={{ flex }}>
      <LinearGradient
        colors={colors as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.intentCard}
      >
        <View style={[styles.intentIcon, { backgroundColor: dark ? 'rgba(7,12,22,0.14)' : 'rgba(244,248,255,0.16)' }]}>
          <Icon name={icon} size={24} color={fg} />
        </View>
        <Text style={[styles.intentTitle, { color: fg }]}>{title}</Text>
        <Text style={[styles.intentSub, { color: dark ? 'rgba(7,12,22,0.72)' : 'rgba(244,248,255,0.85)' }]}>{subtitle}</Text>
        <View style={[styles.intentCta, { backgroundColor: dark ? 'rgba(7,12,22,0.12)' : 'rgba(244,248,255,0.18)' }]}>
          <Text style={[styles.intentCtaText, { color: fg }]}>{cta}</Text>
          <Icon name="back" size={13} color={fg} />
        </View>
        <View pointerEvents="none" style={styles.intentGloss} />
      </LinearGradient>
    </PressableScale>
  );
}

/* ── Home ──────────────────────────────────────────────────────────────── */

export function Home({ navigation }: any) {
  const user: User = useAppStore((s) => s.user) ?? (USER as User);
  const roles = useAppStore((s) => s.roles);

  const liveProviders = useLiveProviders();
  const configured = isSupabaseConfigured();
  /* In local mode providers resolve to null forever; in live mode a failed
   * request also returns null. Fall back to fixtures after a short window so
   * the rail is never stuck on a skeleton. */
  const [provTimedOut, setProvTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setProvTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const techs: any[] = (liveProviders ?? TECHNICIANS)
    .slice()
    .sort((a: any, b: any) => b.rating - a.rating)
    .slice(0, 5);
  const showProvSkeleton = configured && liveProviders === null && !provTimedOut;

  const popularCats = CATEGORIES.filter((c) => TECHNICIANS.some((t: any) => t.catId === c.id)).slice(0, 8);

  const topJobs = JOBS
    .map((j) => ({ ...j, matchScore: jobMatchScore(j, user as any) }))
    .filter((j) => j.matchScore >= 70)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    .slice(0, 2);
  const freshJobs = JOBS.slice(0, 4);

  const isJobseeker = roles.includes('jobseeker');
  const isEmployer = roles.includes('employer');
  const isProvider = roles.includes('provider');
  const isStudent = roles.includes('student');

  const hasUnread = (NOTIFS as { read?: boolean }[]).some((n) => n.read !== true);
  const fadeHero = useEntrance(0, 14);
  const fadeContent = useEntrance(120, 22);
  const clearance = useTabBarClearance();

  const rating = user.avgRating ?? user.rating;
  const ratingText = rating != null ? String(rating) : '--';
  const jobsText = user.completedJobs != null ? String(user.completedJobs) : '--';

  const inProgressEntry = MY_COURSES
    .map((mc) => ({ ...mc, course: COURSES.find((c) => c.id === mc.courseId) }))
    .find((x) => x.course !== undefined);
  const nextCourse = inProgressEntry?.course;

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topRight" color={palette.accent} size={320} opacity={0.09} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <Animated.View style={fadeHero}>
          <View style={styles.brandRow}>
            <View style={styles.brandBlock}>
              <View style={styles.brandLine}>
                <Icon name="sparkle" size={13} color={palette.accent} />
                <Text style={styles.brandLabel}>JOBEZZ</Text>
              </View>
              <Text style={styles.heroGreeting}>{greetingAr()}</Text>
              <Text style={styles.heroName}>{user.name.split(' ')[0]}</Text>
            </View>
            <PressableScale
              onPress={() => navigation.navigate('Notifs')}
              activeScale={0.88}
              style={styles.notifBtn}
              accessibilityLabel="الإشعارات"
            >
              <Icon name="bell" size={20} color={palette.text} />
              {hasUnread ? <PulseDot color={palette.danger} size={8} style={styles.notifDot} /> : null}
            </PressableScale>
          </View>

          <PressableScale
            onPress={() => navigation.navigate('Services')}
            activeScale={0.98}
            style={styles.searchBar}
          >
            <Icon name="search" size={18} color={palette.textMid} />
            <Text style={styles.searchPlaceholder}>ابحث عن وظيفة، خدمة أو دورة...</Text>
          </PressableScale>

          <View style={styles.intentRow}>
            <IntentGate
              flex={1.25}
              title="أحتاج خدمة"
              subtitle="فني موثّق يوصلك أينما كنت"
              icon="wrench"
              colors={palette.gradientAccent}
              cta="اطلب الآن"
              onPress={() => navigation.navigate('Services')}
            />
            <IntentGate
              flex={1}
              title="أبحث عن عمل"
              subtitle="وظائف مطابقة لمهاراتك"
              icon="jobs"
              colors={palette.gradientGold}
              dark
              cta="استعرض"
              onPress={() => navigation.navigate('Jobs')}
            />
          </View>
        </Animated.View>

        {/* ── Role-driven content ── */}
        <Animated.View style={fadeContent}>
          {/* Provider: real performance summary + incoming CTA */}
          {isProvider && (
            <>
              <SectionTitle title="ملخص أدائك" />
              <KpiRow items={[
                { value: ratingText, label: 'التقييم', icon: 'starFill', color: palette.warning },
                { value: jobsText, label: 'مهام مكتملة', icon: 'check', color: palette.success },
                { value: `${user.wallet} د.ل`, label: 'المحفظة', icon: 'wallet', color: palette.accent },
              ]} />
              <SectionTitle
                title="طلبات جديدة"
                actionLabel="عرض الكل"
                onAction={() => navigation.navigate('ProviderIncoming')}
              />
              <Card onPress={() => navigation.navigate('ProviderIncoming')} style={styles.incomingCard}>
                <IconTile icon="services" color={palette.accent} size={46} />
                <View style={styles.flex}>
                  <Text style={styles.incomingTitle}>استقبل طلبات العملاء</Text>
                  <Text style={styles.incomingBody}>عند تفعيل وضع المزوّد تصل طلبات الخدمة الجديدة هنا.</Text>
                </View>
                <RowEdge />
              </Card>
            </>
          )}

          {/* Job seeker: matching jobs */}
          {isJobseeker && topJobs.length > 0 && (
            <>
              <SectionTitle
                title="وظائف مطابقة لك"
                actionLabel="عرض الكل"
                onAction={() => navigation.navigate('Jobs')}
              />
              {topJobs.map((j, i) => (
                <StaggerItem key={j.id} index={i}>
                  <JobCard job={j} onPress={() => navigation.navigate('JobDetail', { id: j.id })} />
                </StaggerItem>
              ))}
            </>
          )}

          {/* Job seeker: fresh jobs rail */}
          {isJobseeker && (
            <>
              <SectionTitle
                title="أحدث الوظائف"
                actionLabel="عرض الكل"
                onAction={() => navigation.navigate('Jobs')}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {freshJobs.map((j, i) => (
                  <StaggerItem key={j.id} index={i}>
                    <JobCard job={j} onPress={() => navigation.navigate('JobDetail', { id: j.id })} style={styles.freshJobCard} />
                  </StaggerItem>
                ))}
              </ScrollView>
            </>
          )}

          {/* Employer: quick actions rail */}
          {isEmployer && (
            <>
              <SectionTitle title="إجراءات سريعة" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {[
                  { label: 'نشر وظيفة', icon: 'plus', tint: palette.accent, nav: 'EmployerPost' },
                  { label: 'وظائفي', icon: 'jobs', tint: palette.success, nav: 'EmployerJobs' },
                  { label: 'المتقدّمون', icon: 'users', tint: palette.warning, nav: 'EmployerApplicants' },
                ].map((a, i) => (
                  <StaggerItem key={a.nav} index={i}>
                    <PressableScale
                      style={styles.employerTile}
                      onPress={() => navigation.navigate(a.nav, {})}
                    >
                      <View style={[styles.employerTileIcon, { backgroundColor: a.tint + '1f' }]}>
                        <Icon name={a.icon} size={20} color={a.tint} />
                      </View>
                      <Text style={styles.employerTileText}>{a.label}</Text>
                    </PressableScale>
                  </StaggerItem>
                ))}
              </ScrollView>
            </>
          )}

          {/* Student: continue learning (MY_COURSES ⋈ COURSES) */}
          {isStudent && nextCourse && inProgressEntry && (
            <>
              <SectionTitle
                title="تابع التعلّم"
                actionLabel="عرض الكل"
                onAction={() => navigation.navigate('Courses')}
              />
              <PressableScale
                style={styles.learnCard}
                onPress={() => navigation.navigate('CourseDetail', { id: inProgressEntry.courseId })}
              >
                <View style={styles.learnIcon}>
                  <Icon name={nextCourse.icon} size={22} color={palette.accent100} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.learnTitle} numberOfLines={1}>{nextCourse.title}</Text>
                  <Text style={styles.learnMeta}>
                    {nextCourse.lessons} درس • الفصل {inProgressEntry.lastLesson} من {nextCourse.lessons}
                  </Text>
                  <View style={styles.learnProgress}>
                    <ProgressLine percent={inProgressEntry.progress} size="sm" />
                  </View>
                </View>
                {inProgressEntry.streak > 0 ? (
                  <View style={styles.streakPill}>
                    <Icon name="fire" size={12} color={palette.warning} />
                    <Text style={styles.streakText}>{inProgressEntry.streak} أيام</Text>
                  </View>
                ) : null}
              </PressableScale>
            </>
          )}

          {/* Universal: most requested categories */}
          <SectionTitle
            title="الأكثر طلباً"
            actionLabel="عرض الكل"
            onAction={() => navigation.navigate('Services')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {popularCats.map((c, i) => {
              const col = categoryColors[c.id] || palette.accent;
              const n = TECHNICIANS.filter((t: any) => t.catId === c.id).length;
              return (
                <StaggerItem key={c.id} index={i}>
                  <PressableScale
                    style={[styles.popCatPill, { borderColor: col + '30' }]}
                    onPress={() => navigation.navigate('TechnicianList', { catId: c.id })}
                  >
                    <View style={[styles.popCatIcon, { backgroundColor: col + '20' }]}>
                      <CategoryIcon id={c.id} size={18} color={col} />
                    </View>
                    <Text style={styles.popCatName}>{c.name}</Text>
                    <Text style={[styles.popCatCount, { color: col }]}>{n} فني</Text>
                  </PressableScale>
                </StaggerItem>
              );
            })}
          </ScrollView>

          {/* Universal: top-rated technicians (live data → skeleton / empty) */}
          <SectionTitle
            title="أفضل الفنيين تقييماً"
            actionLabel="عرض الكل"
            onAction={() => navigation.navigate('Services')}
          />
          {showProvSkeleton ? (
            <SkeletonList count={3} kind="row" />
          ) : techs.length === 0 ? (
            <EmptyState icon="users" title="لا يوجد فنيون متاحون حالياً" body="عد لاحقاً للاطلاع على قائمة المزوّدين." />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {techs.map((t: any, i: number) => (
                <StaggerItem key={t.id} index={i}>
                  <PressableScale
                    style={styles.techCard}
                    onPress={() => navigation.navigate('TechnicianProfile', { tid: t.id })}
                  >
                    <View style={styles.techAvatarWrap}>
                      <Avatar name={t.name} size={52} />
                      {t.online ? <PulseDot color={palette.success} size={10} style={styles.techDot} /> : null}
                    </View>
                    <Text style={styles.techName} numberOfLines={1}>{t.name}</Text>
                    <Text style={styles.techMeta} numberOfLines={1}>{t.cat} • {t.dist}</Text>
                    <View style={styles.starsRow}>
                      <Stars value={t.rating} size={12} />
                      <Text style={styles.techRating}>{t.rating}</Text>
                    </View>
                  </PressableScale>
                </StaggerItem>
              ))}
            </ScrollView>
          )}

          {/* Universal: trusted artisans strip */}
          <SectionTitle
            title="حرفيون موثوقون"
            actionLabel="عرض الكل"
            onAction={() => navigation.navigate('TechnicianList')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {FEATURED_ARTISANS.map((a, i) => (
              <StaggerItem key={a.id} index={i}>
                <Card flat style={styles.artisanCard}>
                  <View style={styles.artisanHead}>
                    <Avatar name={a.name} size={40} />
                    <View style={styles.flex}>
                      <Text style={styles.artisanName} numberOfLines={1}>{a.name}</Text>
                      <Text style={styles.artisanSkill} numberOfLines={1}>{a.skill}</Text>
                    </View>
                  </View>
                  <View style={styles.starsRow}>
                    <Stars value={a.rating} size={11} />
                    <Text style={styles.techRating}>{a.rating}</Text>
                    <Text style={styles.artisanReviews}>({a.reviews})</Text>
                  </View>
                </Card>
              </StaggerItem>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  body: { paddingHorizontal: sp.screen, paddingTop: sp.base + 4 },
  hScroll: { gap: sp.md, paddingEnd: sp.screen, paddingBottom: sp.xs },

  /* hero */
  brandRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: sp.base },
  brandBlock: { flex: 1 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  brandLabel: { ...typ.overline, color: palette.accent },
  heroGreeting: { ...typ.bodyS, color: palette.textMid, marginTop: sp.sm },
  heroName: { ...typ.h1, color: palette.textHi, marginTop: 2 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: r.sm,
    backgroundColor: palette.surfaceHi,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: sp.sm,
    end: sp.sm + 2,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.bg3,
    borderRadius: r.pill,
    paddingHorizontal: sp.base,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: palette.border,
    ...sh.md,
  },
  searchPlaceholder: { ...typ.bodyS, color: palette.textLow },

  /* intent gates */
  intentRow: { flexDirection: 'row', gap: sp.md, marginTop: sp.lg, marginBottom: sp.xs },
  intentCard: {
    minHeight: 172,
    borderRadius: r.xl,
    padding: sp.base,
    paddingTop: sp.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...sh.xl,
  },
  intentIcon: {
    width: 46,
    height: 46,
    borderRadius: r.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  intentTitle: { ...typ.h3, fontSize: 21, lineHeight: 28, marginTop: sp.md },
  intentSub: { ...typ.bodyS, marginTop: 2, lineHeight: 18 },
  intentCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: r.pill,
    paddingHorizontal: sp.md,
    paddingVertical: 6,
    marginTop: sp.md,
  },
  intentCtaText: { ...typ.label, fontSize: 12 },
  intentGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },

  /* provider */
  incomingCard: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  incomingTitle: { ...typ.h4, color: palette.textHi },
  incomingBody: { ...typ.caption, color: palette.textLow, marginTop: 2 },

  /* employer */
  employerTile: {
    width: 108,
    borderRadius: r.md,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    borderColor: palette.border,
    padding: sp.base,
    alignItems: 'center',
    gap: sp.sm,
    ...sh.sm,
  },
  employerTileIcon: { width: 40, height: 40, borderRadius: r.sm, alignItems: 'center', justifyContent: 'center' },
  employerTileText: { ...typ.caption, color: palette.text, fontWeight: '700' },

  /* student */
  learnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.md,
    backgroundColor: palette.bg3,
    borderRadius: r.card,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
    ...sh.sm,
  },
  learnIcon: {
    width: 46,
    height: 46,
    borderRadius: r.md,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnTitle: { ...typ.h4, color: palette.textHi },
  learnMeta: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  learnProgress: { marginTop: sp.sm + 2 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.warningBg,
    borderRadius: r.pill,
    paddingHorizontal: sp.sm,
    paddingVertical: sp.xs + 1,
    alignSelf: 'flex-start',
  },
  streakText: { ...typ.caption, color: palette.warning, fontWeight: '800' },

  /* categories */
  popCatPill: {
    width: 108,
    borderRadius: r.md,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    padding: sp.base,
    gap: sp.sm,
    ...sh.sm,
  },
  popCatIcon: { width: 36, height: 36, borderRadius: r.sm, alignItems: 'center', justifyContent: 'center' },
  popCatName: { ...typ.label, color: palette.textHi },
  popCatCount: { ...typ.caption, fontSize: 10.5 },

  /* technicians */
  techCard: {
    width: 150,
    borderRadius: r.md,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    borderColor: palette.border,
    padding: sp.base,
    gap: 4,
    ...sh.sm,
  },
  techAvatarWrap: { position: 'relative', alignSelf: 'flex-start' },
  techDot: { position: 'absolute', bottom: 1, end: 1 },
  techName: { ...typ.label, color: palette.textHi, marginTop: sp.xs },
  techMeta: { ...typ.caption, color: palette.textLow, fontSize: 10.5 },
  techRating: { ...typ.caption, color: palette.textMid, fontWeight: '800' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },

  /* artisans */
  artisanCard: { width: 210, gap: sp.sm },
  artisanHead: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  artisanName: { ...typ.label, color: palette.textHi },
  artisanSkill: { ...typ.caption, color: palette.textLow, fontSize: 10.5 },
  artisanReviews: { ...typ.caption, color: palette.textLow },
  freshJobCard: { width: 280, marginBottom: 0 },
});
