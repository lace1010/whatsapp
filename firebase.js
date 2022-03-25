// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaaquF_hEvBkOTcL1fal4IGdALmlvoTxE",
  authDomain: "whatsapp-clone-84ad4.firebaseapp.com",
  projectId: "whatsapp-clone-84ad4",
  storageBucket: "whatsapp-clone-84ad4.appspot.com",
  messagingSenderId: "550333789795",
  appId: "1:550333789795:web:3c5ba9567163439cd8aa56",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
