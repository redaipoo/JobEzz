/**
 * Admin — لوحة الأدمن.
 * تفعيل اشتراكات المزوّدين المعلّقة يدوياً (مع Supabase أو تجريبي محلياً).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import {
  Card, Shell, IconTile, Badge, Button, EmptyState, useToast,
} from '../../ui';
import { isSupabaseConfigured } from '../../lib/supabase';
import { listProviderSubscriptions, adminActivateSubscription } from '../../lib/payments';
import { useAppStore } from '../../store';

const DEMO = [
  { id: 'SUB-DEMO1', provider: 'علي العبيدي', phone: '091-234-5678', plan: 'شهري · 25 د.ل', status: 'pending' },
  { id: 'SUB-DEMO2', provider: 'محمد بن عمر', phone: '092-345-6789', plan: 'شهري · 25 د.ل', status: 'pending' },
];

export function Admin({ navigation }: any) {
  const live = isSupabaseConfigured();
  const setSubscription = useAppStore((s) => s.setSubscription);
  const toast = useToast();
  const [rows, setRows] = useState<any[]>(() => (live ? [] : DEMO));
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (!live) return;
    setBusy(true);
    const subs = await listProviderSubscriptions('*');
    const pending = subs.filter((x) => x.status === 'pending');
    setRows(pending);
    setBusy(false);
  };

  const activate = async (id: string) => {
    setBusy(true);
    const res = await adminActivateSubscription(id);
    setBusy(false);
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      setSubscription('active');
      toast.show(res.message, 'success');
    } else {
      toast.show(res.message, 'error');
    }
  };

  return (
    <Shell title="لوحة الأدمن" navigation={navigation} back>
      <Card contentStyle={styles.headCard}>
        <View style={styles.headRow}>
          <IconTile icon="settings" size={44} />
          <View style={styles.headMid}>
            <Text style={styles.headTitle}>لوحة الأدمن عن بُعد</Text>
            <Text style={styles.headBody}>
              يُفعَّل الاشتراك يدوياً هنا أو عبر admin.html عند الاتصال بالخادم
            </Text>
          </View>
        </View>
        {live && (
          <Button label="تحديث القائمة" variant="ghost" size="sm" loading={busy} onPress={refresh} />
        )}
      </Card>

      <Text style={styles.sectionTitle}>
        اشتراكات بانتظار التفعيل {live ? '' : '(وضع تجريبي محلي)'}
      </Text>

      {rows.length === 0 ? (
        <EmptyState
          icon="checkCircle"
          title="لا توجد اشتراكات معلّقة"
          body="تظهر هنا اشتراكات المزوّدين التي دفعها العملاء وبانتظار تفعيل يدوي"
          actionLabel={live ? 'تحديث القائمة' : undefined}
          onAction={live ? refresh : undefined}
        />
      ) : (
        rows.map((r) => (
          <Card key={r.id} style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.rowMid}>
                <Text style={styles.rowName}>{r.provider}</Text>
                <Text style={styles.rowMeta}>{r.phone}</Text>
                <Text style={styles.rowMeta}>{r.plan}</Text>
                {r.payment_ref ? <Text style={styles.rowRef}>مرجع الدفع: {r.payment_ref}</Text> : null}
              </View>
              <Badge variant="warning" label="معلّق" />
            </View>
            <Button
              label="تفعيل الاشتراك"
              loading={busy}
              onPress={() => activate(r.id)}
              style={styles.activate}
            />
          </Card>
        ))
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  headCard: { gap: sp.base, marginBottom: sp.lg },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  headMid: { flex: 1, minWidth: 0 },
  headTitle: { ...typ.h4, color: palette.textHi },
  headBody: { ...typ.caption, color: palette.textLow, marginTop: 2, lineHeight: 18 },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
  row: { marginBottom: sp.md },
  rowHead: { flexDirection: 'row', gap: sp.base },
  rowMid: { flex: 1, minWidth: 0, gap: 2 },
  rowName: { ...typ.h4, color: palette.textHi },
  rowMeta: { ...typ.caption, color: palette.textMid },
  rowRef: { ...typ.caption, color: palette.gold },
  activate: { marginTop: sp.md },
});
