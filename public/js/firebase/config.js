// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByZtUkYKIGcre-HFS3LYN8Gpou5C5jvEA",
    authDomain: "gamehub-b09f8.firebaseapp.com",
    projectId: "gamehub-b09f8",
    storageBucket: "gamehub-b09f8.appspot.com",
    messagingSenderId: "886094702335",
    appId: "1:886094702335:web:b4fe195cf0a4ac7d6fceca",
    measurementId: "G-3WJ9ZG2S1T",
    databaseURL: "https://gamehub-b09f8-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
let app;
let database;
let auth;
let analytics;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    analytics = getAnalytics(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Export the initialized services
export { database, auth, analytics }; 