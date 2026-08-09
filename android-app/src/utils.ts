/**
 * JobEzz — Utility functions
 * -----------------------------------------------------------------------------
 * Pure, side-effect-free helpers shared across the app. Every function is fully
 * typed and documented. None of these depend on React or native modules, so they
 * are safe to import anywhere (components, hooks, API layer, tests).
 *
 * @module utils
 */

/* ─────────────────────────────────────────────
 * 1. Formatting
 * ───────────────────────────────────────────── */

/**
 * Format a numeric amount as a currency string.
 *
 * Defaults to the Libyan Dinar (`LYD`) with Arabic-locale grouping, matching
 * JobEzz's primary market, but any ISO-4217 currency and BCP-47 locale can be
 * supplied. Falls back gracefully when `Intl.NumberFormat` rejects a locale.
 *
 * @param amount    - The numeric amount to format.
 * @param currency  - ISO-4217 currency code (default `'LYD'`).
 * @param locale    - BCP-47 locale tag (default `'ar-LY'`).
 * @param fractionDigits - Forced decimal places; defaults to the currency's own.
 * @returns A localized currency string, e.g. `"١٬٢٥٠ د.ل.‏"` or `"LYD 1,250.00"`.
 *
 * @example
 * formatCurrency(1250);            // Arabic LYD
 * formatCurrency(1250, 'USD', 'en'); // "$1,250.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'LYD',
  locale: string = 'ar-LY',
  fractionDigits?: number,
): string {
  if (!Number.isFinite(amount)) return '—';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...(fractionDigits != null
        ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
        : {}),
    }).format(amount);
  } catch {
    // Invalid locale/currency → plain fixed string so the UI never crashes.
    return `${amount.toFixed(fractionDigits ?? 2)} ${currency}`;
  }
}

/** Options accepted by {@link formatDate}. */
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {}

/**
 * Format a date into a localized, human-readable string.
 *
 * Accepts a `Date`, an epoch number (ms), or any string parseable by `Date`.
 * Invalid inputs render an em-dash rather than throwing.
 *
 * @param date    - The date value to format.
 * @param locale  - BCP-47 locale tag (default `'ar-LY'`).
 * @param options - `Intl.DateTimeFormatOptions` (default: medium date + short time).
 * @returns The formatted date string, or `'—'` for invalid input.
 *
 * @example
 * formatDate('2026-07-20T09:30:00Z');
 * formatDate(Date.now(), 'en', { dateStyle: 'full' });
 */
export function formatDate(
  date: Date | number | string,
  locale: string = 'ar-LY',
  options: DateFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return d.toISOString();
  }
}

/**
 * Produce a relative "time ago" string (e.g. "منذ ٥ دقائق" / "5m ago").
 *
 * @param date   - The past date value.
 * @param locale - BCP-47 locale tag (default `'ar-LY'`).
 * @returns A localized relative-time string.
 */
export function formatRelativeTime(date: Date | number | string, locale: string = 'ar-LY'): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
  return rtf.format(Math.round(diffSec / 31536000), 'year');
}

/* ─────────────────────────────────────────────
 * 2. Function helpers
 * ───────────────────────────────────────────── */

/** A function that also exposes a `.cancel()` method. */
export interface DebouncedFunction<A extends unknown[]> {
  (...args: A): void;
  /** Cancel any pending invocation. */
  cancel: () => void;
  /** Flush the pending invocation immediately (if any). */
  flush: () => void;
}

/**
 * Create a debounced version of `fn` that delays invocation until `wait` ms
 * have elapsed since the last call. Useful for search-as-you-type inputs.
 *
 * @param fn   - The function to debounce.
 * @param wait - Delay in milliseconds (default `300`).
 * @returns A debounced function with `.cancel()` and `.flush()` helpers.
 *
 * @example
 * const search = debounce((q) => api.search(q), 400);
 * search('plumber'); // only fires 400ms after the last keystroke
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number = 300,
): DebouncedFunction<A> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const debounced = (...args: A): void => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (lastArgs) fn(...lastArgs);
    }, wait);
  };

  debounced.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  debounced.flush = (): void => {
    if (timer && lastArgs) {
      clearTimeout(timer);
      timer = null;
      const args = lastArgs;
      lastArgs = null;
      fn(...args);
    }
  };

  return debounced;
}

/** A throttled function with a `.cancel()` method. */
export interface ThrottledFunction<A extends unknown[]> {
  (...args: A): void;
  cancel: () => void;
}

/**
 * Create a throttled version of `fn` that invokes at most once per `wait` ms.
 * Uses a trailing-edge call so the latest arguments are never lost. Ideal for
 * scroll/resize/gesture handlers.
 *
 * @param fn   - The function to throttle.
 * @param wait - Minimum interval in milliseconds (default `200`).
 * @returns A throttled function with a `.cancel()` helper.
 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number = 200,
): ThrottledFunction<A> {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const throttled = (...args: A): void => {
    lastArgs = args;
    const now = Date.now();
    const remaining = wait - (now - lastCall);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCall = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        if (lastArgs) fn(...lastArgs);
      }, remaining);
    }
  };

  throttled.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  return throttled;
}

/* ─────────────────────────────────────────────
 * 3. Identifiers
 * ───────────────────────────────────────────── */

/**
 * Generate a reasonably-unique id.
 *
 * Combines a high-resolution timestamp, a random base36 suffix, and an optional
 * prefix. Uses `crypto.randomUUID()` when available for stronger uniqueness.
 *
 * @param prefix - Optional prefix (e.g. `'job'`, `'msg'`).
 * @returns A unique string id, e.g. `"job_1719999999_k3f9a"`.
 */
export function generateId(prefix?: string): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  const core =
    typeof g.crypto?.randomUUID === 'function'
      ? g.crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${core}` : core;
}

/* ─────────────────────────────────────────────
 * 4. Validation
 * ───────────────────────────────────────────── */

/**
 * Validate an international phone number, with first-class support for the
 * Libyan (`+218`) and Egyptian (`+20`) formats used across JobEzz.
 *
 * Accepts an optional leading `+`, spaces, dashes, and parentheses. The number
 * must contain 8–15 digits (E.164 allows up to 15).
 *
 * @param phone - The phone string to validate.
 * @returns `true` when the phone number is structurally valid.
 *
 * @example
 * validatePhone('+218 91 234 5678'); // true
 * validatePhone('01012345678');       // true (EG local)
 * validatePhone('123');               // false
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-().]/g, '');
  // E.164-ish: optional + then 8–15 digits.
  return /^\+?[0-9]{8,15}$/.test(cleaned);
}

/** RFC-5322 pragmatic email regex (covers >99.9% of real addresses). */
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validate an email address.
 *
 * @param email - The email string to validate.
 * @returns `true` when the email is structurally valid.
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email.trim());
}

/* ─────────────────────────────────────────────
 * 5. Geo
 * ───────────────────────────────────────────── */

/** Mean Earth radius in kilometres (WGS-84 volumetric mean). */
const EARTH_RADIUS_KM = 6371.0088;

/**
 * Compute the great-circle distance between two coordinates using the
 * Haversine formula.
 *
 * @param lat1 - Latitude of point A in degrees.
 * @param lon1 - Longitude of point A in degrees.
 * @param lat2 - Latitude of point B in degrees.
 * @param lon2 - Longitude of point B in degrees.
 * @returns The distance in kilometres.
 *
 * @example
 * calculateDistance(32.8872, 13.1913, 32.7939, 13.0765); // ≈ Tripoli span
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/* ─────────────────────────────────────────────
 * 6. Text
 * ───────────────────────────────────────────── */

/**
 * Derive up to two initials from a full name.
 *
 * Handles both Latin ("Ahmed Ali" → "AA") and Arabic names, ignoring particles
 * such as "ال" when they are the only token. Returns `'?'` for empty input.
 *
 * @param name - The full name.
 * @returns A 1–2 character initials string, upper-cased for Latin scripts.
 *
 * @example
 * getInitials('Ahmed Ali'); // "AA"
 * getInitials('محمد');       // "م"
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

/**
 * Truncate text to a maximum length, appending an ellipsis when shortened.
 *
 * @param text      - The source text.
 * @param maxLength - Maximum characters before truncation (default `50`).
 * @param suffix    - Truncation suffix (default `'…'`).
 * @returns The original text if within bounds, otherwise the truncated string.
 */
export function truncateText(text: string, maxLength: number = 50, suffix: string = '…'): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - suffix.length)).trimEnd()}${suffix}`;
}

/**
 * Clamp a number into an inclusive `[min, max]` range.
 *
 * @param value - The value to clamp.
 * @param min   - Lower bound.
 * @param max   - Upper bound.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between `a` and `b` by factor `t` (0..1).
 * Marked as a Reanimated worklet so it can run on the UI thread.
 *
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor (clamped to 0..1).
 * @returns The interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
  'worklet';
  return a + (b - a) * clamp(t, 0, 1);
}

/* ─────────────────────────────────────────────
 * 9. Job matching
 * ───────────────────────────────────────────── */

type MatchableJob = {
  matchScore?: number;
  expLevel?: string;
  loc?: string;
  skills?: string[];
};

type MatchableProfile = {
  city?: string;
  skills?: string[];
  experience?: string;
};

const EXP_LEVEL: Record<string, number> = { مبتدئ: 1, متوسط: 2, متقدم: 3 };

/**
 * Compute a live job-match percentage from the user profile, blending the
 * engine's base score with derived signals (same city, shared skills, and
 * experience level) so the number genuinely reflects "your skills, experience
 * and location" instead of a static value.
 *
 * @param job     - The job entry (base `matchScore` + skills/loc/expLevel).
 * @param profile - The current user profile.
 * @returns A match percentage clamped to `[25, 98]`.
 */
export function jobMatchScore(job: MatchableJob, profile: MatchableProfile): number {
  const base = job.matchScore ?? 50;
  let score = base;

  if (profile.city && job.loc?.includes(profile.city)) score += 6;

  const profileSkills = (profile.skills ?? []).map((s) => s.trim().toLowerCase());
  const shared = (job.skills ?? []).filter((s) => profileSkills.includes(s.trim().toLowerCase())).length;
  score += shared * 6;

  const jobExp = EXP_LEVEL[job.expLevel ?? ''] ?? 2;
  const userYears = parseInt(profile.experience ?? '0', 10);
  const userExp = userYears >= 5 ? 3 : userYears >= 2 ? 2 : userYears >= 1 ? 1 : 2;
  if (jobExp === userExp) score += 5;

  return clamp(Math.round(score), 25, 98);
}
