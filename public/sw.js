/**
 * Service Worker Cache Purge
 * Unregisters any stale caches and bypasses cache completely
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.registration.unregister()).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always fetch directly from network to avoid stale cache in preview
  event.respondWith(fetch(event.request));
});
