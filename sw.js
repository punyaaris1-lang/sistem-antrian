const CACHE_NAME = "mlu-blue-v1"; // Versi baru (Blue Edition)
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./1763947427555.jpg", // Background image Anda
  "./icon-192.png",
  "./icon-512.png",
  // Cache Library External agar lebih cepat load
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"
];

// 1. Install Service Worker & Cache File Utama
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Paksa update segera
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Menyimpan aset tema Biru...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate & Hapus Cache Lama (Penting agar warna hijau hilang)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Menghapus cache lama:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Strategy: Stale-While-Revalidate
// (Pakai cache dulu biar cepat, lalu update di background)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache jika berhasil ambil data baru
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
            });
        }
        return networkResponse;
      }).catch(() => {
          // Jika offline total, biarkan saja (karena sudah ada cachedResponse)
      });

      return cachedResponse || fetchPromise;
    })
  );
});
