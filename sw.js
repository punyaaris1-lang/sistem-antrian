const CACHE_NAME = 'mlu-network-first-v26'; // Versi baru
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'manifest.json'
];

// 1. INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache file penting saja, tapi jangan batalkan install jika gagal
        return cache.addAll(urlsToCache).catch(err => console.log('SW: Cache warning', err));
      })
  );
});

// 2. AKTIVASI & BERSIH CACHE
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH (STRATEGI: NETWORK FIRST)
// Selalu coba ambil file terbaru dari internet.
// Jika internet mati, baru ambil dari memori.
// Ini mencegah aplikasi "nyangkut" di layar putih.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
