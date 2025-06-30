self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('reboot-cache').then(function(cache) {
      return cache.addAll([
        'index.html',
        'section1.html',
        'section2.html',
        'section3.html',
        'section4.html',
        'section5.html',
        'section6.html',
        'bonus.html',
        'manifest.json',
        'icon.png'
      ]);
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});