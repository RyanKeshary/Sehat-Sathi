const CACHE_NAME = 'sehat-sathi-shell-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/images/sehat sathi logo .png',
  // Add other critical assets here
];

// 1. Install Event - Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event - Stategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy for API Calls: Network-First with Cache/IDB Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
              headers: { 'Content-Type': 'application/json' },
            });
          });
        })
    );
    return;
  }

  // Strategy for Navigation: Cache-First (App Shell)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Strategy for Static Assets (Images, Fonts, CSS, JS): Cache-First
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      });
    })
  );
});

// 4. Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'health-record-sync') {
    event.waitUntil(syncHealthRecords());
  }
});

async function syncHealthRecords() {
  // Mock background sync logic
  console.log('Background sync starting...');
  // In a real app, you'd read from IndexedDB and push to API
  return new Promise((resolve) => {
    setTimeout(() => {
      self.registration.showNotification('Sehat Sathi', {
        body: '3 health records synced successfully',
        icon: '/assets/images/sehat sathi logo .png',
      });
      console.log('Sync complete');
      resolve();
    }, 2000);
  });
}
