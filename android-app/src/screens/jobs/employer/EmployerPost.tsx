/**
 * EmployerPost — نموذج نشر وظيفة جديدة.
 * حقول مع تسميات وأخطاء عبر Input + اختيار نوع الوظيفة بالشرائح.
 * ⚠️ محاكاة: الإرسال يُحاكي النشر مؤقتاً (بلا Backend بعد) ثم ينقل
 * لشاشة الوظائف مع Toast — يُربط لاحقاً بجدول jobs عبر Supabase.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../../design';
import { Shell, Button, Input, Chip, Card } from '../../../ui';
import { useToast } from '../../../ui';
import { JOB_FILTERS } from '../../../data';

/* أنواع الوظائف المعتمدة (من JOB_FILTERS دون "الكل") */
const JOB_TYPES = JOB_FILTERS.slice(1).map((f) => f.name);

type PostErrors = { title?: string; loc?: string; desc?: string };

/** محاكاة زمن النشر — يستبدل لاحقاً باستدعاء insert لجدول jobs */
function simulatePublish(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export function EmployerPost({ navigation }: any) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState(JOB_TYPES[0]);
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState<PostErrors>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next: PostErrors = {};
    if (!title.trim()) next.title = 'أدخل مسمى الوظيفة';
    if (!loc.trim()) next.loc = 'أدخل موقع العمل';
    if (!desc.trim() || desc.trim().length < 20) next.desc = 'اكتب وصفاً واضحاً (20 حرفاً على الأقل)';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    await simulatePublish();
    setBusy(false);
    toast.show('تم نشر الوظيفة بنجاح');
    navigation.navigate('EmployerJobs');
  };

  return (
    <Shell title="نشر وظيفة جديدة" navigation={navigation} back>
      <Input
        label="مسمى الوظيفة"
        value={title}
        onChangeText={setTitle}
        placeholder="مثال: محاسب مالي"
        error={errors.title}
      />
      <Input
        label="موقع العمل"
        value={loc}
        onChangeText={setLoc}
        placeholder="مثال: بنغازي - السلماني"
        error={errors.loc}
      />

      <Text style={styles.fieldLabel}>نوع الوظيفة</Text>
      <View style={styles.chipsRow}>
        {JOB_TYPES.map((t) => (
          <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
        ))}
      </View>

      <Input
        label="الوصف"
        value={desc}
        onChangeText={setDesc}
        placeholder="صف المهام والمؤهلات المطلوبة من المرشح..."
        multiline
        error={errors.desc}
      />

      <Card style={styles.noteCard}>
        <Text style={styles.noteText}>
          ستظهر الوظيفة فوراً في شاشة الوظائف والمتقدّمين بعد النشر.
        </Text>
      </Card>

      <Button
        label="نشر الوظيفة"
        size="lg"
        loading={busy}
        onPress={() => void submit()}
        style={styles.cta}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { ...typ.label, color: palette.textMid, marginBottom: sp.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, marginBottom: sp.base },
  noteCard: { marginTop: sp.sm },
  noteText: { ...typ.bodyS, color: palette.textMid, textAlign: 'right' },
  cta: { marginTop: sp.xl },
});
