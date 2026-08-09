/**
 * Header + Shell — the canonical top bar. One header. Never re-created per screen.
 *
 * - insets.top aware.
 * - Right slot is explicit (`right` ReactNode) — kill the "function means bell" magic.
 * - Shell = Header + scroll body with unified padding.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, sp, typ, r, layout } from '../../design';
import { PressableScale } from '../../design';
import { Icon } from '../../icons';

export interface HeaderProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  leading?: React.ReactNode;    /* override instead of back chevron */
  tone?: 'default' | 'hero';     /* hero = no bottom hairline, bigger title */
  style?: StyleProp<ViewStyle>;
}

export function HeaderBack({ onBack, icon = 'back', color = palette.text }: { onBack?: () => void; icon?: string | undefined; color?: string | undefined }) {
  return (
    <PressableScale
      onPress={onBack}
      activeScale={0.88}
      style={styles.iconBtn}
      accessibilityRole="button"
      accessibilityLabel="رجوع"
    >
      <Icon name={icon} size={19} color={color} strokeWidth={2} />
    </PressableScale>
  );
}

export function Header({ title, onBack, right, leading, tone = 'default', style }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const showBack = !!leading || !!onBack;
  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top,
          height: layout.headerH + insets.top + (tone === 'hero' ? 10 : 0),
        },
        tone === 'default' && styles.barDefault,
        style,
      ]}
    >
      <View style={[styles.side, { width: 44 * (showBack ? 1 : 1) }]}>
        {leading ?? (onBack ? <HeaderBack onBack={onBack} /> : <View style={styles.sideSpacer} />)}
      </View>
      <Text
        style={[
          tone === 'default' ? styles.titleDefault : styles.titleHero,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <View style={styles.side}>
        {right ?? <View style={styles.sideSpacer} />}
      </View>
    </View>
  );
}

export function Shell({
  title, navigation, back, right, leading, tone = 'default', children, style, scroll = true,
}: {
  title?: string;
  navigation?: { goBack: () => void };
  back?: boolean;
  right?: React.ReactNode;
  leading?: React.ReactNode;
  tone?: 'default' | 'hero';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
}) {
  const handleBack = onBackify(back, navigation);
  const content = scroll ? (
    <ScrollView
      style={styles.shellFlex}
      contentContainerStyle={styles.shellBody}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.shellFlex}>{children}</View>
  );
  return (
    <View style={styles.shell}>
      <Header title={title} onBack={handleBack} right={right} leading={leading} tone={tone} />
      {content}
    </View>
  );
}

function onBackify(back: boolean | undefined, navigation?: { goBack: () => void }) {
  return back && navigation ? () => navigation.goBack() : undefined;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp.screen,
  },
  barDefault: {
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
    backgroundColor: palette.bg1,
  },
  titleDefault: {
    ...typ.h3,
    color: palette.textHi,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  titleHero: {
    ...typ.h2,
    color: palette.textHi,
    flex: 1,
    textAlign: 'center',
  },
  side: { minWidth: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  sideSpacer: { width: 40 },
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
  shell: { flex: 1, backgroundColor: palette.bg1 },
  shellFlex: { flex: 1 },
  shellBody: {
    paddingHorizontal: sp.screen,
    paddingTop: sp.base,
    paddingBottom: sp.xxxl + 8,
  },
});
