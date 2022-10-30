import React, {useState} from 'react';
import './App.scss';
import {Switch, Route, Link} from 'react-router-dom';
import Greeting from "./components/greeting/greeting";
import {SingUpName} from "./components/sign-up";
import {User} from "./types";
import {UserContext} from './context/user-context'
import {SignUpImage} from "./components/sign-up/sign-up-photo";
import {ToastContainer} from "react-toastify";
import {SignUpEmailPassword} from "./components/sign-up/sign-up-email-password";
import {SignUpMainInterests} from "./components/sign-up/sign-up-main-interests";
import {SignUpSecondaryInterests} from "./components/sign-up/sign-up-secondary-interests";
import {SignUpRepetitionInterests} from "./components/sign-up/sign-up-repeatition-interests";
import {SignUpChats} from "./components/sign-up/sign-up-chats";
import {Home} from "./components/home/home";
import {SignIn} from "./components/sign-in/sign-in";
import {Messenger} from "./components/messenger/messenger";
import {Chat} from "./components/messenger/chat";
import {Dialog} from "./components/messenger/dialog";

function App() {
    const [user, setUser] = useState<User>({
        name: null,
        activity:50,
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
                                <SignUpImage/>
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
