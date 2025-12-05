const CACHE_NAME = 'mlu-app-v5-complete'; // Versi baru lagi
const urlsToCache = [
  '/',
  'index.html',      // Halaman Utama (Menu)
  'antrian.html',    // Halaman Antrian
  'lokasi.html',     // Halaman Peta
  'sos.html',        // Halaman Darurat
  'artikel.html',    // Halaman Berita
  'manifest.json',   // File settingan aplikasi
  
  // RESOURCE EKSTERNAL (Font & Firebase)
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
  
  // CATATAN PENTING:
  // Jangan masukkan nama file gambar (jpg/png) di sini jika Anda tidak yakin 100% namanya benar.
  // Salah satu file saja tidak ketemu (404), seluruh aplikasi akan GAGAL INSTALL.
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Data (Agar bisa jalan offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Hapus Cache Lama (Agar update terbaru muncul)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
