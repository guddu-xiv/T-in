// Taiyariya Service Worker for PWA Offline Shell & App Installability
const CACHE_NAME = 'taiyariya-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache asset failure (graceful):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => {
        if (response) return response;
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        return new Response('Offline content unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })
  );
});
