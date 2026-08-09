/**
 * JobEzz — Supabase client singleton
 *
 * يوفّر عميل Supabase واحداً مهيأً للاستخدام في React Native:
 *  - تخزين الجلسات في AsyncStorage (دائم عبر إعادة تشغيل التطبيق)
 *  - دعم كشف انقطاع الاتصال تلقائياً (NetInfo)
 *  - سقوط آمن إلى بيانات مضمّنة عند الاتصال البطيء/المنقطع
 *
 * Env vars (انظر .env.example):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

/* ─────────────────────────────────────────────
 * قراءة متغيرات البيئة مع تحقق آمن
 * ───────────────────────────────────────────── */

function envOrThrow(key: string): string {
  const value =
    (typeof process !== 'undefined' && process.env?.[key]) ||
    (globalThis as any)?.[key];
  if (!value) {
    throw new Error(
      `[JobEzz] Missing env var ${key}.\n` +
      `Please copy .env.example → .env and fill it with values from:\n` +
      `Supabase Dashboard → Project Settings → API.`,
    );
  }
  return value;
}

/**
 * Supabase connection values.
 *
 * If EXPO_PUBLIC_SUPABASE_URL is not set (the default for local development),
 * the app falls back to the bundled mock-data layer as defined in src/api.ts.
 * This keeps every screen fully functional offline until a real backend is
 * provisioned — see supabase/SETUP.md for the ten-minute onboarding steps.
 */
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

export function getSupabaseCredentials(): { url: string | null; key: string | null } {
  if (cachedUrl !== null) return { url: cachedUrl, key: cachedKey };
  try {
    cachedUrl = envOrThrow('EXPO_PUBLIC_SUPABASE_URL');
    cachedKey = envOrThrow('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  } catch {
    cachedUrl = null;
    cachedKey = null;
  }
  return { url: cachedUrl, key: cachedKey };
}

/** True when the .env files contain a real Supabase project. */
export function isSupabaseConfigured(): boolean {
  const { url } = getSupabaseCredentials();
  return !!url && !url.includes('your-project-ref');
}

export const SUPABASE_URL = getSupabaseCredentials().url;
export const SUPABASE_ANON_KEY = getSupabaseCredentials().key;

/* ─────────────────────────────────────────────
 * Supabase client — النسخة الوحيدة في التطبيق
 * ───────────────────────────────────────────── */

let client: SupabaseClient<Database, 'public', any> | null = null;

export function getSupabase(): SupabaseClient<Database, 'public', any> {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) {
    throw new Error(
      '[JobEzz] Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env, then restart Metro.'
    );
  }
  if (!client) {
    client = createClient<Database, 'public', any>(url, key, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // React Native — لا يوجد URL
      },
      global: {
        headers: {
          'x-client-info': 'jobezz-android',
        },
      },
    });

    // مراقبة حالة الشبكة لدعم قرارات offline
    NetInfo.addEventListener((state) => {
      // عند عودة الاتصال، أعد مزامنة الاشتراكات المتأخرة
      if (state.isConnected) {
        // no-op الآن: React Query retry مع refetchOnMount يكفيان
      }
    });
  }
  return client;
}

/* ─────────────────────────────────────────────
 * مساعدات الجلسة
 * ───────────────────────────────────────────── */

/** هل المستخدم مسجّل دخوله حالياً؟ */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await getSupabase().auth.getSession();
  return !!session;
}

/** المستخدم الحالي (auth.user) أو null */
export async function getCurrentUser() {
  const { data: { user } } = await getSupabase().auth.getUser();
  return user;
}

/** ملف الملف الشخصي الكامل من جدول profiles */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await (getSupabase() as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return (data ?? null) as import('../types').ProfileRow | null;
}

/** تسجيل خروج نظيف */
export async function signOut() {
  await getSupabase().auth.signOut();
}
