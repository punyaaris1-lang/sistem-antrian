const CACHE_NAME = 'mlu-app-v12-final-png'; // Update versi
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'lokasi.html',
  'artikel.html',
  'manifest.json',
  'mlu-logo.png', // <--- Pastikan ini PNG
  // Background JPG tetap disimpan untuk background halaman
  '1763947427555.jpg' 
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Gunakan catch agar aplikasi tetap jalan walau gambar error
        return cache.addAll(urlsToCache).catch(err => console.log('Cache error ignored:', err));
      })
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Hapus Cache Lama
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
