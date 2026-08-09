/**
 * TechnicianProfile — cover + overlapping identity card + trust + bio +
 * skills + service details + portfolio + honest reviews + sticky booking bar.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, categoryColors, typ, sp, r, sh,
  useEntrance, PressableScale, PulseDot, FadeInView, StaggerItem,
  DepthGradient,
} from '../../design';
import {
  Card, Avatar, Verified, Stars, Badge, Tag, TrustBadge,
  SectionTitle, EmptyState, KpiRow,
} from '../../ui';
import { Icon, CategoryIcon } from '../../icons';
import { useLiveProviders } from '../../lib/queries';
import { findTechnician, shareTechnician, REVIEW_SAMPLES } from './shared';

function CoverBtn({ onPress, label, children }: { onPress: () => void; label: string; children: React.ReactNode }) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.88}
      style={styles.coverBtn}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {children}
    </PressableScale>
  );
}

export function TechnicianProfile({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const live = useLiveProviders();
  const t = findTechnician(route.params?.tid, live);
  const [fav, setFav] = useState(false);
  const [shared, setShared] = useState(false);
  const fadeCover = useEntrance(0, 14);
  const tileW = (width - sp.screen * 2 - sp.sm * 2) / 3;

  if (!t) {
    return (
      <View style={styles.screen}>
        <DepthGradient variant="screen" />
        <EmptyState
          icon="services"
          title="الفني غير موجود"
          body="قد يكون قد حُذف ملفه أو لم يعد متاحاً"
          actionLabel="العودة"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }
  const color = categoryColors[t.catId] || palette.accent;

  return (
    <View style={styles.screen}>
      <DepthGradient variant="screen" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: 148 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cover ── */}
        <View style={[styles.cover, { backgroundColor: t.cover || palette.bg4 }]}>
          <DepthGradient variant="hero" />
          <View style={[styles.coverBar, { paddingTop: insets.top + sp.sm }]}>
            <CoverBtn onPress={() => navigation.goBack()} label="رجوع">
              <Icon name="back" size={18} color={palette.textHi} />
            </CoverBtn>
            <View style={styles.coverActions}>
              <CoverBtn onPress={() => setFav((v) => !v)} label={fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}>
                <Icon name={fav ? 'heartFill' : 'heart'} size={18} color={fav ? palette.danger : palette.textHi} />
              </CoverBtn>
              <CoverBtn onPress={() => { shareTechnician(t); setShared(true); }} label="مشاركة الملف">
                <Icon name="share" size={17} color={palette.textHi} />
              </CoverBtn>
            </View>
          </View>
          <Text style={styles.coverTagline}>
            {t.cat} · {t.city}
          </Text>
        </View>

        {/* ── Identity card (overlapping) ── */}
        <View style={[styles.sectionPad, { marginTop: -sp.xxxl + 8 }]}>
          <Card style={styles.identityCard}>
            <View style={styles.identityTop}>
              <View style={styles.avatarWrap}>
                <Avatar name={t.name} size={74} color={color} />
                {t.online ? <PulseDot color={palette.success} size={13} style={styles.onlineDot} /> : null}
              </View>
              <View style={styles.identityText}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{t.name}</Text>
                  {t.verified ? <Verified size={15} /> : null}
                </View>
                <View style={styles.ratingRow}>
                  <Stars value={t.rating} size={14} />
                  <Text style={styles.goldText}>{t.rating}</Text>
                  <Text style={styles.lowText}>({t.reviews} تقييم)</Text>
                </View>
                <View style={styles.badgeRow}>
                  <Badge
                    variant={t.availability === 'متاح اليوم' ? 'success' : 'neutral'}
                    label={t.availability}
                  />
                </View>
              </View>
            </View>

            <View style={styles.kpiWrap}>
              <KpiRow
                items={[
                  { value: `${t.years}`, label: 'سنوات خبرة', icon: 'award' },
                  { value: `${t.jobs}`, label: 'مهمة مكتملة', icon: 'checkCircle' },
                  { value: `${t.completionRate}%`, label: 'نسبة الإنجاز', icon: 'target' },
                ]}
              />
            </View>

            {t.trustBadges.length > 0 ? (
              <View style={styles.trustWrap}>
                {t.trustBadges.map((b) => (
                  <TrustBadge key={b} label={b} />
                ))}
              </View>
            ) : null}
          </Card>
        </View>

        {/* ── Bio ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="نبذة" />
          <FadeInView delay={60}>
            <Text style={styles.bioText}>{t.bio}</Text>
          </FadeInView>
        </View>

        {/* ── Skills ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="المهارات" sub={`${t.skills.length} مهارة`} />
          <View style={styles.tagWrap}>
            {t.skills.map((sk) => (
              <Tag
                key={sk}
                label={sk}
                icon="check"
                color={color}
                style={[styles.skillTag, { borderColor: color + '3A', backgroundColor: color + '16' }]}
              />
            ))}
          </View>
        </View>

        {/* ── Service details ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="الخدمة والأوقات" />
          <Card>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>السعر</Text>
              <Text style={styles.detailPrice}>{t.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>أوقات العمل</Text>
              <Text style={styles.detailValue}>{t.workingHours}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>الاستجابة</Text>
              <Text style={[styles.detailValue, { color: palette.success }]}>{t.responseTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>اللغة</Text>
              <Text style={styles.detailValue}>{t.languages.join('، ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>المسافة منك</Text>
              <Text style={styles.detailValue}>{t.dist} · {t.eta}</Text>
            </View>
            {t.cert ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الاعتماد</Text>
                <Text style={[styles.detailValue, { color: palette.gold }]}>{t.cert}</Text>
              </View>
            ) : null}
          </Card>
        </View>

        {/* ── Portfolio ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="أعمال سابقة" sub={`${t.jobs} مهمة مكتملة`} />
          <View style={styles.gridWrap}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <StaggerItem key={i} index={i} delay={40}>
                <View
                  style={[styles.workTile, {
                    width: tileW,
                    backgroundColor: [color, palette.bg4, color + '80', palette.bg3, color + '55', palette.bg4][i],
                  }]}
                >
                  <CategoryIcon id={t.catId} size={26} color={i % 2 ? palette.accent100 : palette.textHi} />
                </View>
              </StaggerItem>
            ))}
          </View>
        </View>

        {/* ── Reviews ── */}
        <View style={[styles.sectionPad, styles.blockGap]}>
          <SectionTitle title="آراء العملاء" sub={`${t.reviews} تقييم`} />
          <View style={styles.stack}>
            {REVIEW_SAMPLES.map((rv, i) => (
              <FadeInView key={rv.name} delay={100 + i * 80}>
                <Card style={styles.reviewCard}>
                  <View style={styles.reviewHead}>
                    <View style={styles.reviewAuthor}>
                      <Avatar name={rv.name} size={34} />
                      <View>
                        <Text style={styles.reviewName}>{rv.name}</Text>
                        <Text style={styles.reviewDays}>{rv.days}</Text>
                      </View>
                    </View>
                    <Stars value={rv.rating} size={12} />
                  </View>
                  <Text style={styles.reviewText}>{rv.text}</Text>
                </Card>
              </FadeInView>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky action bar ── */}
      <View style={[styles.stickyBar, { paddingBottom: Math.max(insets.bottom, sp.base) }]}>
        <View style={styles.stickyRow}>
          <PressableScale
            onPress={() => navigation.navigate('ChatList')}
            activeScale={0.9}
            style={styles.stickyIcon}
            accessibilityRole="button"
            accessibilityLabel="مراسلة الفني"
          >
            <Icon name="chat" size={19} color={palette.accent} />
          </PressableScale>
          <PressableScale
            onPress={() => { shareTechnician(t); setShared(true); }}
            activeScale={0.9}
            style={styles.stickyIcon}
            accessibilityRole="button"
            accessibilityLabel="مشاركة الملف"
          >
            <Icon name="share" size={19} color={palette.accent} />
          </PressableScale>
          <PressableScale
            activeScale={0.97}
            style={styles.stickyBookWrap}
            onPress={() => navigation.navigate('Booking', { tid: t.id })}
            accessibilityRole="button"
            accessibilityLabel="احجز الخدمة"
          >
            <View style={[styles.stickyBook, { backgroundColor: color }]}>
              <Text style={styles.stickyBookText}>احجز الخدمة</Text>
            </View>
          </PressableScale>
        </View>
        {shared ? (
          <View style={styles.sharedRow}>
            <Icon name="checkCircle" size={13} color={palette.success} />
            <Text style={styles.sharedText}>تمت مشاركة الملف</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  sectionPad: { paddingHorizontal: sp.screen },
  blockGap: { marginTop: sp.xl },

  cover: { height: 196, justifyContent: 'flex-end' },
  coverBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: sp.screen,
  },
  coverActions: { flexDirection: 'row', gap: sp.sm },
  coverBtn: {
    width: 40, height: 40, borderRadius: r.pill,
    backgroundColor: palette.surfaceHi, borderWidth: 1, borderColor: palette.borderHi,
    alignItems: 'center', justifyContent: 'center',
  },
  coverTagline: {
    ...typ.overline, color: palette.textHi,
    opacity: 0.75, paddingHorizontal: sp.screen, marginTop: sp.xxl, marginBottom: sp.base,
  },

  identityCard: { borderColor: palette.borderHi, ...sh.md },
  identityTop: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  avatarWrap: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2 },
  identityText: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  name: { ...typ.h2, color: palette.textHi, flexShrink: 1, fontSize: 17 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: sp.xs },
  goldText: { ...typ.bodyS, color: palette.gold, fontWeight: '700' },
  lowText: { ...typ.caption, color: palette.textLow },
  badgeRow: { marginTop: sp.sm, alignSelf: 'flex-start' },

  kpiWrap: { marginTop: sp.base },
  trustWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, marginTop: sp.base },

  bioText: { ...typ.body, color: palette.textMid, lineHeight: 26 },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  skillTag: { borderWidth: 1 },

  detailRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: sp.sm + 2, gap: sp.md,
  },
  detailLabel: { ...typ.bodyS, color: palette.textMid },
  detailValue: { ...typ.bodyS, color: palette.text, flexShrink: 1 },
  detailPrice: { ...typ.h3, color: palette.accent100, fontSize: 16 },

  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  workTile: {
    height: 96, borderRadius: r.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: palette.border,
  },

  stack: { gap: sp.md },
  reviewCard: { padding: sp.base },
  reviewHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: sp.md,
  },
  reviewAuthor: { flexDirection: 'row', alignItems: 'center', gap: sp.sm },
  reviewName: { ...typ.label, color: palette.textHi },
  reviewDays: { ...typ.caption, color: palette.textLow },
  reviewText: { ...typ.bodyS, color: palette.textMid, marginTop: sp.sm, lineHeight: 22 },

  stickyBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingTop: sp.md, paddingHorizontal: sp.screen,
    backgroundColor: palette.bg2, borderTopWidth: 1, borderTopColor: palette.border,
  },
  stickyRow: { flexDirection: 'row', alignItems: 'center', gap: sp.sm },
  stickyIcon: {
    width: 46, height: 46, borderRadius: r.pill,
    backgroundColor: palette.surfaceHi, borderWidth: 1, borderColor: palette.borderHi,
    alignItems: 'center', justifyContent: 'center',
  },
  stickyBookWrap: { flex: 1 },
  stickyBook: {
    height: 46, borderRadius: r.lg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  stickyBookText: { ...typ.button, color: palette.bg0, fontWeight: '800' },
  sharedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: sp.xs, marginTop: sp.xs,
  },
  sharedText: { ...typ.caption, color: palette.textMid },
});
