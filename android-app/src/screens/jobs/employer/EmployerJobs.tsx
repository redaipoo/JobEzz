/**
 * EmployerJobs — وظائف صاحب العمل.
 * نظرة عامة (KpiRow حقيقية من MY_POSTINGS) + قائمة النشرات
 * مع التنقل للمتقدّمين وإجراء نشر وظيفة جديدة.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { sp, StaggerItem } from '../../../design';
import { palette } from '../../../design';
import { Shell, Button, KpiRow, ListItem, Badge, EmptyState, SectionTitle } from '../../../ui';
import { MY_POSTINGS } from '../../../data';

export function EmployerJobs({ navigation }: any) {
  const totalApplicants = MY_POSTINGS.reduce((s, p) => s + (p.applicants || 0), 0);

  return (
    <Shell title="وظائف صاحب العمل" navigation={navigation} back>
      <Button
        label="نشر وظيفة جديدة"
        onPress={() => navigation.navigate('EmployerPost')}
        style={styles.primaryBtn}
      />

      <KpiRow
        items={[
          { value: `${MY_POSTINGS.length}`, label: 'وظائف نشطة', icon: 'jobs', color: palette.accent },
          { value: `${totalApplicants}`, label: 'إجمالي المتقدّمين', icon: 'users', color: palette.success },
        ]}
      />

      <SectionTitle title="نشراتك" />
      {MY_POSTINGS.length === 0 ? (
        <EmptyState
          icon="jobs"
          title="لا توجد نشرات بعد"
          body="انشر أول وظيفة لتستقبل طلبات المتقدمين."
          actionLabel="نشر أول وظيفة"
          onAction={() => navigation.navigate('EmployerPost')}
        />
      ) : (
        MY_POSTINGS.map((p, i) => (
          <StaggerItem key={p.id} index={i} style={styles.item}>
            <ListItem
              icon="jobs"
              title={p.title}
              body={`${p.loc} · ${p.type}`}
              badge={
                <Badge label={`${p.applicants} متقدّم`} variant="neutral" />
              }
              onPress={() => navigation.navigate('EmployerApplicants', { postingId: p.id })}
            />
          </StaggerItem>
        ))
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  primaryBtn: { marginBottom: sp.base },
  item: { marginBottom: sp.sm },
});
