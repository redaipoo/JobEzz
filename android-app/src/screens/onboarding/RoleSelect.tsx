/**
 * RoleSelect — multi-select the roles the user plays in the app.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store';
import {
  palette, sp, r, typ, FadeInView, StaggerItem, DepthGradient, PressableScale,
} from '../../design';
import { Button, Badge } from '../../ui';
import { Icon } from '../../icons';
import { IconTile } from '../../ui';

const ROLES = [
  { id: 'customer',   icon: 'user',     title: 'عميل خدمات',      desc: 'اطلب فنيين وخدمات من حولك',        color: palette.catTeal },
  { id: 'jobseeker',  icon: 'jobs',     title: 'باحث عن عمل',     desc: 'تصفح الوظائف وتقدّم عليها',        color: palette.accent },
  { id: 'provider',   icon: 'services', title: 'مزوّد خدمة',      desc: 'قدّم خدماتك واكسب دخلاً',          color: palette.warning },
  { id: 'employer',   icon: 'building', title: 'صاحب عمل',        desc: 'انشر وظائف واستقطب الكفاءات',       color: palette.success },
  { id: 'student',    icon: 'courses',  title: 'طالب دورات',      desc: 'تعلّم مهارات جديدة واعتمد شهاداتك', color: palette.gold },
  { id: 'instructor', icon: 'school',   title: 'مدرّب / محاضر',   desc: 'أنشئ دورات وعلّم الآخرين',          color: palette.catRose },
];

export function RoleSelect({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const roles = useAppStore((s) => s.roles);
  const setRoles = useAppStore((s) => s.setRoles);

  const toggle = (id: string) => {
    const on = roles.includes(id as any);
    setRoles(on ? roles.filter((x: any) => x !== id) : [...roles, id as any]);
  };

  return (
    <View style={styles.root}>
      <DepthGradient variant="screen" />
      <View style={[styles.head, { paddingTop: insets.top + sp.md }]}>
        <Text style={styles.wordmark}>JobEzz</Text>
      </View>

      <FadeInView style={styles.inner}>
        <Text style={styles.title}>ما الذي تريد فعله في JobEzz؟</Text>
        <Text style={styles.sub}>يمكنك اختيار أكثر من دور؛ حساب واحد لكل احتياجاتك.</Text>

        {roles.length > 0 && (
          <View style={styles.confirm}>
            <Icon name="checkCircle" size={15} color={palette.success} />
            <Text style={styles.confirmText}>
              اخترت {roles.length} {roles.length === 1 ? 'دوراً' : 'أدواراً'} · يمكنك تعديلها لاحقاً
            </Text>
          </View>
        )}

        <View style={styles.grid}>
          {ROLES.map((r, i) => {
            const sel = roles.includes(r.id as any);
            return (
              <StaggerItem key={r.id} index={i} style={styles.cell}>
                <PressableRoleButton
                  item={r} sel={sel} onPress={() => toggle(r.id)}
                />
              </StaggerItem>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />
        <Button
          label={roles.length ? `متابعة · ${roles.length} ${roles.length === 1 ? 'دور' : 'أدوار'}` : 'اختر دورك أولاً'}
          onPress={() => navigation.navigate('Auth')}
          disabled={!roles.length}
          size="lg"
          style={{ marginBottom: insets.bottom + sp.sm }}
        />
      </FadeInView>
    </View>
  );
}

function PressableRoleButton({ item, sel, onPress }: any) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.94}
      accessibilityState={{ selected: sel }}
      style={[styles.card, sel && styles.cardSel]}
    >
      {sel && <View style={styles.cardCheck}><Icon name="check" size={13} color={palette.bg0} /></View>}
      <IconTile icon={item.icon} color={sel ? item.color : palette.textLow} style={styles.cardIcon} />
      <Text style={[styles.cardTitle, sel && styles.cardTitleSel]} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.desc}</Text>
      {sel && <Badge label="محدد" variant="accent" style={{ marginTop: sp.sm }} />}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg1 },
  head: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: sp.screen,
  },
  wordmark: { ...typ.h3, color: palette.textHi, letterSpacing: 1 },
  inner: { flex: 1, paddingHorizontal: sp.screen, paddingTop: sp.lg },
  title: { ...typ.display, color: palette.textHi },
  sub: { ...typ.body, color: palette.textMid, marginTop: 6 },
  confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.successBg,
    borderRadius: r.md,
    padding: sp.md,
    marginTop: sp.base,
    borderWidth: 1,
    borderColor: 'rgba(62,207,142,0.22)',
  },
  confirmText: { ...typ.bodyS, color: palette.success, flex: 1 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp.md,
    marginTop: sp.xl,
  },
  cell: { width: '48%' },
  card: {
    alignItems: 'flex-start',
    padding: sp.lg,
    borderRadius: r.card,
    backgroundColor: palette.bg3,
    borderWidth: 1,
    borderColor: palette.border,
    minHeight: 158,
  },
  cardSel: {
    backgroundColor: palette.accentGlow,
    borderColor: palette.borderAccent,
  },
  cardIcon: { width: 46, height: 46 },
  cardCheck: {
    position: 'absolute',
    top: sp.sm,
    right: sp.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...typ.h3, color: palette.textHi, marginTop: sp.md },
  cardTitleSel: { color: palette.textHi },
  cardDesc: { ...typ.caption, color: palette.textLow, marginTop: 3, lineHeight: 17 },
});
