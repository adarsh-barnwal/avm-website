import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0370849572",
  appId: "1:91624026671:web:baa558babc790ebea3ccda",
  apiKey: "AIzaSyAhJTggm_Zaf7Wq5WbEeXBdTI-kfIuiZvI",
  authDomain: "gen-lang-client-0370849572.firebaseapp.com",
  storageBucket: "gen-lang-client-0370849572.firebasestorage.app",
  messagingSenderId: "91624026671",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-remixremixadarsh-53bd3f01-93fd-46f5-8806-0ee2db35d3ad");
export default app;
