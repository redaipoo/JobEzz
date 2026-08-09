/**
 * CompanyProfile — ملف الشركة.
 * بطاقة بطل (الشعار + الاسم + التوثيق + إحصاءات حقيقية) +
 * قائمة النشرات النشطة من MY_POSTINGS مع التنقل للمتقدّمين.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ, StaggerItem } from '../../design';
import { Shell, Card, Tag, Badge, Verified, BrandLetterAvatar, ListItem, EmptyState, SectionTitle } from '../../ui';
import { JOBS, MY_POSTINGS } from '../../data';

export function CompanyProfile({ navigation, route }: any) {
  const companyId = route.params?.companyId as string | undefined;
  /* ربط معرف الوظيفة بالشركة عند توفر معرّف — وإلا فالشركة الأولى من JOBS */
  const linked = companyId ? JOBS.find((x) => x.id === companyId) : undefined;
  const companyName = linked?.company ?? JOBS[0].company;
  const verified = linked?.verified ?? JOBS[0].verified;
  /* MY_POSTINGS لا يحمل حقلاً للشركة — نعرض كل النشرات كما هي */
  const postings = MY_POSTINGS;
  const totalApplicants = postings.reduce((s, p) => s + (p.applicants || 0), 0);

  return (
    <Shell title="ملف الشركة" navigation={navigation} back>
      {/* بطاقة البطل */}
      <Card style={styles.heroCard}>
        <BrandLetterAvatar name={companyName} size={72} color={palette.accent} />
        <View style={styles.heroTitleRow}>
          <Text style={styles.companyName} numberOfLines={1}>{companyName}</Text>
          {verified ? <Verified size={16} /> : null}
        </View>
        <Text style={styles.heroSub}>{postings.length} وظيفة نشطة</Text>
        <View style={styles.heroTags}>
          <Tag icon="users">{totalApplicants} متقدّم</Tag>
          <Tag icon="verified">{verified ? 'شركة موثّقة' : 'شركة غير موثّقة'}</Tag>
        </View>
      </Card>

      {/* النشرات النشطة */}
      <SectionTitle title="الوظائف النشطة" />
      {postings.length === 0 ? (
        <EmptyState
          icon="jobs"
          title="لا توجد وظائف نشطة"
          body="لم تنشر هذه الشركة وظائف متاحة حالياً."
        />
      ) : (
        postings.map((p, i) => (
          <StaggerItem key={p.id} index={i} style={styles.item}>
            <ListItem
              icon="jobs"
              title={p.title}
              body={`${p.loc} · ${p.type}`}
              badge={
                <View style={styles.badgeStack}>
                  <Badge label={p.status} variant="success" />
                  <Text style={styles.appCount}>{p.applicants} متقدّم</Text>
                </View>
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
  heroCard: { alignItems: 'center', paddingTop: sp.xl },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: sp.sm },
  companyName: { ...typ.h3, color: palette.textHi },
  heroSub: { ...typ.bodyS, color: palette.textMid, marginTop: 2 },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: sp.base },
  badgeStack: { alignItems: 'flex-end', gap: sp.xs },
  appCount: { ...typ.caption, color: palette.textLow },
  item: { marginBottom: sp.sm },
});
