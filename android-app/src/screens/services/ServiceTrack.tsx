/**
 * ServiceTrack — live order tracking with a 5-stage status stepper
 * (تم قبول الطلب → في الطريق إليك → وصل إلى موقعك → جارٍ العمل → اكتملت الخدمة)
 * and a pay-now CTA when complete.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette, typ, sp, r, useEntrance } from '../../design';
import { Shell, Card, ProviderRow, MapBox, Button } from '../../ui';
import { Icon } from '../../icons';
import { PROVIDERS } from '../../data';

const STATUSES = ['تم قبول الطلب', 'في الطريق إليك', 'وصل إلى موقعك', 'جارٍ العمل', 'اكتملت الخدمة'];
const UPDATE_LABELS = ['', 'تحديث: وصل المزوّد', 'تحديث: بدء العمل', 'إنهاء الخدمة والدفع'];

export function ServiceTrack({ navigation, route }: any) {
  const p = PROVIDERS.find((x) => x.id === route.params?.pid) || PROVIDERS[0];
  const [step, setStep] = useState<number>(Number(route.params?.step) || 1);
  const fade = useEntrance(0, 14);
  const rateMatch = /(\d+)/.exec(p.price || '');
  const fee = rateMatch ? parseInt(rateMatch[1], 10) : 60;

  return (
    <Shell title="تتبّع المزوّد" navigation={navigation} back>
      <View style={styles.body}>
        <MapBox h={200} />
        <View style={styles.gapBlock}>
          <Card>
            <ProviderRow p={p} />
            <View style={styles.actionsRow}>
              <Button
                label="محادثة"
                variant="secondary"
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Chat', { id: 'm1' })}
              />
              <Button
                label="التقييمات"
                variant="ghost"
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Reviews', { type: 'provider', id: p.id })}
              />
            </View>
          </Card>
        </View>

        <Animated.View style={fade}>
          <Text style={styles.sectionTitle}>حالة الطلب</Text>
          <Card>
            {STATUSES.map((lab, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <View key={lab} style={styles.stepRow}>
                  <View style={[styles.stepDot, done && styles.stepDone, active && styles.stepActive]}>
                    {done ? (
                      <Icon name="check" size={13} color="#fff" />
                    ) : (
                      <View style={[styles.stepBullet, active && styles.stepBulletActive]} />
                    )}
                  </View>
                  <Text style={[styles.stepText, active && styles.stepTextActive]}>{lab}</Text>
                </View>
              );
            })}
          </Card>
        </Animated.View>

        <View style={styles.gapBlock}>
          {step < 4 ? (
            <Button label={UPDATE_LABELS[step]} onPress={() => setStep((s) => s + 1)} />
          ) : (
            <Button
              label="ادفع الآن"
              onPress={() => navigation.navigate('Checkout', { amount: fee, description: 'خدمة', pid: p.id })}
            />
          )}
        </View>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  body: { padding: sp.screen },
  gapBlock: { marginTop: sp.md },
  actionsRow: { flexDirection: 'row', gap: sp.sm, marginTop: sp.md },
  actionBtn: { flex: 1 },
  sectionTitle: {
    ...typ.label, color: palette.textHi,
    marginTop: sp.lg, marginBottom: sp.sm, fontSize: 17, fontWeight: '700',
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: sp.md, paddingVertical: sp.sm },
  stepDot: {
    width: 26, height: 26, borderRadius: r.pill,
    backgroundColor: palette.surfaceHi, borderWidth: 2, borderColor: palette.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDone: { backgroundColor: palette.success, borderColor: palette.success },
  stepActive: { borderColor: palette.accent },
  stepBullet: { width: 10, height: 10, borderRadius: r.pill, backgroundColor: palette.borderHi },
  stepBulletActive: { backgroundColor: palette.accent },
  stepText: { ...typ.bodyS, color: palette.textMid },
  stepTextActive: { ...typ.bodyS, color: palette.textHi, fontWeight: '700' },
});
