/**
 * Report — الإبلاغ عن مستخدم أو خدمة.
 * اختيار سبب + تفاصيل اختيارية ثم تأكيد الإرسال عبر Dialog.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, Chip, Input, Button, Dialog, useToast } from '../../ui';

const REASONS = [
  'سعر مبالغ فيه',
  'طلب الدفع خارج المنصة',
  'إعلان مخالف',
  'سلوك غير لائق',
  'معلومات مضللة',
];

export function Report({ navigation }: any) {
  const [sel, setSel] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [confirm, setConfirm] = useState(false);
  const toast = useToast();

  return (
    <Shell title="إبلاغ / شكوى" navigation={navigation} back>
      <Card contentStyle={styles.headCard}>
        <Text style={styles.headTitle}>الإبلاغ</Text>
        <Text style={styles.headBody}>
          سيُراجع فريق الدعم البلاغ خلال 24 ساعة، وتبقى هويتك سرية تماماً.
        </Text>
      </Card>

      <Text style={styles.label}>سبب البلاغ</Text>
      <View style={styles.chips}>
        {REASONS.map((r) => (
          <Chip key={r} label={r} active={sel === r} onPress={() => setSel(r)} />
        ))}
      </View>

      <Input
        label="تفاصيل إضافية (اختياري)"
        placeholder="اكتب أي معلومات تساعدنا في المراجعة..."
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={4}
        containerStyle={styles.input}
      />

      <Button label="إرسال البلاغ" variant="danger" onPress={() => setConfirm(true)} style={styles.submit} />

      <Dialog
        visible={confirm}
        title="تأكيد الإبلاغ"
        body={`سيتم إرسال بلاغك: ${sel}${details.trim() ? ` · ${details.trim()}` : ''}`}
        confirmLabel="إرسال"
        cancelLabel="تراجع"
        variant="danger"
        icon="alert"
        onConfirm={() => {
          setConfirm(false);
          toast.show('تم استلام بلاغك وسنراجعه خلال 24 ساعة', 'success');
          navigation.goBack();
        }}
        onCancel={() => setConfirm(false)}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  headCard: { gap: sp.xs, marginBottom: sp.lg },
  headTitle: { ...typ.h4, color: palette.danger },
  headBody: { ...typ.bodyS, color: palette.textMid },
  label: { ...typ.label, color: palette.textMid, marginBottom: sp.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, marginBottom: sp.lg },
  input: { marginBottom: sp.lg },
  submit: { marginTop: sp.xs },
});
