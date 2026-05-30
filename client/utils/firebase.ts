// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbml4qpc_-66WVaiRGeuTjJ3GYnZx8Bjc",
  authDomain: "practice-d1272.firebaseapp.com",
  projectId: "practice-d1272",
  storageBucket: "practice-d1272.firebasestorage.app",
  messagingSenderId: "808202378929",
  appId: "1:808202378929:web:298614a6f355e3b0e48c90",
  measurementId: "G-KTCEYCK483"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);