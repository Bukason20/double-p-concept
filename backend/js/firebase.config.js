// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyB4eZ_BJw2UIw2hGKO0syf78wjzo1BG19M",
  authDomain: "double-p-concept.firebaseapp.com",
  projectId: "double-p-concept",
  storageBucket: "double-p-concept.firebasestorage.app",
  messagingSenderId: "1097085495030",
  appId: "1:1097085495030:web:2db41c5f37ac500f05eed7",
  measurementId: "G-S0P84W0KT9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
