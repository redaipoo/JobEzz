/**
 * Checkout — إتمام الدفع.
 * اختيار وسيلة الدفع من PAYMENT_METHODS ثم التوجه إلى الفاتورة.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, PressableScale } from '../../design';
import { Card, Shell, IconTile, Badge, Button } from '../../ui';
import { PAYMENT_METHODS, PLATFORM_SETTINGS } from '../../data';

export function Checkout({ navigation, route }: any) {
  const amount = Number(route.params?.amount) || 60;
  const description = route.params?.description || 'خدمة';
  const pid = route.params?.pid;
  const methods = PAYMENT_METHODS.filter((m) => m.enabled);
  const [sel, setSel] = useState(methods[0]?.id);

  const pay = () => navigation.navigate('Invoice', { id: 'NEW', amount, type: description, pid });

  return (
    <Shell title="الدفع" navigation={navigation} back>
      <Card contentStyle={styles.amountCard}>
        <Text style={styles.amountLabel}>المبلغ المطلوب</Text>
        <Text style={styles.amount}>{amount} د.ل</Text>
        <Text style={styles.amountNote}>{description}</Text>
        <Text style={styles.amountNote}>
          عمولة المنصة ({PLATFORM_SETTINGS.commission}%) تُخصم من المستلم
        </Text>
      </Card>

      <Text style={styles.label}>وسيلة الدفع</Text>
      {methods.map((m) => {
        const active = sel === m.id;
        return (
          <PressableScale
            key={m.id}
            onPress={() => setSel(m.id)}
            activeScale={0.98}
            style={[styles.method, active && styles.methodActive]}
          >
            <IconTile icon={m.icon} size={40} />
            <View style={styles.methodMid}>
              <Text style={styles.methodName}>{m.name}</Text>
              <Text style={styles.methodDesc}>{m.desc}</Text>
            </View>
            {active ? <Badge variant="success" icon="check" label="محدد" /> : null}
          </PressableScale>
        );
      })}

      <Button label="الدفع الآن" size="lg" onPress={pay} style={styles.pay} />
    </Shell>
  );
}

const styles = StyleSheet.create({
  amountCard: { alignItems: 'center', gap: sp.xs, marginBottom: sp.lg },
  amountLabel: { ...typ.caption, color: palette.textLow },
  amount: { ...typ.display, color: palette.textHi },
  amountNote: { ...typ.bodyS, color: palette.textMid, textAlign: 'center' },
  label: { ...typ.label, color: palette.textMid, marginBottom: sp.sm },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.base,
    backgroundColor: palette.bg3,
    borderRadius: 16,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: sp.sm,
  },
  methodActive: { borderColor: palette.borderAccent, backgroundColor: palette.accentSoft },
  methodMid: { flex: 1, minWidth: 0 },
  methodName: { ...typ.h4, color: palette.textHi },
  methodDesc: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  pay: { marginTop: sp.md },
});
