// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAbU3b14WbGB_QAREETUMlbRCAGRUCZf_U",
    authDomain: "elite-elevator-411619.firebaseapp.com",
    databaseURL: "https://elite-elevator-411619-default-rtdb.firebaseio.com",
    projectId: "elite-elevator-411619",
    storageBucket: "elite-elevator-411619.appspot.com",
    messagingSenderId: "98325339290",
    appId: "1:98325339290:web:a51c38845c893f1b1b5323"
  };

  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  
  export { db };