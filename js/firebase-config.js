// Firebase Configuration for PlayLearn
// Replace with your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyBCSMXeejyMD_q0A4iktZq4q9SAE7Nxo-8lhxyl_Ux0Bh95g4dVnglTRVFqK_GSvVVb7Eq0GTX8dmpkL_6tSc5TI",
    authDomain: "playlearn-ab1e6.firebaseapp.com",
    projectId: "playlearn-ab1e6",
    storageBucket: "playlearn-ab1e6.appspot.com",
    messagingSenderId: "439937082453",
    appId: "1:439937082453:web:64cbc547f4994e62cfa0dc",
    measurementId: "G-CPK19DMF3D"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

console.log('Firebase initialized successfully');