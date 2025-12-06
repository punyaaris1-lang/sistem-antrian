const CACHE_NAME = 'mlu-safe-v35'; // Ganti versi biar reset
const OFFLINE_URL = './index.html';

// HANYA cache file yang 100% PASTI ADA. 
// Jangan masukkan gambar background yg namanya aneh-aneh disini.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './mlu-logo.png' 
];

// 1. INSTALL (Dibuat sangat aman)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Force add index.html dulu
        return cache.add(OFFLINE_URL).then(() => {
            // Baru coba add sisanya, kalau gagal biarin aja (catch)
            // Biar SW tetap terinstall meski ada file hilang
            return cache.addAll(urlsToCache).catch(err => console.log('Ada file missing, tapi lanjut aja:', err));
        });
      })
  );
});

// 2. ACTIVATE (Bersihkan sampah lama)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH (Anti White Screen Logic)
self.addEventListener('fetch', event => {
  const req = event.request;

  // A. Jika Navigasi Halaman (Buka Aplikasi)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .catch(() => {
          // Kalau internet mati / fetch gagal, buka cache
          return caches.match(OFFLINE_URL); 
        })
    );
    return;
  }

  // B. Jika Asset Lain (Gambar/CSS/JS)
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      // 1. Cek Cache
      if (cachedResponse) return cachedResponse;
      
      // 2. Jika tidak ada, ambil Network
      return fetch(req).then(networkResponse => {
          return networkResponse;
      }).catch(err => {
          // Jika gambar gagal load (offline), biarkan kosong (jangan error)
          return new Response('', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      });
    })
  );
});
