import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDortTzy9wS0UH8K2NUNcWRHP6nWcwbJhE",
  authDomain: "lab-3c35c.firebaseapp.com",
  projectId: "lab-3c35c",
  storageBucket: "lab-3c35c.firebasestorage.app",
  messagingSenderId: "480799666961",
  appId: "1:480799666961:web:11a7a6031c5c47502e52b0",
  measurementId: "G-0WLMDDJ1SP"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
