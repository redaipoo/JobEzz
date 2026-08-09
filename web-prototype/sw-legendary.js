/* ============================================================
   JobEzz — Advanced Service Worker v3.0
   Background Sync, Push Notifications, Smart Caching,
   Offline-first Architecture, App Shortcuts
   ============================================================ */

const CACHE_NAME = 'jobezz-legendary-v3.0';
const OFFLINE_URL = '/index.html';
const OFFLINE_IMAGE = '/assets/img/offline.svg';

/* Assets to pre-cache on install */
const PRECACHE_ASSETS = [
  '/index.html',
  '/admin.html',
  '/assets/css/style-legendary.css',
  '/assets/js/data.js',
  '/assets/js/data-extra.js',
  '/assets/js/icons.js',
  '/assets/js/animations-legendary.js',
  '/assets/js/app-legendary.js',
  '/admin.css',
  '/admin-legendary.js',
  '/assets/img/icon.png',
  '/assets/img/logo.png',
  '/manifest.json'
];

/* Runtime caching strategies */
const CACHE_STRATEGIES = {
  // Cache-first for static assets
  static: {
    pattern: /\.(css|js|png|jpg|jpeg|svg|woff2?|ttf|eot)$/,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  // Network-first for API calls
  api: {
    pattern: /\/api\//,
    strategy: 'network-first',
    maxAge: 5 * 60 * 1000 // 5 minutes
  },
  // Stale-while-revalidate for pages
  pages: {
    pattern: /\.html$/,
    strategy: 'stale-while-revalidate',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
};

/* Install: pre-cache core assets */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

/* Activate: clean old caches */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

/* Fetch: Smart caching strategies */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Determine caching strategy
  let strategy = 'network-first';
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(url.pathname)) {
      strategy = config.strategy;
      break;
    }
  }

  event.respondWith(handleRequest(request, strategy));
});

async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'cache-first':
      return cacheFirst(request);
    case 'network-first':
      return networkFirst(request);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request);
    default:
      return networkFirst(request);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache-first failed:', error);
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

/* Background Sync */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-requests') {
    event.waitUntil(syncPendingRequests());
  } else if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncPendingRequests() {
  try {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();

    for (const request of pendingRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        await removePendingRequest(request.id);
        console.log('[SW] Synced request:', request.id);
      } catch (error) {
        console.warn('[SW] Failed to sync request:', request.id, error);
      }
    }

    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_COMPLETE', tag: 'sync-requests' });
    });
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error;
  }
}

async function syncAnalytics() {
  try {
    const events = await getAnalyticsEvents();
    if (events.length > 0) {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
      await clearAnalyticsEvents();
      console.log('[SW] Synced', events.length, 'analytics events');
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
    throw error;
  }
}

/* Push Notifications */
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = {
    title: 'JobEzz',
    body: 'لديك إشعار جديد',
    icon: '/assets/img/icon.png',
    badge: '/assets/img/icon.png',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
    vibrate: [100, 50, 100],
    tag: data.tag || 'jobezz-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    image: data.image,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
});

/* Message handling from clients */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  } else if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(PRECACHE_ASSETS);
        });
      })
    );
  } else if (event.data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      self.registration.showNotification(event.data.title, event.data.options)
    );
  }
});

/* IndexedDB helpers for offline storage */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JobEzzDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingRequests')) {
        db.createObjectStore('pendingRequests', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id' });
      }
    };
  });
}

async function getPendingRequests() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingRequests', 'readonly');
    const store = tx.objectStore('pendingRequests');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingRequest(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingRequests', 'readwrite');
    const store = tx.objectStore('pendingRequests');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getAnalyticsEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('analytics', 'readonly');
    const store = tx.objectStore('analytics');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function clearAnalyticsEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('analytics', 'readwrite');
    const store = tx.objectStore('analytics');
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/* Periodic Background Sync (if supported) */
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'refresh-data') {
    event.waitUntil(refreshData());
  }
});

async function refreshData() {
  try {
    const response = await fetch('/api/data/refresh');
    if (response.ok) {
      const data = await response.json();
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/data', new Response(JSON.stringify(data)));
      console.log('[SW] Data refreshed');
    }
  } catch (error) {
    console.warn('[SW] Data refresh failed:', error);
  }
}

console.log('🚀 JobEzz Advanced Service Worker v3.0 loaded');
