// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC73NfQ_hKRjz5j834qwSFGT7FOlHxR8pI",
  authDomain: "ghattchart-4260b.firebaseapp.com",
  projectId: "ghattchart-4260b",
  storageBucket: "ghattchart-4260b.firebasestorage.app",
  messagingSenderId: "484588840738",
  appId: "1:484588840738:web:e46505bfc50851d944e77b",
  measurementId: "G-QE8NXVKHV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
