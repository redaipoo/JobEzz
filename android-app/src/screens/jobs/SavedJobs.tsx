/**
 * SavedJobs — الوظائف المحفوظة.
 * مصدرها useAppStore.savedJobIds + JOBS؛ كل بطاقة تعرض MatchScore
 * وتتضمن زر إزالة عبر toggleSavedJob مع Toast، وحالة فارغة مع CTA للوظائف.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, sp } from '../../design';
import { Shell, JobCard, Button, EmptyState } from '../../ui';
import { useToast } from '../../ui';
import { JOBS, USER } from '../../data';
import { jobMatchScore } from '../../utils';
import { useAppStore } from '../../store';
import { StaggerItem } from '../../design';

export function SavedJobs({ navigation }: any) {
  const savedIds = useAppStore((s) => s.savedJobIds);
  const toggleSavedJob = useAppStore((s) => s.toggleSavedJob);
  const user = useAppStore((s) => s.user) ?? USER;
  const toast = useToast();

  const saved = JOBS.filter((j) => savedIds.includes(j.id));

  const remove = (id: string) => {
    toggleSavedJob(id);
    toast.show('تمت الإزالة من المحفوظات');
  };

  return (
    <Shell title="الوظائف المحفوظة" navigation={navigation} back>
      {saved.length === 0 ? (
        <EmptyState
          icon="heart"
          title="لا توجد وظائف محفوظة"
          body="احفظ الوظائف التي تهمك من صفحة التفاصيل لتظهر هنا."
          actionLabel="تصفح الوظائف"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Jobs' })}
        />
      ) : (
        saved.map((j, i) => (
          <StaggerItem key={j.id} index={i}>
            <JobCard
              job={{ ...j, matchScore: jobMatchScore(j, user) }}
              onPress={() => navigation.navigate('JobDetail', { id: j.id })}
              onApply={() => navigation.navigate('JobApply', { id: j.id })}
            />
            <View style={styles.removeRow}>
              <Button
                label="إزالة من المحفوظات"
                variant="ghost"
                size="sm"
                compact
                onPress={() => remove(j.id)}
              />
            </View>
          </StaggerItem>
        ))
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  removeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: sp.md,
    paddingHorizontal: sp.sm,
  },
});
