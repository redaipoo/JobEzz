/**
 * ServiceRate — post-service rating: stars + optional comment → toast + home.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette, typ, sp, useEntrance } from '../../design';
import { Shell, Card, Avatar, Verified, RateStars, Input, Button, useToast } from '../../ui';
import { PROVIDERS } from '../../data';

export function ServiceRate({ navigation, route }: any) {
  const toast = useToast();
  const p = PROVIDERS.find((x) => x.id === route.params?.pid) || PROVIDERS[0];
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const fade = useEntrance(0, 14);

  const submit = () => {
    toast.show(stars >= 4 ? 'شكراً لتقييمك!' : 'تم إرسال تقييمك');
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <Shell title="قيّم التجربة" navigation={navigation} back>
      <View style={styles.body}>
        <Animated.View style={fade}>
          <Card style={styles.card}>
            <Avatar name={p.name} size={64} />
            <View style={styles.nameRow}>
              <Text style={styles.name}>{p.name}</Text>
              {p.verified ? <Verified /> : null}
            </View>
            <Text style={styles.prompt}>كيف كانت تجربتك مع {p.name}؟</Text>
            <View style={styles.starsWrap}>
              <RateStars value={stars} onChange={setStars} size={36} />
            </View>
            <Input
              placeholder="أخبر الآخرين عن تجربتك (اختياري)"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />
            <View style={styles.submitWrap}>
              <Button label="إرسال التقييم" onPress={submit} />
            </View>
          </Card>
        </Animated.View>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  body: { padding: sp.screen },
  card: { alignItems: 'center', padding: sp.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs, marginTop: sp.sm },
  name: { ...typ.h2, color: palette.textHi },
  prompt: { ...typ.bodyS, color: palette.textMid, marginTop: sp.sm, textAlign: 'center' },
  starsWrap: { marginTop: sp.lg },
  submitWrap: { marginTop: sp.lg, alignSelf: 'stretch' },
});
