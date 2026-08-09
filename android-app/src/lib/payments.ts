/**
 * JobEzz — Payment Gateway Abstraction (طبقة دفع محايدة)
 *
 * التطبيق لا يتعامل مع أي بوابة دفع مباشرة إطلاقاً.
 * كل الشاشات تتعامل مع هذه الواجهة فقط، وبالتالي تبديل البوابة
 * (manual → mizapay → tadawul) يتم من إعدادات البيئة دون لمس الكود.
 *
 * Env vars (انظر .env.example):
 *   EXPO_PUBLIC_PAYMENT_GATEWAY      = 'manual' (الافتراضي) | 'mizapay' | 'tadawul'
 *   EXPO_PUBLIC_BANK_TRANSFER_INFO   = JSON بصيغة BankTransferInfo
 */
import { getSupabase, isSupabaseConfigured } from './supabase';

export type PaymentGateway = 'manual' | 'mizapay' | 'tadawul';

export interface SubscriptionPlan {
  id: 'monthly';
  nameAr: string;
  nameEn: string;
  price: number;            /* د.ل */
  currency: 'LYD';
  periodDays: number;
  perks: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    nameAr: 'ظهور مزوّد موثّق',
    nameEn: 'Verified Provider',
    price: 25,
    currency: 'LYD',
    periodDays: 30,
    perks: [
      'الظهور في نتائج البحث والخدمات',
      'استقبال طلبات العملاء الجدد',
      'شارة موثّق بجانب اسمك',
    ],
  },
];

export function getPlan(id: string): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) || SUBSCRIPTION_PLANS[0];
}

/* ─────────────────────────────────────────────
 * بوابة الدفع النشطة (من البيئة، مع سقوط آمن)
 * ───────────────────────────────────────────── */

export function getActiveGateway(): PaymentGateway {
  const raw =
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_PAYMENT_GATEWAY) ||
    (globalThis as any)?.EXPO_PUBLIC_PAYMENT_GATEWAY;
  if (raw === 'mizapay' || raw === 'tadawul') return raw;
  return 'manual';
}

export interface BankTransferInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  note?: string;
}

/** بيانات التحويل البنكي للدفع اليدوي (تُقرأ من البيئة أو القيمة الافتراضية) */
export function getBankTransferInfo(): BankTransferInfo {
  const raw =
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_BANK_TRANSFER_INFO) ||
    (globalThis as any)?.EXPO_PUBLIC_BANK_TRANSFER_INFO;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as BankTransferInfo;
      if (parsed.bankName && parsed.accountNumber) return parsed;
    } catch {
      /* تجاهل JSON غير صالح — نعود للافتراضي */
    }
  }
  return {
    bankName: 'مصرف التجارة والتنمية',
    accountName: 'JobEzz للخدمات التقنية',
    accountNumber: '000-000-000-000',
    note: 'اكتب رقم هاتفك في خانة البيان لإتمام التفعيل',
  };
}

/* ─────────────────────────────────────────────
 * نموذج الفاتورة المحايد
 * ───────────────────────────────────────────── */

export interface SubscriptionInvoice {
  id: string;              /* معرف محلي للعرض */
  subscriptionId: string | null; /* معرف الصف في supabase إن وُجد */
  plan: SubscriptionPlan;
  amount: number;
  currency: 'LYD';
  gateway: PaymentGateway;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

const uid = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase() +
  Date.now().toString(36).slice(-4).toUpperCase();

/**
 * إنشاء اشتراك جديد بحالة pending:
 *  - مع Supabase: إدراج صف في subscriptions + تسجيل payment_event
 *  - محلياً: إرجاع فاتورة محلية (يتم التفعيل يدوياً عبر الأدمن)
 */
export async function createSubscriptionInvoice(
  providerId: string,
  planId: string = 'monthly',
): Promise<SubscriptionInvoice> {
  const plan = getPlan(planId);
  const gateway = getActiveGateway();
  const invoice: SubscriptionInvoice = {
    id: 'SUB-' + uid(),
    subscriptionId: null,
    plan,
    amount: plan.price,
    currency: 'LYD',
    gateway,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const now = new Date();
      const expires = new Date(now.getTime() + plan.periodDays * 86400000);
      const { data, error } = await (getSupabase() as any)
        .from('subscriptions')
        .insert({
          provider_id: providerId,
          plan_months: 1,
          amount: plan.price,
          currency: 'LYD',
          status: 'pending',
          expires_at: expires.toISOString(),
        })
        .select('id')
        .single();
      if (!error && data?.id) {
        invoice.subscriptionId = data.id;
        await (getSupabase() as any)
          .from('payment_events')
          .insert({
            subscription_id: data.id,
            gateway,
            amount: plan.price,
            currency: 'LYD',
            status: 'pending',
            raw_payload: { initiated_from: 'mobile', plan: plan.id },
          });
      }
    } catch {
      /* offline — نعود للفاتورة المحلية */
    }
  }
  return invoice;
}

/**
 * تأكيد استلام التحويل اليدوي من قبل العميل (أو تفعيل الأدمن):
 * مع Supabase → تحديث الاشتراك إلى active + تسجيل حدث confirmed.
 * محلياً → لا شيء (الأدمن يفعّل عبر لوحة Admin).
 */
export async function confirmSubscriptionPayment(
  subscriptionId: string | null,
  providerId: string,
  paymentRef: string,
  opts: { activate?: boolean } = {},
): Promise<{ ok: boolean; message: string }> {
  if (isSupabaseConfigured() && subscriptionId) {
    try {
      const patch: Record<string, unknown> = { payment_ref: paymentRef };
      if (opts.activate) {
        patch.status = 'active';
        patch.activated_at = new Date().toISOString();
      }
      const { error } = await (getSupabase() as any)
        .from('subscriptions')
        .update(patch)
        .eq('id', subscriptionId);
      if (error) return { ok: false, message: error.message };
      await (getSupabase() as any)
        .from('payment_events')
        .insert({
          subscription_id: subscriptionId,
          gateway: 'manual',
          gateway_ref: paymentRef,
          amount: getPlan('monthly').price,
          currency: 'LYD',
          status: opts.activate ? 'confirmed' : 'pending',
          raw_payload: { transfer_ref: paymentRef },
        });
      return { ok: true, message: 'تم تسجيل التحويل' };
    } catch {
      return { ok: false, message: 'تعذّر الاتصال بالخادم' };
    }
  }
  /* وضع محلي: مسجّل محلياً — التفعيل عبر لوحة الأدمن */
  return { ok: true, message: 'تم تسجيل التحويل محلياً · بانتظار تفعيل الأدمن' };
}

/**
 * التفعيل اليدوي من لوحة الأدمن:
 * مع Supabase → تحديث الاشتراك إلى active.
 * محلياً → لا يوجد خادم، التفعيل فوري وهمي (للنموذج).
 */
export async function adminActivateSubscription(
  subscriptionId: string,
  note = 'تفعيل يدوي من الأدمن',
): Promise<{ ok: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await (getSupabase() as any)
        .from('subscriptions')
        .update({
          status: 'active',
          activated_at: new Date().toISOString(),
          activation_note: note,
        })
        .eq('id', subscriptionId)
        .eq('status', 'pending');
      if (error) return { ok: false, message: error.message };
      return { ok: true, message: 'تم تفعيل الاشتراك' };
    } catch {
      return { ok: false, message: 'تعذّر الاتصال بالخادم' };
    }
  }
  return { ok: true, message: 'تم التفعيل محلياً' };
}

/** جلب اشتراكات (لوحة الأدمن: الكل / المحفظة: لمزوّد معيّن) */
export async function listProviderSubscriptions(providerId?: string): Promise<any[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let q = (getSupabase() as any)
      .from('subscriptions')
      .select('*');
    if (providerId && providerId !== '*') q = q.eq('provider_id', providerId);
    const { data } = await q.order('created_at', { ascending: false }).limit(20);
    return data || [];
  } catch {
    return [];
  }
}
