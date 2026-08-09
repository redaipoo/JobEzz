/**
 * JobEzz — Live Data Layer (طبقة بيانات حية)
 *
 * كل دالة هنا: supabase أولاً، بيانات مضمّنة ثانياً.
 * عند غياب الإعداد (وضع التطوير) ترجع null أو تتعامل محلياً،
 * فتبقى كل الشاشات تعمل دون خادم.
 */
import { getSupabase, isSupabaseConfigured } from './supabase';
import { useEffect, useState } from 'react';

function db() {
  return getSupabase() as any;
}

/* ═══════════════════════════════════════════════
 * Providers / Technicians — بوابة الاشتراك عبر view active_providers
 * ═══════════════════════════════════════════════ */

/** المزوّدون الظاهرون (أصحاب اشتراك فعّال فقط) أو null للوضع المحلي */
export async function loadActiveProviders(): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await db()
      .from('active_providers')
      .select('*')
      .order('rating', { ascending: false });
    return error ? null : (data ?? []);
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════
 * Live Provider mapping → شكل شاشات الفنيين
 * (نافذة على view active_providers — بوابة الاشتراك)
 * ═══════════════════════════════════════════════ */

export interface LiveProvider {
  id: string;
  name: string;
  catId: string;
  cat: string;
  city: string;
  rating: number;
  reviews: number;
  priceMin: number;
  priceMax: number;
  price: string;
  online: boolean;
  availability: string;
  years: number;
  jobs: number;
  bio: string;
  languages: string[];
  skills: string[];
  cover?: string;
  verified: boolean;
  cert?: string;
  trustBadges: string[];
  responseMin: number;
  responseTime: string;
  completionRate: number;
  emergency?: boolean;
  icon: string;
  dist: string;
  distKm: number;
  eta: string;
  etaMin: number;
  gender: string;
  workingHours: string;
}

/** مفاتيح الربط بالعربية — مطابقة المهارات مع الفئة */
const CAT_KEYWORDS: Record<string, string[]> = {
  plumber: ['سباك', 'تمديد', 'تسليك', 'مياه', 'حمامات', 'مجاري'],
  electrician: ['كهربائي', 'كهرباء', 'إنارة', 'تمديدات كهربائية', 'مفتاح حماية'],
  ac: ['تكييف', 'تبريد', 'مكيف', 'غاز تكييف'],
  mover: ['نقل', 'أثاث', 'فك وتركيب', 'تنقيل'],
  water: ['مياه عذبة', 'توصيل مياه', 'مياه شرب'],
  mechanic: ['ميكانيكي', 'سيارات', 'صيانة سيارات', 'زيت'],
  carpenter: ['نجار', 'خشب', 'أثاث', 'دولاب'],
  cleaning: ['تنظيف', 'تعقيم', 'نظافة', 'مدابغ'],
  solar: ['شمسية', 'طاقة', 'ألواح', 'إنفرتر'],
  tailor: ['خياطة', 'تفصيل', 'خياط', 'تعديل'],
  mason: ['بناء', 'مساح', 'تشطيبات', 'تبليط', 'نقاش'],
  pest: ['حشرات', 'مكافحة', 'إبادة', 'صراصير', 'نمل'],
  tutor: ['تدريس', 'دروس', 'معلم', 'تأسيس', 'قاعدة بيانات', 'لغات'],
  photo: ['تصوير', 'مونتاج', 'فوتوغرافي', 'تصميم'],
  aluminum: ['ألمنيوم', 'شبابيك', 'مطابخ', 'واجهات', 'جلدات'],
  barber: ['حلاقة', 'كوافير', 'تزيين'],
};

/** إرجاع catId الأقرب للمزوّد حسب مهاراته، أو '' حين لا يتطابق */
export function matchProviderCatId(p: Pick<LiveProvider, 'skills' | 'cat'>): string {
  const haystack = [...(p.skills ?? []), p.cat].join(' ').toLowerCase();
  let best = '';
  let bestScore = 0;
  for (const [catId, kws] of Object.entries(CAT_KEYWORDS)) {
    const score = kws.filter((k) => haystack.includes(k.toLowerCase())).length;
    if (score > bestScore) { bestScore = score; best = catId; }
  }
  return best;
}

export function mapProfileToProvider(p: any): LiveProvider {
  const range = String(p.price_range || '').replace(/\s/g, '');
  const [pm = '0', pM = '0'] = range.split('-');
  const priceMin = Number(pm) || 0;
  const priceMax = Number(pM) || priceMin;
  const verified = !!p.is_verified;
  return {
    id: p.id,
    name: p.full_name || 'فني موثّق',
    catId: '',
    cat: 'فني خدمي',
    city: p.city || 'بنغازي',
    rating: Number(p.rating ?? 0),
    reviews: Number(p.review_count ?? 0),
    priceMin,
    priceMax,
    price: p.price_range || `${priceMin} د.ل`,
    online: true,
    availability: 'متاح اليوم',
    years: 0,
    jobs: 0,
    bio: p.bio || p.skills?.join(' · ') || '',
    languages: ['العربية'],
    skills: p.skills ?? [],
    verified,
    cert: verified ? 'موثّق من JobEzz' : undefined,
    trustBadges: verified ? ['موثّق'] : [],
    responseMin: 30,
    responseTime: 'أقل من ساعة',
    completionRate: 100,
    icon: 'wrench',
    dist: 'أقل من 1 كم',
    distKm: 0,
    eta: 'دقائق',
    etaMin: 30,
    gender: 'm',
    workingHours: '8:00 ص - 8:00 م',
  };
}

/** مزامنة مع matchProviderCatId — تُستخدم لضبط catId بعد التحميل */
export function enrichProviderCat(p: LiveProvider): LiveProvider {
  const catId = matchProviderCatId(p);
  return catId ? { ...p, catId } : p;
}

const liveCache: { providers: LiveProvider[] | null; ts: number } = { providers: null, ts: 0 };

/** تحميل المزوّدين النشطين مرة + تخزين مؤقت 60 ثانية */
export async function getLiveProviders(): Promise<LiveProvider[] | null> {
  if (!isSupabaseConfigured()) return null;
  if (liveCache.providers && Date.now() - liveCache.ts < 60_000) return liveCache.providers;
  const rows = await loadActiveProviders();
  if (!rows) return null;
  const mapped = rows.map((p: any) => enrichProviderCat(mapProfileToProvider(p)));
  liveCache.providers = mapped;
  liveCache.ts = Date.now();
  return mapped;
}

/** Hook: المزوّدون النشطون حياً (Supabase) — null في وضع التطوير المحلي */
export function useLiveProviders(limit?: number): LiveProvider[] | null {
  const [list, setList] = useState<LiveProvider[] | null>(null);
  useEffect(() => {
    let active = true;
    getLiveProviders().then((rows) => {
      if (!active || !rows) return;
      setList(limit && limit > 0 ? rows.slice(0, limit) : rows);
    });
    return () => { active = false; };
  }, [limit]);
  return list;
}

/** حلّ فني واحد من القائمة الحية حسب المعرف */
export function useLiveTechnician(id?: string): LiveProvider | null {
  const list = useLiveProviders();
  return id && list ? list.find((t) => t.id === id) ?? null : null;
}

/* ═══════════════════════════════════════════════
 * Jobs
 * ═══════════════════════════════════════════════ */

export async function loadJobs(filters?: { q?: string; type?: string }): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    let q = db().from('jobs').select('*').eq('is_active', true);
    if (filters?.type && filters.type !== 'all') {
      const map: Record<string, string> = { fulltime: 'full_time', parttime: 'part_time', remote: 'remote', contract: 'contract' };
      q = q.eq('type', map[filters.type] || filters.type);
    }
    const { data, error } = await q.order('published_at', { ascending: false }).limit(50);
    return error ? null : (data ?? []);
  } catch {
    return null;
  }
}

export async function loadJobDetail(id: string): Promise<any | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await db().from('jobs').select('*').eq('id', id).maybeSingle();
    return error ? null : data;
  } catch {
    return null;
  }
}

/** تقديم وظيفة (تسجيل application) */
export async function submitApplication(jobId: string, applicantId: string, coverLetter: string): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured()) return { ok: false, message: 'وضع محلي · جارٍ إرسال الطلب' };
  try {
    const { error } = await db().from('applications').insert({
      job_id: jobId,
      applicant_id: applicantId,
      cover_letter: coverLetter,
      status: 'applied',
    });
    return error ? { ok: false, message: error.message } : { ok: true, message: 'تم إرسال طلبك' };
  } catch {
    return { ok: false, message: 'تعذّر الاتصال بالخادم' };
  }
}

/* ═══════════════════════════════════════════════
 * Courses
 * ═══════════════════════════════════════════════ */

export async function loadCourses(): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await db()
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return error ? null : (data ?? []);
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════
 * Service requests — إنشاء طلب خدمة مباشر
 * ═══════════════════════════════════════════════ */

export async function createServiceRequest(
  customerId: string,
  categoryId: string,
  description: string,
  addressText = '',
): Promise<{ ok: boolean; id?: string; message: string }> {
  if (!isSupabaseConfigured()) return { ok: false, message: 'وضع محلي' };
  try {
    const { data, error } = await db()
      .from('service_requests')
      .insert({
        customer_id: customerId,
        category_id: categoryId,
        description,
        address_text: addressText,
        status: 'pending',
      })
      .select('id')
      .single();
    return error ? { ok: false, message: error.message } : { ok: true, id: data?.id, message: 'تم إرسال طلبك' };
  } catch {
    return { ok: false, message: 'تعذّر الاتصال بالخادم' };
  }
}

/* ═══════════════════════════════════════════════
 * Notifications
 * ═══════════════════════════════════════════════ */

export async function loadNotifications(userId: string): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await db()
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);
    return error ? null : (data ?? []);
  } catch {
    return null;
  }
}

export async function markNotificationsRead(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await db()
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);
  } catch {
    /* ignore */
  }
}

/* ═══════════════════════════════════════════════
 * Chat — رسائل حية عبر Realtime
 * ═══════════════════════════════════════════════ */

export async function loadMessages(conversationId: string): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await db()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(200);
    return error ? null : (data ?? []);
  } catch {
    return null;
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured()) return { ok: false, message: 'وضع محلي' };
  try {
    const { error } = await db().from('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body,
    });
    return error ? { ok: false, message: error.message } : { ok: true, message: 'أُرسلت' };
  } catch {
    return { ok: false, message: 'تعذّر الإرسال' };
  }
}

export type MessageListener = (payload: any) => void;

/**
 * اشتراك Realtime على رسائل محادثة.
 * يرجع دالة إلغاء الاشتراك — استدعها عند تفكيك الشاشة.
 */
export function subscribeToMessages(conversationId: string, onMessage: MessageListener): () => void {
  if (!isSupabaseConfigured()) return () => {};
  let channel: any = null;
  try {
    channel = db()
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        onMessage,
      )
      .subscribe();
  } catch {
    /* ignore */
  }
  return () => {
    try {
      if (channel) db().removeChannel(channel);
    } catch {
      /* ignore */
    }
  };
}

/** اشتراك Realtime على طلبات الخدمة الجديدة (المزوّدون) */
export function subscribeToRequests(onRequest: (payload: any) => void): () => void {
  if (!isSupabaseConfigured()) return () => {};
  let channel: any = null;
  try {
    channel = db()
      .channel('service_requests:new')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_requests' },
        onRequest,
      )
      .subscribe();
  } catch {
    /* ignore */
  }
  return () => {
    try {
      if (channel) db().removeChannel(channel);
    } catch {
      /* ignore */
    }
  };
}
