// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// --- Init Firebase (pakai config project Anda) ---
firebase.initializeApp({
  apiKey: "AIzaSyALIlkIDALIk83K8s1htalvW6rmNNw02Go",
  authDomain: "sistem-antrian-b1c39.firebaseapp.com",
  projectId: "sistem-antrian-b1c39",
  storageBucket: "sistem-antrian-b1c39.firebasestorage.app",
  messagingSenderId: "454124587608",
  appId: "1:454124587608:web:34fbb0f5211067a67f982d"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  // console.log('[firebase-messaging-sw.js] Background Message ', payload);
  const data = payload.data || {};
  const title = data.title || 'FAST CHARGING';
  const body = data.body || 'Selesai pengecasan';
  const plat = data.plat || '';

  const options = {
    body: body,
    icon: '/icon.png',         // ganti sesuai
    badge: '/badge.png',       // opsional
    vibrate: [300, 100, 300],
    data: { plat: plat, click_action: '/' }
  };

  self.registration.showNotification(title, options);
});

// Buka halaman ketika user klik notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const plat = event.notification?.data?.plat || '';
  const urlToOpen = new URL('/', self.location.origin);
  if(plat) urlToOpen.searchParams.set('alarm', plat);

  // fokus existing window atau buka window baru
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        // kalau sudah ada tab dari domain yang sama, fokus dan navigasi
        if (client.url && client.url.startsWith(self.location.origin)) {
          client.focus();
          client.navigate(urlToOpen.href);
          return;
        }
      }
      // jika tidak ada tab, buka yang baru
      return clients.openWindow(urlToOpen.href);
    })
  );
});
