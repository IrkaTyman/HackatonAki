import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import App from "./App";
import {AppContext} from "./context/app-context";
import {BrowserRouter} from "react-router-dom";

import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
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

//import {getAnalytics} from "firebase/analytics";
const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
});
//const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <AppContext.Provider value={{db, auth, storage}}>
            <BrowserRouter >
                <App/>
            </BrowserRouter>
        </AppContext.Provider>
    </React.StrictMode>
);
