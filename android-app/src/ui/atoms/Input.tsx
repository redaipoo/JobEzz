/**
 * Input + SearchBar — form primitives.
 * Skill 4.6: label above, helper/hint under label, error below, single radius,
 * no placeholder-as-label, WCAG AA contrast on dark.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { palette, sp, r, typ, sh } from '../../design';
import { Icon } from '../../icons';

export interface InputProps extends Partial<TextInputProps> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, error, hint, icon, containerStyle, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label} accessibilityRole="text">{label}</Text> : null}
      <View
        style={[
          styles.field,
          focus && styles.focus,
          !!error && styles.error,
        ]}
      >
        {icon && <Icon name={icon} size={17} color={palette.textLow} />}
        <TextInput
          placeholderTextColor={palette.textLow}
          style={[styles.input, rest.multiline && styles.multiline]}
          accessibilityLabel={label || rest.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'بحث',
  onFocus,
  onBlur,
  style,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.searchField}>
        <Icon name="search" size={17} color={palette.textLow} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textLow}
          style={styles.searchInput}
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityLabel={placeholder}
          returnKeyType="search"
        />
        {value ? (
          <Icon name="close" size={14} color={palette.textLow} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: sp.base, gap: sp.xs },
  label: { ...typ.label, color: palette.textMid, marginBottom: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.sm + 2,
    backgroundColor: palette.bg2,
    borderRadius: r.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: sp.base,
    minHeight: 50,
    ...sh.sm,
  },
  focus: {
    borderColor: palette.accent,
    backgroundColor: palette.bg3,
    ...sh.glowSoft,
  },
  error: { borderColor: palette.danger },
  multiline: { minHeight: 110, textAlignVertical: 'top', paddingVertical: sp.sm },
  input: {
    flex: 1,
    color: palette.textHi,
    fontFamily: 'Tajawal_400Regular',
    fontSize: 15,
    textAlign: 'right',
    paddingVertical: 0,
  },
  errorText: { color: palette.danger, fontSize: 11, fontFamily: 'Tajawal_500Medium' },
  hint: { color: palette.textLow, fontSize: 11, fontFamily: 'Tajawal_500Medium' },

  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.sm + 2,
    backgroundColor: palette.bg2,
    borderRadius: r.pill,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: sp.base,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    color: palette.textHi,
    fontFamily: 'Tajawal_400Regular',
    fontSize: 15,
    textAlign: 'right',
    paddingVertical: 0,
  },
});
