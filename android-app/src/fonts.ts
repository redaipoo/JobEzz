/**
 * Font registry — registers every installed Tajawal weight plus the two
 * Inter weights for Latin text. The `fontFamily` strings exported here are
 * the exact names `useFonts` registers.
 */
import { useFonts } from 'expo-font';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from '@expo-google-fonts/tajawal';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

export const FONTS = {
  tajawal: 'Tajawal_400Regular',
  tajawal500: 'Tajawal_500Medium',
  tajawal700: 'Tajawal_700Bold',
  tajawal800: 'Tajawal_800ExtraBold',
  inter: 'Inter_400Regular',
  inter700: 'Inter_700Bold',
} as const;

/** Resolve a numeric weight to the loaded Tajawal family. */
export function fontFor(weight: string | number | undefined): string {
  const w = String(weight);
  if (w === '800' || w === '900') return FONTS.tajawal800;
  if (w === '700' || w === '600') return FONTS.tajawal700;
  if (w === '500') return FONTS.tajawal500;
  return FONTS.tajawal;
}

/* Backward-compatible aliases (existing screens import these). */
export const FONT_FAMILIES = {
  regular: FONTS.tajawal,
  medium: FONTS.tajawal500,
  bold: FONTS.tajawal700,
  extraBold: FONTS.tajawal800,
  interRegular: FONTS.inter,
  interBold: FONTS.inter700,
} as const;

/** Map fontWeight → registered Tajawal family (legacy alias). */
export function tajawalForWeight(weight: string): string {
  return fontFor(weight);
}

export function useAppFonts(): [boolean, boolean] {
  const [loaded, error] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
    Inter_400Regular,
    Inter_700Bold,
  });
  return [loaded || !!error, !!error];
}
