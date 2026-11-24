/* Firebase баптауы: бұлттық сақтау және сынып рейтингі үшін (жоба: kokzhiek-a5cf9).
   Firebase Console → Project settings → General → Your apps → kokzhiek-web → firebaseConfig.
   Бұл мәндер құпия емес (браузерге бәрібір жіберіледі): деректерді Firestore ережелері (firestore.rules) қорғайды.
   null болса, сайт бұрынғыдай тек браузерде сақтайды. */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCdQSg5rPL95acjAYVY_Xy527ad-TpzRU0",
  authDomain: "kokzhiek-a5cf9.firebaseapp.com",
  projectId: "kokzhiek-a5cf9",
  storageBucket: "kokzhiek-a5cf9.firebasestorage.app",
  messagingSenderId: "673541301960",
  appId: "1:673541301960:web:d1ed6ad2d5cfc8f47167fd"
};

/* App Check сайт кілті (reCAPTCHA, Google Cloud Fraud Defense, kokzhiek жобасы): құпия емес, браузерге бәрібір көрінеді.
   Firebase Console → App Check ішінде «Fraud Defense» тәсілімен тіркелген, құпия кілт қажет емес. */
window.APPCHECK_SITE_KEY = "6LcMDSwuAAAAAFLFea72-WxcUx8weeilch0__Rl2";
