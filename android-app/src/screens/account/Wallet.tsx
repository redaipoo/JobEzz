/**
 * Wallet — balance card, provider subscription state, payment methods and
 * invoices. "شحن المحفظة" flows into the real Checkout route.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  palette, sp, r, typ, sh,
  DepthGradient, AmbientGlow,
} from '../../design';
import {
  Header, Card, Button, Badge, ListItem, IconTile,
  EmptyState, useTabBarClearance,
} from '../../ui';
import { Icon } from '../../icons';
import { useAppStore } from '../../store';
import { SUBSCRIPTION_PLANS } from '../../lib/payments';
import { USER, PAYMENT_METHODS, INVOICES } from '../../data';

function invoiceIcon(method: string): string {
  if (method.includes('بنكي')) return 'bank';
  if (method.includes('بوابة')) return 'card';
  return 'money';
}

export function Wallet({ navigation }: any) {
  const user = useAppStore((s) => s.user) ?? USER;
  const subStatus = useAppStore((s) => s.subscriptionStatus);
  const subExpires = useAppStore((s) => s.subscriptionExpiresAt);
  const isProvider = useAppStore((s) => s.roles).includes('provider');
  const clearance = useTabBarClearance();

  const plan = SUBSCRIPTION_PLANS[0];
  const active = subStatus === 'active' || subStatus === 'trial';

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topRight" color={palette.accent} size={260} opacity={0.07} />

      <Header title="المحفظة" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Balance card ── */}
        <LinearGradient
          colors={palette.gradientHero as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceIcon}>
            <Icon name="wallet" size={22} color={palette.accent} />
          </View>
          <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
          <Text style={styles.balanceValue}>{user.wallet} د.ل</Text>
          <Button
            label="شحن المحفظة"
            onPress={() => navigation.navigate('Checkout', { amount: 50, description: 'شحن محفظة' })}
            style={styles.balanceCta}
          />
        </LinearGradient>

        {/* ── Provider subscription ── */}
        {isProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اشتراك المزوّد</Text>
            <Card style={[styles.block, { borderColor: active ? palette.success : palette.borderAccent }]}>
              <View style={styles.rowBetween}>
                <View style={styles.rowLead}>
                  <IconTile icon="crown" size={40} color={active ? palette.success : palette.gold} />
                  <View style={styles.flex}>
                    <Text style={styles.rowTitle}>{plan.nameAr}</Text>
                    <Text style={styles.rowBody}>
                      {active
                        ? subExpires
                          ? `نشط حتى ${new Date(subExpires).toLocaleDateString('ar')}`
                          : 'نشط'
                        : subStatus === 'pending'
                          ? 'قيد التفعيل بعد تأكيد التحويل'
                          : `${plan.price} د.ل / شهرياً`}
                    </Text>
                  </View>
                </View>
                <Badge
                  label={active ? 'نشط' : subStatus === 'pending' ? 'معلّق' : 'متوقف'}
                  variant={active ? 'success' : subStatus === 'pending' ? 'warning' : 'neutral'}
                />
              </View>
              {!active && (
                <Button
                  label={subStatus === 'pending' ? 'متابعة الاشتراك' : 'اشترك الآن'}
                  variant="gold"
                  onPress={() => navigation.navigate('ProviderDashboard')}
                  style={styles.inlineBtn}
                />
              )}
            </Card>
          </View>
        )}

        {/* ── Payment methods ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طرق الدفع المتاحة</Text>
          {PAYMENT_METHODS.map((m) => (
            <ListItem
              key={m.id}
              icon={m.icon}
              iconColor={m.enabled ? palette.accent : palette.textLow}
              title={m.name}
              body={m.desc}
              badge={
                <Badge
                  label={m.enabled ? 'مفعل' : 'قريباً'}
                  variant={m.enabled ? 'success' : 'neutral'}
                />
              }
            />
          ))}
        </View>

        {/* ── Invoices ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الفواتير / الإيصالات</Text>
          {INVOICES.length === 0 ? (
            <EmptyState icon="receipt" title="لا توجد فواتير بعد" body="ستظهر فواتير الخدمات والدورات هنا." />
          ) : (
            INVOICES.map((inv) => (
              <ListItem
                key={inv.id}
                icon={invoiceIcon(inv.method)}
                iconColor={palette.accent}
                title={inv.type}
                body={`${inv.id} • ${inv.date}`}
                badge={<Text style={styles.amount}>{inv.amount} د.ل</Text>}
                onPress={() => navigation.navigate('Invoice', { id: inv.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  body: { paddingHorizontal: sp.screen, paddingTop: sp.base },
  section: { marginTop: sp.section },
  sectionTitle: { ...typ.label, color: palette.textMid, marginBottom: sp.md },
  block: { marginBottom: sp.base },

  balanceCard: {
    borderRadius: r.xl,
    padding: sp.xl,
    ...sh.lg,
  },
  balanceIcon: {
    width: 44,
    height: 44,
    borderRadius: r.md,
    backgroundColor: palette.accentGlow,
    borderWidth: 1,
    borderColor: palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    ...sh.glowSoft,
  },
  balanceLabel: { ...typ.bodyS, color: palette.textMid, marginTop: sp.lg },
  balanceValue: { ...typ.display, color: palette.textHi, marginTop: sp.xs },
  balanceCta: { marginTop: sp.lg },

  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: sp.md },
  rowLead: { flexDirection: 'row', alignItems: 'center', gap: sp.md, flex: 1 },
  rowTitle: { ...typ.h4, color: palette.textHi },
  rowBody: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  inlineBtn: { marginTop: sp.lg },

  amount: { ...typ.label, color: palette.textHi },
});
