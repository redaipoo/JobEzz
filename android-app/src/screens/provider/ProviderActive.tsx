/**
 * ProviderActive — الخدمة الجارية.
 * خريطة الوصول + بيانات العميل + الأجر المتفق عليه + إنهاء الخدمة.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, Avatar, Badge, MapBox, Button, Dialog, useToast } from '../../ui';

export function ProviderActive({ navigation }: any) {
  const [done, setDone] = useState(false);
  const toast = useToast();

  return (
    <Shell title="خدمة نشطة" navigation={navigation} back>
      <MapBox h={200} />
      <Card style={styles.card} contentStyle={styles.customer}>
        <Avatar name="ياسين" size={48} />
        <View style={styles.customerMid}>
          <Text style={styles.customerName}>ياسين المنفي</Text>
          <Text style={styles.customerSub}>بنغازي · السلماني · اتصال 091-234-5678</Text>
        </View>
        <Button label="محادثة" variant="ghost" size="sm" onPress={() => navigation.navigate('Chat', { id: 'm1' })} />
      </Card>
      <Card style={styles.card} contentStyle={styles.work}>
        <View style={styles.workHead}>
          <Text style={styles.workTitle}>تفاصيل الخدمة</Text>
          <Badge variant="accent" icon="clock" label="قيد التنفيذ" />
        </View>
        <Text style={styles.workBody}>
          إصلاح تسريب تحت حوض المطبخ وتغيير وصلة مياه تالفة، تأكيد الوصول خلال 8 دقائق.
        </Text>
        <View style={styles.divider} />
        <View style={styles.payRow}>
          <Text style={styles.payLabel}>الأجر المتفق عليه</Text>
          <Text style={styles.payValue}>60 د.ل</Text>
        </View>
      </Card>

      <Button label="تم الإنجاز" size="lg" style={styles.finish} onPress={() => setDone(true)} />

      <Dialog
        visible={done}
        title="إنهاء الخدمة"
        body="تأكد من استلام العميل للخدمة قبل تأكيد الإنجاز، ثم قيّم تجربتك."
        confirmLabel="تأكيد الإنجاز"
        cancelLabel="تراجع"
        icon="checkCircle"
        onConfirm={() => {
          setDone(false);
          toast.show('تم الإنجاز · شكراً لعملك الاحترافي', 'success');
          navigation.navigate('ServiceRate', { pid: 'p1' });
        }}
        onCancel={() => setDone(false)}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: sp.md },
  customer: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  customerMid: { flex: 1, minWidth: 0 },
  customerName: { ...typ.h4, color: palette.textHi },
  customerSub: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  work: { gap: sp.base },
  workHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  workTitle: { ...typ.h4, color: palette.textHi },
  workBody: { ...typ.bodyS, color: palette.textMid, lineHeight: 22 },
  divider: { height: 1, backgroundColor: palette.divider },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payLabel: { ...typ.body, color: palette.textMid },
  payValue: { ...typ.h3, color: palette.gold },
  finish: { marginTop: sp.lg },
});
