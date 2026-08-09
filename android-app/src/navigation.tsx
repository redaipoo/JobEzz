/**
 * JobEzz — Advanced navigation utilities
 * -----------------------------------------------------------------------------
 * Centralizes everything navigation-related beyond the basic stack/tab setup:
 *
 *  - Typed navigation param lists + strongly-typed hooks
 *  - Deep-linking configuration (URL → screen mapping)
 *  - Navigation-state persistence (restore last session via MMKV)
 *  - Custom screen-transition presets (slide, modal, fade, shared)
 *  - Bottom-sheet integration (provider + imperative hook)
 *
 * @module navigation
 */
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
  type NavigationState,
  type PartialState,
  type LinkingOptions,
} from '@react-navigation/native';
import type { StackNavigationProp, StackCardStyleInterpolator } from '@react-navigation/stack';
import { TransitionPresets, TransitionSpecs } from '@react-navigation/stack';

import { storage } from './hooks';
import type { RootStackParamList, MainTabParamList } from './types';

/* ─────────────────────────────────────────────
 * 1. Typed navigation hooks
 * ───────────────────────────────────────────── */

/** Strongly-typed navigation prop for any Root Stack screen. */
export type AppNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * A typed `useNavigation` for Root Stack screens — removes the need to annotate
 * the generic at every call site.
 *
 * @returns A typed stack navigation prop.
 *
 * @example
 * const nav = useAppNavigation();
 * nav.navigate('JobDetail', { id: '1' });
 */
export function useAppNavigation(): AppNavigationProp {
  return useNavigation<AppNavigationProp>();
}

/**
 * A typed `useRoute` for a specific Root Stack screen.
 *
 * @typeParam T - The screen name from {@link RootStackParamList}.
 * @returns The typed route prop for that screen.
 *
 * @example
 * const route = useAppRoute<'JobDetail'>();
 * const { id } = route.params;
 */
export function useAppRoute<T extends keyof RootStackParamList>(): RouteProp<RootStackParamList, T> {
  return useRoute<RouteProp<RootStackParamList, T>>();
}

/** Typed navigation prop for bottom-tab screens. */
export type AppTabNavigationProp = StackNavigationProp<MainTabParamList>;

/* ─────────────────────────────────────────────
 * 2. Deep-linking configuration
 * ───────────────────────────────────────────── */

/**
 * Deep-linking config mapping JobEzz URLs to screens. Supports both the custom
 * `jobezz://` scheme and universal/app links on `https://jobezz.example`.
 *
 * Examples:
 *  - jobezz://jobs/123            → JobDetail { id: '123' }
 *  - https://jobezz.example/courses/9 → CourseDetail { id: '9' }
 *  - jobezz://services?category=سباكة → ServiceRequest { categoryId }
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['jobezz://', 'https://jobezz.example', 'https://www.jobezz.example'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      RoleSelect: 'roles',
      Auth: 'auth',
      Otp: 'otp',
      MainTabs: {
        path: 'app',
        screens: {
          Home: 'home',
          Jobs: 'jobs',
          Services: 'services',
          Courses: 'courses',
          Profile: 'profile',
        },
      },
      ServiceRequest: 'services/request',
      ServiceMatch: 'services/match',
      ServiceTrack: 'services/track',
      ServiceRate: 'services/rate',
      JobDetail: 'jobs/:id',
      JobApply: 'jobs/:id/apply',
      EmployerJobs: 'employer/jobs',
      EmployerPost: 'employer/post',
      EmployerApplicants: 'employer/applicants',
      CompanyProfile: 'companies/:companyId',
      Applications: 'applications',
      SavedJobs: 'saved',
      CourseDetail: 'courses/:id',
      CourseLearn: 'courses/:id/learn',
      CourseQuiz: 'courses/:id/quiz',
      Certificate: 'courses/:id/certificate',
      InstructorDashboard: 'instructor',
      Reviews: 'reviews',
      Report: 'report',
      Checkout: 'checkout',
      Invoice: 'invoices/:id',
      ProviderDashboard: 'provider',
      ProviderIncoming: 'provider/incoming',
      ProviderActive: 'provider/active',
      ChatList: 'chats',
      Chat: 'chats/:id',
      Notifs: 'notifications',
      Wallet: 'wallet',
      Settings: 'settings',
      Admin: 'admin',
      Legal: 'legal/:section',
    },
  },
};

/**
 * Build a shareable URL for a given path template (e.g. `'jobs/:id'`).
 *
 * @param path - The path template.
 * @returns The full https URL.
 */
export function buildShareURL(path: string): string {
  return `https://jobezz.example/${path.replace(/^\//, '')}`;
}

/**
 * Subscribe to incoming deep links and forward them to a handler. Returns an
 * unsubscribe function (useful in `useEffect`).
 *
 * @param handler - Callback receiving the raw URL string.
 * @returns A cleanup function that removes the listener.
 */
export function subscribeToDeepLinks(handler: (url: string) => void): () => void {
  const sub = Linking.addEventListener('url', ({ url }) => handler(url));
  return () => sub.remove();
}

/* ─────────────────────────────────────────────
 * 3. Navigation state persistence
 * ───────────────────────────────────────────── */

const NAV_STATE_KEY = 'navigation.state';

/** Debounce timer for persisting navigation state. */
let persistTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Load the previously persisted navigation state (if any). Pass the result to
 * `NavigationContainer`'s `initialState` prop to restore the last session.
 *
 * @returns The persisted state, or `undefined` on first launch / parse error.
 */
export function loadNavigationState(): NavigationState | PartialState<NavigationState> | undefined {
  try {
    const raw = storage.getString(NAV_STATE_KEY);
    return raw ? (JSON.parse(raw) as NavigationState) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Persist navigation state, debounced by 500ms so rapid navigation doesn't
 * thrash storage. Wire this to `NavigationContainer`'s `onStateChange`.
 *
 * @param state - The latest navigation state.
 */
export function saveNavigationState(state: NavigationState | undefined): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      if (state) storage.set(NAV_STATE_KEY, JSON.stringify(state));
    } catch {
      /* ignore serialization errors */
    }
  }, 500);
}

/** Clear persisted navigation state (e.g. on logout). */
export function clearNavigationState(): void {
  storage.delete(NAV_STATE_KEY);
}

/**
 * Hook that manages the `isReady` gate + restored `initialState` for
 * `NavigationContainer`. Splash screens should wait until `isReady` is true.
 *
 * @returns `{ isReady, initialState }`.
 *
 * @example
 * const { isReady, initialState } = usePersistedNavigationState();
 * <NavigationContainer initialState={initialState} ... />
 */
export function usePersistedNavigationState(): {
  isReady: boolean;
  initialState: NavigationState | PartialState<NavigationState> | undefined;
} {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<
    NavigationState | PartialState<NavigationState> | undefined
  >();

  useEffect(() => {
    setInitialState(loadNavigationState());
    setIsReady(true);
  }, []);

  return { isReady, initialState };
}

/* ─────────────────────────────────────────────
 * 4. Custom screen transitions
 * ───────────────────────────────────────────── */

/**
 * A horizontal slide-with-fade card interpolator. Screens slide in from the
 * right while the previous screen dims slightly — a premium iOS-like feel.
 */
export const slideFadeInterpolator: StackCardStyleInterpolator = ({ current, layouts }) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });
  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });
  return { cardStyle: { transform: [{ translateX }], opacity } };
};

/**
 * A vertical slide-up interpolator for modal-style screens.
 */
export const modalSlideUpInterpolator: StackCardStyleInterpolator = ({ current, layouts }) => {
  const translateY = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.height, 0],
  });
  return { cardStyle: { transform: [{ translateY }] } };
};

/**
 * Ready-to-spread `screenOptions` presets for the Root Stack navigator.
 *
 * @example
 * <Stack.Navigator screenOptions={NAV_TRANSITIONS.slide}>
 */
export const NAV_TRANSITIONS = {
  /** iOS-style horizontal push (default). */
  slide: {
    ...TransitionPresets.SlideFromRightIOS,
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
  },
  /** Bottom-sheet-like modal slide-up. */
  modal: {
    ...TransitionPresets.ModalSlideFromBottomIOS,
    gestureEnabled: true,
    gestureDirection: 'vertical' as const,
  },
  /** Cross-fade between screens. */
  fade: {
    ...TransitionPresets.DefaultTransition,
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  },
  /** Custom horizontal slide + fade. */
  custom: {
    cardStyleInterpolator: slideFadeInterpolator,
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
  },
} as const;

export { TransitionPresets };
export type { RootStackParamList, MainTabParamList };
