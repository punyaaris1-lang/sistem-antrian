import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyALIlkIDALIk83K8s1htalvW6rmNNw02Go",
  authDomain: "sistem-antrian-b1c39.firebaseapp.com",
  projectId: "sistem-antrian-b1c39",
  storageBucket: "sistem-antrian-b1c39.firebasestorage.app",
  messagingSenderId: "454124587608",
  appId: "1:454124587608:web:34fbb0f5211067a67f982d"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestPermission() {
  console.log("Requesting permission…");

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Izin notifikasi diberikan.");

    const vapidKey = "ra2uPkrLOs_lECdkHUD8bLfgePr9T2C7sgWMivJdmVA";

    // WAJIB: Registrasi service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration
    });

    console.log("FCM TOKEN:", token);

    return token;
  } else {
    console.log("Permission ditolak.");
    return null;
  }
}

// Pesan foreground
onMessage(messaging, (payload) => {
  console.log("Pesan diterima (foreground):", payload);

  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });
});
