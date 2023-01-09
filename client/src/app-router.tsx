import React from 'react'
import {Route, Switch} from "react-router-dom";
import {
    SignUpChats,
    SignUpEmailPassword,
    SignUpMainInterests,
    SignUpPhoto, SignUpRepetitionInterests,
    SignUpSecondaryInterests,
    SingUpName
} from "./components/sign-up";
import {SignIn} from "./components/sign-in/sign-in";
import {Home} from "./components/home/home";
import {Chat} from "./components/messenger/chat";
import {Messenger} from "./components/messenger/messenger";
import {CatalogChats} from "./components/catalog-chats";
import Greeting from "./components/greeting/greeting";

export function AppRouter(){
    return(
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
                <Chat isDialog={true}/>
            </Route>
            <Route path="/messenger">
                <Messenger/>
            </Route>
            <Route path="/catalog-chats">
                <CatalogChats/>
            </Route>
            <Route path="/">
                <Greeting/>
            </Route>
        </Switch>
    )
}