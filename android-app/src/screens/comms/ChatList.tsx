/**
 * ChatList — قائمة المحادثات.
 * بيانات حقيقية من CHATS مع حالة التواجد وإشعار قراءة محلي.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, PressableScale } from '../../design';
import { Card, Shell, Avatar, Verified, Badge, PulseDot, EmptyState, SearchField } from '../../ui';
import { CHATS } from '../../data';

export function ChatList({ navigation }: any) {
  const [q, setQ] = useState('');
  const [read, setRead] = useState<Record<string, boolean>>({});
  const list = CHATS.filter((c) => {
    const s = q.trim().toLowerCase();
    return !s || [c.name, c.role, c.last].some((v) => v.toLowerCase().includes(s));
  });

  const open = (id: string) => {
    setRead((prev) => ({ ...prev, [id]: true }));
    navigation.navigate('Chat', { id });
  };

  return (
    <Shell title="المحادثات" navigation={navigation} back>
      <SearchField value={q} onChangeText={setQ} placeholder="ابحث في المحادثات..." style={styles.search} />
      {list.length === 0 ? (
        <EmptyState icon="chat" title="لا توجد محادثات" body="جرّب كلمة بحث أخرى أو ابدأ محادثة جديدة من صفحة الخدمة" />
      ) : (
        list.map((c) => {
          const unread = !read[c.id];
          return (
            <PressableScale key={c.id} onPress={() => open(c.id)} activeScale={0.98} style={styles.row}>
              <View style={styles.avatarWrap}>
                <Avatar name={c.name} size={48} />
                {c.online && <PulseDot color={palette.success} size={9} style={styles.dot} />}
              </View>
              <View style={styles.mid}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{c.name}</Text>
                  {c.verified && <Verified size={13} />}
                </View>
                <Text style={styles.role} numberOfLines={1}>{c.role}</Text>
                <Text style={styles.last} numberOfLines={1}>{c.last}</Text>
              </View>
              <View style={styles.side}>
                <Text style={styles.time}>{c.time}</Text>
                {unread ? <Badge variant="solid" label="جديد" /> : null}
              </View>
            </PressableScale>
          );
        })
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  search: { marginBottom: sp.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.base,
    backgroundColor: palette.bg3,
    borderRadius: 16,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: sp.sm,
  },
  avatarWrap: { position: 'relative' },
  dot: { position: 'absolute', bottom: 2, right: 2, borderWidth: 2, borderColor: palette.bg3 },
  mid: { flex: 1, minWidth: 0, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  name: { ...typ.h4, color: palette.textHi },
  role: { ...typ.caption, color: palette.textLow },
  last: { ...typ.bodyS, color: palette.textMid },
  side: { alignItems: 'flex-end', gap: sp.sm },
  time: { ...typ.caption, color: palette.textLow },
});
