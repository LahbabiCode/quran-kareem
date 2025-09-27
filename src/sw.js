// Quran Kareem Service Worker
// This service worker provides offline functionality and caching

const CACHE_NAME = 'quran-kareem-v1.0.0';
const STATIC_CACHE_NAME = 'quran-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'quran-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  // Add main app files
  '/main.js',
  '/styles.css',
  // Add commonly accessed routes
  '/surah-list',
  '/prayer-times',
  '/qibla',
  '/tasbih',
  '/adhkar',
  '/asma-ul-husna'
];

// API endpoints and dynamic content
const DYNAMIC_URLS = [
  '/api/',
  'https://api.alquran.cloud/',
  'https://api.aladhan.com/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
  
  // Force the service worker to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin && !DYNAMIC_URLS.some(apiUrl => request.url.includes(apiUrl))) {
    return;
  }
  
  if (request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('Service Worker: Serving from cache', request.url);
          return response;
        }
        
        // Fetch from network
        return fetch(request)
          .then((fetchResponse) => {
            // Check if response is valid
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Clone the response
            const responseToCache = fetchResponse.clone();
            
            // Determine which cache to use
            const cacheName = isDynamicRequest(request) ? DYNAMIC_CACHE_NAME : STATIC_CACHE_NAME;
            
            // Add to cache
            caches.open(cacheName)
              .then((cache) => {
                if (shouldCache(request)) {
                  console.log('Service Worker: Caching new resource', request.url);
                  cache.put(request, responseToCache);
                }
              });
            
            return fetchResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed, serving offline page', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return offline message for other requests
            return new Response(
              JSON.stringify({ 
                error: 'Offline', 
                message: 'This content is not available offline',
                message_ar: 'هذا المحتوى غير متوفر في وضع عدم الاتصال'
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
              }
            );
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-bookmarks') {
    event.waitUntil(syncBookmarks());
  }
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Push notifications for prayer times
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'حان وقت الصلاة - Prayer time reminder',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'prayer-time',
    requireInteraction: true,
    actions: [
      {
        action: 'open-app',
        title: 'فتح التطبيق',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق',
        icon: '/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('القرآن الكريم - Quran Kareem', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'open-app') {
    event.waitUntil(
      clients.matchAll().then((clients) => {
        // If app is already open, focus it
        const client = clients.find(c => c.visibilityState === 'visible');
        if (client) {
          client.focus();
        } else {
          // Open the app
          clients.openWindow('/');
        }
      })
    );
  }
});

// Utility functions
function isDynamicRequest(request) {
  return DYNAMIC_URLS.some(url => request.url.includes(url)) ||
         request.url.includes('/api/') ||
         request.url.includes('json');
}

function shouldCache(request) {
  // Don't cache POST requests or requests with query parameters (except specific ones)
  if (request.method !== 'GET') {
    return false;
  }
  
  const url = new URL(request.url);
  
  // Cache API responses but not auth-related endpoints
  if (url.pathname.includes('/api/')) {
    return !url.pathname.includes('/auth/') && !url.pathname.includes('/user/');
  }
  
  // Cache static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'font' ||
      request.destination === 'audio') {
    return true;
  }
  
  return true;
}

async function syncBookmarks() {
  try {
    console.log('Service Worker: Syncing bookmarks');
    // Implement bookmark sync logic here
    // This would sync with server when online
  } catch (error) {
    console.error('Service Worker: Bookmark sync failed', error);
  }
}

async function syncFavorites() {
  try {
    console.log('Service Worker: Syncing favorites');
    // Implement favorites sync logic here
    // This would sync with server when online
  } catch (error) {
    console.error('Service Worker: Favorites sync failed', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const buffer = await response.arrayBuffer();
        totalSize += buffer.byteLength;
      }
    }
  }
  
  return totalSize;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  console.log('Service Worker: All caches cleared');
}