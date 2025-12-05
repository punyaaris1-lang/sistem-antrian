const CACHE_NAME = 'mlu-safe-v25'; // Versi saya naikkan jauh biar HP sadar ini baru
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'lokasi.html',
  'sos.html',
  'artikel.html',
  'manifest.json',
  // Kita HAPUS daftar gambar spesifik dari sini agar tidak bikin error install.
  // Biarkan gambar di-cache otomatis saat user melihatnya nanti.
];

// 1. INSTALL (LANGSUNG JALAN TANPA NUNGGU)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Menyiapkan file inti...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('SW: Ada file gagal download, tapi lanjut aja!', err))
  );
});

// 2. HAPUS CACHE LAMA (PENYEBAB WHITE SCREEN)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Membuang cache sampah ->', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. STRATEGI: NETWORK FIRST (INTERNET DULU, BARU CACHE)
// Ini adalah KUNCI agar tidak blank. Browser dipaksa ambil yang segar dari internet dulu.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Kalau internet mati, baru ambil dari cache
        return caches.match(event.request);
      })
  );
});
