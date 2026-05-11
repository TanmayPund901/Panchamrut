import { initializeApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "gen-lang-client-0650095462",
  appId: "1:115241241841:web:a53840d1273c20b7192d50",
  apiKey: "AIzaSyAW7UZIsw-ntrXlp4s7JFSQxIW1PxVqCEY",
  authDomain: "gen-lang-client-0650095462.firebaseapp.com",
  storageBucket: "gen-lang-client-0650095462.firebasestorage.app",
  messagingSenderId: "115241241841"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-cf08112c-2f6e-4811-bd74-633b2edf4e12");
export const auth = getAuth(app);
export const storage = getStorage(app);
