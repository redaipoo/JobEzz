/**
 * CourseLearn — درس الدورة مع تتبع تقدم محلي.
 * القائمة مبنية من عدد دروس الدورة، وضغط درس يكمله ويرفع النسبة.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, PressableScale } from '../../design';
import { Card, Shell, Badge, ProgressLine, Button, useToast } from '../../ui';
import { COURSES, MY_COURSES } from '../../data';

const LESSON_NAMES = [
  'المقدمة وأهداف الدورة',
  'الأدوات والمعدات الأساسية',
  'التطبيق العملي الأول',
  'الحالات الخاصة والشائعة',
  'المراجعة والاختبار القصير',
];

export function CourseLearn({ navigation, route }: any) {
  const c = COURSES.find((x: any) => x.id === route.params?.id) || COURSES[0];
  const enrolled = MY_COURSES.find((mc) => mc.courseId === c.id);
  const toast = useToast();
  const [done, setDone] = useState(() => Math.round(((enrolled?.progress ?? 40) / 100) * c.lessons));
  const pct = Math.min(100, Math.round((done / c.lessons) * 100));

  const tapLesson = (i: number) => {
    if (i + 1 <= done) return;
    setDone(i + 1);
    if (i + 1 >= c.lessons) {
      toast.show('أكملت الدورة · احصل على شهادتك المعتمدة الآن', 'success');
    }
  };

  const lessons = Array.from({ length: Math.min(c.lessons, LESSON_NAMES.length) }, (_, i) => ({
    name: LESSON_NAMES[i],
    done: i < done,
  }));

  return (
    <Shell title={`التعلم: ${c.title}`} navigation={navigation} back>
      <Card contentStyle={styles.progressCard}>
        <View style={styles.progressHead}>
          <Text style={styles.cardTitle}>التقدم في الدورة</Text>
          <Text style={styles.percent}>{pct}%</Text>
        </View>
        <ProgressLine percent={pct} />
        {enrolled && (
          <View style={styles.badges}>
            <Badge variant="warning" icon="fire" label={`سلسلة ${enrolled.streak} أيام`} />
            <Badge variant="accent" label={`${enrolled.xp} XP`} />
            <Badge variant="neutral" label={`الدرس ${done} من ${c.lessons}`} />
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>محتوى الدورة</Text>
      {lessons.map((l, i) => (
        <PressableScale key={i} onPress={() => tapLesson(i)} activeScale={0.97} style={styles.lesson}>
          <View style={[styles.dot, l.done && styles.dotDone]}>
            <Text style={styles.dotText}>{i + 1}</Text>
          </View>
          <Text style={[styles.lessonName, l.done && styles.lessonDone]} numberOfLines={2}>
            {l.name}
          </Text>
          {l.done ? (
            <Badge variant="success" icon="check" label="مكتمل" />
          ) : (
            <Badge variant="neutral" icon="play" label="ابدأ" />
          )}
        </PressableScale>
      ))}
      <Text style={styles.more}>{c.lessons - lessons.length > 0 ? `+ ${c.lessons - lessons.length} درس إضافي في النسخة الكاملة` : 'كل الدروس في هذه الدفعة'}</Text>

      <View style={styles.actions}>
        <Button label="ابدأ الاختبار" onPress={() => navigation.navigate('CourseQuiz', { id: c.id })} size="lg" />
        <Button label="شهادة الإتمام" variant="ghost" onPress={() => navigation.navigate('Certificate', { id: c.id })} />
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  progressCard: { gap: sp.md, marginBottom: sp.lg },
  progressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typ.h4, color: palette.textHi },
  percent: { ...typ.label, color: palette.accent },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.md,
    paddingVertical: sp.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  dotDone: { backgroundColor: palette.successBg, borderColor: palette.success },
  dotText: { ...typ.label, color: palette.textMid },
  lessonName: { ...typ.body, color: palette.textHi, flex: 1 },
  lessonDone: { color: palette.textMid },
  more: { ...typ.caption, color: palette.textLow, marginTop: sp.md, textAlign: 'center' },
  actions: { marginTop: sp.lg, gap: sp.md },
});
