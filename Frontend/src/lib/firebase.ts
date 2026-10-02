import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDjv9I3AXw1ZBktt6eJ1SyCWfcEbioRadE",
  authDomain: "little-placket.firebaseapp.com",
  databaseURL: "https://little-placket-default-rtdb.firebaseio.com",
  projectId: "little-placket",
  storageBucket: "little-placket.firebasestorage.app",
  messagingSenderId: "382297260593",
  appId: "1:382297260593:web:8a6fae420203d0719f4b10",
  measurementId: "G-0BWG0XKYDN"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Analytics (Only in browser environment if supported)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
