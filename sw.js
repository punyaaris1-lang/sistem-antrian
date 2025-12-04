const CACHE_NAME = 'mlu-app-dynamic-v1';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'lokasi.html',
  'sos.html',
  'antrian.html',
  '1763947427555.jpg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;600;800&display=swap'
];

// 1. INSTALL (Hapus cache lama & simpan file penting)
self.addEventListener('install', (evt) => {
  self.skipWaiting(); // Paksa update service worker baru segera
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. ACTIVATE (Bersihkan versi lama jika nama cache berubah)
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim(); // Ambil alih kontrol halaman segera
});

// 3. FETCH (STRATEGI: NETWORK FIRST, FALLBACK CACHE)
// Coba internet dulu, kalau gagal (offline), baru ambil cache
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request)
      .then((res) => {
        // Jika berhasil ambil dari internet, simpan copy-nya ke cache (untuk update background)
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(evt.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // Jika internet mati/gagal, ambil dari cache
        return caches.match(evt.request);
      })
  );
});
