/**
 * greetingAr — Arabic time-of-day greeting for hub/hero headers.
 * Pure helper: no React, no native modules. Returns the greeting WITHOUT
 * a trailing name; callers append the user's first name separately.
 */
export function greetingAr(hour: number = new Date().getHours()): string {
  if (hour < 5) return 'مساء الخير،';
  if (hour < 12) return 'صباح الخير،';
  if (hour < 17) return 'طاب يومك،';
  return 'مساء الخير،';
}
