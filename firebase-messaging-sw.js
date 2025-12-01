importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyALIlkIDALIk83K8s1htalvW6rmNNw02Go",
  authDomain: "sistem-antrian-b1c39.firebaseapp.com",
  projectId: "sistem-antrian-b1c39",
  storageBucket: "sistem-antrian-b1c39.firebasestorage.app",
  messagingSenderId: "454124587608",
  appId: "1:454124587608:web:34fbb0f5211067a67f982d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });
});
