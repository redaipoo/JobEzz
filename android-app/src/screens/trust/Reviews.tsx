/**
 * Reviews — مراجعات الفني أو الدورة.
 * بيانات حقيقية من TECHNICIANS / COURSES مع نصوص مراجعات نموذجية.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, Avatar, Verified, Stars, Badge, EmptyState } from '../../ui';
import { TECHNICIANS, COURSES } from '../../data';

const REVIEWS: Record<string, { name: string; rating: number; text: string; date: string }[]> = {
  t1: [
    { name: 'محمود', rating: 5, text: 'سباك محترف وصل في الموعد وشغله نظيف جداً', date: 'قبل أسبوع' },
    { name: 'سارة', rating: 4, text: 'استجابة سريعة وسعر مناسب، أنصح بالتعامل معه', date: 'قبل شهر' },
  ],
  t2: [
    { name: 'خالد', rating: 5, text: 'كهربائي ممتاز عالج جميع الأعطال في البيت', date: 'قبل 3 أيام' },
    { name: 'أمل', rating: 4, text: 'عمل دقيق وفريق ملتزم بالسلامة', date: 'قبل أسبوعين' },
  ],
  course: [
    { name: 'علي', rating: 5, text: 'دورة عملية وشرح مبسط خطوة بخطوة', date: 'قبل أسبوع' },
    { name: 'منى', rating: 4, text: 'محتوى غني وينصح بها لكل مبتدئ', date: 'قبل شهر' },
  ],
};

export function Reviews({ navigation, route }: any) {
  const isCourse = route.params?.type === 'course';
  const target = route.params?.id;

  const tech = TECHNICIANS.find((t) => t.id === target) || TECHNICIANS[0];
  const course = COURSES.find((c) => c.id === target) || COURSES[0];

  const rating = isCourse ? course.rating : tech.rating;
  const count = isCourse ? course.students : tech.reviews;
  const rows = REVIEWS[isCourse ? 'course' : tech.id] || REVIEWS.t1;

  return (
    <Shell title="المراجعات" navigation={navigation} back>
      <Card contentStyle={styles.summary}>
        <View style={styles.summaryRow}>
          <Avatar name={isCourse ? course.title : tech.name} size={48} color={palette.accent} />
          <View style={styles.summaryMid}>
            <Text style={styles.summaryTitle} numberOfLines={1}>{isCourse ? course.title : tech.name}</Text>
            <Stars value={rating} size={14} />
          </View>
          <View style={styles.summarySide}>
            <Text style={styles.summaryValue}>{rating.toFixed(1)}</Text>
            <Text style={styles.summaryCount}>{count.toLocaleString()} مراجعة</Text>
          </View>
        </View>
      </Card>

      {rows.map((r, i) => (
        <Card key={i} style={styles.review} contentStyle={styles.reviewContent}>
          <View style={styles.reviewHead}>
            <Avatar name={r.name} size={36} />
            <View style={styles.reviewMid}>
              <View style={styles.nameRow}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Verified size={13} />
              </View>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
            <Stars value={r.rating} size={12} />
          </View>
          <Text style={styles.reviewText}>{r.text}</Text>
          <Badge variant="success" icon="check" label="عملية موثقة" />
        </Card>
      ))}

      {rows.length === 0 && (
        <EmptyState icon="star" title="لا توجد مراجعات بعد" body="كن أول من يقيّم هذه الخدمة" />
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: sp.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  summaryMid: { flex: 1, minWidth: 0, gap: sp.xs },
  summaryTitle: { ...typ.h4, color: palette.textHi },
  summarySide: { alignItems: 'flex-end' },
  summaryValue: { ...typ.h2, color: palette.warning },
  summaryCount: { ...typ.caption, color: palette.textLow },
  review: { marginBottom: sp.md },
  reviewContent: { gap: sp.sm },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  reviewMid: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  reviewName: { ...typ.h4, color: palette.textHi },
  reviewDate: { ...typ.caption, color: palette.textLow },
  reviewText: { ...typ.bodyS, color: palette.textMid, lineHeight: 21 },
});
