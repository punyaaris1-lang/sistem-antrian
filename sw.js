const CACHE_NAME = 'mlu-reset-fix-v15'; // Versi baru wajib beda
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'manifest.json',
  // Hanya masukkan file yg PASTI ada. Jika ragu, jangan masukkan gambar ke sini.
  // Biarkan gambar load lewat internet agar tidak bikin blank.
];

// 1. INSTALL & PAKSA AKTIF
self.addEventListener('install', event => {
  self.skipWaiting(); // Penting: Langsung aktif tanpa nunggu browser tutup
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('SW Install Warning:', err))
  );
});

// 2. HAPUS CACHE SAMPAH (Penyebab White Screen)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache rusak:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. STRATEGI: NETWORK FIRST (Internet Dulu, Baru Cache)
// Ini mencegah aplikasi "nyangkut" di versi lama/rusak
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
