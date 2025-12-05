const CACHE_NAME = 'mlu-fresh-start-v20'; // Versi loncat jauh biar cache lama mati
const urlsToCache = [
  '/',
  'index.html',
  'mlu-logo.png',
  'manifest.json'
];

// 1. INSTALL & HAPUS CACHE LAMA SEGERA
self.addEventListener('install', event => {
  self.skipWaiting(); // Paksa SW baru aktif detik ini juga
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache bersih dimulai');
        // Gunakan 'addAll' dengan catch agar jika 1 file error, aplikasi TIDAK MATI
        return cache.addAll(urlsToCache).catch(err => console.log('Cache error (diabaikan):', err));
      })
  );
});

// 2. AKTIVASI & BERSIH-BERSIH MEMORI HP
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus semua cache yang bukan versi v20 ini
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Menghapus cache sampah ->', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH (STRATEGI: NETWORK FIRST)
// Selalu coba ambil dari internet dulu. Kalau offline baru ambil cache.
// Ini mencegah White Screen gara-gara cache rusak.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
