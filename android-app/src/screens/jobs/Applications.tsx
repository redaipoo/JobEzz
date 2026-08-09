/**
 * Applications — طلبات التقديم المقدّمة.
 * فلترة بالحالة (الكل/مقدم/مراجعة/قائمة مختصرة/مرفوض) + بحث +
 * ListItem مع Badge حالة معتمد على APPLICATION_STATUS.
 */
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { sp, StaggerItem } from '../../design';
import { Shell, ListItem, Badge, EmptyState } from '../../ui';
import type { BadgeVariant } from '../../ui';
import { UserJobsHeader } from './UserJobsHeader';
import type { JobsFilterDef } from './UserJobsHeader';
import { MY_APPLICATIONS, APPLICATION_STATUS } from '../../data';
import type { ApplicationStatus } from '../../types';

/* تلوين حالة الطلب على السطوح الداكنة (نفس ألوان Badge الدلالية) */
const STATUS_VARIANT: Record<ApplicationStatus, BadgeVariant> = {
  applied: 'neutral',
  review: 'warning',
  shortlisted: 'accent',
  rejected: 'danger',
  accepted: 'success',
};

/* فلاتر الحالة: الكل + كل حالات APPLICATION_STATUS المعتمدة */
const STATUS_FILTERS: JobsFilterDef[] = [
  { id: 'all', name: 'الكل' },
  ...Object.entries(APPLICATION_STATUS).map(([id, s]) => ({ id, name: s.label })),
];

export function Applications({ navigation }: any) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MY_APPLICATIONS.filter((a) => {
      if (tab !== 'all' && a.status !== tab) return false;
      if (!s) return true;
      return `${a.job} ${a.company}`.toLowerCase().includes(s);
    });
  }, [tab, q]);

  return (
    <Shell title="طلبات التقديم" navigation={navigation} back>
      <UserJobsHeader
        title="طلباتي"
        search={q}
        onSearchChange={setQ}
        filter={tab}
        onFilterChange={setTab}
        count={filtered.length}
        countLabel="طلب تقديم"
        filters={STATUS_FILTERS}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="doc"
          title="لا توجد طلبات هنا"
          body="جرّب تغيير الفلتر، أو ابدأ بالبحث عن وظيفة تناسبك."
          actionLabel="تصفح الوظائف"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Jobs' })}
        />
      ) : (
        filtered.map((a, i) => (
          <StaggerItem key={a.id} index={i} style={styles.item}>
            <ListItem
              icon="jobs"
              title={a.job}
              body={`${a.company} · ${a.date}`}
              badge={<Badge label={APPLICATION_STATUS[a.status as ApplicationStatus].label} variant={STATUS_VARIANT[a.status as ApplicationStatus]} />}
            />
          </StaggerItem>
        ))
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  item: { marginBottom: sp.sm },
});
