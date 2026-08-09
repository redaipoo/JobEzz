/**
 * Invoice — الفاتورة والإيصال.
 * عرض تفاصيل الدفع مع خصم عمولة المنصة وحساب الصافي.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, Badge, StatRow, Button, useToast } from '../../ui';
import { INVOICES, PLATFORM_SETTINGS } from '../../data';

export function Invoice({ navigation, route }: any) {
  const found = INVOICES.find((x) => x.id === route.params?.id);
  const inv = found || {
    id: 'INV-NEW',
    type: route.params?.type || 'خدمة',
    amount: Number(route.params?.amount) || 60,
    date: '2026/08/08',
    method: 'نقدي',
    pct: PLATFORM_SETTINGS.commission,
  };
  const pct = inv.pct != null ? inv.pct : PLATFORM_SETTINGS.commission;
  const fee = Math.round((inv.amount * pct) / 100);
  const net = inv.amount - fee;
  const toast = useToast();
  const isService = String(inv.type).includes('خدمة') || String(inv.type).includes('اشتراك');

  return (
    <Shell title="الإيصال / الفاتورة" navigation={navigation} back>
      <Card contentStyle={styles.card}>
        <View style={styles.head}>
          <Text style={styles.brand}>JobEzz</Text>
          <Badge variant="success" icon="check" label="مدفوعة" />
        </View>
        <View style={styles.divider} />
        <StatRow icon="doc" label="رقم الإيصال" value={inv.id} />
        <StatRow icon="calendar" label="التاريخ" value={inv.date} />
        <StatRow icon="services" label="البيان" value={inv.type} />
        <StatRow icon="money" label="وسيلة الدفع" value={inv.method} />
        <View style={styles.divider} />
        <StatRow icon="wallet" label="المبلغ" value={`${inv.amount} د.ل`} color={palette.textHi} />
        <StatRow icon="settings" label={`عمولة المنصة (${pct}%)`} value={`- ${fee} د.ل`} color={palette.danger} />
        <View style={styles.divider} />
        <View style={styles.netRow}>
          <Text style={styles.netLabel}>صافي المستلم</Text>
          <Text style={styles.netValue}>{net} د.ل</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label="تنزيل PDF" onPress={() => toast.show('يتوفر تنزيل الإيصال PDF في نسخة قادمة', 'info')} />
        <Button
          label={isService ? 'متابعة الخدمة' : 'العودة للدورات'}
          variant="ghost"
          onPress={() => {
            if (isService) navigation.navigate('ServiceRate', { pid: route.params?.pid || 'p1' });
            else navigation.navigate('Courses');
          }}
        />
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  card: { gap: 0 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { ...typ.h3, color: palette.textHi },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: sp.md },
  netRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  netLabel: { ...typ.h4, color: palette.textHi },
  netValue: { ...typ.h2, color: palette.gold },
  actions: { gap: sp.md, marginTop: sp.lg },
});
