import React, {useState, useEffect} from 'react';
import './App.scss';
import {User} from "./types";
import {UserContext} from './context/user-context'
import {ToastContainer} from "react-toastify";
import {listenValue, removeListenerValue} from "./firebase/listeners";
import {getUser} from "./api/user";
import {AppRouter} from "./app-router";

function App() {
    const [user, setUser] = useState<User | null>(null)
    const [isOAuth, setIsOAuth] = useState(false)

    useEffect(() => {
        if (user === null) return;
        listenValue('/users/' + user.uid, () => getUser(user.uid, setUser))

        return () => removeListenerValue('/users/' + user.uid)
    }, [user])

    return (
        <div className="mobile-container w100per jc_c">
            <div className="app h100per">
                <div className="app_scroll h100per">
                    <UserContext.Provider value={{user, setUser, isOAuth, setIsOAuth}}>
                        <AppRouter user={user}/>
                    </UserContext.Provider>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default App;
