import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNXdV4c05iAv4LAAUZF-4Zb8iG0XoCbVk",
  authDomain: "hostify-da6a3.firebaseapp.com",
  projectId: "hostify-da6a3",
  storageBucket: "hostify-da6a3.appspot.com",
  messagingSenderId: "367369933691",
  appId: "1:367369933691:web:6e0faf6dd9d6b2029163de",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);
