/**
 * CourseQuiz — اختبار نهاية الدورة.
 * اختيار إجابة لكل سؤال ثم عرض النتيجة في Dialog مع إعادة المحاولة.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, PressableScale } from '../../design';
import { Card, Shell, Button, Dialog } from '../../ui';
import { COURSES, QUIZ } from '../../data';

export function CourseQuiz({ navigation, route }: any) {
  const c = COURSES.find((x: any) => x.id === route.params?.id) || COURSES[0];
  const [ans, setAns] = useState<(number | undefined)[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const choose = (qi: number, oi: number) => {
    const n = [...ans];
    n[qi] = oi;
    setAns(n);
  };

  const submit = () => {
    const correct = ans.filter((a, i) => a === QUIZ[i].ans).length;
    setResult(correct);
  };

  const reset = () => {
    setResult(null);
    setAns([]);
  };

  const pass = result !== null && result >= QUIZ.length / 2;

  return (
    <Shell title={`الاختبار: ${c.title}`} navigation={navigation} back>
      <Text style={styles.intro}>
        أجب عن {QUIZ.length} أسئلة للتأكد من استيعابك. تحتاج {Math.ceil(QUIZ.length / 2)} إجابة صحيحة للنجاح.
      </Text>
      {QUIZ.map((q: any, qi: number) => (
        <Card key={qi} style={styles.question}>
          <Text style={styles.qText}>{qi + 1}. {q.q}</Text>
          {q.opts.map((o: string, oi: number) => {
            const sel = ans[qi] === oi;
            return (
              <PressableScale
                key={oi}
                onPress={() => choose(qi, oi)}
                activeScale={0.97}
                style={[styles.opt, sel && styles.optSel]}
              >
                <View style={[styles.optDot, sel && styles.optDotSel]}>
                  <Text style={styles.optDotText}>{['١', '٢', '٣', '٤'][oi]}</Text>
                </View>
                <Text style={[styles.optText, sel && styles.optTextSel]}>{o}</Text>
              </PressableScale>
            );
          })}
        </Card>
      ))}
      <Button label="تصحيح الإجابات" onPress={submit} size="lg" disabled={ans.length < QUIZ.length} style={styles.submit} />

      <Dialog
        visible={result !== null}
        title={pass ? 'ممتاز! نجحت في الاختبار' : 'حاول مرة أخرى'}
        body={`أجبت عن ${result ?? 0} من ${QUIZ.length} إجابة صحيحة. ${pass ? 'أنت جاهز للحصول على شهادتك المعتمدة.' : 'راجع الدروس وحاول مجدداً لتحصل على الشهادة.'}`}
        confirmLabel="إعادة المحاولة"
        cancelLabel={pass ? 'الحصول على الشهادة' : 'إنهاء'}
        icon={pass ? 'trophy' : 'alert'}
        variant={pass ? 'primary' : 'danger'}
        onConfirm={reset}
        onCancel={() => {
          reset();
          if (pass) navigation.navigate('Certificate', { id: c.id });
          else navigation.navigate('CourseLearn', { id: c.id });
        }}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  intro: { ...typ.bodyS, color: palette.textMid, marginBottom: sp.base },
  question: { marginBottom: sp.md, gap: sp.md },
  qText: { ...typ.h4, color: palette.textHi },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.md,
    paddingHorizontal: sp.md,
    paddingVertical: sp.md - 2,
    borderRadius: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  optSel: { backgroundColor: palette.accentSoft, borderColor: palette.borderAccent },
  optDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceHi,
  },
  optDotSel: { backgroundColor: palette.accent },
  optDotText: { ...typ.caption, color: palette.textMid, fontWeight: '800' },
  optText: { ...typ.body, color: palette.textMid, flex: 1 },
  optTextSel: { color: palette.textHi, fontWeight: '700' },
  submit: { marginTop: sp.xs },
});
