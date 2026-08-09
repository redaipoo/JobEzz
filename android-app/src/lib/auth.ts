/**
 * JobEzz — مصادقة المستخدم الحقيقية عبر Supabase Auth
 *
 * يوفّر كل عمليات الدخول/التسجيل/الخروج مع سقوط آمن إلى "mock"
 * عندما لا تكون Supabase مهيأ (مرحلة التطوير المحلي).
 *
 * النموذج: phone (+password PIN اختياري) + OTP SMS (عند تفعيل Twilio)
 */
import { getSupabase, isSupabaseConfigured } from './supabase';

/* ─────────────────────────────────────────────
 * الأنواع المحلية
 * ───────────────────────────────────────────── */

export type AuthResult =
  | { ok: true; mode: 'otp_sent' | 'password_ready' | 'signed_in'; message?: never }
  | { ok: false; mode?: never; message: string };

/* ─────────────────────────────────────────~~~~
 * تطبيع رقم الهاتف الليبي
 * ───────────────────────────────────────────── */

const LIBYA_PREFIX = '+218';

/**
 * يحوّل "091 2345678" أو "0912345678" → "+218912345678"
 * يتحقق من أن الرقم الليبي يبدأ بـ 9 ويصبح طوله 9 أرقام بعد البادئة المحلية.
 */
export function normalizeLibyanPhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-\(\)]/g, '');
  const digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith(LIBYA_PREFIX)) {
    return LIBYA_PREFIX + digits.slice(3);                    // +218 91…
  }
  if (digits.startsWith('218')) {
    return LIBYA_PREFIX + digits.slice(3);
  }
  if (digits.startsWith('0')) {
    return LIBYA_PREFIX + digits.slice(1);                    // 091… → +21891…
  }
  // يبدأ مباشرة بـ 9 (بدون صفر)
  return LIBYA_PREFIX + digits;
}

/** تحقق: يقبل +2189XXXXXXXX فقط (9 أرقام بعد البادئة) */
export const isValidLibyanPhone = (raw: string): boolean => {
  const normalized = normalizeLibyanPhone(raw);
  return /^\+2189\d{8}$/.test(normalized);
};

/* ─────────────────────────────────────────────
 * تسجيل الدخول برقم الهاتف فقط (OTP جديد)
 *
 * يرسل رمز التحقق عبر SMS. عند أول مرة يُنشئ حساباً كاملاً
 * في auth.users ويُنشئ ملفه الشخصي في جدول profiles تلقائياً
 * (عبر trigger handle_new_user) — رقم الهاتف هو كل ما نحتاجه.
 * ───────────────────────────────────────────── */
export async function verifyPhoneOtp(phone: string, token: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    // وضع التطوير: أي رمز 4 خانات يقبل
    if (token.length === 4 || token.length === 6) {
      return { ok: true, mode: 'signed_in' };
    }
    return { ok: false, message: 'أدخل الرمز كاملاً' };
  }
  const normalized = normalizeLibyanPhone(phone);
  const sb = getSupabase();
  const { error } = await sb.auth.verifyOtp({
    phone: normalized,
    token,
    type: 'sms',
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, mode: 'signed_in' };
}

/* ─────────────────────────────────────────────
 * تسجيل الدخول برقم الهاتف فقط (OTP جديد)
 * ───────────────────────────────────────────── */
export async function signInWithPhone(phone: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true, mode: 'otp_sent' };
  }
  const normalized = normalizeLibyanPhone(phone);
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOtp({
    phone: normalized,
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, mode: 'otp_sent' };
}

/* ─────────────────────────────────────────────
 * إرسال OTP جديد (Resend)
 * ───────────────────────────────────────────── */
export async function resendOtp(phone: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: true, mode: 'otp_sent' };
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOtp({
    phone: normalizeLibyanPhone(phone),
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, mode: 'otp_sent' };
}

/* ─────────────────────────────────────────────
 * تسجيل الخروج
 * ───────────────────────────────────────────── */
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await getSupabase().auth.signOut();
}
