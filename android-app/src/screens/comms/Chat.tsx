/**
 * Chat — محادثة مباشرة.
 * رسائل حية عبر subscribeToMessages عند توفر Supabase، ورسائل محلية بخلاف ذلك.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { palette, sp, typ, PressableScale } from '../../design';
import { Shell, Avatar, Verified, Input, useToast } from '../../ui';
import { CHATS } from '../../data';
import { loadMessages, sendMessage, subscribeToMessages } from '../../lib/queries';
import { useAppStore } from '../../store';

const FIXTURE: Record<string, any[]> = {
  m1: [
    { id: 'f1', sender: 'other', body: 'مرحباً، وصلت للتو إلى المنطقة', at: '10:12' },
    { id: 'f2', sender: 'other', body: 'سأكون عندك خلال 8 دقائق', at: '10:12' },
  ],
  m2: [
    { id: 'f3', sender: 'other', body: 'مرحباً، تلقينا طلبك وشكراً لاهتمامك', at: '09:40' },
    { id: 'f4', sender: 'other', body: 'سنراجع سيرتك ونرد خلال يوم عمل', at: '09:41' },
  ],
  m3: [
    { id: 'f5', sender: 'other', body: 'أهلاً بك في دورة السباكة المعتمدة', at: 'أمس' },
    { id: 'f6', sender: 'other', body: 'تم رفع الدرس الثالث، بالتوفيق', at: 'أمس' },
  ],
};

export function Chat({ navigation, route }: any) {
  const chat = CHATS.find((c) => c.id === route.params?.id) || CHATS[0];
  const user = useAppStore((s) => s.user);
  const toast = useToast();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);
  const me = user?.name ?? 'أنت';

  useEffect(() => {
    let active = true;
    loadMessages(chat.id).then((rows) => {
      if (!active) return;
      setMsgs(rows && rows.length > 0 ? rows : FIXTURE[chat.id] ?? []);
    });
    const off = subscribeToMessages(chat.id, (payload: any) => {
      const row = payload?.new;
      if (row?.body) setMsgs((prev) => [...prev, { id: row.id, sender: 'other', body: row.body, at: 'الآن' }]);
    });
    return () => { active = false; off(); };
  }, [chat.id]);

  const send = async () => {
    const body = draft.trim();
    if (!body) return;
    setDraft('');
    setMsgs((prev) => [...prev, { id: `l${Date.now()}`, sender: 'me', body, at: 'الآن' }]);
    const res = await sendMessage(chat.id, 'me', body);
    if (!res.ok && res.message !== 'وضع محلي') toast.show(res.message, 'error');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Shell
        title={chat.name}
        navigation={navigation}
        back
        right={<Verified size={16} />}
        scroll={false}
      >
        <ScrollView
          ref={scroll}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        >
          {msgs.map((m) => {
            const mine = m.sender === 'me';
            return (
              <View key={m.id} style={[styles.bubbleWrap, mine ? styles.mine : styles.theirs]}>
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{m.body}</Text>
                  <Text style={[styles.at, mine ? styles.atMine : styles.atTheirs]}>{m.at}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composer}>
          <Input
            value={draft}
            onChangeText={setDraft}
            placeholder="اكتب رسالتك..."
            containerStyle={styles.inputWrap}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <PressableScale onPress={send} activeScale={0.9} style={styles.send} accessibilityRole="button" accessibilityLabel="إرسال">
            <Text style={styles.sendText}>إرسال</Text>
          </PressableScale>
        </View>
      </Shell>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  messages: { paddingHorizontal: sp.screen, paddingVertical: sp.md, gap: sp.sm },
  bubbleWrap: { flexDirection: 'row' },
  mine: { justifyContent: 'flex-end' },
  theirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: sp.md,
    paddingVertical: sp.sm,
  },
  bubbleMine: { backgroundColor: palette.accent600, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: palette.bg3, borderWidth: 1, borderColor: palette.border, borderBottomLeftRadius: 4 },
  bubbleText: { ...typ.bodyS, color: palette.text, lineHeight: 20 },
  bubbleTextMine: { color: '#FFFFFF' },
  at: { ...typ.caption, marginTop: 2, alignSelf: 'flex-end' },
  atMine: { color: 'rgba(255,255,255,0.7)' },
  atTheirs: { color: palette.textLow },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.sm,
    paddingHorizontal: sp.screen,
    paddingTop: sp.sm,
    paddingBottom: sp.base,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
    backgroundColor: palette.bg1,
  },
  inputWrap: { flex: 1 },
  send: {
    height: 44,
    paddingHorizontal: sp.base,
    borderRadius: 12,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { ...typ.label, color: '#FFFFFF' },
});
