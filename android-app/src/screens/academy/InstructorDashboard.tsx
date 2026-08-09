/**
 * InstructorDashboard — لوحة المدرّب.
 * إيرادات وطلاب وتقييمات محسوبة من بيانات الدورات الحقيقية.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import {
  Card, Shell, IconTile, Badge, Stars, KpiRow, Button, useToast,
} from '../../ui';
import { COURSES } from '../../data';

const MY = COURSES.slice(0, 2);
const totalStudents = MY.reduce((a, c) => a + c.students, 0);
const totalRevenue = MY.reduce((a, c) => a + Math.round(c.students * 0.45), 0);
const avgRating = MY.reduce((a, c) => a + c.rating, 0) / MY.length;

export function InstructorDashboard({ navigation }: any) {
  const toast = useToast();
  const courses = MY.map((c) => ({
    ...c,
    revenue: Math.round(c.students * 0.45),
    status: c.rating >= 4.7 ? 'نشطة' : 'قيد المراجعة',
  }));

  return (
    <Shell title="لوحة المدرّب" navigation={navigation} back>
      <Card contentStyle={styles.revenueCard}>
        <Text style={styles.revenueLabel}>إجمالي الإيرادات</Text>
        <View style={styles.revenueRow}>
          <Text style={styles.revenueValue}>{totalRevenue.toLocaleString()} د.ل</Text>
          <Badge variant="gold" label="بعد خصم المنصة" />
        </View>
        <Text style={styles.revenueSub}>من {MY.length} دورات منشورة على أكاديمية JobEzz</Text>
      </Card>

      <View style={styles.kpiWrap}>
        <KpiRow
          items={[
            { value: String(MY.length), label: 'دورة', icon: 'courses' },
            { value: totalStudents.toLocaleString(), label: 'طالب', icon: 'users' },
            { value: avgRating.toFixed(1), label: 'متوسط التقييم', icon: 'starFill', color: palette.warning },
          ]}
        />
      </View>

      <Button
        label="+ إنشاء دورة جديدة"
        variant="secondary"
        onPress={() => toast.show('إطلاق أداة إنشاء الدورات للمدرّبين قريباً', 'info')}
        style={styles.newBtn}
      />

      <Text style={styles.sectionTitle}>دوراتي</Text>
      {courses.map((c) => (
        <Card key={c.id} style={styles.courseCard} contentStyle={styles.courseRow}>
          <IconTile icon={c.icon} size={44} />
          <View style={styles.courseMid}>
            <Text style={styles.courseTitle} numberOfLines={1}>{c.title}</Text>
            <Text style={styles.courseMeta}>{c.students.toLocaleString()} طالب</Text>
            <Stars value={c.rating} size={11} />
          </View>
          <View style={styles.courseSide}>
            <Badge variant={c.status === 'نشطة' ? 'success' : 'warning'} label={c.status} />
            <Text style={styles.revenue}>{c.revenue} د.ل</Text>
          </View>
        </Card>
      ))}
    </Shell>
  );
}

const styles = StyleSheet.create({
  revenueCard: { gap: sp.sm, marginBottom: sp.base },
  revenueLabel: { ...typ.caption, color: palette.textLow },
  revenueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: sp.md },
  revenueValue: { ...typ.display, color: palette.gold },
  revenueSub: { ...typ.bodyS, color: palette.textMid },
  kpiWrap: { marginBottom: sp.base },
  newBtn: { marginBottom: sp.lg },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
  courseCard: { marginBottom: sp.md },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  courseMid: { flex: 1, minWidth: 0, gap: sp.xs },
  courseTitle: { ...typ.h4, color: palette.textHi },
  courseMeta: { ...typ.caption, color: palette.textLow },
  courseSide: { alignItems: 'flex-end', gap: sp.sm },
  revenue: { ...typ.label, color: palette.gold },
});
