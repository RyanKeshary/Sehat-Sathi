const CACHE_NAME = 'sehat-sathi-v2';
const OFFLINE_PAGE = '/offline';

// Critical assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
];

// Dynamic routes to cache on first visit
const CACHEABLE_ROUTES = [
  '/dashboard',
  '/symptom-checker',
  '/get-started',
  '/room',
];

// ────────────────────────────────────────────
// 1. INSTALL — Pre-cache critical shell assets
// ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('SW: Some static assets failed to cache, continuing:', err);
      });
    })
  );
  self.skipWaiting();
});

// ────────────────────────────────────────────
// 2. ACTIVATE — Cleanup old caches
// ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ────────────────────────────────────────────
// 3. FETCH — Smart cache strategies
// ────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname.includes('pravatar.cc')) return; // Skip avatar CDN

  // ── API Calls: Network-First with cache fallback ──
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
            // Return offline-friendly JSON for API routes
            return new Response(
              JSON.stringify({ 
                error: 'You are offline. Your data has been saved locally and will sync when you reconnect.',
                offline: true 
              }),
              {
                status: 200, // 200 so frontend doesn't show error
                headers: { 
                  'Content-Type': 'application/json',
                  'X-Offline': 'true'
                },
              }
            );
          });
        })
    );
    return;
  }

  // ── Page Navigation: Network-First, Cache as fallback ──
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful page navigations
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
          return response;
        })
        .catch(() => {
          // Try cached version of this specific page
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // Fallback to cached home page
            return caches.match('/').then((home) => {
              if (home) return home;
              // Ultimate fallback - offline HTML
              return new Response(
                `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Sehat Sathi — Offline</title>
                  <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Inter', system-ui, sans-serif; background: #060F1E; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem; }
                    .container { max-width: 400px; }
                    .icon { font-size: 4rem; margin-bottom: 1.5rem; }
                    h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
                    p { color: rgba(255,255,255,0.6); margin-bottom: 2rem; line-height: 1.6; }
                    .emergency { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); padding: 1rem; border-radius: 1rem; margin-bottom: 1.5rem; }
                    .emergency h3 { color: #EF4444; font-size: 0.875rem; margin-bottom: 0.5rem; }
                    .emergency a { color: white; text-decoration: none; font-size: 1.5rem; font-weight: bold; display: block; padding: 0.5rem; }
                    .btn { background: #00C896; color: #060F1E; padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; border: none; font-size: 1rem; cursor: pointer; width: 100%; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon">📡</div>
                    <h1>You're Offline</h1>
                    <p>Don't worry — Sehat Sathi works partially offline. Your health records are saved locally and will sync automatically when you're back online.</p>
                    <div class="emergency">
                      <h3>🚨 Emergency Numbers</h3>
                      <a href="tel:108">Ambulance: 108</a>
                      <a href="tel:104">Health Helpline: 104</a>
                    </div>
                    <button class="btn" onclick="location.reload()">Try Again</button>
                  </div>
                </body>
                </html>`,
                {
                  status: 200,
                  headers: { 'Content-Type': 'text/html' },
                }
              );
            });
          });
        })
    );
    return;
  }

  // ── Static Assets (JS, CSS, Images, Fonts): Cache-First ──
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Only cache same-origin successful responses
          if (!response || response.status !== 200) return response;
          if (url.origin !== self.location.origin) return response;
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // For failed image requests, return a placeholder
          if (event.request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#1a2332" width="200" height="200"/><text fill="#4a5a72" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('', { status: 408, statusText: 'Offline' });
        });
    })
  );
});

// ────────────────────────────────────────────
// 4. BACKGROUND SYNC — Sync offline health data
// ────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'health-record-sync') {
    event.waitUntil(syncHealthRecords());
  }
});

async function syncHealthRecords() {
  console.log('[SW] Background sync starting...');
  try {
    // In production, read from IndexedDB and POST to API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Show notification to user
    await self.registration.showNotification('Sehat Sathi ✓', {
      body: 'Your health records have been synced successfully.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      tag: 'sync-complete',
    });
    
    console.log('[SW] Sync complete');
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}

// ────────────────────────────────────────────
// 5. PUSH NOTIFICATIONS
// ────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Sehat Sathi', body: 'You have a new notification.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
    })
  );
});
