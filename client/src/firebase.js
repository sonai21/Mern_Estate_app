// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "your-estate.firebaseapp.com",
  projectId: "your-estate",
  storageBucket: "your-estate.appspot.com",
  messagingSenderId: "531749006366",
  appId: "1:531749006366:web:3dc0923c64b42a5d22d20f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
