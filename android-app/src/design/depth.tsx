/**
 * JobEzz — Visual Depth System
 * Subtle background gradient + ambient glow + frosted surfaces.
 * Used as a screen root wrapper to give every screen the same premium feel
 * — never reduces readability because gradients stay very dark.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, sp } from './tokens';


/**
 * Subtle full-screen navy gradient background.
 * Place as a position:absolute child behind content — or use <DepthBackground>
 * wrapper that places it behind its children.
 */
export function DepthGradient({
  variant = 'screen',
  style,
}: {
  variant?: 'screen' | 'hero' | 'warm' | 'card';
  style?: StyleProp<ViewStyle>;
}) {
  const stops =
    variant === 'hero'   ? palette.gradientHero
  : variant === 'warm'   ? palette.gradientWarm
  : variant === 'card'   ? palette.gradientCard
  :                       palette.gradientScreen;
  return (
    <LinearGradient
      colors={stops as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[absStyles.full, style]}
    />
  );
}

/**
 * Soft radial-glow blob (top corner accent halo).
 * Use sparingly to add ambient depth — never over text.
 */
export function AmbientGlow({
  position = 'topRight',
  color = palette.accent,
  size = 320,
  opacity = 0.10,
  style,
}: {
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  color?: string;
  size?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pos =
    position === 'topRight'    ? { top: -size * 0.35, right: -size * 0.25 }
  : position === 'topLeft'     ? { top: -size * 0.35, left:  -size * 0.25 }
  : position === 'bottomRight' ? { bottom: -size * 0.35, right: -size * 0.25 }
  :                              { bottom: -size * 0.35, left:  -size * 0.25 };
  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          ...pos,
        },
        style,
      ]}
    />
  );
}

/**
 * Convenience wrapper: depth gradient + optional glow + content.
 * <DepthScreen> automatically adds screen padding and the global navy gradient.
 */
export function DepthScreen({
  children,
  variant = 'screen',
  glow = true,
  glowPosition = 'topRight',
  glowColor,
  style,
}: {
  children: React.ReactNode;
  variant?: 'screen' | 'hero' | 'warm';
  glow?: boolean;
  glowPosition?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[absStyles.fill, style]}>
      <DepthGradient variant={variant} />
      {glow && <AmbientGlow position={glowPosition} color={glowColor} />}
      <View style={dsStyles.content}>{children}</View>
    </View>
  );
}

const absStyles = StyleSheet.create({
  full: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  fill: { flex: 1, position: 'relative' },
});

const dsStyles = StyleSheet.create({
  content: { flex: 1, position: 'relative', paddingHorizontal: sp.screen },
});
