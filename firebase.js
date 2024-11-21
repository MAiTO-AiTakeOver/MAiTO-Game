import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration (คัดลอกจาก Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBNGpSm8mpuzSNc2tDiXyAmrmmFUADNTvw",
    authDomain: "maito-c5bd5.firebaseapp.com",
    projectId: "maito-c5bd5",
    storageBucket: "maito-c5bd5.firebasestorage.app",
    messagingSenderId: "1011117095879",
    appId: "1:1011117095879:web:177d25bba904af355537e2",
    measurementId: "G-XQNXPCL0Z4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
