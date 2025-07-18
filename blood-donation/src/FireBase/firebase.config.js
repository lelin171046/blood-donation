// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ8vwiN-yGLZEYD8CotlcuXQsUYhiT3bc",
  authDomain: "blood-donation-e5309.firebaseapp.com",
  projectId: "blood-donation-e5309",
  storageBucket: "blood-donation-e5309.firebasestorage.app",
  messagingSenderId: "704355777081",
  appId: "1:704355777081:web:46535ac9c5e2a54240abe8",
  measurementId: "G-SF6ZS0PQJV"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);