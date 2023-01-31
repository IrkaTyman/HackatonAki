import React from 'react'
import {Route, Redirect} from "react-router-dom";

type Props = {
    path: string;
    component: JSX.Element;
    redirectPath: string;
    isRedirect: boolean;
}

export function ProtectedRoute(props: Props) {
    return (
        <Route path={props.path}>
            {props.isRedirect
                ? props.component
                : <Redirect to={props.redirectPath}/>
            }
        </Route>
    )
}