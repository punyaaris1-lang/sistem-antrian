// firebase-messaging-sw.js (put in repo root)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyALIlkIDALIk83K8s1htalvW6rmNNw02Go",
  authDomain: "sistem-antrian-b1c39.firebaseapp.com",
  projectId: "sistem-antrian-b1c39",
  storageBucket: "sistem-antrian-b1c39.firebasestorage.app",
  messagingSenderId: "454124587608",
  appId: "1:454124587608:web:34fbb0f5211067a67f982d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const data = payload.data || {};
  const title = (payload.notification && payload.notification.title) || data.title || 'Fast Charging';
  const body = (payload.notification && payload.notification.body) || data.body || (data.plat? `Plat ${data.plat} selesai` : 'Selesai');
  const options = {
    body,
    icon: '/logo.png',
    data: data
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const data = event.notification.data || {};
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          client.postMessage({ type: 'ALARM_TRIGGER', plat: data.plat });
          return client.focus();
        }
      }
      return clients.openWindow('/?alarm=' + (data.plat || ''));
    })
  );
});
