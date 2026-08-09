/**
 * Notifs — الإشعارات.
 * طلب إذن الإشعارات + تحميل الإشعارات الحقيقية مع تحديد الكل كمقروء.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Shell, Card, ListItem, Badge, EmptyState, SkeletonList, Button } from '../../ui';
import { NOTIFS } from '../../data';
import { loadNotifications, markNotificationsRead } from '../../lib/queries';
import { getNotificationPermission, requestNotificationPermission } from '../../notifications';
import { useAppStore } from '../../store';

export function Notifs({ navigation }: any) {
  const user = useAppStore((s) => s.user);
  const [rows, setRows] = useState<any[] | null | undefined>(undefined);
  const [perm, setPerm] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    let active = true;
    getNotificationPermission().then((p) => { if (active) setPerm(p); });
    loadNotifications(user?.id ?? 'guest').then((list) => {
      if (active) {
        setRows(list);
        markNotificationsRead(user?.id ?? 'guest');
      }
    });
    return () => { active = false; };
  }, [user?.id]);

  const enable = async () => {
    const granted = await requestNotificationPermission();
    setPerm(granted ? 'granted' : 'denied');
  };

  const list = rows && rows.length > 0 ? rows : NOTIFS;

  return (
    <Shell title="الإشعارات" navigation={navigation} back>
      {perm !== 'granted' && (
        <Card style={styles.banner} contentStyle={styles.bannerRow}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>فعّل الإشعارات</Text>
            <Text style={styles.bannerBody}>يصلك تنبيه فوري لطلبات الخدمة والوظائف الجديدة</Text>
          </View>
          <Button label="تفعيل" size="sm" onPress={enable} />
        </Card>
      )}

      {rows === undefined ? (
        <SkeletonList count={4} kind="row" />
      ) : (
        list.map((n) => (
          <ListItem
            key={n.id}
            icon={n.icon || 'bell'}
            title={n.title}
            body={n.body}
            badge={<Badge variant="neutral" label={n.time} />}
          />
        ))
      )}
      {rows !== undefined && list.length === 0 && (
        <EmptyState icon="bell" title="لا توجد إشعارات" body="ستظهر هنا تنبيهات طلباتك ووظائفك الجديدة" />
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: sp.md },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  bannerText: { flex: 1, gap: 2 },
  bannerTitle: { ...typ.h4, color: palette.textHi },
  bannerBody: { ...typ.caption, color: palette.textMid },
});
