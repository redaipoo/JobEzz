/**
 * ListItem — the canonical "row of a menu / list" surface.
 * Enforces press feedback, consistent tile radius, and a single chevron
 * treatment. `badges` slot holds trailing custom content.
 */
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { palette, typ, sp, r, sh, PressableScale } from '../../design';
import { IconTile, RowEdge } from '../atoms/IconTile';

export function ListItem({
  title, body, icon, iconColor, onPress, badge, style,
  destructive = false, disabled = false,
}: {
  title: string;
  body?: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  badge?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  destructive?: boolean;
  disabled?: boolean;
}) {
  const color = destructive ? palette.danger : iconColor || palette.accent;
  return (
    <PressableScale onPress={onPress} disabled={disabled} activeScale={0.98} style={[styles.row, style]}>
      {icon ? <IconTile icon={icon} color={color} style={styles.tile} /> : null}
      <View style={styles.text}>
        <Text style={[styles.title, destructive && styles.titleDanger]} numberOfLines={1}>
          {title}
        </Text>
        {body ? <Text style={styles.body} numberOfLines={1} ellipsizeMode="tail">{body}</Text> : null}
      </View>
      {badge ? <View style={styles.badge}>{badge}</View> : null}
      {onPress ? <RowEdge /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.base,
    backgroundColor: palette.bg3,
    borderRadius: r.md,
    padding: sp.base,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: sp.sm,
    ...sh.sm,
  },
  tile: { width: 40, height: 40 },
  text: { flex: 1, minWidth: 0 },
  title: { ...typ.h4, color: palette.textHi },
  titleDanger: { color: palette.danger },
  body: { ...typ.caption, color: palette.textLow, marginTop: 2 },
  badge: { marginStart: sp.sm },
});
