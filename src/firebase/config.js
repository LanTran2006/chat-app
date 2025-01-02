import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: 'AIzaSyCLsR0gpBHDhvstd9u4uJr-y5r3N_3verI',
  authDomain: "chat-app-85572.firebaseapp.com",
  projectId: "chat-app-85572",
  storageBucket: "chat-app-85572.firebasestorage.app",
  messagingSenderId: "9808581125",
  appId: "1:9808581125:web:814ef0fd61d28cc9e3826c"
};
export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db = getFirestore(app);