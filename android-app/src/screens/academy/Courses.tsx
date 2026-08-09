/**
 * Courses — أكاديمية JobEzz (tab screen).
 * بحث + فلاتر تصنيف + دوراتي المسجّلة + شبكة الدورات + مؤشرات حقيقية.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, sp, r, typ, preset, useEntrance, StaggerItem,
} from '../../design';
import { DepthGradient, AmbientGlow } from '../../design/depth';
import {
  Card, Chip, IconTile, Badge, Stars, ProgressLine, KpiRow,
  SearchField, EmptyState, SkeletonList, useTabBarClearance,
} from '../../ui';
import { COURSES, MY_COURSES } from '../../data';
import { loadCourses } from '../../lib/queries';

const priceOf = (c: any): string => {
  if (typeof c.price === 'number') return c.price === 0 ? 'مجاني' : `${c.price} د.ل`;
  return c.price || 'مجاني';
};

const totalStudents = COURSES.reduce((a, c) => a + c.students, 0);
const avgRating = COURSES.reduce((a, c) => a + c.rating, 0) / COURSES.length;
const totalXp = MY_COURSES.reduce((a, c) => a + c.xp, 0);
const CATS = ['الكل', ...Array.from(new Set(COURSES.map((c) => c.cat)))];

export function Courses({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('الكل');
  const [live, setLive] = useState<any[] | null | undefined>(undefined);
  const hero = useEntrance(0, 14);

  useEffect(() => {
    let active = true;
    loadCourses().then((rows) => {
      if (active) setLive(rows);
    });
    return () => { active = false; };
  }, []);

  const loading = live === undefined;
  const catalog = live && live.length > 0 ? live : COURSES;

  const filtered = (catalog as any[]).filter((c) => {
    const matchCat = cat === 'الكل' || String(c.cat) === cat;
    const s = q.trim().toLowerCase();
    const matchQ = !s || [c.title, c.sub ?? c.subtitle, c.cat].some((v) => String(v ?? '').toLowerCase().includes(s));
    return matchCat && matchQ;
  });

  const enrolled = MY_COURSES.map((mc) => ({ mc, course: COURSES.find((c) => c.id === mc.courseId) }))
    .filter((x): x is { mc: (typeof MY_COURSES)[number]; course: (typeof COURSES)[number] } => !!x.course);

  return (
    <View style={preset.screen}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topLeft" color={palette.accent} size={300} opacity={0.07} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.body, { paddingTop: insets.top + sp.base, paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={hero}>
          <Text style={styles.title}>أكاديمية JobEzz</Text>
          <Text style={styles.subtitle}>طوّر مهاراتك واحصل على شهادات معتمدة</Text>
        </Animated.View>

        <SearchField
          value={q}
          onChangeText={setQ}
          placeholder="ابحث في الدورات..."
          style={{ marginBottom: sp.base }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATS.map((c) => (
            <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />
          ))}
        </ScrollView>

        <View style={styles.kpiRow}>
          <KpiRow
            items={[
              { value: String(COURSES.length), label: 'دورة', icon: 'courses' },
              { value: totalStudents.toLocaleString(), label: 'طالب', icon: 'users' },
              { value: avgRating.toFixed(1), label: 'متوسط التقييم', icon: 'starFill', color: palette.warning },
              { value: String(totalXp), label: 'نقطة XP', icon: 'bolt' },
            ]}
          />
        </View>

        {enrolled.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>دروسي النشطة</Text>
            {enrolled.map(({ mc, course }) => (
              <Card
                key={mc.courseId}
                onPress={() => navigation.navigate('CourseDetail', { id: mc.courseId })}
                style={styles.enrolledCard}
                contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: sp.base }}
              >
                <IconTile icon={course.icon} size={48} />
                <View style={styles.enrolledMid}>
                  <Text style={styles.enrolledTitle} numberOfLines={1}>{course.title}</Text>
                  <Text style={styles.enrolledMeta}>الدرس {mc.lastLesson} من {course.lessons}</Text>
                  <ProgressLine percent={mc.progress} size="sm" />
                </View>
                <View style={styles.enrolledSide}>
                  <Badge variant="warning" icon="fire" label={String(mc.streak)} />
                  <Badge variant="accent" style={{ marginTop: sp.xs }} label={`${mc.xp} XP`} />
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الدورات المتاحة</Text>
          {loading ? (
            <SkeletonList count={4} kind="card" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="courses"
              title="لا توجد دورات مطابقة"
              body="جرّب تغيير التصنيف أو كلمة البحث للعثور على نتائج"
            />
          ) : (
            <View style={styles.grid}>
              {filtered.map((c, i) => (
                <StaggerItem key={c.id} index={i} style={styles.gridItem}>
                  <Card onPress={() => navigation.navigate('CourseDetail', { id: c.id })} style={styles.gridCard}>
                    <IconTile icon={c.icon || 'courses'} size={44} />
                    <Text style={styles.courseTitle} numberOfLines={2}>{c.title}</Text>
                    <View style={styles.courseMetaRow}>
                      <Stars value={Number(c.rating ?? 0)} size={11} />
                      <Text style={styles.courseMeta}>{Number(c.lessons ?? c.lessons_count ?? 0)} درس</Text>
                    </View>
                    {priceOf(c) !== 'مجاني' ? (
                      <Text style={styles.price}>{priceOf(c)}</Text>
                    ) : (
                      <Badge variant="success" label="مجاني" />
                    )}
                  </Card>
                </StaggerItem>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: sp.screen },
  title: { ...typ.display, color: palette.textHi },
  subtitle: { ...typ.bodyS, color: palette.textMid, marginTop: 2, marginBottom: sp.base },
  chips: { gap: sp.sm, paddingBottom: sp.base },
  kpiRow: { marginBottom: sp.base },
  section: { marginTop: sp.md },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
  enrolledCard: { marginBottom: sp.md },
  enrolledMid: { flex: 1, minWidth: 0, gap: sp.xs },
  enrolledTitle: { ...typ.h4, color: palette.textHi },
  enrolledMeta: { ...typ.caption, color: palette.textLow },
  enrolledSide: { alignItems: 'flex-end' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.md },
  gridItem: { width: '48%', flexGrow: 1 },
  gridCard: { minHeight: 150 },
  courseTitle: { ...typ.h4, color: palette.textHi, marginTop: sp.md, minHeight: 42 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, marginTop: sp.sm },
  courseMeta: { ...typ.caption, color: palette.textLow },
  price: { ...typ.label, color: palette.gold, marginTop: sp.sm },
});
