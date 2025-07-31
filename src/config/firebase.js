// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDciNYb491M6AFWhkgbSTdLIJqN25hvqY",
  authDomain: "benkyou-7fbc3.firebaseapp.com",
  projectId: "benkyou-7fbc3",
  storageBucket: "benkyou-7fbc3.firebasestorage.app",
  messagingSenderId: "968119920481",
  appId: "1:968119920481:web:5044b742bf5f235dac4720",
  measurementId: "G-3E8KVH69PS"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
