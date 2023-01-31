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
import {User} from "./types";
import {ProtectedRoute} from "./router/protected-route";

export function AppRouter({user}: { user: User | null }) {
    return (
        <Switch>
            <Route path="/sign-up/name">
                <SingUpName/>
            </Route>
            <Route path="/sign-up/email-password">
                <SignUpEmailPassword/>
            </Route>
            <ProtectedRoute path="/sign-up/photo"
                            component={<SignUpPhoto/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/sign-up/main-interests"
                            component={<SignUpMainInterests/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/sign-up/secondary-interests"
                            component={<SignUpSecondaryInterests/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/sign-up/repetition-interests"
                            component={<SignUpRepetitionInterests/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/sign-up/chats"
                            component={<SignUpChats/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/sign-up/chats"
                            component={<SignUpRepetitionInterests/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <Route path="/sign-in">
                <SignIn/>
            </Route>
            <ProtectedRoute path="/home"
                            component={<Home/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/messenger/chat/:uid"
                            component={<Chat/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/messenger/dialog/:uid"
                            component={<Chat isDialog={true}/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/messenger"
                            component={<Messenger/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <ProtectedRoute path="/catalog-chats"
                            component={<CatalogChats/>}
                            redirectPath={"/"}
                            isRedirect={user === null}/>
            <Route path="/">
                <Greeting/>
            </Route>
        </Switch>
    )
}