/**
 * Certificate — شهادة إتمام الدورة.
 * بطاقة شهادة أنيقة + تنزيل/مشاركة كإجراءات تجريبية عبر Toast.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, Badge, Button, useToast } from '../../ui';
import { COURSES } from '../../data';
import { useAppStore } from '../../store';

export function Certificate({ navigation, route }: any) {
  const c = COURSES.find((x: any) => x.id === route.params?.id) || COURSES[0];
  const user = useAppStore((s) => s.user);
  const toast = useToast();

  return (
    <Shell title="الشهادة" navigation={navigation} back>
      <Card style={styles.cert} contentStyle={styles.certContent}>
        <View style={styles.seal}>
          <Text style={styles.sealText}>JE</Text>
        </View>
        <Text style={styles.overline}>شهادة إتمام</Text>
        <Text style={styles.lead}>تتقدم أكاديمية JobEzz شهادة تقدير إلى</Text>
        <Text style={styles.name}>{user?.name ?? 'يوسف المنفي'}</Text>
        <Text style={styles.sub}>لإتمامه بنجاح دورة</Text>
        <Text style={styles.course}>{c.title}</Text>
        <View style={styles.stats}>
          <Badge variant="accent" icon="check" label={`${c.lessons} دروس`} />
          <Badge variant="accent" icon="clock" label={`${c.hours} ساعات`} />
          <Badge variant="success" icon="shield" label="معتمدة" />
        </View>
        <View style={styles.meta}>
          <Badge variant="neutral" label="منصة JobEzz" />
          <Badge variant="neutral" label={`#JE-${c.id.toUpperCase()}-2026`} />
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label="تنزيل الشهادة PDF" size="lg" onPress={() => toast.show('يتوفر التنزيل كملف PDF في نسخة قادمة', 'info')} />
        <Button label="مشاركة الإنجاز" variant="secondary" onPress={() => toast.show('مشاركة شهادتك على الشبكات الاجتماعية', 'success')} />
        <Button label="إضافة الشهادة إلى حسابي" variant="ghost" onPress={() => toast.show('أُضيفت الشهادة إلى قسم إنجازاتك', 'success')} />
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  cert: {
    borderWidth: 2,
    borderColor: palette.borderAccent,
    marginTop: sp.sm,
  },
  certContent: { alignItems: 'center', paddingVertical: sp.xl },
  seal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accentGlow,
    borderWidth: 2,
    borderColor: palette.accent,
    marginBottom: sp.base,
  },
  sealText: { ...typ.h2, color: palette.accent },
  overline: { ...typ.overline, color: palette.gold, marginBottom: sp.sm },
  lead: { ...typ.bodyS, color: palette.textMid, textAlign: 'center' },
  name: { ...typ.h1, color: palette.textHi, marginTop: sp.sm, textAlign: 'center' },
  sub: { ...typ.bodyS, color: palette.textMid, marginTop: sp.base, textAlign: 'center' },
  course: { ...typ.h3, color: palette.accent, marginTop: sp.xs, textAlign: 'center' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: sp.sm, marginTop: sp.lg },
  meta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: sp.sm, marginTop: sp.sm },
  actions: { gap: sp.md, marginTop: sp.lg },
});
