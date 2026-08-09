/**
 * BottomTabBar — single source of truth for the app chrome.
 *
 * Replaces the bespoke tab bar in App.tsx and kills every per-screen
 * "paddingBottom: 100/110" magic number by exporting a matching
 * `useTabBarClearance` hook screens pad by.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { palette, sp, r, motion, PressableScale } from '../../design';
import { Icon } from '../../icons';

export interface TabItemDef {
  name: string;
  title: string;
  icon: string;
}

/** Extra bottom padding every tabbed screen uses under its scroll content. */
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, sp.sm) + sp.lg + 56;
}

const TAB_HEIGHT = 60;

export function BottomTabBar({
  items, state, navigation,
}: { items: TabItemDef[]; state: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const [barW, setBarW] = useState(0);
  const itemW = items.length > 0 && barW > 0 ? barW / items.length : 0;
  const dotX = useSharedValue(0);
  const dotW = 18;

  useEffect(() => {
    if (itemW > 0) {
      dotX.value = withSpring(state.index * itemW + (itemW - dotW) / 2, motion.spring.snap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, itemW]);

  const dotStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dotX.value }] }));

  return (
    <View
      style={[
        styles.bar,
        { bottom: Math.max(insets.bottom, sp.sm), height: TAB_HEIGHT },
      ]}
    >
      <View style={styles.inner} onLayout={(e) => setBarW(e.nativeEvent.layout.width)}>
        {barW > 0 && <Animated.View style={[styles.dot, { width: dotW }, dotStyle]} />}
        {items.map((item, index) => (
          <TabItem
            key={item.name}
            item={item}
            focused={state.index === index}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: state.routes[index].key, canPreventDefault: true });
              if (state.index !== index && !event.defaultPrevented) navigation.navigate(item.name);
            }}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({ item, focused, onPress }: { item: TabItemDef; focused: boolean; onPress: () => void }) {
  const scale = useSharedValue(focused ? 1 : 0.92);
  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.92, motion.spring.snap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.9}
      style={styles.item}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
    >
      <Animated.View style={[styles.iconCell, focused && styles.iconCellActive, style]}>
        <Icon
          name={item.icon}
          size={21}
          color={focused ? palette.accent : palette.textLow}
          strokeWidth={focused ? 2.2 : 1.6}
        />
      </Animated.View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {item.title}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: sp.md,
    right: sp.md,
    borderRadius: r.lg,
    backgroundColor: 'rgba(11,17,32,0.94)',
    borderWidth: 1,
    borderColor: palette.borderHi,
    shadowColor: '#00030C',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  inner: { flex: 1, flexDirection: 'row', paddingHorizontal: sp.sm, paddingTop: sp.sm, paddingBottom: sp.sm },
  dot: { position: 'absolute', top: sp.sm + 30, left: 0, height: 4, borderRadius: 2, backgroundColor: palette.accent },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: sp.xs },
  iconCell: { width: 46, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  iconCellActive: { backgroundColor: palette.accentGlow },
  label: { fontSize: 10, fontWeight: '600', color: palette.textLow, marginTop: 3, letterSpacing: 0.3 },
  labelActive: { color: palette.accent, fontWeight: '800', letterSpacing: 0.2 },
});
