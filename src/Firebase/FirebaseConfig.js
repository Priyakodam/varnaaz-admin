import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyCZF3m46K69SOcYuXk-0uUXCf0OsqwL3EM",
  authDomain: "varnaaz-mobile-app.firebaseapp.com",
  projectId: "varnaaz-mobile-app",
  storageBucket: "varnaaz-mobile-app.appspot.com",
  messagingSenderId: "853395132994",
  appId: "1:853395132994:web:a1c2c2890b6483497d13db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth

export { db, auth }; // Export both
