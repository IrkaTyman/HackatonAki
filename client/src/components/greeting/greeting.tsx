import React, {useContext} from 'react';
import {UserContext} from "../../context/user-context";
import {Link, useHistory} from 'react-router-dom';
import './style.scss'
import {signInGoogle} from "../../firebase/sign";
import google from '../../image/google.png'
import {User} from "../../types";

export default function Greeting() {
    const userContext = useContext(UserContext)
    const history = useHistory();

    function signUp(user: any) {
        if (!userContext) return
        userContext.user.email = user.email
        userContext.user.imageUrl = user.photoURL
        userContext.user.name = user.displayName
        userContext.user.surname = ""
        userContext.user.uid = user.uid
        userContext.setUser({...userContext.user})
        history.push("/sign-up/main-interests")
    }

    function signIn(user: User) {
        if (!userContext) return
        userContext.setUID(user.uid)
        history.push("/home")
    }

    return (
        <div className="h100per greating_page page fd_c ai_c jc_c">
            <div className="big-header">Тиньк</div>
            <div className="greating_buttons ai_c fd_c ">
                <Link to="/sign-up/name" className="greating_sing_on big_yellow_btn jc_c ai_c">Начать общаться</Link>
                <Link to="/sign-in" className="grey_a sign_in">Зарегистрированы? Войти</Link>
                <img className="google" src={google} onClick={() => signInGoogle(signUp,signIn)}/>
            </div>
        </div>
    )
}