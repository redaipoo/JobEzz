/**
 * ServiceMatch — simulated matchmaking: loading sweep, then either an
 * instant-match card (mode === 'instant') or up to 3 price quotes.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette, typ, sp, useEntrance } from '../../design';
import { Shell, Card, Badge, ProviderRow, MapBox, Button } from '../../ui';
import { Icon } from '../../icons';
import { CATEGORIES, PROVIDERS } from '../../data';

export function ServiceMatch({ navigation, route }: any) {
  const c = CATEGORIES.find((x) => x.id === route.params?.cat) || CATEGORIES[0];
  const [loading, setLoading] = useState(true);
  const fade = useEntrance(0, 14);

  useEffect(() => {
    if (loading) {
      const tm = setTimeout(() => setLoading(false), 1300);
      return () => clearTimeout(tm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Shell title="مطابقة" navigation={navigation} back>
        <ActivityIndicator size="large" color={palette.accent} style={styles.spinner} />
        <Text style={styles.loadingText}>جاري البحث عن أقرب فني موثّق...</Text>
      </Shell>
    );
  }

  if (c.mode === 'instant') {
    const p = PROVIDERS.find((x) => x.cat === c.name && x.online) || PROVIDERS.find((x) => x.online)!;
    return (
      <Shell title="مطابقة فورية" navigation={navigation} back>
        <View style={styles.body}>
          <View style={styles.modeRow}>
            <Icon name="bolt" size={14} color={palette.success} />
            <Badge variant="success" label="تم العثور على أقرب فني موثّق" />
          </View>
          <View style={styles.gapBlock}>
            <Card><ProviderRow p={p} /></Card>
          </View>
          <MapBox h={150} />
          <View style={styles.gapBlock}>
            <Button
              label="تأكيد الطلب وتتبّع المزوّد"
              onPress={() => navigation.navigate('ServiceTrack', { pid: p.id, step: 1 })}
            />
          </View>
        </View>
      </Shell>
    );
  }

  const list = PROVIDERS.filter((x) => x.cat === c.name).slice(0, 3);
  return (
    <Shell title="عروض الأسعار" navigation={navigation} back>
      <View style={styles.body}>
        <View style={styles.modeRow}>
          <Icon name="doc" size={14} color={palette.accent} />
          <Badge variant="accent" label={`وصلتك ${list.length} عروض · اختر الأنسب`} />
        </View>
        <Animated.View style={fade}>
          {list.map((p, i) => (
            <View key={p.id} style={[styles.offerCard, i > 0 && styles.offerGap]}>
              <Card>
                <ProviderRow p={p} />
                <View style={styles.offerAction}>
                  <Button
                    label="اختيار هذا العرض"
                    variant="primary"
                    onPress={() => navigation.navigate('ServiceTrack', { pid: p.id, step: 1 })}
                  />
                </View>
              </Card>
            </View>
          ))}
        </Animated.View>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  body: { padding: sp.screen },
  spinner: { marginTop: 60 },
  loadingText: { ...typ.body, color: palette.textMid, textAlign: 'center', marginTop: sp.md },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: sp.sm, alignSelf: 'flex-start' },
  gapBlock: { marginTop: sp.md },
  offerCard: {},
  offerGap: { marginTop: sp.md },
  offerAction: { marginTop: sp.md },
});
