/**
 * Booking — streamlined reservation: summary + description + address +
 * date/time chips + estimate + payment chips → confirm → success screen.
 * `notifyNow` fires on confirm (preserved behavior).
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, categoryColors, typ, sp, r, motion, sh,
  useEntrance, PressableScale, FadeInView, DepthGradient,
} from '../../design';
import {
  Header, Card, Avatar, Verified, Chip, Input, ProviderRow,
  EmptyState, MapBox, Button,
} from '../../ui';
import { Icon } from '../../icons';
import { notifyNow } from '../../notifications';
import { PAYMENT_METHODS } from '../../data';
import { useLiveProviders } from '../../lib/queries';
import { findTechnician, DATES, TIMES } from './shared';

export function Booking({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const live = useLiveProviders();
  const t = findTechnician(route.params?.tid, live);
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(DATES[0]);
  const [time, setTime] = useState(TIMES[1]);
  const [method, setMethod] = useState(PAYMENT_METHODS.find((m) => m.enabled)?.id || 'cash');
  const [done, setDone] = useState(false);
  const fadeDone = useEntrance(0, 20);

  if (!t) {
    return (
      <View style={styles.screen}>
        <DepthGradient variant="screen" />
        <EmptyState
          icon="services"
          title="الخدمة غير متاحة"
          body="ارجع واختر فني آخر"
          actionLabel="العودة"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }
  const color = categoryColors[t.catId] || palette.accent;
  const fee = Math.round(t.priceMin * 0.1);
  const total = t.priceMin + fee;

  const confirm = () => {
    void notifyNow(
      'تم تأكيد حجزك',
      `${t.name} سيصل إليك ${date}${time ? ` الساعة ${time}` : ''}.`,
    );
    setDone(true);
  };

  if (done) {
    return (
      <View style={styles.screen}>
        <DepthGradient variant="screen" />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.doneBody, { paddingTop: insets.top + sp.xxl, paddingBottom: insets.bottom + sp.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={fadeDone}>
            <View style={styles.doneWrap}>
              <View style={styles.doneCircle}>
                <Icon name="check" size={44} color={palette.success} strokeWidth={2.5} />
              </View>
              <Text style={styles.doneTitle}>تم تأكيد الحجز!</Text>
              <Text style={styles.doneSub}>
                سيتواصل {t.name} معك قريباً لتأكيد التفاصيل
              </Text>

              <Card style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>الفني</Text>
                  <Text style={styles.summaryValue}>{t.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>الموعد</Text>
                  <Text style={styles.summaryValue}>{date} · {time}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>الإجمالي التقديري</Text>
                  <Text style={[styles.summaryValue, { color: palette.success }]}>{total} د.ل</Text>
                </View>
              </Card>

              <View style={styles.doneActions}>
                <Button
                  label="العودة للرئيسية"
                  variant="secondary"
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                />
                <PressableScale
                  activeScale={0.96}
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('ChatList')}
                  accessibilityRole="button"
                  accessibilityLabel="مراسلة الفني"
                >
                  <View style={[styles.primaryPill, { backgroundColor: color }]}>
                    <Text style={styles.primaryText}>مراسلة الفني</Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <DepthGradient variant="screen" />
      <Header title="احجز الخدمة" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Technician summary ── */}
        <FadeInView delay={50}>
          <Card style={styles.summaryCard}>
            <ProviderRow
              p={{
                id: t.id, name: t.name, cat: `${t.cat} · ${t.dist} · ${t.eta}`,
                rating: t.rating, reviews: t.reviews, price: t.price,
                dist: undefined, online: t.online, verified: t.verified,
              }}
            />
          </Card>
        </FadeInView>

        {/* ── Description ── */}
        <View style={styles.formBlock}>
          <Input
            label="وصف المشكلة"
            placeholder="مثال: تسريب في ماسورة المطبخ تحت المغسلة..."
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* ── Address ── */}
        <View style={styles.formBlock}>
          <Input
            label="العنوان"
            icon="pin"
            placeholder="اكتب العنوان بالتفصيل"
            value={address}
            onChangeText={setAddress}
          />
          <MapBox h={150} />
        </View>

        {/* ── Date / time chips ── */}
        <View style={styles.formBlock}>
          <Text style={styles.label}>تاريخ الزيارة</Text>
          <View style={styles.chipRow}>
            {DATES.map((d) => (
              <Chip key={d} label={d} active={date === d} onPress={() => setDate(d)} />
            ))}
          </View>
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.label}>الوقت المناسب</Text>
          <View style={styles.chipRow}>
            {TIMES.map((tm) => (
              <Chip key={tm} label={tm} active={time === tm} onPress={() => setTime(tm)} />
            ))}
          </View>
        </View>

        {/* ── Estimate ── */}
        <Card style={styles.formBlock}>
          <View style={styles.estimateHead}>
            <Icon name="receipt" size={16} color={palette.accent} />
            <Text style={styles.estimateTitle}>التكلفة التقديرية</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>سعر الخدمة</Text>
            <Text style={styles.summaryValue}>{t.priceMin} د.ل</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>رسوم المنصة (10%)</Text>
            <Text style={styles.summaryValue}>{fee} د.ل</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>الإجمالي التقديري</Text>
            <Text style={styles.totalValue}>{total} د.ل</Text>
          </View>
        </Card>

        {/* ── Payment method ── */}
        <View style={styles.formBlock}>
          <Text style={styles.label}>طريقة الدفع</Text>
          <View style={styles.chipRow}>
            {PAYMENT_METHODS.filter((m) => m.enabled).map((m) => (
              <Chip
                key={m.id}
                label={m.name}
                icon={m.icon}
                active={method === m.id}
                onPress={() => setMethod(m.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Confirm bar ── */}
      <View style={[styles.confirmBar, { paddingBottom: Math.max(insets.bottom, sp.base) }]}>
        <PressableScale
          activeScale={0.97}
          onPress={confirm}
          accessibilityRole="button"
          accessibilityLabel={`تأكيد الحجز بمبلغ ${total} د.ل`}
        >
          <View style={[styles.confirmBtn, { backgroundColor: color }]}>
            <Text style={styles.confirmText}>تأكيد الحجز · {total} د.ل</Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
  body: { padding: sp.screen },
  formBlock: { marginBottom: sp.lg },

  label: { ...typ.label, color: palette.textMid, marginBottom: sp.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },

  summaryCard: { marginBottom: sp.lg, ...sh.sm },
  estimateHead: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm },
  estimateTitle: { ...typ.label, color: palette.textHi },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: sp.xs, gap: sp.md,
  },
  summaryLabel: { ...typ.bodyS, color: palette.textMid },
  summaryValue: { ...typ.bodyS, color: palette.text, flexShrink: 1 },
  summaryTotal: { ...typ.label, color: palette.textHi },
  totalValue: { ...typ.h3, color: palette.success, fontSize: 16 },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: sp.sm },

  confirmBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingTop: sp.md, paddingHorizontal: sp.screen,
    backgroundColor: palette.bg2, borderTopWidth: 1, borderTopColor: palette.border,
  },
  confirmBtn: {
    height: 56, borderRadius: r.lg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  confirmText: { ...typ.button, color: palette.bg0, fontWeight: '800' },

  doneBody: { paddingHorizontal: sp.xxl },
  doneWrap: { alignItems: 'center' },
  doneCircle: {
    width: 92, height: 92, borderRadius: r.pill,
    backgroundColor: palette.successBg, alignItems: 'center', justifyContent: 'center',
    ...sh.glowSoft,
  },
  doneTitle: { ...typ.h1, color: palette.textHi, marginTop: sp.xl, textAlign: 'center' },
  doneSub: { ...typ.body, color: palette.textMid, marginTop: sp.sm, textAlign: 'center' },
  summaryCardDone: { width: '100%', marginTop: sp.xl },
  doneActions: { flexDirection: 'row', gap: sp.md, marginTop: sp.xxl, alignSelf: 'stretch' },
  actionBtn: { flex: 1 },
  primaryPill: {
    height: 50, borderRadius: r.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  primaryText: { ...typ.button, color: palette.bg0, fontWeight: '800' },
});
