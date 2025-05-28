// importScripts(
//   "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyCigkwniTkOdKNMbBfc6COE276V-eN8ktU",
//   authDomain: "math-class-website.firebaseapp.com",
//   projectId: "math-class-website",
//   storageBucket: "math-class-website.firebasestorage.app",
//   messagingSenderId: "659758710227",
//   appId: "1:659758710227:web:0df3ce1817f84c4c00c326",
//   measurementId: "G-E71J2QX9V9",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message:",
//     payload
//   );
//   const notificationTitle =
//     payload.notification?.title || "Math Class Notification";
//   const notificationOptions = {
//     body: payload.notification?.body || "You have a new message.",
//     icon: "/firebase-logo.png",
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });



importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCigkwniTkOdKNMbBfc6COE276V-eN8ktU",
  authDomain: "math-class-website.firebaseapp.com",
  projectId: "math-class-website",
  storageBucket: "math-class-website.firebasestorage.app",
  messagingSenderId: "659758710227",
  appId: "1:659758710227:web:0df3ce1817f84c4c00c326",
  measurementId: "G-E71J2QX9V9",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.getMessaging(app);

firebase.messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle =
    payload.notification?.title || "Math Class Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: "/firebase-logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});