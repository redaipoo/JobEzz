/**
 * ProviderIncoming — طلب خدمة وارد مع عدّاد قبول تنازلي.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Card, Shell, IconTile, Badge, Tag, MapBox, Button, useToast } from '../../ui';
import { TECHNICIANS } from '../../data';

export function ProviderIncoming({ navigation }: any) {
  const t = TECHNICIANS[0];
  const toast = useToast();
  const [left, setLeft] = useState(38);

  useEffect(() => {
    const timer = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <Shell title="طلب وارد" navigation={navigation} back>
      <Card contentStyle={styles.card}>
        <View style={styles.head}>
          <IconTile icon={t.icon} size={48} />
          <View style={styles.headMid}>
            <Text style={styles.headTitle}>طلب سباكة عاجل</Text>
            <Text style={styles.headSub}>يحتاج العميل إلى حضور خلال {t.eta}</Text>
          </View>
          <Badge variant="warning" icon="clock" label={`${mm}:${ss}`} />
        </View>
        <Text style={styles.desc}>
          تسريب تحت حوض المطبخ مع تلف في وصلة المياه، الحي: {t.city}، يفضل الحضور قبل نهاية العداد.
        </Text>
        <View style={styles.tags}>
          <Tag icon="pin">{t.dist} من موقعك</Tag>
          <Tag icon="money">{t.priceMin} د.ل/ساعة</Tag>
        </View>
        <MapBox h={150} />
      </Card>

      <View style={styles.actions}>
        <Button label="قبول الطلب" size="lg" onPress={() => navigation.navigate('ProviderActive')} />
        <Button label="رفض" variant="ghost" onPress={() => {
          toast.show('تم رفض الطلب وسيُعرض على مزوّد آخر', 'info');
          navigation.goBack();
        }} />
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  card: { gap: sp.base },
  head: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  headMid: { flex: 1, minWidth: 0, gap: 2 },
  headTitle: { ...typ.h4, color: palette.textHi },
  headSub: { ...typ.caption, color: palette.textLow },
  desc: { ...typ.bodyS, color: palette.textMid, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm },
  actions: { marginTop: sp.lg, gap: sp.md },
});
