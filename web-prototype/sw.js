/* ============================================================
   JobEzz — Service Worker v2.0
   Offline-first caching strategy
   ============================================================ */

const CACHE_NAME = 'jobezz-v2.0';
const OFFLINE_URL = '/index.html';

/* Assets to pre-cache on install */
const PRECACHE_ASSETS = [
  '/index.html',
  '/admin.html',
  '/assets/css/style.css',
  '/assets/js/data.js',
  '/assets/js/data-extra.js',
  '/assets/js/icons.js',
  '/assets/js/app.js',
  '/admin.css',
  '/admin.js',
  '/assets/img/icon.png',
  '/assets/img/logo.png',
  '/manifest.json'
];

/* Install: pre-cache core assets */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

/* Activate: clean old caches */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* Fetch: network-first with cache fallback */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  /* Skip non-GET requests */
  if (request.method !== 'GET') return;

  /* Skip external requests (fonts, CDN) — let them go to network */
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        /* Cache successful responses */
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        /* Offline: try cache */
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          /* Fallback for navigation requests */
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
