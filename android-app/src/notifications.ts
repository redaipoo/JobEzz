/**
 * JobEzz — Notification service (expo-notifications)
 * -----------------------------------------------------------------------------
 * Safe wrapper: the native module ships with the NEXT EAS build; on builds
 * where it is missing the require() throws and every helper degrades to a
 * no-op, so the currently installed APK keeps working untouched.
 *
 * Remote push (APNs/FCM) activates once a backend issues device tokens; local
 * notifications (application received, booking confirmed) work immediately.
 *
 * @module notifications
 */

/* eslint-disable @typescript-eslint/no-var-requires */

type NotifModule = {
  setNotificationHandler: (handler: unknown) => void;
  requestPermissionsAsync: (opts?: unknown) => Promise<{ status: string }>;
  getPermissionsAsync: () => Promise<{ status: string }>;
  setNotificationChannelAsync: (id: string, opts: unknown) => Promise<unknown>;
  scheduleNotificationAsync: (req: unknown) => Promise<string>;
  addNotificationResponseReceivedListener: (cb: (r: unknown) => void) => { remove: () => void };
  getExpoPushTokenAsync: (opts?: unknown) => Promise<{ data: string }>;
};

let Notifications: NotifModule | null = null;
try {
  /* Dynamic require: on builds without the native module this throws and is
   * caught — the app keeps functioning with notifications disabled. */
  // eslint-disable-next-line global-require
  Notifications = require('expo-notifications');
} catch {
  Notifications = null;
}

export const notificationsAvailable = (): boolean => !!Notifications;

/* ── 1. Foreground presentation ───────────────── */

let handlerSet = false;

/**
 * Configure how notifications behave while the app is in the foreground.
 * Safe to call on every launch.
 */
export function setupNotificationHandler(): void {
  if (!Notifications || handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/* ── 2. Permissions ───────────────────────────── */

export type NotifPermission = 'granted' | 'denied' | 'undetermined';

/**
 * Current notification permission status.
 * @returns 'granted' | 'denied' | 'undetermined' (or 'undetermined' when the
 *          native module is unavailable).
 */
export async function getNotificationPermission(): Promise<NotifPermission> {
  if (!Notifications) return 'undetermined';
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
  } catch {
    return 'undetermined';
  }
}

/**
 * Ask the user for notification permission (Android 13+ shows the system
 * dialog; older versions grant on first use).
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/* ── 3. Local notifications ───────────────────── */

let channelSet = false;

/**
 * Schedule a local notification (fired immediately).
 *
 * @param title   - Notification title (Arabic).
 * @param body    - Notification body (Arabic).
 * @returns true when scheduled, false when the module is unavailable.
 */
export async function notifyNow(title: string, body: string): Promise<boolean> {
  if (!Notifications) return false;
  try {
    if (!channelSet) {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'الافتراضي',
        importance: 4,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#123B5E',
      });
      channelSet = true;
    }
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
    return true;
  } catch {
    return false;
  }
}

/* ── 4. Response handling (deep link on tap) ──── */

/**
 * Subscribe to notification taps. Returns an unsubscribe function.
 *
 * @param handler - Receives the notification payload (or null).
 */
export function onNotificationTap(handler: (data: Record<string, unknown> | null) => void): () => void {
  if (!Notifications) return () => undefined;
  const sub = Notifications.addNotificationResponseReceivedListener((r: any) => {
    const data = r?.notification?.request?.content?.data ?? null;
    handler(typeof data === 'object' && data !== null ? data : null);
  });
  return () => sub.remove();
}

/* ── 5. Remote push scaffold ──────────────────── */

/**
 * Fetch the Expo push token for this device (APNs/FCM). Returns null when the
 * module is missing or permission is denied. Wire to your backend once live.
 */
export async function getPushToken(): Promise<string | null> {
  if (!Notifications) return null;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return null;
    const { data } = await Notifications.getExpoPushTokenAsync();
    return data;
  } catch {
    return null;
  }
}
