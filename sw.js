const CACHE_NAME = 'mlu-lite-v7'; // Versi baru
const urlsToCache = [
  '/',
  'index.html',
  'lokasi.html'
  'artikel.html',
  'antrian.html',
  'manifest.json',
  '1763947427555.jpg'
];

// Install: Hanya cache file kritikal (HTML & Gambar Utama)
// Font & Firebase biarkan load via internet agar tidak bikin error install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching core files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('SW Install Error:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kalau ada di cache, ambil dari cache. Kalau tidak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
