/**
 * JobDetail — تفاصيل الوظيفة.
 * بطل الشركة + مطابقة الملف + إحصائيات حقيقية (راتب/موعد/متقدمون) +
 * الوصف الكامل من loadJobDetail(id) أو قسم فارغ حقيقي + المهارات مع تمييز المطابق.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, r, typ, PressableScale } from '../../design';
import {
  Shell, Card, Button, Tag, Badge, Verified, BrandLetterAvatar,
  MatchScore, KpiRow, EmptyState,
} from '../../ui';
import { Icon } from '../../icons';
import { JOBS, USER } from '../../data';
import { loadJobDetail } from '../../lib/queries';
import { jobMatchScore } from '../../utils';
import { useAppStore } from '../../store';

const TYPE_AR: Record<string, string> = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  remote: 'عن بُعد',
  contract: 'عقد',
};

export function JobDetail({ navigation, route }: any) {
  const id = route.params?.id as string;
  const fixture = JOBS.find((x) => x.id === id) ?? JOBS[0];
  const user = useAppStore((s) => s.user) ?? USER;
  const saved = useAppStore((s) => s.savedJobIds.includes(id));
  const toggleSavedJob = useAppStore((s) => s.toggleSavedJob);
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    let active = true;
    loadJobDetail(id).then((row) => {
      if (active && row) setDetail(row);
    });
    return () => {
      active = false;
    };
  }, [id]);

  /* دمج بيانات الجدول الحي فوق بيانات العرض المضمّنة — الحقول الحية تفوز */
  const j = detail
    ? {
        ...fixture,
        title: detail.title ?? fixture.title,
        company: detail.company_name ?? fixture.company,
        loc: detail.city ?? fixture.loc,
        type: TYPE_AR[detail.type] ?? fixture.type,
        salary:
          detail.salary_min != null
            ? `${Number(detail.salary_min)} - ${Number(detail.salary_max)} د.ل`
            : fixture.salary,
        skills: (detail.skills ?? fixture.skills) as string[],
        verified: typeof detail.is_verified === 'boolean' ? detail.is_verified : fixture.verified,
      }
    : fixture;

  const desc = detail?.description || undefined;
  const score = jobMatchScore(j, user);
  const userSkills = user.skills ?? [];

  const stats = [
    j.salary ? { value: j.salary, label: 'الراتب', icon: 'money', color: palette.accent } : null,
    j.deadline ? { value: j.deadline, label: 'آخر موعد للتقديم', icon: 'calendar', color: palette.warning } : null,
    j.applicants != null ? { value: `${j.applicants}`, label: 'متقدّم', icon: 'users', color: palette.success } : null,
  ].filter(Boolean) as Array<{ value: string; label: string; icon: string; color: string }>;

  const saveBtn = (
    <PressableScale
      onPress={() => toggleSavedJob(j.id)}
      activeScale={0.88}
      style={styles.iconBtn}
      accessibilityRole="button"
      accessibilityLabel={saved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
    >
      <Icon
        name={saved ? 'heartFill' : 'heart'}
        size={19}
        color={saved ? palette.danger : palette.textMid}
        strokeWidth={1.8}
      />
    </PressableScale>
  );

  return (
    <Shell title="تفاصيل الوظيفة" navigation={navigation} back right={saveBtn}>
      {/* بطاقة البطل: الشركة */}
      <Card>
        <View style={styles.hero}>
          <BrandLetterAvatar
            name={j.company}
            size={56}
            color={j.verified ? palette.accent : palette.textLow}
          />
          <View style={styles.heroText}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>{j.title}</Text>
              {j.verified ? <Verified size={15} /> : null}
            </View>
            <Text style={styles.company} numberOfLines={1}>{j.company}</Text>
          </View>
        </View>
        <View style={styles.tags}>
          <Tag icon="pin">{j.loc}</Tag>
          <Tag icon="clock">{j.type}</Tag>
          <Tag icon="jobs">{j.cat}</Tag>
          {j.expLevel ? <Tag icon="chart">{j.expLevel}</Tag> : null}
        </View>
      </Card>

      {/* مطابقة مع ملف المستخدم */}
      <Card style={styles.block}>
        <View style={styles.matchRow}>
          <View style={styles.matchLead}>
            <Icon name="trending" size={18} color={palette.success} />
            <Text style={styles.matchTitle}>مطابقة مع ملفك</Text>
          </View>
          <MatchScore score={score} />
        </View>
        <Text style={styles.matchBody}>بناءً على مهاراتك وخبرتك وموقعك الحالي</Text>
      </Card>

      {/* إحصائيات الوظيفة */}
      {stats.length > 0 ? (
        <Card style={styles.block}>
          <KpiRow items={stats} />
        </Card>
      ) : null}

      {/* الوصف الحقيقي أو قسم فارغ صادق */}
      {desc ? (
        <Card style={styles.block}>
          <Text style={styles.sectionTitle}>الوصف</Text>
          <Text style={styles.desc}>{desc}</Text>
        </Card>
      ) : (
        <Card style={styles.block}>
          <EmptyState
            icon="doc"
            title="لا يوجد وصف إضافي"
            body="تفاصيل هذه الوظيفة غير متوفرة حالياً. يمكنك التقديم مباشرة وسيتواصل معك صاحب العمل."
          />
        </Card>
      )}

      {/* المهارات المطلوبة مع تمييز المطابقة */}
      {j.skills.length > 0 ? (
        <Card style={styles.block}>
          <Text style={styles.sectionTitle}>المهارات المطلوبة</Text>
          <View style={styles.chips}>
            {j.skills.map((sk: string) => {
              const matched = userSkills.some(
                (us) =>
                  sk.toLowerCase().includes(us.toLowerCase()) ||
                  us.toLowerCase().includes(sk.toLowerCase()),
              );
              return (
                <Badge
                  key={sk}
                  label={matched ? `✓ ${sk}` : sk}
                  variant={matched ? 'success' : 'neutral'}
                  style={styles.chip}
                />
              );
            })}
          </View>
        </Card>
      ) : null}

      <Button
        label="تقدّم الآن"
        size="lg"
        onPress={() => navigation.navigate('JobApply', { id: j.id })}
        style={styles.cta}
      />
    </Shell>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: sp.base },
  heroText: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { ...typ.h3, color: palette.textHi, flexShrink: 1 },
  company: { ...typ.bodyS, color: palette.textMid, marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: sp.base },
  block: { marginTop: sp.md },
  matchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchLead: { flexDirection: 'row', alignItems: 'center', gap: sp.sm },
  matchTitle: { ...typ.label, color: palette.textHi },
  matchBody: { ...typ.bodyS, color: palette.textMid, marginTop: 6 },
  sectionTitle: { ...typ.h4, color: palette.textHi, marginBottom: sp.sm },
  desc: { ...typ.body, color: palette.text, lineHeight: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { marginBottom: 2 },
  cta: { marginTop: sp.xl },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: r.sm,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
