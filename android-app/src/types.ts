/**
 * JobEzz — Central TypeScript type definitions
 * Covers domain models, navigation params, component props, and API responses.
 */
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

/* ─────────────────────────────────────────────
 * 1. Domain Models
 * ───────────────────────────────────────────── */

export type Language = 'ar' | 'en';

export type UserRole = 'customer' | 'jobseeker' | 'student' | 'provider' | 'employer' | 'instructor' | 'admin';

export type ServiceMode = 'instant' | 'quote';

export type JobType = 'full_time' | 'part_time' | 'remote' | 'contract';

export type ApplicationStatus = 'applied' | 'review' | 'shortlisted' | 'rejected' | 'accepted';

export type PaymentMethodId = 'cash' | 'bank' | 'gateway';

export type InvoiceType = 'service' | 'course' | 'job_post';

export interface User {
  id: string;
  name: string;
  phone: string;
  city: string;
  roles: UserRole[];
  verified: boolean;
  wallet: number;
  avatar: string | null;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  profileCompletion?: number;
  totalReviews?: number;
  avgRating?: number;
  completedJobs?: number;
  savedJobs?: string[];
  /** Supabase-mapped aggregates (profileRowToUser); prefer avgRating/totalReviews when set */
  rating?: number;
  reviews?: number;
}

export interface Provider {
  id: string;
  name: string;
  cat: string;
  icon: string;
  verified: boolean;
  rating: number;
  jobs: number;
  price: string;
  dist: string;
  eta: string;
  online: boolean;
  cert?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  cat: string;
  type: string;
  loc: string;
  salary: string;
  date: string;
  verified: boolean;
}

export interface Course {
  id: string;
  title: string;
  sub: string;
  cat: string;
  lessons: number;
  hours: number;
  students: number;
  rating: number;
  price: string;
  icon: string;
  cert: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  mode: ServiceMode;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMine: boolean;
}

export interface Chat {
  id: string;
  name: string;
  role: string;
  icon: string;
  verified: boolean;
  last: string;
  time: string;
  online: boolean;
}

export interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read?: boolean;
}

export interface Invoice {
  id: string;
  type: string;
  amount: number;
  date: string;
  method: string;
  pct: number;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  icon: string;
  desc: string;
  enabled: boolean;
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
}

export interface Applicant {
  id: string;
  name: string;
  exp: string;
  verified: boolean;
  rating: number;
  status: ApplicationStatus;
}

export interface JobPosting {
  id: string;
  title: string;
  cat: string;
  loc: string;
  status: string;
  applicants: number;
  type: string;
}

export interface MyApplication {
  id: string;
  job: string;
  company: string;
  logo: string;
  status: ApplicationStatus;
  date: string;
}

export interface PlatformSettings {
  commission: number;
  featured: string[];
}

/* ─────────────────────────────────────────────
 * 2. Navigation Param Types
 * ───────────────────────────────────────────── */

/** Params for every Stack screen (undefined = no params needed) */
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Otp: { phone: string };
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  /* services flow */
  ServiceRequest: { cat?: string } | undefined;
  ServiceMatch: { cat?: string } | undefined;
  ServiceTrack: { pid?: string } | undefined;
  ServiceRate: { pid?: string } | undefined;
  /* premium services flow (v3) */
  TechnicianList: { catId?: string } | undefined;
  TechnicianProfile: { tid: string };
  Booking: { tid: string };
  /* jobs */
  JobDetail: { id: string };
  JobApply: { id: string };
  EmployerJobs: undefined;
  EmployerPost: undefined;
  EmployerApplicants: { postingId?: string } | undefined;
  CompanyProfile: { companyId?: string } | undefined;
  Applications: undefined;
  SavedJobs: undefined;
  /* academy */
  CourseDetail: { id: string };
  CourseLearn: { id: string };
  CourseQuiz: { id: string };
  Certificate: { id: string };
  InstructorDashboard: undefined;
  /* trust / payments */
  Reviews: { type?: string; id?: string } | undefined;
  Report: { targetId?: string; targetType?: string } | undefined;
  Checkout: { amount: number; description: string; pid?: string };
  Invoice: { id: string; amount?: number; type?: string };
  /* provider */
  ProviderDashboard: undefined;
  ProviderIncoming: undefined;
  ProviderActive: undefined;
  /* chat / notifs / account */
  ChatList: undefined;
  Chat: { id: string };
  Notifs: undefined;
  Wallet: undefined;
  Settings: undefined;
  Admin: undefined;
  Legal: { section?: 'privacy' | 'terms' } | undefined;
};

/** Bottom-tab navigator params */
export type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Services: undefined;
  Courses: undefined;
  Profile: undefined;
};

/* ─────────────────────────────────────────────
 * 3. Navigation Prop Helpers
 * ───────────────────────────────────────────── */

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  RootStackNavigationProp
>;

export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;

/* ─────────────────────────────────────────────
 * 4. Component Prop Types
 * ───────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export interface CardProps {
  children: React.ReactNode;
  style?: object;
  mb?: number;
  onPress?: () => void;
}

export interface ScreenProps {
  children: React.ReactNode;
  bg?: string;
  noPad?: boolean;
}

export interface RowProps {
  children: React.ReactNode;
  between?: boolean;
  gap?: number;
  style?: object;
}

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  right?: () => void;
  navigation?: RootStackNavigationProp;
}

export interface AvatarProps {
  name: string;
  size?: number;
  uri?: string | null;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'success' | 'warning' | 'danger' | 'gray';
  style?: object;
}

export interface StarsProps {
  n: number;
  size?: number;
}

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export interface SelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  error?: string;
}

/* ─────────────────────────────────────────────
 * 5. Form Validation Types
 * ───────────────────────────────────────────── */

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'phone'; message?: string }
  | { type: 'custom'; validate: (value: string) => boolean; message?: string };

export interface FieldConfig {
  rules: ValidationRule[];
}

export type FormErrors<T extends string = string> = Partial<Record<T, string>>;

/* ─────────────────────────────────────────────
 * 6. API Response Types (future backend)
 * ───────────────────────────────────────────── */

export interface ApiMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: ApiMeta;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  phone: string;
  password?: string;
  otp?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/* ─────────────────────────────────────────────
 * 7. Store Types
 * ───────────────────────────────────────────── */

export interface AppState {
  lang: Language;
  providerMode: boolean;
  roles: UserRole[];
  user: User | null;
  darkMode: boolean;
  savedJobIds: string[];
  /** true بعد استكمال جلسة Auth من Supabase */
  isAuthenticated: boolean;
  /** true بعد انتهاء أول فحص جلسة (لتفادي وميض مسار) */
  authReady: boolean;
  /** حالة اشتراك المزوّد. null = مستعمل عادي / لا اشتراك */
  subscriptionStatus: SubscriptionStatus | null;
  /** تاريخ انتهاء الاشتراك (ISO) أو null */
  subscriptionExpiresAt: string | null;
}

export interface AppActions {
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  setProviderMode: (on: boolean) => void;
  toggleProviderMode: () => void;
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  setDarkMode: (on: boolean) => void;
  toggleDarkMode: () => void;
  toggleSavedJob: (id: string) => void;
  setAuthenticated: (v: boolean) => void;
  setSubscription: (status: SubscriptionStatus | null, expiresAt?: string | null) => void;
  /** تحميل الجلسة الحالية من Supabase عند بدء التطبيق (يعيّن authReady عند النهاية) */
  hydrateAuth: () => Promise<void>;
  /** تسجيل خروج كامل (مسح session + profile) */
  signOut: () => Promise<void>;
}

export type AppStore = AppState & AppActions;

/* ─────────────────────────────────────────────
 * 8. Theme Types
 * ───────────────────────────────────────────── */

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  navy: string;
  navy700: string;
  navy600: string;
  blue: string;
  blue600: string;
  blue100: string;
  white: string;
  grayBg: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray500: string;
  gray700: string;
  ink: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBarBg: string;
}

export interface ShadowDef {
  elevation: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
}

export interface Theme {
  colors: ThemeColors;
  spacing: SpacingScale;
  typography: TypographyScale;
  shadows: Record<'sm' | 'md' | 'lg' | 'neo' | 'neoInset', ShadowDef>;
  radii: RadiiScale;
}

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface TypographyScale {
  h1: { fontSize: number; fontWeight: '700' | '800'; lineHeight: number };
  h2: { fontSize: number; fontWeight: '700' | '800'; lineHeight: number };
  h3: { fontSize: number; fontWeight: '600' | '700'; lineHeight: number };
  body: { fontSize: number; fontWeight: '400'; lineHeight: number };
  bodyBold: { fontSize: number; fontWeight: '700'; lineHeight: number };
  caption: { fontSize: number; fontWeight: '400'; lineHeight: number };
  button: { fontSize: number; fontWeight: '700'; lineHeight: number };
}

export interface RadiiScale {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

/* ─────────────────────────────────────────────
 * 9. Supabase Row Types (mirror of schema.sql)
 * ───────────────────────────────────────────── */

export type SubscriptionStatus = 'inactive' | 'pending' | 'trial' | 'active' | 'past_due' | 'cancelled';
export type RequestStatus = 'pending' | 'accepted' | 'on_way' | 'in_progress' | 'completed' | 'rated' | 'cancelled';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface ProfileRow {
  id: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  roles: UserRole[];
  city: string;
  bio: string;
  skills: string[];
  is_verified: boolean;
  rating: number;
  review_count: number;
  price_range: string;
  wallet_balance: number;
  locale: Language;
  expo_push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  provider_id: string;
  plan_months: number;
  amount: number;
  currency: 'LYD';
  status: SubscriptionStatus;
  payment_ref: string | null;
  activation_note: string;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategoryRow {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface ServiceRequestRow {
  id: string;
  customer_id: string;
  category_id: string;
  description: string;
  photos: string[];
  address_text: string;
  status: RequestStatus;
  assigned_provider: string | null;
  price_agreed: number | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  request_id: string | null;
  customer_id: string;
  provider_id: string;
  starts_at: string;
  ends_at: string | null;
  status: RequestStatus;
  total_price: number;
  paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRow {
  id: string;
  employer_id: string;
  title: string;
  company_name: string;
  category: string;
  type: string;
  subtype: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  city: string;
  description: string;
  skills: string[];
  featured: boolean;
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
}

export interface ApplicationRow {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string;
  status: ApplicationStatus;
  applied_at: string;
}

export interface CourseRow {
  id: string;
  instructor_id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  lessons_count: number;
  duration_hrs: number | null;
  is_published: boolean;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  job_id: string | null;
  booking_id: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface PaymentEventRow {
  id: string;
  subscription_id: string | null;
  gateway: string;
  gateway_ref: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  raw_payload: Record<string, unknown>;
  created_at: string;
}

/** Database generic used by @supabase/supabase-js */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow>; Update: Partial<ProfileRow> };
      service_categories: { Row: ServiceCategoryRow; Insert: Partial<ServiceCategoryRow>; Update: Partial<ServiceCategoryRow> };
      service_requests: { Row: ServiceRequestRow; Insert: Partial<ServiceRequestRow>; Update: Partial<ServiceRequestRow> };
      bookings: { Row: BookingRow; Insert: Partial<BookingRow>; Update: Partial<BookingRow> };
      subscriptions: { Row: SubscriptionRow; Insert: Partial<SubscriptionRow>; Update: Partial<SubscriptionRow> };
      payment_events: { Row: PaymentEventRow; Insert: Partial<PaymentEventRow>; Update: Partial<PaymentEventRow> };
      jobs: { Row: JobRow; Insert: Partial<JobRow>; Update: Partial<JobRow> };
      applications: { Row: ApplicationRow; Insert: Partial<ApplicationRow>; Update: Partial<ApplicationRow> };
      courses: { Row: CourseRow; Insert: Partial<CourseRow>; Update: Partial<CourseRow> };
      messages: { Row: MessageRow; Insert: Partial<MessageRow>; Update: Partial<MessageRow> };
      conversations: { Row: ConversationRow; Insert: Partial<ConversationRow>; Update: Partial<ConversationRow> };
    };
    Views: {
      active_providers: { Row: ProfileRow };
      conversations_with_unread: { Row: ConversationRow & { unread_count: number } };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      subscription_status: SubscriptionStatus;
      request_status: RequestStatus;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
