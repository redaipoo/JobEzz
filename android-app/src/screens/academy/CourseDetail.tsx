/**
 * CourseDetail — تفاصيل الدورة.
 * وصف حقيقي + مؤشرات الدورة + التقدم المسجّل + التوجه للتعلم أو الدفع.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import {
  Card, Shell, IconTile, Badge, Stars, ProgressLine, KpiRow, Button,
} from '../../ui';
import { COURSES, MY_COURSES } from '../../data';
import { useAppStore } from '../../store';

const levelVariant = (level: string): 'danger' | 'warning' | 'success' =>
  level.includes('متقدم') ? 'danger' : level.includes('متوسط') ? 'warning' : 'success';

export function CourseDetail({ navigation, route }: any) {
  const c = COURSES.find((x) => x.id === route.params?.id) || COURSES[0];
  const me = useAppStore((s) => s.user);
  const enrolled = MY_COURSES.find((mc) => mc.courseId === c.id);
  const fee = /(\d+)/.exec(c.price);
  const feeNum = fee ? parseInt(fee[1], 10) : 0;
  const paid = feeNum > 0;

  const start = () => navigation.navigate('CourseLearn', { id: c.id });
  const pay = () => navigation.navigate('Checkout', {
    amount: feeNum, description: `دورة: ${c.title}`, pid: c.id,
  });

  return (
    <Shell title={c.title} navigation={navigation} back>
      <Card style={styles.hero} contentStyle={styles.heroContent}>
        <IconTile icon={c.icon} size={64} />
        <View style={styles.heroMid}>
          <Text style={styles.title}>{c.title}</Text>
          <Text style={styles.sub}>{c.sub}</Text>
        </View>
        <Badge variant={paid ? 'gold' : 'success'} label={c.price} />
      </Card>

      <View style={styles.badges}>
        <Badge variant="accent" label={c.cat} />
        <Badge variant={levelVariant(c.level)} label={c.level} />
        {c.cert && <Badge variant="success" icon="shield" label="شهادة معتمدة" />}
      </View>

      <View style={styles.kpiWrap}>
        <KpiRow
          items={[
            { value: String(c.lessons), label: 'درس', icon: 'play' },
            { value: String(c.hours), label: 'ساعة', icon: 'clock' },
            { value: c.students.toLocaleString(), label: 'طالب', icon: 'users' },
            { value: c.rating.toFixed(1), label: 'التقييم', icon: 'starFill', color: palette.warning },
          ]}
        />
      </View>

      {enrolled && (
        <Card style={styles.card} contentStyle={styles.progressCard}>
          <View style={styles.progressHead}>
            <Text style={styles.cardTitle}>تقدمي في الدورة</Text>
            <Text style={styles.percent}>{enrolled.progress}%</Text>
          </View>
          <ProgressLine percent={enrolled.progress} />
          <View style={styles.progressMeta}>
            <Stars value={c.rating} size={12} />
            <Badge variant="warning" icon="fire" label={`${enrolled.streak} أيام`} />
            <Badge variant="accent" label={`${enrolled.xp} XP`} />
          </View>
        </Card>
      )}

      <Text style={styles.sectionTitle}>ماذا ستتعلم؟</Text>
      <View style={styles.featureRow}>
        <IconTile icon="check" size={20} color={palette.success} />
        <Text style={styles.featureText}>أساسيات المهنة خطوة بخطوة مع تطبيق عملي</Text>
      </View>
      <View style={styles.featureRow}>
        <IconTile icon="doc" size={20} color={palette.accent} />
        <Text style={styles.featureText}>{c.lessons} درساً و{c.hours} ساعات من المحتوى المكثف</Text>
      </View>
      {c.cert && (
        <View style={styles.featureRow}>
          <IconTile icon="shield" size={20} color={palette.gold} />
          <Text style={styles.featureText}>شهادة إتمام معتمدة من أكاديمية JobEzz</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button label={enrolled ? 'أكمل التعلم' : 'سجّل في الدورة'} onPress={start} size="lg" />
        {paid && !enrolled && (
          <Button label={`الدفع الآن · ${c.price}`} variant="gold" size="lg" onPress={pay} />
        )}
        <Text style={styles.hint}>
          {enrolled ? `آخر درس: ${enrolled.lastLesson} من ${c.lessons}` : (me ? `أهلاً ${me.name.split(' ')[0] || ''}` : '')}
        </Text>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  hero: { marginBottom: sp.base },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  heroMid: { flex: 1, minWidth: 0, gap: sp.xs },
  title: { ...typ.h2, color: palette.textHi },
  sub: { ...typ.bodyS, color: palette.textMid },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, marginBottom: sp.base },
  kpiWrap: { marginBottom: sp.base },
  card: { marginBottom: sp.md },
  progressCard: { gap: sp.md },
  progressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typ.h4, color: palette.textHi },
  percent: { ...typ.label, color: palette.accent },
  progressMeta: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, flexWrap: 'wrap' },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md, marginBottom: sp.md },
  featureText: { ...typ.body, color: palette.text, flex: 1 },
  actions: { marginTop: sp.xs, gap: sp.md },
  hint: { ...typ.caption, color: palette.textLow, textAlign: 'center' },
});
