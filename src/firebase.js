import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCmDuiCQB-QL0YHGSOIKvDdjpjHc8BIxFw",
  authDomain: "chat-app-720db.firebaseapp.com",
  projectId: "chat-app-720db",
  storageBucket: "chat-app-720db.appspot.com",
  messagingSenderId: "617311507526",
  appId: "1:617311507526:web:fff3b655d70f929e9d2647"
};

export const app = initializeApp(firebaseConfig)
export  const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();