import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/messaging'; // Import the Cloud Messaging module

const firebaseConfig = {
    apiKey: "AIzaSyAhGk_lEII5H23G61r_Gw72yY0l4h9HAB4",
    authDomain: "poultrypro-2408c.firebaseapp.com",
    projectId: "poultrypro-2408c",
    storageBucket: "poultrypro-2408c.appspot.com",
    messagingSenderId: "522704898609",
    appId: "1:522704898609:web:19eaf71338ccc90eeba310",
    measurementId: "G-N0K94GGLYJ"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
