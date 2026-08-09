/**
 * JobEzz — Premium UI Components
 * Built entirely on the design tokens (palette/type/sp/r/sh).
 * Single source of truth for all shared UI atoms.
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  TextInput, ActivityIndicator, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, type, sp, r, sh, preset, layout, useShimmer } from './design';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { Icon } from './icons';

/* ─────────────────────────────────────────────
 * Screen — scrollable screen container
 * ───────────────────────────────────────────── */
export function Screen({ children, bg = palette.bg1, noPad }: any) {
  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: bg }]}
      contentContainerStyle={[noPad ? {} : styles.pad, { paddingBottom: sp.xxxl + sp.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

/* ─────────────────────────────────────────────
 * Row — flex row
 * ───────────────────────────────────────────── */
export function Row({ children, between, gap, style }: any) {
  return <View style={[styles.row, between && styles.between, gap != null && { gap }, style]}>{children}</View>;
}

/* ─────────────────────────────────────────────
 * Button — 3 canonical variants
 *   primary   brand solid (default)
 *   secondary surface + border
 *   ghost     transparent
 * Legacy aliases: accent → primary (gold CTA is only used through `accent`),
 * soft → secondary tinted, danger preserved.
 * ───────────────────────────────────────────── */
const BTN_VARIANTS: Record<string, { bg: string; fg: string; border: string }> = {
  primary:   { bg: palette.accent,       fg: '#FFFFFF', border: palette.accent },
  secondary: { bg: palette.surfaceHi,     fg: palette.text,  border: palette.borderHi },
  ghost:     { bg: 'transparent',         fg: palette.textMid, border: palette.border },
  danger:    { bg: palette.danger,        fg: '#FFFFFF', border: palette.danger },
  accent:    { bg: palette.gold,          fg: '#0A1929', border: palette.gold },
  soft:      { bg: palette.accentGlow,    fg: palette.accent, border: 'transparent' },
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, style }: any) {
  const c = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scale, { toValue: 0.97, speed: 40, bounciness: 4, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, speed: 24, bounciness: 8, useNativeDriver: true }).start();
  };
  const solid = c.bg !== 'transparent';
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          styles.btn,
          {
            backgroundColor: c.bg,
            borderColor: c.border,
            opacity: disabled ? 0.45 : 1,
          },
          style,
        ]}
      >
        {/* glass top gloss — light catch on filled buttons */}
        {solid && <View pointerEvents="none" style={styles.btnGloss} />}
        {loading ? (
          <ActivityIndicator size="small" color={c.fg} />
        ) : (
          <Text style={[type.button, { color: c.fg, fontFamily: 'Tajawal_700Bold' }]}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ─────────────────────────────────────────────
 * Card — surface panel (optional tinted glow + edge highlight)
 * ───────────────────────────────────────────── */
export function Card({ children, style, mb, onPress, glow, flat }: any) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[
        styles.card,
        flat && styles.cardFlat,
        glow === 'gold' && { ...sh.goldGlow },
        glow === 'accent' && { ...sh.glow },
        mb != null && { marginBottom: mb },
        style,
      ]}
    >
      {!flat && <View pointerEvents="none" style={styles.cardEdge} />}
      {children}
    </Wrapper>
  );
}

/* ─────────────────────────────────────────────
 * Header — top bar with safe-area inset
 * ───────────────────────────────────────────── */
export function Header({ title, onBack, right, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top, height: layout.headerH + insets.top }]}>
      {onBack || navigation ? (
        <TouchableOpacity
          onPress={onBack || (navigation && (() => navigation.goBack()))}
          style={styles.headerIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="رجوع"
        >
          <Icon name="back" size={20} color={palette.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerIconBtnSpacer} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      {right ? (
        typeof right === 'function' ? (
          <TouchableOpacity onPress={right} style={styles.headerIconBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityRole="button" accessibilityLabel="الإشعارات">
            <Icon name="bell" size={20} color={palette.textMid} />
          </TouchableOpacity>
        ) : (
          right
        )
      ) : (
        <View style={styles.headerIconBtnSpacer} />
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Shell — header + scroll body (single source of truth)
 * ───────────────────────────────────────────── */
export function Shell({ title, navigation, back, right, children }: any) {
  return (
    <View style={[styles.flex, { backgroundColor: palette.bg1 }]}>
      <Header
        title={title}
        navigation={navigation}
        onBack={back ? () => navigation.goBack() : undefined}
        right={right}
      />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.shellBody}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Avatar — initial circle
 * ───────────────────────────────────────────── */
export function Avatar({ name, size = 44 }: any) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{(name || '؟').trim().charAt(0)}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Verified — small check mark badge
 * ───────────────────────────────────────────── */
export function Verified() {
  return (
    <View style={styles.verifiedWrap}>
      <Icon name="verified" size={11} color={palette.accent} />
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Stars — crisp vector rating
 * ───────────────────────────────────────────── */
export function Stars({ n, size = 13 }: any) {
  const rounded = Math.round(n);
  return (
    <View style={styles.row} accessibilityLabel={`${n} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name={i <= rounded ? 'star' : 'starEmpty'} size={size} color={i <= rounded ? palette.warning : palette.textLow} strokeWidth={1.6} />
      ))}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Badge — pill variant chip
 * ───────────────────────────────────────────── */
const BADGES: Record<string, { bg: string; color: string; border: string }> = {
  blue:    { bg: palette.accentGlow,  color: palette.accent,    border: palette.borderAccent },
  success: { bg: palette.successBg,   color: palette.success,   border: palette.successBg },
  warning: { bg: palette.warningBg,   color: palette.warning,   border: palette.warningBg },
  danger:  { bg: palette.dangerBg,    color: palette.danger,    border: palette.dangerBg },
  gray:    { bg: palette.surface,     color: palette.textMid,   border: palette.border },
  navy:    { bg: palette.accent,      color: '#FFFFFF',         border: palette.accent },
  gold:    { bg: palette.goldBg,      color: palette.gold,      border: palette.goldBg },
};
export function Badge({ children, variant = 'blue', style }: any) {
  const c = BADGES[variant] || BADGES.blue;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      <Text style={[type.caption, { color: c.color, fontWeight: '700' }]}>{children}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Chip — selectable filter chip
 * ───────────────────────────────────────────── */
export function Chip({ label, active, onPress, icon }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[styles.chip, active && styles.chipActive]}
    >
      {icon && <Icon name={icon} size={13} color={active ? palette.accent : palette.textMid} />}
      <Text style={[type.label, styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────
 * Tag — inline icon tag (e.g. location, type, category)
 * ───────────────────────────────────────────── */
export function Tag({ children, style, icon, color = palette.textMid }: any) {
  return (
    <View style={[styles.tag, style]}>
      {typeof icon === 'string' && <Icon name={icon} size={11} color={color} />}
      {children && <Text style={[type.caption, { color }]}>{children}</Text>}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Kpi — stat tile
 * ───────────────────────────────────────────── */
export function Kpi({ value, label, icon }: any) {
  return (
    <View style={styles.kpi}>
      {icon && (
        <View style={styles.kpiIconWrap}>
          <Icon name={icon} size={18} color={palette.accent} />
        </View>
      )}
      <Text style={styles.kpiV}>{value}</Text>
      <Text style={styles.kpiL} numberOfLines={1}>{label}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * MapBox — stylised map placeholder (no emoji)
 * ───────────────────────────────────────────── */
export function MapBox({ h = 160 }: any) {
  return (
    <View style={[styles.map, { height: h }]}>
      <View style={[styles.road, { left: 0, right: 0, top: '45%', height: 14 }]} />
      <View style={[styles.road, { top: 0, bottom: 0, left: '40%', width: 14 }]} />
      <View style={styles.mapPin}>
        <Icon name="pin" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.me} />
    </View>
  );
}

/* ─────────────────────────────────────────────
 * GlassPanel — frosted container
 * ───────────────────────────────────────────── */
export function GlassPanel({ children, style, elevated }: any) {
  return <View style={[preset.glass, elevated && styles.glassElevated, style]}>{children}</View>;
}

/* ─────────────────────────────────────────────
 * SectionTitle — section header with accent marker
 * ───────────────────────────────────────────── */
export function SectionTitle({ title, onSee, light, icon }: any) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.row}>
        <View style={styles.sectionTick} />
        {icon && <Icon name={icon} size={16} color={palette.accent} />}
        <Text style={[styles.sectionTitleText, light && { color: palette.textHi }]}>{title}</Text>
      </View>
      {onSee && (
        <TouchableOpacity onPress={onSee} activeOpacity={0.8} accessibilityRole="button">
          <Text style={styles.seeAllText}>عرض الكل</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * EmptyState
 * ───────────────────────────────────────────── */
export function EmptyState({ icon, title, message, actionLabel, onAction }: any) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Icon name={icon || 'search'} size={36} color={palette.accent} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message && <Text style={styles.emptyMessage}>{message}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={{ marginTop: sp.lg, alignSelf: 'center' }} />
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Skeletons
 * ───────────────────────────────────────────── */
export function SkeletonCard() {
  const shimmer = useShimmer();
  const sweep = useAnimatedStyle(() => ({
    backgroundColor: shimmer.value ? palette.surfaceHi : palette.surface,
  }));
  return (
    <View style={styles.skeletonCard}>
      <ReAnimated.View style={[styles.skeletonAvatar, sweep]} />
      <View style={{ flex: 1, gap: sp.sm }}>
        <ReAnimated.View style={[styles.skeletonLine, { width: '70%' }, sweep]} />
        <ReAnimated.View style={[styles.skeletonLine, { width: '50%' }, sweep]} />
        <ReAnimated.View style={[styles.skeletonLine, { width: '40%' }, sweep]} />
      </View>    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: sp.md }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * MatchScore — job match percent
 * ───────────────────────────────────────────── */
export function MatchScore({ score }: { score: number }) {
  const color = score >= 80 ? palette.success : score >= 50 ? palette.warning : palette.textLow;
  return (
    <View style={[styles.matchBadge, { borderColor: color + '30' }]}>
      <Icon name="trending" size={12} color={color} />
      <Text style={[styles.matchText, { color }]}>{score}%</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * CompletionBar — progress
 * ───────────────────────────────────────────── */
export function CompletionBar({ percent, label }: { percent: number; label?: string }) {
  const color = percent >= 80 ? palette.success : palette.accent;
  return (
    <View style={styles.completionWrap}>
      {label && (
        <View style={styles.rowBetween}>
          <Text style={styles.completionLabel}>{label}</Text>
          <Text style={[styles.completionLabel, { color }]}>{percent}%</Text>
        </View>
      )}
      <View style={styles.completionTrack}>
        <View style={[styles.completionFill, { width: `${Math.min(100, percent)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * TrustBadge — provider trust pill
 * ───────────────────────────────────────────── */
export function TrustBadge({ label }: { label: string }) {
  return (
    <View style={styles.trustBadge}>
      <Icon name="shield" size={11} color={palette.accent} />
      <Text style={styles.trustBadgeText}>{label}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * RolePill — role switch pill
 * ───────────────────────────────────────────── */
export function RolePill({ label, icon, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[styles.rolePill, active && styles.rolePillActive]}
    >
      {icon && <Icon name={icon} size={14} color={active ? '#FFFFFF' : palette.textMid} />}
      <Text style={[styles.rolePillText, active && styles.rolePillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────
 * StatRow — label/value row
 * ───────────────────────────────────────────── */
export function StatRow({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  const c = color || palette.accent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp.md, paddingVertical: sp.sm }}>
      <View style={[styles.statIconWrap, { backgroundColor: c + '1f' }]}>
        <Icon name={icon} size={16} color={c} />
      </View>
      <Text style={[type.bodyS, { flex: 1, color: palette.textMid }]}>{label}</Text>
      <Text style={[type.label, { color: palette.textHi }]}>{value}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * StepIndicator — multi-step progress
 * ───────────────────────────────────────────── */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={styles.stepIndicator}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepCircle, done && styles.stepCircleDone, active && styles.stepCircleActive]}>
              {done ? (
                <Icon name="check" size={14} color="#FFFFFF" />
              ) : (
                <Text style={[styles.stepNumber, active && { color: '#FFFFFF' }]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, (done || active) && { color: palette.textMid }]}>{step}</Text>
            {i < steps.length - 1 && <View style={[styles.stepLine, done && styles.stepLineDone]} />}
          </View>
        );
      })}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Input — labelled field
 * ───────────────────────────────────────────── */
export function Input({ label, value, onChangeText, placeholder, secure, icon, multiline, keyboardType, error, hint, autoFocus, onSubmitEditing }: any) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: sp.md }}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrap, focus && styles.inputWrapFocus, error && { borderColor: palette.danger }]}>
        {icon && <Icon name={icon} size={18} color={palette.textLow} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textLow}
          secureTextEntry={secure}
          multiline={multiline}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[styles.input, multiline && styles.inputArea]}
          accessibilityLabel={label || placeholder}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * SearchBar — icon + field + clear
 * ───────────────────────────────────────────── */
export function SearchBar({ value, onChangeText, placeholder }: any) {
  return (
    <View style={styles.searchWrap}>
      <Icon name="search" size={18} color={palette.textLow} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'بحث'}
        placeholderTextColor={palette.textLow}
        style={[type.body, styles.searchInput]}
        accessibilityLabel={placeholder || 'بحث'}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="مسح">
          <Icon name="close" size={16} color={palette.textLow} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Toggle — animated switch
 * ───────────────────────────────────────────── */
export function Toggle({ value, onChange, label, disabled }: any) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const toggle = () => {
    if (disabled) return;
    const next = !value;
    Animated.timing(anim, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onChange && onChange(next);
  };
  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={styles.toggleRow} disabled={disabled} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      {label && <Text style={[type.bodyS, styles.toggleLabel]}>{label}</Text>}
      <Animated.View style={[styles.toggleTrack, { backgroundColor: anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(23,42,66,0.14)', palette.accent] }) }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] }) }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────
 * Styles
 * ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { justifyContent: 'space-between' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  screen: { padding: sp.screen },
  pad: { paddingHorizontal: sp.screen },

  /* Button */
  btn: {
    minHeight: layout.tapMin,
    borderRadius: r.md,
    paddingVertical: 12,
    paddingHorizontal: sp.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  btnGloss: {
    position: 'absolute',
    top: 1,
    left: 3,
    right: 3,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  /* Card */
  card: {
    ...preset.card,
    ...sh.sm,
  },
  cardFlat: { backgroundColor: 'transparent', ...sh.flat },
  cardEdge: {
    position: 'absolute',
    top: 0,
    left: r.card + 6,
    right: r.card + 6,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp.base,
    backgroundColor: palette.bg1,
    borderBottomWidth: 1,
    borderColor: palette.border,
  },
  shellWrap: { flex: 1, backgroundColor: palette.bg1 },
  shellBody: { padding: sp.screen, paddingBottom: sp.xxxl + sp.sm },
  headerTitle: { ...type.h3, color: palette.textHi, flex: 1, textAlign: 'center' },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: r.sm,
    backgroundColor: palette.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnSpacer: { width: 40 },

  /* Avatar */
  avatar: {
    backgroundColor: palette.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.borderAccent,
  },
  avatarText: { color: palette.accent, fontWeight: '800' },

  /* Verified */
  verifiedWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Badge */
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: r.pill,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },

  /* Chip */
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: sp.base,
    paddingVertical: 9,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: { backgroundColor: palette.accentSoft, borderColor: palette.borderAccent },
  chipText: { color: palette.textMid },
  chipTextActive: { color: palette.accent },

  /* Tag */
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignSelf: 'flex-start',
  },

  /* KPI */
  kpi: {
    flex: 1,
    backgroundColor: palette.bg3,
    borderRadius: r.lg,
    padding: sp.base + 2,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    ...sh.sm,
  },
  kpiIconWrap: {
    width: 34,
    height: 34,
    borderRadius: r.sm,
    backgroundColor: palette.accentSoft,
    borderWidth: 1,
    borderColor: palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  kpiV: { ...type.h2, color: palette.textHi, fontSize: 22, marginTop: 4 },
  kpiL: { ...type.caption, color: palette.textLow, marginTop: 3, textAlign: 'center', fontSize: 10 },

  /* Map */
  map: {
    position: 'relative',
    borderRadius: r.card,
    overflow: 'hidden',
    backgroundColor: palette.bg2,
    borderWidth: 1,
    borderColor: palette.border,
  },
  road: { position: 'absolute', backgroundColor: palette.surface },
  mapPin: {
    position: 'absolute',
    left: '58%',
    top: '44%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...sh.md,
  },
  me: {
    position: 'absolute',
    left: '30%',
    top: '58%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.accent600,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  /* Glass Panel */
  glassElevated: {
    backgroundColor: palette.surfaceTop,
    borderColor: palette.borderHi,
    ...sh.md,
  },

  /* Section Title */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: sp.section,
    marginBottom: sp.md,
    gap: sp.sm,
  },
  sectionTick: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: palette.accent,
    marginEnd: sp.sm,
    ...sh.glowSoft,
  },
  sectionTitleText: { ...type.h3, color: palette.text, letterSpacing: 0.2 },
  seeAllText: { ...type.label, color: palette.accent, fontSize: 12 },

  /* Empty State */
  emptyContainer: { alignItems: 'center', paddingVertical: sp.xxxl, paddingHorizontal: sp.xl },
  emptyIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.accentSoft,
    borderWidth: 1,
    borderColor: palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.base,
    ...sh.glow,
  },
  emptyTitle: { ...type.h3, color: palette.textHi, textAlign: 'center' },
  emptyMessage: { ...type.bodyS, color: palette.textMid, textAlign: 'center', marginTop: sp.sm, lineHeight: 20 },

  /* Skeleton */
  skeletonCard: {
    flexDirection: 'row',
    gap: sp.md,
    backgroundColor: palette.bg3,
    borderRadius: r.lg,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skeletonAvatar: { width: 48, height: 48, borderRadius: r.md, backgroundColor: palette.surfaceHi },
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: palette.surfaceHi },

  /* Match Score */
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: r.pill,
    borderWidth: 1,
    backgroundColor: palette.surface,
  },
  matchText: { ...type.caption, fontSize: 11 },

  /* Completion Bar */
  completionWrap: { marginTop: sp.md },
  completionLabel: { color: palette.textLow, fontSize: 12, fontWeight: '600' },
  completionTrack: { height: 6, borderRadius: 3, backgroundColor: palette.surfaceHi },
  completionFill: { height: '100%', borderRadius: 3 },

  /* Trust Badge */
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: r.pill,
    backgroundColor: palette.accentGlow,
    borderWidth: 1,
    borderColor: palette.borderAccent,
    alignSelf: 'flex-start',
  },
  trustBadgeText: { color: palette.accent, fontSize: 10, fontWeight: '700' },

  /* Role Pill */
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: sp.md,
    paddingVertical: 7,
    borderRadius: r.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  rolePillActive: { backgroundColor: palette.accent, borderColor: palette.accent },
  rolePillText: { color: palette.textMid, fontSize: 12, fontWeight: '700' },
  rolePillTextActive: { color: '#FFFFFF' },

  /* Stat Row */
  statIconWrap: { width: 32, height: 32, borderRadius: r.sm, alignItems: 'center', justifyContent: 'center' },

  /* Step Indicator */
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: sp.base,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.borderHi,
  },
  stepCircleDone: { backgroundColor: palette.success, borderColor: palette.success },
  stepCircleActive: { backgroundColor: palette.accent, borderColor: palette.accent },
  stepNumber: { ...type.caption, color: palette.textLow },
  stepLabel: {
    color: palette.textLow,
    fontSize: 9,
    fontWeight: '600',
    position: 'absolute',
    top: 34,
    width: 56,
    textAlign: 'center',
  },
  stepLine: { flex: 1, height: 2, backgroundColor: palette.borderHi, marginHorizontal: -4, marginBottom: 20 },
  stepLineDone: { backgroundColor: palette.success },

  /* Input */
  inputLabel: { ...type.label, color: palette.textMid, marginBottom: 6, fontSize: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.bg2,
    borderRadius: r.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: sp.base,
    minHeight: 48,
  },
  inputWrapFocus: { borderColor: palette.borderAccent },
  input: {
    flex: 1,
    color: palette.textHi,
    minHeight: 46,
    fontFamily: 'Tajawal_400Regular',
    fontSize: 15,
    textAlign: 'right',
  },
  inputArea: { minHeight: 100, paddingVertical: 10, textAlignVertical: 'top' },
  inputError: { color: palette.danger, fontSize: 11, marginTop: 4 },

  /* Search bar */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.bg2,
    borderRadius: r.pill,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: sp.base,
    minHeight: 46,
  },
  searchInput: { flex: 1, color: palette.textHi, paddingVertical: 0, textAlign: 'right' },

  /* Toggle */
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: sp.sm },
  toggleLabel: { fontSize: 14, color: palette.text, flex: 1 },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    ...sh.sm,
  },
});