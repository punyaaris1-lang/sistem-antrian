const CACHE_NAME = 'mlu-turbo-v31'; // Saya naikkan versinya biar refresh
const urlsToCache = [
  './',
  './index.html',
  './antrian.html',
  './lokasi.html',
  './sos.html',
  './artikel.html',
  './manifest.json',
  './mlu-logo.png',
  './1763947427555.jpg',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap'
];

// 1. INSTALL
self.addEventListener('install', event => {
  self.skipWaiting(); // Paksa SW baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching file penting...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Gagal cache:', err))
  );
});

// 2. ACTIVATE (HAPUS CACHE LAMA)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Paksa kontrol semua tab yg terbuka
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Hapus cache lama', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH STRATEGY (ANTI WHITE SCREEN)
self.addEventListener('fetch', event => {
  const req = event.request;

  // Cek apakah request ke Firebase/Google Font (Strategy: Stale While Revalidate)
  if (req.url.includes('firebase') || req.url.includes('googleapis') || req.url.includes('gstatic')) {
    event.respondWith(
        caches.match(req).then(cachedResponse => {
            return cachedResponse || fetch(req);
        })
    );
    return;
  }

  // Cek apakah ini navigasi halaman (HTML)?
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .catch(() => {
          // JIKA OFFLINE/GAGAL: Ambil dari cache
          return caches.match(req)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // FINAL FALLBACK: Jika halaman yg diminta ga ada di cache,
              // kasih 'index.html' utama biar ga White Screen.
              return caches.match('./index.html');
            });
        })
    );
    return;
  }

  // Untuk file aset (Gambar, JS, CSS) -> Cache First
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      return cachedResponse || fetch(req);
    })
  );
});
