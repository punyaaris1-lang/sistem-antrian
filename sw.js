const CACHE_NAME = 'mlu-turbo-v30'; // Versi baru
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'lokasi.html',
  'sos.html',
  'artikel.html',
  'manifest.json',
  'mlu-logo.png',
  '1763947427555.jpg', // Background
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

// 1. INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Menyimpan file penting...');
        return cache.addAll(urlsToCache).catch(err => console.log('Gagal cache sebagian:', err));
      })
  );
});

// 2. AKTIVASI & BERSIH CACHE LAMA
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

// 3. FETCH STRATEGY (HYBRID)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // STRATEGI A: CACHE FIRST (Untuk Gambar, Font, Script JS) -> SUPER CEPAT
  // File ini jarang berubah, jadi ambil dari HP saja biar ngebut.
  if (req.destination === 'image' || req.destination === 'font' || req.destination === 'script' || req.destination === 'style') {
    event.respondWith(
      caches.match(req).then(cachedResponse => {
        return cachedResponse || fetch(req);
      })
    );
  } 
  // STRATEGI B: NETWORK FIRST (Untuk HTML/Halaman) -> SELALU UPDATE
  // Agar kalau Admin update fitur, user langsung dapat perubahannya.
  else {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match(req);
      })
    );
  }
});
