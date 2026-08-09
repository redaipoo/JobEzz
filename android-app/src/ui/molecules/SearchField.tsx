/**
 * SearchField — header-level search bar used by Jobs / Services / Courses.
 * Centralizes the style so no screen recreates its own.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextInput } from 'react-native';
import { palette, sp, r, typ } from '../../design';
import { Icon } from '../../icons';

export function SearchField({
  value, onChangeText, placeholder, style,
  onSubmitEditing, returnKeyType = 'search',
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onSubmitEditing?: () => void;
  returnKeyType?: 'search' | 'done' | 'go' | 'next' | 'send';
}) {
  return (
    <View style={[styles.field, style]}>
      <Icon name="search" size={17} color={palette.textLow} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textLow}
        style={styles.input}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <View style={styles.clear} onTouchEnd={() => onChangeText('')}>
          <Icon name="close" size={12} color={palette.bg0} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.sm,
    backgroundColor: palette.bg2,
    borderRadius: r.pill,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: sp.base,
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: palette.textHi,
    ...typ.body,
    textAlign: 'right',
    paddingVertical: 0,
  },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.textLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
