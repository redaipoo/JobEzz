/**
 * EmployerApplicants — قائمة المتقدمين لوظيفة صاحب العمل.
 * صفوف ListItem مع تقييم النجوم + Badge حالة، وإجراءات
 * (قائمة مختصرة / قبول / رفض) تعدّل الحالة محلياً مع Toast.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, StaggerItem } from '../../../design';
import { Shell, Card, ListItem, Badge, Button, EmptyState, Stars } from '../../../ui';
import type { BadgeVariant } from '../../../ui';
import { useToast } from '../../../ui';
import { APPLICANTS, APPLICATION_STATUS, MY_POSTINGS } from '../../../data';
import type { Applicant, ApplicationStatus } from '../../../types';

const STATUS_VARIANT: Record<ApplicationStatus, BadgeVariant> = {
  applied: 'neutral',
  review: 'warning',
  shortlisted: 'accent',
  rejected: 'danger',
  accepted: 'success',
};

export function EmployerApplicants({ navigation, route }: any) {
  const postingId = route.params?.postingId as string | undefined;
  const posting = MY_POSTINGS.find((p) => p.id === postingId);
  const toast = useToast();
  const [list, setList] = useState<Applicant[]>(APPLICANTS as Applicant[]);

  const setStatus = (id: string, status: ApplicationStatus) => {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const act = (a: Applicant, status: ApplicationStatus, message: string) => {
    setStatus(a.id, status);
    toast.show(message);
  };

  return (
    <Shell title="المتقدّمون" navigation={navigation} back>
      {posting ? (
        <Card style={styles.postingCard}>
          <Text style={styles.postingTitle} numberOfLines={1}>{posting.title}</Text>
          <Text style={styles.postingSub}>{posting.loc} · {posting.type}</Text>
        </Card>
      ) : null}

      {list.length === 0 ? (
        <EmptyState
          icon="user"
          title="لا يوجد متقدمون"
          body="لم يتقدّم أحد لهذه الوظيفة بعد. شاركها لاستقبال الطلبات."
        />
      ) : (
        list.map((a, i) => {
          const st = APPLICATION_STATUS[a.status];
          const done = a.status === 'accepted' || a.status === 'rejected';
          return (
            <StaggerItem key={a.id} index={i} style={styles.item}>
              <ListItem
                icon="user"
                title={a.name}
                body={`${a.verified ? 'موثّق · ' : ''}${a.exp} خبرة`}
                badge={
                  <View style={styles.badgeStack}>
                    <Badge label={st.label} variant={STATUS_VARIANT[a.status]} />
                    <View style={styles.ratingRow}>
                      <Stars value={a.rating} size={11} />
                      <Text style={styles.ratingText}>{a.rating}</Text>
                    </View>
                  </View>
                }
              />
              {!done ? (
                <View style={styles.actions}>
                  <Button
                    label="قائمة مختصرة"
                    variant="secondary"
                    size="sm"
                    style={styles.actionBtn}
                    onPress={() => act(a, 'shortlisted', `تمت إضافة ${a.name} إلى القائمة المختصرة`)}
                  />
                  <Button
                    label="قبول"
                    size="sm"
                    style={styles.actionBtn}
                    onPress={() => act(a, 'accepted', `تم قبول ${a.name}`)}
                  />
                  <Button
                    label="رفض"
                    variant="danger"
                    size="sm"
                    style={styles.actionBtn}
                    onPress={() => act(a, 'rejected', `تم رفض ${a.name}`)}
                  />
                </View>
              ) : null}
            </StaggerItem>
          );
        })
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  postingCard: { marginBottom: sp.base },
  postingTitle: { ...typ.h4, color: palette.textHi },
  postingSub: { ...typ.bodyS, color: palette.textMid, marginTop: 2 },
  badgeStack: { alignItems: 'flex-end', gap: sp.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: sp.xs },
  ratingText: { ...typ.caption, color: palette.textLow, fontWeight: '700' },
  item: { marginBottom: sp.sm },
  actions: { flexDirection: 'row', gap: sp.sm, marginTop: -sp.xs, marginBottom: sp.md },
  actionBtn: { flex: 1 },
});
