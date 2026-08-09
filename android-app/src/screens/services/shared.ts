/**
 * JobEzz — Services screens (v4): shared helpers.
 * Local fixtures/helpers that belong to the Services flow only.
 * No imports from the old ServicesFlow or the legacy theme.
 */
import { Share } from 'react-native';
import { TECHNICIANS } from '../../data';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { LiveProvider } from '../../lib/queries';

/* Category one-liners for the home category cards. */
export const CATEGORY_DESC: Record<string, string> = {
  plumber: 'تمديدات وصيانة وتسليك مجاري',
  electrician: 'تأسيس وإصلاح أعطال الإنارة',
  ac: 'تركيب وصيانة وشحن غاز',
  mover: 'نقل أثاث فك وتركيب',
  water: 'توصيل مياه عذبة فوري',
  mechanic: 'صيانة سيارات وكشف أعطال',
  carpenter: 'أثاث مخصص وتركيبات خشبية',
  cleaning: 'تنظيف عميق وتعقيم',
  solar: 'تركيب أنظمة طاقة شمسية',
  tailor: 'تفصيل وتعديلات خياطة',
  mason: 'بناء وتقسيمات وتشطيبات',
  pest: 'مكافحة حشرات بمواد آمنة',
  tutor: 'دروس خصوصية جميع المراحل',
  photo: 'جلسات تصوير ومونتاج',
  aluminum: 'شبابيك ومطابخ وواجهات',
  barber: 'حلاقة منزلية بأدوات معقمة',
};

/* Roster sort modes — shared by the technician list header and its sheet. */
export const SORTS = [
  { id: 'rating', label: 'الأعلى تقييماً', icon: 'star' },
  { id: 'nearest', label: 'الأقرب', icon: 'pin' },
  { id: 'price', label: 'الأقل سعراً', icon: 'money' },
  { id: 'fast', label: 'الأسرع استجابة', icon: 'bolt' },
  { id: 'exp', label: 'الأكثر خبرة', icon: 'award' },
  { id: 'jobs', label: 'الأكثر إنجازاً', icon: 'checkCircle' },
  { id: 'available', label: 'متاح الآن', icon: 'dot' },
] as const;

export type SortId = (typeof SORTS)[number]['id'];

/* Honest review samples rendered on the technician profile. */
export const REVIEW_SAMPLES = [
  { name: 'سارة المهدوي', text: 'وصل في الموعد تماماً، عمل نظيف واحترافي. أنصح به بشدة وأفضل من كل اللي جربته.', days: 'قبل 3 أيام', rating: 5 },
  { name: 'علي بن خليل', text: 'جودة ممتازة وسعر منافس. شرح لي المشكلة وطريقة حلها بشكل واضح.', days: 'قبل أسبوع', rating: 5 },
  { name: 'فاطمة الجراري', text: 'التزام تام بالمواعيد واحترافية عالية. سأتعامل معه في كل مرة.', days: 'قبل أسبوعين', rating: 4 },
];

/* Booking date/time pickers. */
export const DATES = ['اليوم', 'غداً', 'بعد غد'];
export const TIMES = ['9:00 ص', '12:00 ظهراً', '17:00 مساءً', '19:00 مساءً'];

/**
 * Per-category aggregate stats over the local roster (used by the home
 * category cards and the popular strip when live data is absent).
 */
export function statsFor(catId: string) {
  const list = TECHNICIANS.filter((t) => t.catId === catId);
  const count = list.length;
  const minDist = list.length ? Math.min(...list.map((t) => t.distKm)) : 0;
  const maxRating = list.length ? Math.max(...list.map((t) => t.rating)) : 0;
  const minPrice = list.length ? Math.min(...list.map((t) => t.priceMin)) : 0;
  const totalJobs = list.reduce((a, t) => a + t.jobs, 0);
  const available = list.filter((t) => t.online && t.availability === 'متاح اليوم').length;
  return { count, minDist, maxRating, minPrice, totalJobs, available };
}

/** Resolve a technician from live data first, then the bundled roster. */
export function findTechnician(tid: string | undefined, live: LiveProvider[] | null) {
  if (!tid) return undefined;
  return (live?.find((x) => x.id === tid)) ?? TECHNICIANS.find((x) => x.id === tid);
}

/**
 * Roster-view type: every field the list/profile/booking screens touch,
 * with optionals collapsed so chained filters/sorts type-check cleanly.
 */
export interface TechnicianView {
  id: string;
  name: string;
  cat: string;
  catId: string;
  rating: number;
  reviews: number;
  jobs: number;
  years: number;
  price: string;
  priceMin: number;
  dist: string;
  distKm: number;
  eta: string;
  responseTime: string;
  responseMin: number;
  online: boolean;
  availability: string;
  emergency: boolean;
  verified: boolean;
  bio: string;
  languages: string[];
  skills: string[];
  trustBadges: string[];
  cover: string;
  completionRate: number;
  workingHours: string;
  cert: string;
}

/** Normalize live or bundled roster entries into TechnicianView. */
export function toTechnicianView(list: (LiveProvider | (typeof TECHNICIANS)[number])[]): TechnicianView[] {
  return list.map((t) => ({
    id: t.id, name: t.name, cat: t.cat, catId: t.catId,
    rating: t.rating, reviews: t.reviews, jobs: t.jobs, years: t.years,
    price: t.price, priceMin: t.priceMin, dist: t.dist, distKm: t.distKm, eta: t.eta,
    responseTime: t.responseTime, responseMin: t.responseMin,
    online: t.online, availability: t.availability,
    emergency: !!t.emergency, verified: !!t.verified,
    bio: t.bio, languages: t.languages, skills: t.skills, trustBadges: t.trustBadges,
    cover: t.cover || '', completionRate: t.completionRate,
    workingHours: t.workingHours, cert: t.cert || '',
  }));
}

/**
 * True while a real (configured) Supabase source is still resolving.
 * When Supabase is not configured the live hook never resolves — the
 * bundled fixtures are shown immediately instead of an infinite skeleton.
 */
export function isLiveLoading(live: LiveProvider[] | null): boolean {
  return isSupabaseConfigured() && live === null;
}

/** Share a technician profile card via the system share sheet. */
export function shareTechnician(t: { name: string; cat: string; rating: number; price: string; city: string }) {
  Share.share({
    message: `${t.name} · ${t.cat} · تقييم ${t.rating} · ${t.price}\n${t.city} · متاح عبر تطبيق JobEzz`,
  }).catch(() => {});
}
