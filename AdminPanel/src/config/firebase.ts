import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDjv9I3AXw1ZBktt6eJ1SyCWfcEbioRadE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "little-placket.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://little-placket-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "little-placket",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "little-placket.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "382297260593",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:382297260593:web:8a6fae420203d0719f4b10",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0BWG0XKYDN"
};

import { getAuth } from 'firebase/auth';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Analytics
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
