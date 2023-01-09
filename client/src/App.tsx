import React, {useState, useEffect} from 'react';
import './App.scss';
import {User} from "./types";
import {UserContext} from './context/user-context'
import {ToastContainer} from "react-toastify";
import {listenValue, removeListenerValue} from "./firebase/listeners";
import {getUser} from "./firebase/get";
import {AppRouter} from "./app-router";

function App() {
    const [user, setUser] = useState<User>({
        name: null,
        activity: 50,
        surname: null,
        location: null,
        interests: {},
        password: null,
        imageUrl: null,
        email: null,
        birth: null,
        firstEntry: true,
        mainInterests: {},
        uid: "",
        chats: {},
        dialogs: {}
    })
    const [UID, setUID] = useState("")
    const [isOAuth, setIsOAuth] = useState(false)

    useEffect(() => {
        listenValue('/users/' + UID, () => getUser(UID, setUser))

        return () => removeListenerValue('/users/' + UID)
    }, [UID])

    return (
        <div className="mobile-container w100per jc_c">
            <div className="app h100per">
                <div className="app_scroll h100per">
                    <UserContext.Provider value={{user, setUser, isOAuth, setIsOAuth, UID, setUID}}>
                        <AppRouter/>
                    </UserContext.Provider>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default App;
