/**
 * Onboarding — 4-slide product intro. Arabic-first, RTL, full-bleed depth
 * background, brand wordmark, slide-specific accent, swipeable pager dots.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette, sp, r, typ, FadeInView, StaggerItem, PressableScale,
  DepthGradient, AmbientGlow,
} from '../../design';
import { Button, Chip } from '../../ui';
import { Icon } from '../../icons';

interface Slide {
  icon: string;
  title: string;
  body: string;
  color: string;
  features: string[];
}

const SLIDES: Slide[] = [
  {
    icon: 'jobs',
    title: 'وظائف',
    body: 'ابحث وتقدّم على أحدث الوظائف في ليبيا، أو انشر فرصتك كصاحب عمل.',
    color: palette.accent,
    features: ['آلاف الوظائف النشطة', 'مطابقة ذكية', 'تقديم فوري'],
  },
  {
    icon: 'services',
    title: 'خدمات عند الطلب',
    body: 'اطلب فنياً موثّقاً؛ سباك، كهربائي، نقّال أثاث، ويصلك فوراً.',
    color: palette.success,
    features: ['مطابقة فورية', 'فنيون موثّقون', 'تتبّع مباشر'],
  },
  {
    icon: 'courses',
    title: 'أكاديمية JobEzz',
    body: 'تعلّم مهارات جديدة واحصل على شهادات معتمدة ترفع موثوقيتك.',
    color: palette.warning,
    features: ['دورات عملية', 'شهادات معتمدة', 'نقاط وإنجازات'],
  },
  {
    icon: 'wallet',
    title: 'اربح واستثمر',
    body: 'ادخل أرباحك من العمل الحر أو بيع دوراتك؛ كل شيء في محفظتك.',
    color: palette.gold,
    features: ['محفظة رقمية', 'تحويلات سريعة', 'تقارير مالية'],
  },
];

export function Onboarding({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topLeft" color={slide.color} size={380} opacity={0.14} />

      {/* header */}
      <View style={[styles.head, { paddingTop: insets.top + sp.md }]}>
        <Text style={styles.wordmark}>JobEzz</Text>
        <PressableScale
          onPress={() => navigation.navigate('MainTabs')}
          activeScale={0.92}
          style={styles.skip}
          accessibilityLabel="تخطي المقدمة"
        >
          <Text style={styles.skipText}>تخطي</Text>
        </PressableScale>
      </View>

      {/* slide */}
      <View style={styles.center}>
        <FadeInView key={index} duration={400}>
          <View style={[styles.iconOuter, { borderColor: slide.color + '22' }]}>
            <View style={[styles.iconInner, { backgroundColor: slide.color + '14' }]}>
              <Icon name={slide.icon} size={62} color={slide.color} strokeWidth={1.6} />
            </View>
          </View>

          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>

          <View style={styles.features}>
            {slide.features.map((f) => (
              <Chip key={f} label={f} style={{ marginRight: 6 }} />
            ))}
          </View>
        </FadeInView>

        {/* pager dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index && { ...styles.dotActive, backgroundColor: slide.color },
              ]}
            />
          ))}
        </View>
      </View>

      {/* actions */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + sp.lg }]}>
        <Button
          label={last ? 'دخول المنصة' : 'التالي'}
          onPress={last ? () => navigation.navigate('MainTabs') : () => setIndex(index + 1)}
          size="lg"
          style={styles.primary}
        />
        <View style={styles.secondaryRow}>
          {index > 0 ? (
            <PressableScale onPress={() => setIndex(index - 1)} activeScale={0.9} style={styles.ghost} accessibilityLabel="السابق">
              <Icon name="back" size={13} color={palette.textMid} />
              <Text style={styles.ghostText}>السابق</Text>
            </PressableScale>
          ) : <View style={styles.ghost} />}
          <PressableScale onPress={() => navigation.navigate('RoleSelect')} activeScale={0.9} style={styles.ghost} accessibilityLabel="إعداد الحساب">
            <Text style={styles.ghostText}>إعداد الحساب</Text>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp.screen,
  },
  wordmark: { ...typ.h2, color: palette.textHi, letterSpacing: 1 },
  skip: {
    paddingHorizontal: sp.base,
    paddingVertical: sp.sm,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skipText: { ...typ.caption, color: palette.textMid, fontWeight: '800' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: sp.screen },
  iconOuter: {
    width: 128,
    height: 128,
    borderRadius: r.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bg3,
    marginBottom: sp.xl,
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: r.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typ.display, color: palette.textHi, textAlign: 'center' },
  body: { ...typ.body, color: palette.textMid, textAlign: 'center', marginTop: sp.base, lineHeight: 24 },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: sp.lg,
    gap: 6,
  },

  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: sp.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.surfaceTop,
  },
  dotActive: { width: 22, height: 6, borderRadius: 3 },

  actions: { paddingHorizontal: sp.screen, paddingTop: sp.lg },
  primary: { marginBottom: sp.md },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 40 },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: sp.sm,
    paddingVertical: sp.sm,
  },
  ghostText: { ...typ.label, color: palette.textMid },
});
