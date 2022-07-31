// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiqMcG1BLCR5TIjDu8AIwpI1cPy2nWDEg",
  authDomain: "tpa-desktop-ft.firebaseapp.com",
  projectId: "tpa-desktop-ft",
  storageBucket: "tpa-desktop-ft.appspot.com",
  messagingSenderId: "560022570814",
  appId: "1:560022570814:web:962f2920f1fa4cf5724e6f",
  measurementId: "G-22FVNHFJP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
export {firebaseConfig}