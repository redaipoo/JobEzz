/**
 * JobCard — the canonical job listing card. Shared across Jobs, Home,
 * SavedJobs, Applications and EmployerJobs to eliminate copy-paste.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, r } from '../../design';
import { Verified, BrandLetterAvatar } from '../atoms/Avatar';
import { Icon } from '../../icons';
import { Tag, Badge } from '../atoms/Badge';
import { MatchScore } from './Stat';
import { PressableScale } from '../../design';

export interface JobLike {
  id: string;
  title: string;
  company: string;
  logo?: string;
  loc?: string;
  type?: string;
  salary?: string;
  skills?: string[];
  verified?: boolean;
  date?: string;
  matchScore?: number;
  featured?: boolean;
  color?: string;
}

export function JobCard({ job, onPress, onApply, style }: { job: JobLike; onPress?: () => void; onApply?: () => void; style?: any }) {
  return (
    <PressableScale onPress={onPress} activeScale={0.98} style={[styles.card, style]} accessibilityRole="button">
      <View style={styles.head}>
        <BrandLetterAvatar
          name={job.company}
          size={46}
          color={job.featured ? palette.gold : job.color || palette.accent}
        />
        <View style={styles.headText}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            {job.verified ? <Verified size={14} /> : null}
          </View>
          <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
        </View>
        {typeof job.matchScore === 'number' ? <MatchScore score={job.matchScore} /> : null}
      </View>

      {/* Meta rows */}
      <View style={styles.metaRow}>
        {job.loc ? <Tag icon="pin" label={job.loc} /> : null}
        {job.type ? <Tag icon="clock" label={job.type} /> : null}
      </View>

      {job.skills && job.skills.length > 0 ? (
        <View style={styles.skillsRow}>
          {job.skills.slice(0, 3).map((sk) => (
            <Badge key={sk} label={sk} variant="neutral" style={styles.skill} />
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.salary} numberOfLines={1}>{job.salary}</Text>
        {job.date ? <Text style={styles.date}>{job.date}</Text> : null}
        {onApply ? (
          <PressableScale
            onPress={onApply}
            activeScale={0.92}
            style={styles.apply}
            accessibilityRole="button"
          >
            <Text style={styles.applyText}>تقدّم</Text>
            <Icon name="back" size={12} color="#FFFFFF" />
          </PressableScale>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.bg3,
    borderRadius: r.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: sp.lg,
    marginBottom: sp.md,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: sp.md },
  headText: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { ...typ.h4, color: palette.textHi, flexShrink: 1 },
  company: { ...typ.bodyS, color: palette.textMid, marginTop: 2 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: sp.md },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  skill: { marginRight: 4 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: sp.md,
    paddingTop: sp.md,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
  },
  salary: { ...typ.label, color: palette.accent, flexShrink: 1 },
  date: { ...typ.caption, color: palette.textLow },
  apply: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: r.pill,
  },
  applyText: { ...typ.caption, color: '#FFFFFF', fontWeight: '800' },
});
