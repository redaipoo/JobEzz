/**
 * ServiceRequest — 3-step wizard: describe → location → time & budget.
 * Preserves old behavior: on success toast + goBack; otherwise ServiceMatch.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette, typ, sp, r, useEntrance, PressableScale } from '../../design';
import {
  Shell, StepIndicator, Card, Badge, Chip, Button, MapBox, Input, useToast,
} from '../../ui';
import { Icon } from '../../icons';
import { CATEGORIES } from '../../data';
import { useAppStore } from '../../store';
import { createServiceRequest } from '../../lib/queries';
import { USER } from '../../data';

const STEPS = ['وصف المشكلة', 'الموقع', 'الوقت والميزانية'];

export function ServiceRequest({ navigation, route }: any) {
  const toast = useToast();
  const c = CATEGORIES.find((x) => x.id === route.params?.cat) || CATEGORIES[0];
  const [step, setStep] = useState(0);
  const [desc, setDesc] = useState('');
  const [when, setWhen] = useState('اليوم');
  const [budget, setBudget] = useState('');
  const fade = useEntrance(0, 14);
  const instant = c.mode === 'instant';
  const accent = instant ? palette.success : palette.accent;

  const submit = async () => {
    const user = useAppStore.getState().user || USER;
    const res = await createServiceRequest(user.id, c.id, desc, 'بنغازي · السلماني');
    if (res.ok) {
      toast.show(res.message);
      navigation.goBack();
    } else {
      navigation.navigate('ServiceMatch', { cat: c.id });
    }
  };

  return (
    <Shell title={c.name} navigation={navigation} back>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <StepIndicator steps={STEPS} current={step} />
        <View style={styles.content}>
          {step === 0 && (
            <Animated.View style={fade}>
              <View style={styles.modeRow}>
                <Icon name={instant ? 'bolt' : 'doc'} size={14} color={accent} />
                <Badge variant={instant ? 'success' : 'accent'} label={instant ? 'مطابقة فورية' : 'عروض أسعار'} />
              </View>
              <Text style={styles.fieldLabel}>صف ما تحتاجه بالتفصيل</Text>
              <Input
                placeholder="مثال: تسريب مياه تحت الحوض في المطبخ..."
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.fieldLabel}>أضف صور (اختياري)</Text>
              <PressableScale
                onPress={() => toast.show('إضافة الصور متاحة في النسخة القادمة')}
                activeScale={0.97}
                style={styles.attachTile}
                accessibilityRole="button"
                accessibilityLabel="إضافة صورة أو فيديو"
              >
                <Icon name="plus" size={20} color={palette.accent} />
                <Text style={styles.attachText}>إضافة صورة أو فيديو</Text>
              </PressableScale>
            </Animated.View>
          )}

          {step === 1 && (
            <Animated.View style={fade}>
              <Text style={styles.fieldLabel}>أين تريد الخدمة؟</Text>
              <Card style={styles.locCard}>
                <Icon name="pin" size={20} color={palette.accent} />
                <View style={styles.locText}>
                  <Text style={styles.locTitle}>بنغازي · السلماني</Text>
                  <Text style={styles.locSub}>32.116°N, 20.068°E</Text>
                </View>
                <Badge variant="success" label="GPS" />
              </Card>
              <MapBox h={160} />
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View style={fade}>
              <Text style={styles.fieldLabel}>متى تريد الخدمة؟</Text>
              <View style={styles.chipRow}>
                {['اليوم', 'غداً', 'هذا الأسبوع', 'أي وقت'].map((t) => (
                  <Chip key={t} label={t} active={when === t} onPress={() => setWhen(t)} />
                ))}
              </View>
              <Text style={styles.fieldLabel}>الميزانية المتوقعة (اختياري)</Text>
              <View style={styles.chipRow}>
                {['أقل من 50 د.ل', '50-100 د.ل', '100-200 د.ل', 'أكثر من 200 د.ل'].map((b) => (
                  <Chip key={b} label={b} active={budget === b} onPress={() => setBudget(b)} />
                ))}
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.actions}>
          {step < STEPS.length - 1 ? (
            <Button label="التالي" onPress={() => setStep(step + 1)} />
          ) : (
            <Button
              label={instant ? 'ابدأ المطابقة الفورية' : 'إرسال طلب عروض الأسعار'}
              onPress={submit}
            />
          )}
          {step > 0 && (
            <Button label="رجوع" variant="ghost" onPress={() => setStep(step - 1)} />
          )}
        </View>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  body: { padding: sp.screen, paddingBottom: 48 },
  content: { marginTop: sp.lg },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, alignSelf: 'flex-start' },
  fieldLabel: {
    ...typ.label, color: palette.textHi,
    marginTop: sp.lg, marginBottom: sp.sm, fontWeight: '700',
  },
  attachTile: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: sp.sm,
    height: 52, borderRadius: r.md, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: palette.borderHi, backgroundColor: palette.surfaceHi,
  },
  attachText: { ...typ.bodyS, color: palette.accent },
  locCard: { flexDirection: 'row', alignItems: 'center', gap: sp.md, marginBottom: sp.md },
  locText: { flex: 1, minWidth: 0 },
  locTitle: { ...typ.label, color: palette.textHi, fontWeight: '700' },
  locSub: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  actions: { marginTop: sp.xl, gap: sp.sm },
});
