/**
 * JobEzz — Global state via Zustand with persist middleware.
 * Backward-compatible: AppProvider + useApp() still work for existing screens.
 *
 * extras v2:
 *  - حالة المصادقة المتصلة بـ Supabase Auth (hydrateAuth + signOut)
 *  - حالة اشتراك المزوّد (subscriptionStatus / subscriptionExpiresAt)
 */
import React, { createContext, useContext, useRef } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER, JOBS } from './data';
import {
  getSupabase,
  isSupabaseConfigured,
  getCurrentProfile,
} from './lib/supabase';
import { signOut as authSignOut } from './lib/auth';
import type {
  AppStore, Language, UserRole, User, SubscriptionStatus,
} from './types';

/* ─────────────────────────────────────────────
 * تحويل ProfileRow (Supabase) → User (شاشات التطبيق الحالية)
 * إضافة هذا الـ mapper يحافظ على استمرار الواجهات دون تعديل مسحّي.
 * ───────────────────────────────────────────── */
function profileRowToUser(row: import('./types').ProfileRow): User {
  return {
    id: row.id,
    name: row.full_name,
    phone: row.phone ?? '',
    city: row.city,
    roles: row.roles.length > 0 ? row.roles : [row.role],
    verified: row.is_verified,
    wallet: row.wallet_balance,
    avatar: row.avatar_url,
    bio: row.bio,
    skills: row.skills,
    rating: row.rating,
    reviews: row.review_count,
    profileCompletion: (row.bio ? 20 : 0) + (row.city ? 15 : 0) + (row.skills?.length ? 15 : 0) + 50,
  } as User;
}

/** المستخدم الضيف عند غياب أي جلسة (وضع التطوير بلا Supabase) */
const GUEST_USER: User = {
  ...(USER as User),
  id: 'guest',
  name: 'ضيف JobEzz',
  phone: '',
  verified: false,
  wallet: 0,
};

/* ─────────────────────────────────────────~~~~
 * Zustand Store
 * ─────────────────────────────────────────~~~~ */

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      /* ── state ── */
      lang: 'ar' as Language,
      providerMode: false,
      roles: ['customer', 'jobseeker', 'student'] as UserRole[],
      user: GUEST_USER,
      darkMode: true,              // Dark-Luxury هو الحالة الافتراضية الجديدة
      savedJobIds: JOBS.filter((j: any) => j.saved).map((j) => j.id),
      isAuthenticated: false,
      authReady: false,
      subscriptionStatus: null,
      subscriptionExpiresAt: null,

      /* ── actions ── */
      setLang: (lang) => set({ lang }),

      toggleLang: () => set({ lang: get().lang === 'ar' ? 'en' : 'ar' }),

      setProviderMode: (on) => set({ providerMode: on }),

      toggleProviderMode: () => set({ providerMode: !get().providerMode }),

      setRoles: (roles) => set({ roles }),

      addRole: (role) => {
        const current = get().roles;
        if (!current.includes(role)) set({ roles: [...current, role] });
      },

      removeRole: (role) => set({ roles: get().roles.filter((r) => r !== role) }),

      setUser: (user) => set({ user }),

      setDarkMode: (on) => set({ darkMode: on }),

      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      toggleSavedJob: (id) => {
        const current = get().savedJobIds;
        set({ savedJobIds: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
      },

      setAuthenticated: (v) => set({ isAuthenticated: v }),

      setSubscription: (status, expiresAt = null) =>
        set({ subscriptionStatus: status, subscriptionExpiresAt: expiresAt }),

      /**
       * تحميل الجلسة + الملف الشخصي + اشتراك المزوّد عند بدء التطبيق.
       * يعمل حتى عند غياب Supabase (وضع ضيف محلي).
       */
      hydrateAuth: async () => {
        try {
          if (!isSupabaseConfigured()) {
            // وضع التطوير المحلي — نسمح بالولوج بلا مصادقة حقيقية
            set({ isAuthenticated: true, user: GUEST_USER });
            return;
          }
          const { data: { session } } = await getSupabase().auth.getSession();
          if (!session) {
            set({ isAuthenticated: false, user: GUEST_USER });
            return;
          }
          const profile = await getCurrentProfile();
          if (!profile) {
            // المستخدم مسجّل دخوله لكن profile لم يُنشأ (Trigger فشل)
            set({ isAuthenticated: true, user: GUEST_USER });
            return;
          }
          // قراءة اشتراك المزوّد الفعّال
          let subStatus: SubscriptionStatus | null = null;
          let subExpires: string | null = null;
          if (profile.role === 'provider') {
            const { data: sub } = await (getSupabase() as any)
              .from('subscriptions')
              .select('status, expires_at')
              .eq('provider_id', session.user.id)
              .in('status', ['active', 'trial'])
              .order('expires_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            if (sub) {
              subStatus = sub.status;
              subExpires = sub.expires_at;
            }
          }
          set({
            isAuthenticated: true,
            user: profileRowToUser(profile),
            roles: profile.roles.length ? profile.roles : [profile.role],
            providerMode: profile.role === 'provider',
            subscriptionStatus: subStatus,
            subscriptionExpiresAt: subExpires,
            lang: profile.locale,
          });
        } catch {
          set({ isAuthenticated: false, user: GUEST_USER });
        } finally {
          set({ authReady: true });
        }
      },

      /** تسجيل خروج — يمسح session Zustand وّ Supabase معاً */
      signOut: async () => {
        await authSignOut().catch(() => { /* تجاهل أخطاء offline */ });
        set({
          isAuthenticated: false,
          user: GUEST_USER,
          roles: ['customer'],
          providerMode: false,
          subscriptionStatus: null,
          subscriptionExpiresAt: null,
        });
      },
    }),
    {
      name: 'jobezz-store',
      storage: createJSONStorage(() => AsyncStorage),
      /* حافظ على اللغة + الثيم + المفضلة؛ لا تحفظ بيانات الجلسة هنا (supabase يديرها) */
      partialize: (state) => ({
        lang: state.lang,
        darkMode: state.darkMode,
        savedJobIds: state.savedJobIds,
      }),
    },
  ),
);

/* ─────────────────────────────────────────~~~~
 * Backward-compatible Context wrapper
 * Existing screens call useApp() — this keeps them working unchanged.
 * ─────────────────────────────────────────~~~~ */

interface AppContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  providerMode: boolean;
  setProviderMode: (on: boolean) => void;
  roles: UserRole[];
  setRoles: (r: UserRole[]) => void;
  user: User;
  darkMode: boolean;
  toggleLang: () => void;
  toggleProviderMode: () => void;
  toggleDarkMode: () => void;
}

const Ctx = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const providerMode = useAppStore((s) => s.providerMode);
  const roles = useAppStore((s) => s.roles);
  const user = useAppStore((s) => s.user);
  const darkMode = useAppStore((s) => s.darkMode);

  const value = useRef<AppContextValue>(null as unknown as AppContextValue);
  value.current = {
    lang,
    setLang: useAppStore.getState().setLang,
    providerMode,
    setProviderMode: useAppStore.getState().setProviderMode,
    roles,
    setRoles: useAppStore.getState().setRoles,
    user: (user ?? GUEST_USER) as User,
    darkMode,
    toggleLang: useAppStore.getState().toggleLang,
    toggleProviderMode: useAppStore.getState().toggleProviderMode,
    toggleDarkMode: useAppStore.getState().toggleDarkMode,
  };

  return <Ctx.Provider value={value.current}>{children}</Ctx.Provider>;
}

/**
 * Legacy hook — returns the same shape as before.
 * New code should prefer `useAppStore(selector)` for granular subscriptions.
 */
export function useApp(): AppContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useApp() must be used inside <AppProvider>');
  }
  return ctx;
}
