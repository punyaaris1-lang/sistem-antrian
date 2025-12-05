const CACHE_NAME = 'mlu-app-v10-png'; // Versi baru lagi
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'lokasi.html',
  'sos.html',
  'artikel.html',
  'manifest.json',
  'mlu-logo.png', // <--- GANTI JADI PNG
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Gagal Cache (Cek nama file):', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
