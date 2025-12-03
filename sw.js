const CACHE_NAME = 'mlu-app-v1';
const FILES_TO_CACHE = [
  'index.html',
  'lokasi.html',
  'sos.html',
  'antrian.html',
  '1763947427555.jpg'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      return res || fetch(evt.request);
    })
  );
});
