import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC8dbQwaAH42mvRrc6qRVIDckJJGJNGuM",
  authDomain: "autokorea-39d59.firebaseapp.com",
  projectId: "autokorea-39d59",
  storageBucket: "autokorea-39d59.firebasestorage.app",
  messagingSenderId: "259998186396",
  appId: "1:259998186396:web:ce3eece5e21a5fe8062659"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
