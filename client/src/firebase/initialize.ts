import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app'


const firebaseConfig = {
    apiKey: "AIzaSyB-vKHXOfca93YRcwFdMR2AYVeVCDvL0Ag",
    authDomain: "react-a17cf.firebaseapp.com",
    databaseURL: "https://react-a17cf-default-rtdb.firebaseio.com",
    projectId: "react-a17cf",
    storageBucket: "react-a17cf.appspot.com",
    messagingSenderId: "446041878736",
    appId: "1:446041878736:web:8413657ed3147abf026ed5",
    measurementId: "G-6NJV5SQ5RR"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {db, storage, auth}