import React, {useState, useEffect} from 'react';
import './App.scss';
import {Switch, Route} from 'react-router-dom';
import Greeting from "./components/greeting/greeting";
import {User} from "./types";
import {UserContext} from './context/user-context'
import {ToastContainer} from "react-toastify";
import {
    SignUpEmailPassword,
    SignUpChats,
    SignUpMainInterests,
    SignUpRepetitionInterests,
    SingUpName,
    SignUpSecondaryInterests,
    SignUpPhoto
} from "./components/sign-up";
import {Home} from "./components/home/home";
import {SignIn} from "./components/sign-in/sign-in";
import {Messenger} from "./components/messenger/messenger";
import {Chat} from "./components/messenger/chat";
import {Dialog} from "./components/messenger/dialog";
import {listenValue, removeListenerValue} from "./firebase/listeners";
import {getUser} from "./firebase/get";

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

    useEffect(()=>{
        listenValue('/users/'+UID,()=>getUser(UID, setUser))

        return () => removeListenerValue('/users/'+UID)
    },[UID])

    return (
        <div className="mobile-container w100per jc_c">
            <div className="app h100per">
                <div className="app_scroll h100per">
                    <UserContext.Provider value={{user, setUser, isOAuth, setIsOAuth, UID, setUID}}>
                        <Switch>
                            <Route path="/sign-up/name">
                                <SingUpName/>
                            </Route>
                            <Route path="/sign-up/photo">
                                <SignUpPhoto/>
                            </Route>
                            <Route path="/sign-up/email-password">
                                <SignUpEmailPassword/>
                            </Route>
                            <Route path="/sign-up/main-interests">
                                <SignUpMainInterests/>
                            </Route>
                            <Route path="/sign-up/secondary-interests">
                                <SignUpSecondaryInterests/>
                            </Route>
                            <Route path="/sign-up/repetition-interests">
                                <SignUpRepetitionInterests/>
                            </Route>
                            <Route path="/sign-up/chats">
                                <SignUpChats/>
                            </Route>
                            <Route path="/sign-in">
                                <SignIn/>
                            </Route>
                            <Route path="/home">
                                <Home/>
                            </Route>
                            <Route path="/messenger/chat/:uid">
                                <Chat/>
                            </Route>
                            <Route path="/messenger/dialog/:uid">
                                <Dialog/>
                            </Route>
                            <Route path="/messenger">
                                <Messenger/>
                            </Route>
                            <Route path="/">
                                <Greeting/>
                            </Route>
                        </Switch>
                    </UserContext.Provider>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default App;
