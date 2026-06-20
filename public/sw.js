const CACHE_VERSION = 'v1';
const STATIC_CACHE = `xmstore-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `xmstore-images-${CACHE_VERSION}`;
const NAV_CACHE = `xmstore-pages-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/products',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== NAV_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Helper: check if a request is for an image
function isImageRequest(url) {
  const path = new URL(url).pathname;
  return (
    path.match(/\.(png|jpg|jpeg|gif|webp|svg|avif)$/i) ||
    url.includes('images.unsplash.com') ||
    url.includes('unsplash.com')
  );
}

// Helper: check if a request is a navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Helper: check if a request is an API call
function isApiRequest(url) {
  return url.includes('/api/');
}

// Helper: check if a request is a static asset
function isStaticAsset(url) {
  const path = new URL(url).pathname;
  return (
    path.startsWith('/_next/') ||
    path.match(/\.(js|css|woff2?|ttf|otf|json)$/i)
  );
}

// Fetch: handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // API requests: NetworkOnly
  if (isApiRequest(url)) {
    return;
  }

  // Image requests: CacheFirst (with network update)
  if (isImageRequest(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Static assets: CacheFirst
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          return (
            cached ||
            fetch(request).then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
          );
        });
      })
    );
    return;
  }

  // Navigation: NetworkFirst with offline fallback
  if (isNavigationRequest(request)) {
    event.respondWith(
      caches.open(NAV_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            return caches.match(request).then((cached) => {
              return cached || caches.match('/offline');
            });
          });
      })
    );
    return;
  }

  // Everything else: NetworkFirst
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
