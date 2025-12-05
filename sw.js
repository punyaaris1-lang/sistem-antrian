const CACHE_NAME = 'mlu-logo-v9-final'; // Versi baru
const urlsToCache = [
  '/',
  'index.html',
  'antrian.html',
  'lokasi.html',
  'sos.html',
  'artikel.html',
  'manifest.json',
  '1763947427555.jpg' // Logo Asli
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        // Gunakan return agar install tuntas
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        // JIKA ADA ERROR (Misal gambar tidak ketemu), 
        // Aplikasi TETAP AKAN TERINSTALL (Tidak Stuck)
        console.log('Ada file gagal cache, tapi lanjut install:', err);
      })
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
