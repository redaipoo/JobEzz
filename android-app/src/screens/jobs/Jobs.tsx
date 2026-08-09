/**
 * Jobs — شاشة البحث عن الوظائف.
 * تحميل حي عبر loadJobs() مع حالات: تحميل (SkeletonList) / خطأ (ErrorState) /
 * بيانات مضمّنة (JOBS) عند غياب الإعداد أو فشل الجلب.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, sp, StaggerItem } from '../../design';
import { DepthGradient, AmbientGlow } from '../../design';
import { JobCard, SkeletonList, ErrorState, EmptyState, useTabBarClearance } from '../../ui';
import type { JobLike } from '../../ui';
import { UserJobsHeader } from './UserJobsHeader';
import { JOBS, USER } from '../../data';
import { loadJobs } from '../../lib/queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import { jobMatchScore } from '../../utils';
import { greetingAr } from '../../utils/greeting';
import { useAppStore } from '../../store';
import type { User } from '../../types';

/* خريطة أنواع Supabase → التسميات العربية المعتمدة في JOB_FILTERS */
const TYPE_AR: Record<string, string> = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  remote: 'عن بُعد',
  contract: 'عقد',
};

function fmtDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString('ar');
}

/* تحويل صف الوظيفة الحي (Supabase) إلى شكل JobLike المعتمد في JobCard */
function liveToJob(row: any, user: User): JobLike {
  const loc = row.city ?? '';
  const skills: string[] = row.skills ?? [];
  const featured = !!row.featured;
  return {
    id: row.id,
    title: row.title ?? '',
    company: row.company_name ?? '',
    loc,
    salary:
      row.salary_min != null && row.salary_max != null
        ? `${Number(row.salary_min)} - ${Number(row.salary_max)} د.ل`
        : undefined,
    type: TYPE_AR[row.type] ?? row.type,
    skills,
    verified: !!row.is_verified,
    featured,
    color: featured ? palette.gold : palette.accent,
    date: fmtDate(row.published_at),
    matchScore: jobMatchScore({ loc, skills, expLevel: row.exp_level }, user),
  };
}

type LoadStatus = 'loading' | 'ready' | 'error';

export function Jobs({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance();
  const user = (useAppStore((s) => s.user) ?? USER) as User;
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [live, setLive] = useState<JobLike[] | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const rows = await loadJobs();
      if (rows) {
        setLive(rows.map((r) => liveToJob(r, user)));
        setStatus('ready');
      } else if (isSupabaseConfigured()) {
        /* الخادم مهيأ لكن الجلب فشل — حالة خطأ حقيقية مع إعادة محاولة */
        setStatus('error');
      } else {
        setStatus('ready');
      }
    } catch {
      setStatus('error');
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const source = live ?? (JOBS as JobLike[]);

  const filtered = useMemo(() => {
    const typeLabel: Record<string, string> = {
      fulltime: 'دوام كامل',
      parttime: 'دوام جزئي',
      remote: 'عن بُعد',
      contract: 'عقد',
    };
    const s = q.trim().toLowerCase();
    return source.filter((j) => {
      if (filter !== 'all' && j.type !== typeLabel[filter]) return false;
      if (!s) return true;
      const hay = [j.title, j.company, j.loc, j.salary, ...(j.skills ?? [])].join(' ').toLowerCase();
      return hay.includes(s);
    });
  }, [source, filter, q]);

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <AmbientGlow position="topLeft" color={palette.accent} size={280} opacity={0.06} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingHorizontal: sp.screen,
          paddingBottom: clearance + insets.bottom + sp.md,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <UserJobsHeader
          greeting={`${greetingAr()} ${user.name.split(' ')[0]}`}
          title="وظائف تناسب مهاراتك"
          search={q}
          onSearchChange={setQ}
          filter={filter}
          onFilterChange={setFilter}
          count={filtered.length}
        />

        {status === 'loading' ? (
          <SkeletonList count={4} />
        ) : status === 'error' ? (
          <ErrorState
            title="تعذّر تحميل الوظائف"
            body="تحقق من اتصالك بالإنترنت ثم أعد المحاولة."
            onRetry={() => void load()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="لا توجد نتائج"
            body="جرّب تغيير الفلتر أو كلمة البحث للعثور على وظائف أخرى."
          />
        ) : (
          filtered.map((j, i) => (
            <StaggerItem key={j.id} index={i}>
              <JobCard
                job={j}
                onPress={() => navigation.navigate('JobDetail', { id: j.id })}
                onApply={() => navigation.navigate('JobApply', { id: j.id })}
              />
            </StaggerItem>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  flex: { flex: 1 },
});
