/**
 * ProviderDashboard — لوحة المزوّد.
 * بوابة الاشتراك + الرصيد والمؤشرات + وصول سريع لبقية الشاشات.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import {
  Card, Shell, Badge, ListItem, KpiRow, Button, useToast,
} from '../../ui';
import { USER } from '../../data';
import { SUBSCRIPTION_PLANS } from '../../lib/payments';
import { useAppStore } from '../../store';

export function ProviderDashboard({ navigation }: any) {
  const user = useAppStore((s) => s.user);
  const sub = useAppStore((s) => s.subscriptionStatus);
  const expires = useAppStore((s) => s.subscriptionExpiresAt);
  const toast = useToast();
  const plan = SUBSCRIPTION_PLANS[0];
  const active = sub === 'active' || sub === 'trial';
  const wallet = user?.wallet ?? USER.wallet;
  const expiresDate = expires ? new Date(expires).toLocaleDateString('ar-LY') : null;

  return (
    <Shell title="لوحة المزوّد" navigation={navigation} back>
      {active ? (
        <Card style={styles.activeCard} contentStyle={styles.activeContent}>
          <Badge variant="success" icon="check" label="اشتراكك نشط" />
          <Text style={styles.activeTitle}>مرحباً {user?.name?.split(' ')[0] ?? 'بك'}</Text>
          <Text style={styles.activeBody}>
            أنت ظاهر الآن في نتائج البحث وتستقبل طلبات العملاء
            {expiresDate ? ` · ينتهي الاشتراك في ${expiresDate}` : ''}
          </Text>
        </Card>
      ) : (
        <Card style={styles.planCard} contentStyle={styles.planContent}>
          <View style={styles.planHead}>
            <View style={styles.planMid}>
              <Text style={styles.planName}>{plan.nameAr}</Text>
              <Text style={styles.planSub}>اشتراك شهري · يفعّله فريق الدعم يدوياً</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price} د.ل</Text>
          </View>
          <View style={styles.perks}>
            {plan.perks.map((p) => (
              <View key={p} style={styles.perk}>
                <Badge variant="gold" icon="check" label="ضمن الباقة" />
                <Text style={styles.perkText}>{p}</Text>
              </View>
            ))}
          </View>
          <Button
            label={`اشترك الآن · ${plan.price} د.ل/شهر`}
            variant="gold"
            size="lg"
            onPress={() => navigation.navigate('Checkout', {
              amount: plan.price, description: 'اشتراك مزوّد موثّق', pid: user?.id ?? USER.id,
            })}
          />
          <Text style={styles.planNote}>بعد الدفع راجع لوحة الأدمن لتفعيل اشتراكك فورياً</Text>
        </Card>
      )}

      <View style={styles.kpiWrap}>
        <KpiRow
          items={[
            { value: `${wallet} د.ل`, label: 'رصيدي', icon: 'wallet', color: palette.gold },
            { value: String(USER.completedJobs), label: 'مهمة منجزة', icon: 'check' },
            { value: USER.avgRating.toFixed(1), label: 'تقييمي', icon: 'starFill', color: palette.warning },
          ]}
        />
      </View>

      <Text style={styles.sectionTitle}>أدواتي</Text>
      <ListItem icon="services" title="الطلبات الواردة" body="طلبات خدمة جديدة من العملاء" onPress={() => navigation.navigate('ProviderIncoming')} />
      <ListItem icon="pin" title="الخدمة النشطة" body="تفاصيل الخدمة الجارية الآن" onPress={() => navigation.navigate('ProviderActive')} />
      <ListItem icon="chat" title="محادثاتي" body="تواصل مع العملاء" onPress={() => navigation.navigate('ChatList')} />
      <ListItem icon="courses" title="لوحة المدرّب" body="دوراتي وإيرادات الأكاديمية" onPress={() => navigation.navigate('InstructorDashboard')} />
      <ListItem icon="star" title="مراجعاتي" body="تقييمات العملاء السابقين" onPress={() => navigation.navigate('Reviews', { type: 'provider', id: user?.id ?? USER.id })} />
      <ListItem
        icon="settings"
        title="دعم الاشتراك"
        body="استعلم عن اشتراكك لدى فريق الدعم"
        onPress={() => toast.show('تواصل مع الدعم عبر الدردشة', 'info')}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  activeCard: { marginBottom: sp.md },
  activeContent: { gap: sp.sm },
  activeTitle: { ...typ.h3, color: palette.textHi },
  activeBody: { ...typ.bodyS, color: palette.textMid, lineHeight: 21 },
  planCard: { marginBottom: sp.md },
  planContent: { gap: sp.base },
  planHead: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  planMid: { flex: 1, minWidth: 0, gap: 2 },
  planName: { ...typ.h3, color: palette.gold },
  planSub: { ...typ.caption, color: palette.textMid },
  planPrice: { ...typ.h2, color: palette.gold },
  perks: { gap: sp.sm },
  perk: { flexDirection: 'row', alignItems: 'center', gap: sp.sm },
  perkText: { ...typ.bodyS, color: palette.text },
  planNote: { ...typ.caption, color: palette.textLow, textAlign: 'center' },
  kpiWrap: { marginBottom: sp.base },
  sectionTitle: { ...typ.h3, color: palette.textHi, marginBottom: sp.md },
});
