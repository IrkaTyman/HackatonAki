import React, {useContext} from 'react';
import {AppContext} from "../../context/app-context";
import {UserContext} from "../../context/user-context";
import {Link, useHistory} from 'react-router-dom';
import './style.scss'
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import google from '../../image/google.png'

export default function Greeting() {
    const appContext = useContext(AppContext)
    const userContext = useContext(UserContext)
    const provider = new GoogleAuthProvider();
    const history = useHistory();

    function sign() {
        if (!appContext || !userContext) return
        signInWithPopup(appContext.auth, provider)
            .then((result) => {
                const user = result.user;
                userContext.user.email = user.email
                userContext.user.imageUrl = user.photoURL
                userContext.user.name = user.displayName
                userContext.user.surname = ""
                userContext.user.uid = user.uid
                userContext.setUser({...userContext.user})
                history.push("/sign-up/main-interests")
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    return (
        <div className="h100per greating_page page fd_c ai_c jc_c">
            <div className="big-header">Тиньк</div>
            <div className="greating_buttons ai_c fd_c ">
                <Link to="/sign-up/name" className="greating_sing_on big_yellow_btn jc_c ai_c">Начать общаться</Link>
                <Link to="/sign-in" className="grey_a sign_in">Зарегистрированы? Войти</Link>
                <img className="google" src={google} onClick={sign}/>
            </div>
        </div>
    )
}