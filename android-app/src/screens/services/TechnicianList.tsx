/**
 * TechnicianList — sortable/filterable technician roster.
 * Sort + filter live in a BottomSheet; roster from useLiveProviders with
 * TECHNICIANS fallback; SkeletonList while live data loads.
 */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  palette, categoryColors, typ, sp, r, motion,
  PressableScale, PulseDot, StaggerItem,
} from '../../design';
import {
  Shell, Card, Avatar, Verified, Stars, Badge, Tag,
  Button, Toggle, Chip, BottomSheet, SkeletonList, EmptyState,
} from '../../ui';
import { Icon } from '../../icons';
import { CATEGORIES, TECHNICIANS } from '../../data';
import { useLiveProviders } from '../../lib/queries';
import { SORTS, isLiveLoading, toTechnicianView, type TechnicianView } from './shared';

export interface TechFilters {
  price: 'any' | 'low' | 'mid' | 'high';
  dist: 'any' | 'near' | 'mid';
  rating: 'any' | 'high';
  verified: boolean;
  today: boolean;
  emergency: boolean;
}

const DEFAULT_FILTERS: TechFilters = {
  price: 'any', dist: 'any', rating: 'any',
  verified: false, today: false, emergency: false,
};

const PRICE_CHIPS = [
  { id: 'low' as const, label: '≤ 25 د.ل' },
  { id: 'mid' as const, label: '26 - 60' },
  { id: 'high' as const, label: '+ 60' },
];

const DIST_CHIPS = [
  { id: 'near' as const, label: '≤ 2 كم' },
  { id: 'mid' as const, label: '≤ 5 كم' },
];

export function TechnicianList({ navigation, route }: any) {
  const catId = route.params?.catId as string | undefined;
  const q = String(route.params?.q || '').trim();
  const cat = CATEGORIES.find((c) => c.id === catId);
  const catColor = (catId && categoryColors[catId]) || palette.accent;
  const [sort, setSort] = useState('rating');
  const [filters, setFilters] = useState<TechFilters>(DEFAULT_FILTERS);
  const [sheet, setSheet] = useState(false);
  const live = useLiveProviders();
  const loading = isLiveLoading(live);

  const base = useMemo<TechnicianView[]>(() => {
    const src = live ?? TECHNICIANS;
    let out = catId ? src.filter((t) => t.catId === catId) : src.slice();
    if (q) {
      out = out.filter((t) =>
        t.name.includes(q) || t.cat.includes(q) || t.skills.some((sk) => sk.includes(q)),
      );
    }
    return toTechnicianView(out);
  }, [live, catId, q]);

  const list = useMemo(() => {
    let out = base.slice();
    if (filters.price === 'low') out = out.filter((t) => t.priceMin <= 25);
    if (filters.price === 'mid') out = out.filter((t) => t.priceMin > 25 && t.priceMin <= 60);
    if (filters.price === 'high') out = out.filter((t) => t.priceMin > 60);
    if (filters.dist === 'near') out = out.filter((t) => t.distKm <= 2);
    if (filters.dist === 'mid') out = out.filter((t) => t.distKm <= 5);
    if (filters.rating === 'high') out = out.filter((t) => t.rating >= 4.5);
    if (filters.verified) out = out.filter((t) => t.verified);
    if (filters.today) out = out.filter((t) => t.availability === 'متاح اليوم');
    if (filters.emergency) out = out.filter((t) => t.emergency);

    const sorted = out.slice();
    switch (sort) {
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'nearest': sorted.sort((a, b) => a.distKm - b.distKm); break;
      case 'price': sorted.sort((a, b) => a.priceMin - b.priceMin); break;
      case 'fast': sorted.sort((a, b) => a.responseMin - b.responseMin); break;
      case 'exp': sorted.sort((a, b) => b.years - a.years); break;
      case 'jobs': sorted.sort((a, b) => b.jobs - a.jobs); break;
      case 'available':
        sorted.sort((a, b) =>
          Number(b.online && b.availability === 'متاح اليوم') -
          Number(a.online && a.availability === 'متاح اليوم'),
        );
        break;
      default: break;
    }
    return sorted;
  }, [base, sort, filters]);

  const activeFilterCount =
    (filters.price !== 'any' ? 1 : 0) +
    (filters.dist !== 'any' ? 1 : 0) +
    (filters.rating !== 'any' ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.today ? 1 : 0) +
    (filters.emergency ? 1 : 0);

  const filterBtn = (
    <PressableScale
      onPress={() => setSheet(true)}
      activeScale={0.88}
      style={styles.filterBtn}
      accessibilityRole="button"
      accessibilityLabel="ترتيب وتصفية الفنيين"
    >
      <Icon name="filter" size={17} color={activeFilterCount > 0 ? palette.accent : palette.textMid} />
      {activeFilterCount > 0 ? (
        <View style={styles.filterDot}>
          <Text style={styles.filterDotText}>{activeFilterCount}</Text>
        </View>
      ) : null}
    </PressableScale>
  );

  return (
    <Shell
      title={cat ? cat.name : 'جميع الفنيين'}
      navigation={navigation}
      back
      right={filterBtn}
    >
      <Text style={styles.countText}>
        {loading ? 'جارٍ تحميل الفنيين...' : `${list.length} فني في منطقتك`}
      </Text>

      {loading ? (
        <SkeletonList count={4} kind="card" />
      ) : list.length === 0 ? (
        <EmptyState
          icon="search"
          title="لا يوجد فنيون مطابقون"
          body="جرّب تعديل الفلاتر أو تغيير الترتيب"
          actionLabel="إلغاء الكل"
          onAction={() => setFilters(DEFAULT_FILTERS)}
        />
      ) : (
        list.map((t, i) => {
          const color = categoryColors[t.catId] || catColor || palette.accent;
          return (
            <StaggerItem key={t.id} index={i} delay={motion.stagger.card}>
              <Card style={styles.card}>
                <View style={styles.topRow}>
                  <View style={styles.avatarWrap}>
                    <Avatar name={t.name} size={54} color={color} />
                    {t.online ? <PulseDot color={palette.success} size={11} style={styles.onlineDot} /> : null}
                  </View>
                  <View style={styles.mid}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{t.name}</Text>
                      {t.verified ? <Verified size={14} /> : null}
                    </View>
                    <View style={styles.ratingRow}>
                      <Stars value={t.rating} size={12} />
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

                <Text style={styles.bio} numberOfLines={2}>{t.bio}</Text>

                <View style={styles.statsRow}>
                  {[
                    { icon: 'award', label: `${t.years} سنوات` },
                    { icon: 'checkCircle', label: `${t.jobs} مهمة` },
                    { icon: 'pin', label: t.dist },
                    { icon: 'clock', label: t.eta },
                  ].map((st, j) => (
                    <View key={j} style={styles.statCell}>
                      <Icon name={st.icon} size={13} color={palette.textMid} />
                      <Text style={styles.statLabel}>{st.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.price} numberOfLines={1}>{t.price}</Text>
                  <View style={styles.responseRow}>
                    <Icon name="bolt" size={13} color={palette.success} />
                    <Text style={styles.responseText}>استجابة {t.responseTime}</Text>
                  </View>
                </View>

                {t.languages.length > 0 ? (
                  <View style={styles.tagRow}>
                    {t.languages.map((l) => (
                      <Tag key={l} label={l} />
                    ))}
                  </View>
                ) : null}

                <View style={styles.actionsRow}>
                  <Button
                    label="عرض الملف"
                    variant="secondary"
                    size="sm"
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('TechnicianProfile', { tid: t.id })}
                  />
                  <PressableScale
                    activeScale={0.96}
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Booking', { tid: t.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`احجز ${t.name}`}
                  >
                    <View style={[styles.bookBtn, { backgroundColor: color }]}>
                      <Text style={styles.bookText}>احجز الآن</Text>
                    </View>
                  </PressableScale>
                </View>
              </Card>
            </StaggerItem>
          );
        })
      )}

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="ترتيب وتصفية">
        <Text style={styles.sheetLabel}>الترتيب</Text>
        <View style={styles.sortList}>
          {SORTS.map((srt) => {
            const active = sort === srt.id;
            return (
              <PressableScale
                key={srt.id}
                activeScale={0.96}
                onPress={() => setSort(srt.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={srt.label}
              >
                <View style={[styles.sortRow, active && styles.sortRowActive]}>
                  <Icon name={srt.icon} size={15} color={active ? palette.accent : palette.textMid} />
                  <Text style={[styles.sortText, active && styles.sortTextActive]}>{srt.label}</Text>
                  {active ? <Icon name="check" size={14} color={palette.accent} /> : null}
                </View>
              </PressableScale>
            );
          })}
        </View>

        <Text style={styles.sheetLabel}>نطاق السعر (د.ل/ساعة)</Text>
        <View style={styles.chipRow}>
          {PRICE_CHIPS.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              active={filters.price === o.id}
              onPress={() => setFilters((f) => ({ ...f, price: f.price === o.id ? 'any' : o.id }))}
            />
          ))}
        </View>

        <Text style={styles.sheetLabel}>المسافة</Text>
        <View style={styles.chipRow}>
          {DIST_CHIPS.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              active={filters.dist === o.id}
              onPress={() => setFilters((f) => ({ ...f, dist: f.dist === o.id ? 'any' : o.id }))}
            />
          ))}
        </View>

        <Text style={styles.sheetLabel}>التقييم</Text>
        <View style={styles.chipRow}>
          <Chip
            label="4.5 + فقط"
            icon="star"
            active={filters.rating === 'high'}
            onPress={() => setFilters((f) => ({ ...f, rating: f.rating === 'high' ? 'any' : 'high' }))}
          />
        </View>

        <View style={styles.toggles}>
          <Toggle
            label="موثّق فقط"
            value={filters.verified}
            onChange={(v) => setFilters((f) => ({ ...f, verified: v }))}
          />
          <Toggle
            label="متاح اليوم"
            value={filters.today}
            onChange={(v) => setFilters((f) => ({ ...f, today: v }))}
          />
          <Toggle
            label="طوارئ"
            value={filters.emergency}
            onChange={(v) => setFilters((f) => ({ ...f, emergency: v }))}
          />
        </View>

        <View style={styles.sheetActions}>
          <Button
            label="إلغاء الكل"
            variant="ghost"
            style={styles.actionBtn}
            onPress={() => setFilters(DEFAULT_FILTERS)}
          />
          <Button
            label={`عرض النتائج (${list.length})`}
            style={styles.actionBtn}
            onPress={() => setSheet(false)}
          />
        </View>
      </BottomSheet>
    </Shell>
  );
}

const styles = StyleSheet.create({
  countText: { ...typ.caption, color: palette.textMid, marginBottom: sp.md, marginTop: sp.xs },

  card: { marginBottom: sp.base },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  avatarWrap: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2 },
  mid: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  name: { ...typ.h3, color: palette.textHi, flexShrink: 1, fontSize: 15 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  goldText: { ...typ.caption, color: palette.gold, fontWeight: '700' },
  lowText: { ...typ.caption, color: palette.textLow },
  badgeRow: { marginTop: sp.sm, alignSelf: 'flex-start' },

  bio: { ...typ.bodyS, color: palette.textMid, marginTop: sp.md, lineHeight: 20 },

  statsRow: {
    flexDirection: 'row', marginTop: sp.md, paddingVertical: sp.sm,
    borderRadius: r.md, backgroundColor: palette.surface,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { ...typ.caption, color: palette.textMid, fontSize: 10 },

  priceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: sp.md,
  },
  price: { ...typ.h3, color: palette.accent100, fontSize: 15, flexShrink: 1 },
  responseRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  responseText: { ...typ.caption, color: palette.success },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.xs, marginTop: sp.sm },
  actionsRow: { flexDirection: 'row', gap: sp.sm, marginTop: sp.base },
  actionBtn: { flex: 1 },
  bookBtn: {
    height: 36, borderRadius: r.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent', paddingHorizontal: sp.base,
  },
  bookText: { ...typ.label, color: palette.bg0, fontWeight: '800' },

  filterBtn: {
    width: 40, height: 40, borderRadius: r.pill,
    backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  filterDot: {
    position: 'absolute', top: -2, left: -2,
    minWidth: 16, height: 16, borderRadius: r.pill,
    backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center',
  },
  filterDotText: { ...typ.caption, color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

  sheetLabel: { ...typ.label, color: palette.textMid, marginTop: sp.lg, marginBottom: sp.sm },
  sortList: { gap: sp.xs },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', gap: sp.md,
    paddingVertical: sp.sm + 2, paddingHorizontal: sp.md,
    borderRadius: r.md, borderWidth: 1, borderColor: 'transparent',
  },
  sortRowActive: { backgroundColor: palette.accentSoft, borderColor: palette.borderAccent },
  sortText: { ...typ.bodyS, color: palette.text, flex: 1 },
  sortTextActive: { color: palette.textHi, fontWeight: '700' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  toggles: { marginTop: sp.sm },

  sheetActions: { flexDirection: 'row', gap: sp.md, marginTop: sp.xl },
});
