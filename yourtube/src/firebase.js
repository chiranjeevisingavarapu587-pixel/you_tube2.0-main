import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCCnHh-B0JhgSPg4RvthVwNLCA0lRJ6tZM",
  authDomain: "yourtube-4cee9.firebaseapp.com",
  projectId: "yourtube-4cee9",
  storageBucket: "yourtube-4cee9.appspot.com",
  messagingSenderId: "361369592539",
  appId: "1:361369592539:web:abe171d135b65a4a18a2fe"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();