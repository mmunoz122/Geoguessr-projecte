// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDm3dsJ2MuFwZowDtKWpAe-FvZko4XZreE",
  authDomain: "geoguessr-2d918.firebaseapp.com",
  projectId: "geoguessr-2d918",
  storageBucket: "geoguessr-2d918.firebasestorage.app",
  messagingSenderId: "723882209468",
  appId: "1:723882209468:web:757d881ca24baf5ac660b9",
  measurementId: "G-3ZT3QQGQ79"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };