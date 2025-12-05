const CACHE_NAME = 'mlu-safe-mode-v8';

// Kita kosongkan dulu daftar wajib cache agar tidak ada error 404
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Paksa aktif langsung
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('SW Install Error (Abaikan):', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Ambil alih kontrol halaman
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
