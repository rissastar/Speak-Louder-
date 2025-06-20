const CACHE_NAME = 'sllh-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Add any other static assets you have, e.g. CSS, images, PDFs
];

// Install event - cache all required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event - cleanup old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }))
      )
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});