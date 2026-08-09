/**
 * JobEzz — Custom React hooks
 * -----------------------------------------------------------------------------
 * A batteries-included hook library covering animation, feedback, timing,
 * persistence, and device state. All hooks are typed and documented.
 *
 *  - useAnimatedValue   → spring-driven shared value
 *  - useHapticFeedback  → semantic haptics
 *  - useSoundEffect     → cached sound playback
 *  - useDebounce        → debounced value
 *  - useInterval        → declarative setInterval
 *  - usePrevious        → previous render value
 *  - useLocalStorage    → MMKV-backed persisted state
 *  - useNetworkStatus   → connectivity + type
 *  - useAppState        → foreground/background state
 *
 * @module hooks
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useSharedValue } from 'react-native-reanimated';

import {
  useSpring,
  triggerHaptic,
  type HapticType,
  type SpringPreset,
  type UseSpringOptions,
} from './animations';

/* ─────────────────────────────────────────────
 * Shared Storage instance (Expo Go + MMKV safe)
 * ───────────────────────────────────────────── */

interface StorageInterface {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | boolean | number) => void;
  delete: (key: string) => void;
  contains: (key: string) => boolean;
}

function createStorage(): StorageInterface {
  try {
    const { MMKV } = require('react-native-mmkv');
    return new MMKV({ id: 'jobezz-storage' });
  } catch {
    const memoryStore: Record<string, string> = {};
    return {
      getString: (key: string) => memoryStore[key],
      set: (key: string, value: string | boolean | number) => {
        memoryStore[key] = String(value);
      },
      delete: (key: string) => {
        delete memoryStore[key];
      },
      contains: (key: string) => key in memoryStore,
    };
  }
}

/**
 * App-wide synchronous key/value store.
 * Uses MMKV on native builds, falling back gracefully to memory store in Expo Go/Web.
 */
export const storage: StorageInterface = createStorage();

/* ─────────────────────────────────────────────
 * 1. useAnimatedValue
 * ───────────────────────────────────────────── */

/**
 * A convenience wrapper around the animation toolkit's spring hook. Returns a
 * Reanimated shared value that springs toward `target` whenever it changes.
 *
 * @param target  - The value to animate toward.
 * @param options - Spring preset/config and optional delay.
 * @returns `{ value, set, stop }`.
 *
 * @example
 * const { value } = useAnimatedValue(visible ? 1 : 0, { config: 'bouncy' });
 */
export function useAnimatedValue(target: number, options: UseSpringOptions = {}) {
  return useSpring(target, options);
}

/* ─────────────────────────────────────────────
 * 2. useHapticFeedback
 * ───────────────────────────────────────────── */

/** Return shape of {@link useHapticFeedback}. */
export interface HapticFeedbackApi {
  /** Fire a haptic of the given type. */
  trigger: (type?: HapticType) => void;
  /** Convenience: light impact. */
  light: () => void;
  /** Convenience: success notification. */
  success: () => void;
  /** Convenience: error notification. */
  error: () => void;
  /** Convenience: selection changed. */
  selection: () => void;
}

/**
 * Access semantic haptic feedback. All methods are stable (memoized) and safe
 * to call from event handlers.
 *
 * @returns A {@link HapticFeedbackApi}.
 *
 * @example
 * const haptics = useHapticFeedback();
 * <Button onPress={() => { haptics.success(); save(); }} />
 */
export function useHapticFeedback(): HapticFeedbackApi {
  const trigger = useCallback((type: HapticType = 'light') => {
    void triggerHaptic(type);
  }, []);

  return useMemo(
    () => ({
      trigger,
      light: () => trigger('light'),
      success: () => trigger('success'),
      error: () => trigger('error'),
      selection: () => trigger('selection'),
    }),
    [trigger],
  );
}

/* ─────────────────────────────────────────────
 * 3. useDebounce
 * ───────────────────────────────────────────── */

/**
 * Return a debounced copy of `value` that only updates after `delay` ms of
 * silence. Perfect for deferring expensive search queries.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce window in ms (default `300`).
 * @returns The debounced value.
 *
 * @example
 * const [query, setQuery] = useState('');
 * const debounced = useDebounce(query, 400);
 * useEffect(() => { if (debounced) search(debounced); }, [debounced]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ─────────────────────────────────────────────
 * 5. useInterval
 * ───────────────────────────────────────────── */

/**
 * Declarative `setInterval`. The latest `callback` is always used without
 * resetting the timer. Pass `delay = null` to pause.
 *
 * @param callback - Function invoked on each tick.
 * @param delay    - Interval in ms, or `null` to pause.
 *
 * @example
 * useInterval(() => setCount((c) => c + 1), running ? 1000 : null);
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/* ─────────────────────────────────────────────
 * 6. usePrevious
 * ───────────────────────────────────────────── */

/**
 * Track the value from the previous render.
 *
 * @param value - The current value.
 * @returns The value from the prior render (`undefined` on first render).
 *
 * @example
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/* ─────────────────────────────────────────────
 * 7. useLocalStorage (MMKV)
 * ───────────────────────────────────────────── */

/**
 * React state persisted synchronously to MMKV. Reads are lazy (once) and writes
 * happen on every update. Supports any JSON-serializable value.
 *
 * @param key          - Storage key.
 * @param initialValue - Fallback when the key is absent.
 * @returns A `[value, setValue, removeValue]` tuple (like `useState` + delete).
 *
 * @example
 * const [onboarded, setOnboarded] = useLocalStorage('onboarded', false);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const readValue = useCallback((): T => {
    try {
      const raw = storage.getString(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          storage.set(key, JSON.stringify(next));
        } catch {
          /* non-serializable — keep in-memory only */
        }
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    storage.delete(key);
    setStored(initialValue);
  }, [key, initialValue]);

  return [stored, setValue, removeValue];
}

/* ─────────────────────────────────────────────
 * 8. useNetworkStatus
 * ───────────────────────────────────────────── */

/** Normalized network status exposed by {@link useNetworkStatus}. */
export interface NetworkStatus {
  /** Whether the device currently has connectivity. */
  isConnected: boolean;
  /** Whether the connection is metered (cellular). */
  isInternetReachable: boolean;
  /** Connection type, e.g. `'wifi'`, `'cellular'`, `'none'`. */
  type: string;
  /** The raw NetInfo state for advanced use. */
  raw: NetInfoState | null;
}

/**
 * Subscribe to connectivity changes via `@react-native-community/netinfo`.
 *
 * @returns A live {@link NetworkStatus} object.
 *
 * @example
 * const { isConnected } = useNetworkStatus();
 * if (!isConnected) showOfflineBanner();
 */
export function useNetworkStatus(): NetworkStatus {
  const [state, setState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(setState);
    // Prime the current value immediately.
    void NetInfo.fetch().then(setState);
    return () => unsubscribe();
  }, []);

  return useMemo<NetworkStatus>(
    () => ({
      isConnected: state?.isConnected ?? true,
      isInternetReachable: state?.isInternetReachable ?? true,
      type: state?.type ?? 'unknown',
      raw: state,
    }),
    [state],
  );
}

/* ─────────────────────────────────────────────
 * 9. useAppState
 * ───────────────────────────────────────────── */

/**
 * Track the app's foreground/background state and optionally react to changes.
 *
 * @param onChange - Optional callback fired whenever the state changes.
 * @returns The current `AppStateStatus` (`'active' | 'background' | 'inactive'`).
 *
 * @example
 * const state = useAppState((s) => { if (s === 'background') flushAnalytics(); });
 */
export function useAppState(onChange?: (state: AppStateStatus) => void): AppStateStatus {
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);
  const savedHandler = useRef(onChange);

  useEffect(() => {
    savedHandler.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      setState(next);
      savedHandler.current?.(next);
    });
    return () => sub.remove();
  }, []);

  return state;
}

/* ─────────────────────────────────────────────
 * Bonus: useSharedValue re-export for convenience
 * ───────────────────────────────────────────── */

export { useSharedValue };
export type { SpringPreset };
