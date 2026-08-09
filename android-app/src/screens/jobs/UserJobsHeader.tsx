/**
 * UserJobsHeader — رأس مشترك لشاشتَي "Jobs" و "Applications".
 * يجمع التحيّة + شريط البحث + فلاتر الشرائح + عدّاد النتائج في وحدة واحدة.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette, sp, typ, useEntrance } from '../../design';
import { SearchBar } from '../../ui/atoms/Input';
import { Chip } from '../../ui/atoms/Chip';
import { JOB_FILTERS } from '../../data';

export interface JobsFilterDef {
  id: string;
  name: string;
}

export interface UserJobsHeaderProps {
  /** نص التحيّة العلوية (مثال: "مرحباً، يوسف") — اختياري */
  greeting?: string;
  /** العنوان الكبير تحت التحيّة */
  title: string;
  /** قيمة البحث الحالية */
  search: string;
  onSearchChange: (t: string) => void;
  /** معرف الفلتر النشط */
  filter: string;
  onFilterChange: (id: string) => void;
  /** عدد النتائج المعروضة حالياً */
  count: number;
  /** نص عدّاد النتائج (الافتراضي: "وظيفة متاحة") */
  countLabel?: string;
  /** فلاتر الشرائح (الافتراضي: JOB_FILTERS) */
  filters?: JobsFilterDef[];
  style?: StyleProp<ViewStyle>;
}

export function UserJobsHeader({
  greeting,
  title,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  count,
  countLabel = 'وظيفة متاحة',
  filters = JOB_FILTERS,
  style,
}: UserJobsHeaderProps) {
  const hero = useEntrance(0, 14);

  return (
    <Animated.View style={[styles.wrap, hero, style]}>
      {/* التحيّة + العنوان */}
      {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
      <Text style={styles.title}>{title}</Text>

      {/* شريط البحث */}
      <SearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder="ابحث عن وظيفة، شركة أو مهارة..."
        style={styles.search}
      />

      {/* فلاتر الشرائح — صف واحد تمرير أفقي */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {filters.map((f) => (
          <Chip
            key={f.id}
            label={f.name}
            active={filter === f.id}
            onPress={() => onFilterChange(f.id)}
          />
        ))}
      </ScrollView>

      {/* عدّاد النتائج */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{count} {countLabel}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: sp.base },
  greeting: { ...typ.bodyS, color: palette.textMid },
  title: { ...typ.display, color: palette.textHi, marginTop: 2, marginBottom: sp.base },
  search: { marginBottom: sp.base },
  chipsRow: { gap: sp.sm, paddingVertical: 2, paddingEnd: sp.screen },
  countRow: { marginTop: sp.base, marginBottom: sp.sm },
  countText: { ...typ.label, color: palette.textMid, fontWeight: '800' },
});
