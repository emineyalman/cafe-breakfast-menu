// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKgQ0wwZdaZjso7FEPKSAzvWfzO6x8Bok",
  authDomain: "cafe-breakfast-menu.firebaseapp.com",
  projectId: "cafe-breakfast-menu",
  storageBucket: "cafe-breakfast-menu.firebasestorage.app",
  messagingSenderId: "138830120444",
  appId: "1:138830120444:web:f13662b33891085af1de79",
  measurementId: "G-9FQKWJMJDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };