// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtxhnpeE1K9OsQAVS86Ao1Vl5Skr7vZa4",
  authDomain: "my-blogs-bc476.firebaseapp.com",
  projectId: "my-blogs-bc476",
  storageBucket: "my-blogs-bc476.firebasestorage.app",
  messagingSenderId: "433418611417",
  appId: "1:433418611417:web:9b83256f3dee9ba8a86cc8",
  measurementId: "G-G1SQ3HNBTC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
