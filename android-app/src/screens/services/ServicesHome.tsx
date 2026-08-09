/**
 * ServicesHome — premium service discovery (tab hub).
 * Hero greeting + search + category chips + technician rail + featured
 * artisans + most-requested pills. Emergency strip preserved.
 */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, categoryColors, typ, sp, r, motion, layout,
  useEntrance, PressableScale, PulseDot, FadeInView, StaggerItem,
  DepthGradient, AmbientGlow,
} from '../../design';
import {
  Avatar, Verified, Stars, Chip, Card, Badge,
  SectionTitle, EmptyState, SearchField, SkeletonList, useTabBarClearance,
} from '../../ui';
import { Icon, CategoryIcon } from '../../icons';
import { useAppStore } from '../../store';
import { CATEGORIES, TECHNICIANS, FEATURED_ARTISANS, USER } from '../../data';
import { useLiveProviders } from '../../lib/queries';
import {
  CATEGORY_DESC, statsFor, isLiveLoading,
} from './shared';

function greetingAr() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 17) return 'نهارك سعيد';
  return 'مساء الخير';
}

export function ServicesHome({ navigation }: any) {
  const user = useAppStore((s) => s.user) || USER;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const clear = useTabBarClearance();
  const [q, setQ] = useState('');
  const fadeHero = useEntrance(0, 16);
  const live = useLiveProviders();
  const loading = isLiveLoading(live);
  const padX = sp.screen;
  const cardW = (width - padX * 2 - sp.md) / 2;

  const roster = live ?? TECHNICIANS;
  const techRail = useMemo(() => {
    const src = q.trim() ? roster.filter((t) =>
      t.name.includes(q) || t.cat.includes(q) || t.skills.some((sk) => sk.includes(q)),
    ) : roster;
    return src.slice(0, 6);
  }, [roster, q]);

  const emergency = useMemo(() => TECHNICIANS.filter((t) => t.emergency), []);

  const featured = useMemo(() => {
    if (live) {
      return live.slice(0, 5).map((t) => ({
        id: t.id, name: t.name, skill: t.skills[0] || t.cat,
        rating: t.rating, reviews: t.reviews, online: t.online, full: t,
      }));
    }
    return FEATURED_ARTISANS.map((a) => ({
      ...a, online: true,
      full: TECHNICIANS.find((t) => t.name === a.name) || TECHNICIANS[0],
    }));
  }, [live]);

  const popular = useMemo(() =>
    CATEGORIES
      .map((c) => ({ ...c, ...statsFor(c.id) }))
      .sort((a, b) => b.totalJobs - a.totalJobs)
      .slice(0, 6),
  []);

  const searchMatches = q.trim()
    ? roster.filter((t) =>
        t.name.includes(q) || t.cat.includes(q) || t.skills.some((sk) => sk.includes(q)),
      ).slice(0, 4)
    : [];

  const runSearch = () => {
    const term = q.trim();
    if (!term) return;
    navigation.navigate('TechnicianList', { q: term });
  };

  return (
    <View style={styles.screen}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topLeft" color={palette.accent} size={300} opacity={0.07} />
      <AmbientGlow position="topRight" color={palette.catTeal} size={240} opacity={0.05} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: clear + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero greeting ── */}
        <View style={[styles.hero, { paddingTop: insets.top + sp.lg }]}>
          <Animated.View style={fadeHero}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Icon name="services" size={18} color={palette.accent} />
              </View>
              <Text style={styles.brandLabel}>JOBEZZ SERVICES</Text>
            </View>
            <Text style={styles.title}>خدمات عند الطلب</Text>
            <Text style={styles.subtitle}>
              اعثر على أفضل الفنيين الموثّقين في مدينتك · متاحون الآن ويصلكون في دقائق.
            </Text>
          </Animated.View>

          <SearchField
            value={q}
            onChangeText={setQ}
            placeholder="ابحث عن فني أو خدمة"
            onSubmitEditing={runSearch}
          />
        </View>

        {/* ── Category chips row ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.flexGrow0}
        >
          {CATEGORIES.map((c) => {
            const color = categoryColors[c.id] || palette.accent;
            return (
              <Chip
                key={c.id}
                label={c.name}
                icon={c.icon}
                onPress={() => navigation.navigate('TechnicianList', { catId: c.id })}
                style={[styles.catChip, { borderColor: color + '2E' }]}
              />
            );
          })}
        </ScrollView>

        {/* ── Emergency strip ── */}
        <View style={[styles.sectionPad, styles.emergencyWrap]}>
          <PressableScale
            activeScale={0.96}
            onPress={() => navigation.navigate('TechnicianList', {})}
            accessibilityRole="button"
            accessibilityLabel="خدمات الطوارئ"
          >
            <View style={[styles.emergencyCard, { borderColor: palette.danger + '40' }]}>
              <View style={styles.emergencyIcon}>
                <Icon name="bolt" size={18} color={palette.danger} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.emergencyTitle}>خدمات الطوارئ</Text>
                <Text style={styles.emergencySub}>
                  {live ? live.length : emergency.length} فني متاح الآن على مدار الساعة
                </Text>
              </View>
              <Icon name="back" size={15} color={palette.danger} strokeWidth={2} />
            </View>
          </PressableScale>
        </View>

        {/* ── Smart search: technician matches ── */}
        {q.trim() && searchMatches.length > 0 && (
          <View style={styles.sectionPad}>
            <SectionTitle title="فنيون مطابقون" sub={`${roster.length} فني متاح`} />
            <View style={styles.stack}>
              {searchMatches.map((t, i) => (
                <StaggerItem key={t.id} index={i} delay={30}>
                  <PressableScale
                    activeScale={0.97}
                    onPress={() => navigation.navigate('TechnicianProfile', { tid: t.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`ملف ${t.name}`}
                  >
                    <View style={styles.matchCard}>
                      <Avatar name={t.name} size={42} />
                      <View style={styles.flex}>
                        <View style={styles.nameRow}>
                          <Text style={styles.matchName} numberOfLines={1}>{t.name}</Text>
                          {t.verified ? <Verified size={14} /> : null}
                        </View>
                        <Text style={styles.matchMeta} numberOfLines={1}>
                          {t.cat} · {t.dist} · {t.price}
                        </Text>
                      </View>
                      <View style={styles.ratingPill}>
                        <Icon name="starFill" size={12} color={palette.gold} />
                        <Text style={styles.ratingText}>{t.rating}</Text>
                      </View>
                    </View>
                  </PressableScale>
                </StaggerItem>
              ))}
            </View>
          </View>
        )}

        {/* ── Technician cards rail ── */}
        <View style={styles.sectionPad}>
          <SectionTitle
            title="فنيون قريبون منك"
            sub={loading ? 'جارٍ تحميل الفنيين...' : undefined}
            actionLabel="عرض الكل"
            onAction={() => navigation.navigate('TechnicianList', {})}
          />
        </View>
        {loading ? (
          <View style={[styles.sectionPad, styles.flexGrow0]}>
            <SkeletonList count={3} kind="card" />
          </View>
        ) : techRail.length === 0 ? (
          <View style={styles.sectionPad}>
            <EmptyState
              icon="search"
              title="لا يوجد فنيون مطابقون"
              body="جرّب البحث بكلمة أخرى أو تصفّح جميع الفنيين"
              actionLabel="تصفّح الكل"
              onAction={() => navigation.navigate('TechnicianList', {})}
            />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.rail, { paddingHorizontal: padX }]}
            style={styles.flexGrow0}
          >
            {techRail.map((t, i) => {
              const color = categoryColors[t.catId] || palette.accent;
              return (
                <StaggerItem key={t.id} index={i} delay={motion.stagger.card}>
                  <PressableScale
                    activeScale={0.95}
                    onPress={() => navigation.navigate('TechnicianProfile', { tid: t.id })}
                    style={{ width: cardW }}
                    accessibilityRole="button"
                    accessibilityLabel={`ملف ${t.name}`}
                  >
                    <Card style={styles.railCard}>
                      <View style={styles.railTop}>
                        <View style={styles.avatarWrap}>
                          <Avatar name={t.name} size={48} color={color} />
                          {t.online ? <PulseDot color={palette.success} size={10} style={styles.onlineDot} /> : null}
                        </View>
                        <Badge variant={t.availability === 'متاح اليوم' ? 'success' : 'neutral'} label={t.availability} />
                      </View>
                      <View style={styles.nameRow}>
                        <Text style={styles.railName} numberOfLines={1}>{t.name}</Text>
                        {t.verified ? <Verified size={13} /> : null}
                      </View>
                      <Text style={styles.railCat} numberOfLines={1}>{t.cat}</Text>
                      <View style={styles.starsRow}>
                        <Stars value={t.rating} size={11} />
                        <Text style={styles.goldText}>{t.rating}</Text>
                        <Text style={styles.lowText}>({t.reviews})</Text>
                      </View>
                      <View style={styles.railFooter}>
                        <Text style={styles.priceText} numberOfLines={1}>{t.price}</Text>
                        <Text style={styles.distText}>{t.dist}</Text>
                      </View>
                    </Card>
                  </PressableScale>
                </StaggerItem>
              );
            })}
          </ScrollView>
        )}

        {/* ── Category grid (statsFor-backed) ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="تصفّح الخدمات" sub={`${CATEGORIES.length} خدمة متاحة`} />
          <View style={styles.catGrid}>
            {CATEGORIES.slice(0, 8).map((c, i) => {
              const color = categoryColors[c.id] || palette.accent;
              const st = statsFor(c.id);
              return (
                <StaggerItem key={c.id} index={i} delay={motion.stagger.card}>
                  <PressableScale
                    activeScale={0.95}
                    onPress={() => navigation.navigate('TechnicianList', { catId: c.id })}
                    style={{ width: cardW }}
                    accessibilityRole="button"
                    accessibilityLabel={`خدمة ${c.name}`}
                  >
                    <View style={[styles.catCard, { borderColor: color + '2E', backgroundColor: color + '10' }]}>
                      <View style={[styles.catIcon, { backgroundColor: color + '22' }]}>
                        <CategoryIcon id={c.id} size={30} color={color} />
                      </View>
                      <Text style={styles.catName} numberOfLines={1}>{c.name}</Text>
                      <Text style={styles.catDesc} numberOfLines={1}>
                        {CATEGORY_DESC[c.id] || 'فنيون موثّقون جاهزون للخدمة'}
                      </Text>
                      <View style={styles.catFooter}>
                        <Text style={[styles.catMeta, { color }]}>
                          {st.available > 0 ? `${st.available} متاح الآن` : `${st.count} فني`}
                        </Text>
                        <View style={[styles.catArrow, { backgroundColor: color + '22' }]}>
                          <Icon name="back" size={13} color={color} strokeWidth={2} />
                        </View>
                      </View>
                    </View>
                  </PressableScale>
                </StaggerItem>
              );
            })}
          </View>
        </View>

        {/* ── Featured artisans ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="أفضل الفنيين هذا الأسبوع" sub="حسب تقييمات العملاء" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featRail}
            style={styles.flexGrow0}
          >
            {featured.map((a, i) => (
              <StaggerItem key={a.id} index={i} delay={50}>
                <PressableScale
                  activeScale={0.95}
                  onPress={() => navigation.navigate('TechnicianProfile', { tid: a.full.id })}
                  accessibilityRole="button"
                  accessibilityLabel={`ملف ${a.name}`}
                >
                  <Card style={styles.featCard}>
                    <View style={styles.featAvatarWrap}>
                      <Avatar name={a.name} size={56} />
                      {a.online ? <PulseDot color={palette.success} size={10} style={styles.featOnline} /> : null}
                    </View>
                    <Text style={styles.featName} numberOfLines={1}>{a.name}</Text>
                    <Text style={styles.featSkill} numberOfLines={1}>{a.skill}</Text>
                    <View style={styles.starsRow}>
                      <Icon name="starFill" size={13} color={palette.gold} />
                      <Text style={styles.goldText}>{a.rating}</Text>
                      <Text style={styles.lowText}>({a.reviews})</Text>
                    </View>
                  </Card>
                </PressableScale>
              </StaggerItem>
            ))}
          </ScrollView>
        </View>

        {/* ── Most-requested pills ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="الأكثر طلباً" sub="حسب عدد المهام المكتملة" />
          <FadeInView delay={80}>
            <View style={styles.pillsWrap}>
              {popular.map((c) => {
                const color = categoryColors[c.id] || palette.accent;
                return (
                  <PressableScale
                    key={c.id}
                    activeScale={0.93}
                    onPress={() => navigation.navigate('TechnicianList', { catId: c.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`خدمة ${c.name}`}
                  >
                    <View style={[styles.popPill, { backgroundColor: color + '14' }]}>
                      <CategoryIcon id={c.id} size={15} color={color} />
                      <Text style={styles.popLabel} numberOfLines={1}>{c.name}</Text>
                    </View>
                  </PressableScale>
                );
              })}
            </View>
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  flexGrow0: { flexGrow: 0 },
  body: { paddingBottom: layout.screenPadBottom },
  sectionPad: { paddingHorizontal: sp.screen },

  hero: { paddingHorizontal: sp.screen, paddingBottom: sp.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, marginBottom: sp.base },
  brandIcon: {
    width: 30, height: 30, borderRadius: r.pill,
    backgroundColor: palette.accentGlow, alignItems: 'center', justifyContent: 'center',
  },
  brandLabel: { ...typ.overline, color: palette.accent100, letterSpacing: 2 },
  title: { ...typ.display, color: palette.textHi, marginBottom: sp.sm },
  subtitle: { ...typ.body, color: palette.textMid, marginBottom: sp.lg, maxWidth: 460 },

  chipsRow: { paddingHorizontal: sp.screen, gap: sp.sm, paddingBottom: sp.base },
  catChip: { minHeight: layout.tapMin - 8 },

  emergencyWrap: { marginTop: sp.xs },
  emergencyCard: {
    flexDirection: 'row', alignItems: 'center', gap: sp.md,
    backgroundColor: palette.bg3, borderRadius: r.card, borderWidth: 1,
    paddingHorizontal: sp.base, paddingVertical: sp.md, marginBottom: sp.md,
  },
  emergencyIcon: {
    width: 40, height: 40, borderRadius: r.pill,
    backgroundColor: palette.dangerBg, alignItems: 'center', justifyContent: 'center',
  },
  emergencyTitle: { ...typ.label, color: palette.textHi },
  emergencySub: { ...typ.caption, color: palette.textMid, marginTop: 2 },

  stack: { gap: sp.sm },
  matchCard: {
    flexDirection: 'row', alignItems: 'center', gap: sp.md,
    backgroundColor: palette.bg3, borderRadius: r.card, borderWidth: 1,
    borderColor: palette.borderHi, padding: sp.md,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  matchName: { ...typ.label, color: palette.textHi, flexShrink: 1 },
  matchMeta: { ...typ.caption, color: palette.textMid, marginTop: 2 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: r.pill,
    backgroundColor: palette.goldBg, borderWidth: 1, borderColor: palette.gold + '40',
  },
  ratingText: { ...typ.caption, color: palette.gold, fontWeight: '800' },

  rail: { gap: sp.md, paddingVertical: sp.xs },
  railCard: { width: '100%', minHeight: 196 },
  railTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  avatarWrap: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: -1, left: -1 },
  railName: { ...typ.h4, color: palette.textHi, marginTop: sp.sm, flexShrink: 1 },
  railCat: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: sp.xs },
  goldText: { ...typ.caption, color: palette.gold, fontWeight: '700' },
  lowText: { ...typ.caption, color: palette.textLow },
  railFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: sp.sm, paddingTop: sp.sm, borderTopWidth: 1, borderTopColor: palette.divider,
  },
  priceText: { ...typ.label, color: palette.accent, fontSize: 12, flexShrink: 1 },
  distText: { ...typ.caption, color: palette.textLow },

  blockGap: { marginTop: sp.xl },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.md },
  catCard: {
    borderRadius: r.card, borderWidth: 1, padding: sp.base, minHeight: 158, overflow: 'hidden',
  },
  catIcon: {
    width: 52, height: 52, borderRadius: r.md,
    alignItems: 'center', justifyContent: 'center',
  },
  catName: { ...typ.h3, color: palette.textHi, marginTop: sp.sm, fontSize: 15 },
  catDesc: { ...typ.caption, color: palette.textLow, marginTop: sp.xs, marginBottom: sp.sm },
  catFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  catMeta: { ...typ.caption, fontWeight: '700' },
  catArrow: {
    width: 24, height: 24, borderRadius: r.pill,
    alignItems: 'center', justifyContent: 'center',
  },

  featRail: { gap: sp.md, paddingVertical: sp.xs },
  featCard: { width: 132 },
  featAvatarWrap: {
    width: 62, height: 62, borderRadius: r.pill,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
  },
  featOnline: { position: 'absolute', bottom: 1, right: 1 },
  featName: { ...typ.label, color: palette.textHi, marginTop: sp.sm },
  featSkill: { ...typ.caption, color: palette.textMid, marginTop: 2 },

  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  popPill: {
    flexDirection: 'row', alignItems: 'center', gap: sp.xs,
    paddingHorizontal: sp.md, paddingVertical: sp.sm, borderRadius: r.pill,
  },
  popLabel: { ...typ.caption, color: palette.text },
});
