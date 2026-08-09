/**
 * JobApply — تقديم طلب وظيفة.
 * ملخص السيرة الذاتية + رسالة التعريف + إرسال حقيقي عبر
 * submitApplication(jobId, applicantId, coverLetter) مع حالات
 * تحميل / نجاح (Dialog) / فشل (Toast).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Shell, Card, Button, Badge, BrandLetterAvatar, Dialog, Input } from '../../ui';
import { useToast } from '../../ui';
import { JOBS, USER } from '../../data';
import { submitApplication } from '../../lib/queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAppStore } from '../../store';

export function JobApply({ navigation, route }: any) {
  const id = route.params?.id as string;
  const j = JOBS.find((x) => x.id === id) ?? JOBS[0];
  const user = useAppStore((s) => s.user) ?? USER;
  const toast = useToast();

  const [letter, setLetter] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setBusy(true);
    const res = await submitApplication(j.id, user.id, letter.trim());
    setBusy(false);
    /* الوضع المحلي يرجّع ok:false برسالة "وضع محلي" — يُعامل كنجاح تجريبي */
    if (res.ok || !isSupabaseConfigured()) {
      setDone(true);
    } else {
      toast.show(res.message || 'تعذّر إرسال الطلب، حاول مجدداً', 'error');
    }
  };

  return (
    <Shell title="تقديم على الوظيفة" navigation={navigation} back>
      {/* ملخص الوظيفة */}
      <Card>
        <View style={styles.jobRow}>
          <BrandLetterAvatar
            name={j.company}
            size={48}
            color={j.verified ? palette.accent : palette.textLow}
          />
          <View style={styles.jobText}>
            <Text style={styles.jobTitle} numberOfLines={1}>{j.title}</Text>
            <Text style={styles.jobSub} numberOfLines={1}>{j.company} · {j.loc}</Text>
          </View>
        </View>
      </Card>

      {/* ملخص السيرة الذاتية المرفقة */}
      <Card style={styles.block}>
        <View style={styles.cvHead}>
          <View style={styles.cvText}>
            <Text style={styles.cvTitle}>ملفك الشخصي</Text>
            <Text style={styles.cvSub} numberOfLines={1}>
              {user.name} · {user.city}
              {user.experience ? ` · ${user.experience} خبرة` : ''}
            </Text>
          </View>
          <Badge label="السيرة جاهزة" variant="success" icon="check" />
        </View>
        {user.skills && user.skills.length > 0 ? (
          <View style={styles.chips}>
            {user.skills.slice(0, 4).map((sk) => (
              <Badge key={sk} label={sk} variant="neutral" />
            ))}
          </View>
        ) : null}
      </Card>

      {/* رسالة التعريف */}
      <View style={styles.block}>
        <Input
          label="رسالة التعريف (اختيارية)"
          placeholder="أخبر صاحب العمل لماذا تناسب هذه الوظيفة..."
          value={letter}
          onChangeText={setLetter}
          multiline
          hint="سيراجع صاحب العمل رسالتك مع ملفك الشخصي."
        />
      </View>

      <Button
        label="إرسال الطلب"
        size="lg"
        loading={busy}
        onPress={() => void submit()}
        style={styles.cta}
      />

      <Dialog
        visible={done}
        onCancel={() => {
          setDone(false);
          navigation.goBack();
        }}
        onConfirm={() => {
          setDone(false);
          navigation.navigate('Applications');
        }}
        icon="checkCircle"
        title="تم إرسال طلبك"
        body={`سيراجع فريق ${j.company} طلبك ويتواصل معك عند القبول.`}
        confirmLabel="متابعة طلباتي"
        cancelLabel="العودة"
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  jobText: { flex: 1, minWidth: 0 },
  jobTitle: { ...typ.h4, color: palette.textHi },
  jobSub: { ...typ.bodyS, color: palette.textMid, marginTop: 2 },
  block: { marginTop: sp.md },
  cvHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: sp.sm },
  cvText: { flex: 1, minWidth: 0 },
  cvTitle: { ...typ.label, color: palette.textHi },
  cvSub: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: sp.sm },
  cta: { marginTop: sp.xl },
});
