const CACHE_NAME = 'sabbir-os-v4.0.1';
const STATIC_CACHE = 'sabbir-static-v4.0.1';
const OFFLINE_URL = '/';

const STATIC_ASSETS = [
  OFFLINE_URL,
  '/favicon.ico',
  '/branding/the-sabbir-avatar-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== STATIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })()
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only same-origin GETs. Media (video/audio) and Range requests go straight to the network:
  // the Cache API cannot store partial (206) responses and serving them from cache breaks seeking.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.headers.has('range') || event.request.destination === 'video' || event.request.destination === 'audio') return;

  // HTML Navigation: Network first, fallback to offline shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          // Optional: clone and cache the successful HTML response?
          return networkResponse;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_URL) || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    event.request.destination === 'image' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(event.request);
        
        const networkPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || (await networkPromise) || Response.error();
      })()
    );
  }
});
