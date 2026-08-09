/**
 * JobEzz — i18n with typed translation keys and createTranslation helper.
 * Backward-compatible: STRINGS is still exported for existing screens.
 */
import type { Language } from './types';

/* ─────────────────────────────────────────────
 * Translation dictionary — every key is typed
 * ───────────────────────────────────────────── */

export interface TranslationDict {
  /* app / nav */
  app: string;
  home: string;
  jobs: string;
  services: string;
  courses: string;
  profile: string;
  /* generic actions */
  search: string;
  start: string;
  next: string;
  back: string;
  continue: string;
  send: string;
  confirm: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  close: string;
  retry: string;
  loading: string;
  /* status */
  verified: string;
  online: string;
  offline: string;
  /* sections */
  wallet: string;
  settings: string;
  messages: string;
  notifs: string;
  all: string;
  newest: string;
  /* services */
  apply: string;
  instant: string;
  quotes: string;
  tracking: string;
  pay: string;
  rate: string;
  requestSvc: string;
  bookJob: string;
  browseCourses: string;
  /* provider / dashboards */
  providerMode: string;
  employerDash: string;
  instructorDash: string;
  /* jobs */
  myApps: string;
  saved: string;
  logout: string;
  /* auth */
  login: string;
  register: string;
  phone: string;
  password: string;
  otp: string;
  forgotPassword: string;
  /* forms */
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  tooShort: string;
  tooLong: string;
  /* errors */
  errorGeneric: string;
  errorNetwork: string;
  errorNotFound: string;
  /* empty states */
  noResults: string;
  noData: string;
  /* v2 — home intents */
  whatNeedToday: string;
  needService: string;
  needServiceDesc: string;
  searchJob: string;
  searchJobDesc: string;
  browseCoursesCta: string;
  myWalletCta: string;
  providerDashboardCta: string;
  seeAll: string;
  nearYou: string;
  availableNow: string;
  /* v2 — subscription / paywall */
  subscription: string;
  activateSubscription: string;
  activateYourVisibility: string;
  subExpires: string;
  subActive: string;
  subInactive: string;
  subPending: string;
  payMonthly: string;
  transferNow: string;
  transferInstructions: string;
  sendingTransfer: string;
  renew: string;
  subscriptionHistory: string;
  /* v2 — roles */
  roleCustomer: string;
  roleSeeker: string;
  roleProvider: string;
  roleEmployer: string;
  roleStudent: string;
  /* v2 — auth */
  enterPhone: string;
  sendCode: string;
  enterCode: string;
  didNotGetCode: string;
  codeResent: string;
  invalidPhoneFormat: string;
  completeOtp: string;
  welcomeGuest: string;
  editProfile: string;
  logOutConfirm: string;
  /* v2 — misc */
  empty: string;
  error: string;
}

/* ─────────────────────────────────────────────
 * Arabic translations
 * ───────────────────────────────────────────── */

const ar: TranslationDict = {
  app: 'JobEzz',
  home: 'الرئيسية',
  jobs: 'وظائف',
  services: 'خدمات',
  courses: 'دورات',
  profile: 'حسابي',
  search: 'ابحث عن وظيفة، خدمة أو دورة...',
  start: 'ابدأ',
  next: 'التالي',
  back: 'رجوع',
  continue: 'متابعة',
  send: 'إرسال',
  confirm: 'تأكيد',
  cancel: 'إلغاء',
  save: 'حفظ',
  delete: 'حذف',
  edit: 'تعديل',
  close: 'إغلاق',
  retry: 'إعادة المحاولة',
  loading: 'جارٍ التحميل...',
  verified: 'موثّق',
  online: 'متصل الآن',
  offline: 'غير متصل',
  wallet: 'المحفظة',
  settings: 'الإعدادات',
  messages: 'الرسائل',
  notifs: 'الإشعارات',
  all: 'الكل',
  newest: 'الأحدث',
  apply: 'تقدّم الآن',
  instant: 'مطابقة فورية',
  quotes: 'عروض أسعار',
  tracking: 'تتبّع المزوّد',
  pay: 'ادفع الآن',
  rate: 'قيّم التجربة',
  requestSvc: 'اطلب خدمة',
  bookJob: 'انشر وظيفة',
  browseCourses: 'تصفّح الدورات',
  providerMode: 'وضع مزوّد الخدمة',
  employerDash: 'لوحة صاحب العمل',
  instructorDash: 'لوحة المدرّب',
  myApps: 'طلباتي الوظيفية',
  saved: 'المحفوظة',
  logout: 'تسجيل الخروج',
  login: 'تسجيل الدخول',
  register: 'إنشاء حساب',
  phone: 'رقم الهاتف',
  password: 'كلمة المرور',
  otp: 'رمز التحقق',
  forgotPassword: 'نسيت كلمة المرور؟',
  required: 'هذا الحقل مطلوب',
  invalidEmail: 'بريد إلكتروني غير صالح',
  invalidPhone: 'رقم هاتف غير صالح',
  tooShort: 'قصير جداً',
  tooLong: 'طويل جداً',
  errorGeneric: 'حدث خطأ غير متوقع',
  errorNetwork: 'تعذّر الاتصال بالشبكة',
  errorNotFound: 'لم يتم العثور على المطلوب',
  noResults: 'لا توجد نتائج',
  noData: 'لا توجد بيانات',
  /* v2 — home intents */
  whatNeedToday: 'ماذا تحتاج اليوم؟',
  needService: 'أطلب خدمة',
  needServiceDesc: 'سباك، كهربائي، نقل... متاح الآن',
  searchJob: 'أبحث عن عمل',
  searchJobDesc: 'وظائف تناسب مهاراتك',
  browseCoursesCta: 'تصفّح الدورات',
  myWalletCta: 'محفظتي',
  providerDashboardCta: 'لوحة المزوّد',
  seeAll: 'عرض الكل',
  nearYou: 'قريب منك',
  availableNow: 'متاح الآن',
  /* v2 — subscription / paywall */
  subscription: 'الاشتراك',
  activateSubscription: 'فعّل ظهورك',
  activateYourVisibility: 'اشترك شهرياً لتظهر للعملاء عند طلب الخدمة في مدينتك',
  subExpires: 'ينتهي في',
  subActive: 'اشتراك نشط',
  subInactive: 'حسابك غير مفعّل',
  subPending: 'بانتظار تأكيد التحويل',
  payMonthly: 'اشتراك شهري',
  transferNow: 'سجّلت التحويل',
  transferInstructions: 'حوّل المبلغ إلى الحساب التالي ثم اضغط "سجّلت التحويل" ليُفعَّل حسابك خلال 24 ساعة',
  sendingTransfer: 'جارٍ إرسال...',
  renew: 'تجديد',
  subscriptionHistory: 'سجل الاشتراكات',
  /* v2 — roles */
  roleCustomer: 'عميل خدمات',
  roleSeeker: 'باحث عن عمل',
  roleProvider: 'مزوّد خدمة',
  roleEmployer: 'صاحب عمل',
  roleStudent: 'طالب دورات',
  /* v2 — auth */
  enterPhone: 'أدخل رقم هاتفك الليبي وسنرسل لك رمزاً للتحقق',
  sendCode: 'إرسال الرمز',
  enterCode: 'أدخل الرمز',
  didNotGetCode: 'لم يصلك الرمز؟ إعادة الإرسال',
  codeResent: 'تم إعادة إرسال الرمز',
  invalidPhoneFormat: 'رقم غير صحيح — استخدم صيغة: 0912345678 أو +218912345678',
  completeOtp: 'أدخل الرمز كاملاً',
  welcomeGuest: 'ضيف JobEzz',
  editProfile: 'تعديل الملف',
  logOutConfirm: 'هل تريد تسجيل الخروج؟',
  /* v2 — misc */
  empty: 'لا يوجد محتوى بعد',
  error: 'حدث خطأ',
};

/* ─────────────────────────────────────────────
 * English translations
 * ───────────────────────────────────────────── */

const en: TranslationDict = {
  app: 'JobEzz',
  home: 'Home',
  jobs: 'Jobs',
  services: 'Services',
  courses: 'Courses',
  profile: 'Account',
  search: 'Search job, service or course...',
  start: 'Get started',
  next: 'Next',
  back: 'Back',
  continue: 'Continue',
  send: 'Send',
  confirm: 'Confirm',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  close: 'Close',
  retry: 'Retry',
  loading: 'Loading...',
  verified: 'Verified',
  online: 'Online now',
  offline: 'Offline',
  wallet: 'Wallet',
  settings: 'Settings',
  messages: 'Messages',
  notifs: 'Notifications',
  all: 'All',
  newest: 'Newest',
  apply: 'Apply now',
  instant: 'Instant match',
  quotes: 'Get quotes',
  tracking: 'Track provider',
  pay: 'Pay now',
  rate: 'Rate experience',
  requestSvc: 'Request service',
  bookJob: 'Post a job',
  browseCourses: 'Browse courses',
  providerMode: 'Provider mode',
  employerDash: 'Employer dashboard',
  instructorDash: 'Instructor dashboard',
  myApps: 'My applications',
  saved: 'Saved',
  logout: 'Log out',
  login: 'Log in',
  register: 'Create account',
  phone: 'Phone number',
  password: 'Password',
  otp: 'Verification code',
  forgotPassword: 'Forgot password?',
  required: 'This field is required',
  invalidEmail: 'Invalid email address',
  invalidPhone: 'Invalid phone number',
  tooShort: 'Too short',
  tooLong: 'Too long',
  errorGeneric: 'Something went wrong',
  errorNetwork: 'Network connection failed',
  errorNotFound: 'Not found',
  noResults: 'No results',
  noData: 'No data',
  /* v2 — home intents */
  whatNeedToday: 'What do you need today?',
  needService: 'Request a service',
  needServiceDesc: 'Plumber, electrician, mover... available now',
  searchJob: 'Find a job',
  searchJobDesc: 'Jobs that match your skills',
  browseCoursesCta: 'Browse courses',
  myWalletCta: 'My wallet',
  providerDashboardCta: 'Provider dashboard',
  seeAll: 'See all',
  nearYou: 'Near you',
  availableNow: 'Available now',
  /* v2 — subscription / paywall */
  subscription: 'Subscription',
  activateSubscription: 'Activate your visibility',
  activateYourVisibility: 'Subscribe monthly to appear to customers when they request a service in your city',
  subExpires: 'Expires on',
  subActive: 'Subscription active',
  subInactive: 'Your account is inactive',
  subPending: 'Awaiting transfer confirmation',
  payMonthly: 'Monthly plan',
  transferNow: "I've made the transfer",
  transferInstructions: 'Transfer the amount to the account below, then press "I\'ve made the transfer" — your account will be activated within 24h',
  sendingTransfer: 'Sending...',
  renew: 'Renew',
  subscriptionHistory: 'Subscription history',
  /* v2 — roles */
  roleCustomer: 'Services customer',
  roleSeeker: 'Job seeker',
  roleProvider: 'Service provider',
  roleEmployer: 'Employer',
  roleStudent: 'Student',
  /* v2 — auth */
  enterPhone: 'Enter your Libyan phone number and we will send you a verification code',
  sendCode: 'Send code',
  enterCode: 'Enter the code',
  didNotGetCode: "Didn't get the code? Resend",
  codeResent: 'Code resent',
  invalidPhoneFormat: 'Invalid number — use: 0912345678 or +218912345678',
  completeOtp: 'Enter the full code',
  welcomeGuest: 'JobEzz guest',
  editProfile: 'Edit profile',
  logOutConfirm: 'Log out?',
  /* v2 — misc */
  empty: 'Nothing here yet',
  error: 'Something went wrong',
};

/* ─────────────────────────────────────────────
 * Exported dictionaries
 * ───────────────────────────────────────────── */

export const TRANSLATIONS: Record<Language, TranslationDict> = { ar, en };

/** @deprecated Use TRANSLATIONS or createTranslation() instead. Kept for backward compat. */
export const STRINGS = TRANSLATIONS;

/* ─────────────────────────────────────────────
 * Type-safe translation helper
 * ───────────────────────────────────────────── */

export type TranslationKey = keyof TranslationDict;

/**
 * Creates a type-safe `t()` function bound to a language.
 *
 * ```ts
 * const t = createTranslation('ar');
 * t('home'); // 'الرئيسية' — fully typed, autocomplete works
 * ```
 */
export function createTranslation(lang: Language) {
  const dict = TRANSLATIONS[lang];
  return function t(key: TranslationKey): string {
    return dict[key] ?? key;
  };
}

/**
 * Hook-friendly factory: call inside a component with the current lang.
 * Returns a `t` function that re-resolves when lang changes.
 */
export function useT(lang: Language) {
  return createTranslation(lang);
}
