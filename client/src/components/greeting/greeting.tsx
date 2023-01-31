import React, {useContext} from 'react';
import {UserContext} from "../../context/user-context";
import {Link, useHistory} from 'react-router-dom';
import './style.scss'
import {signInGoogle} from "../../firebase/sign";
import {User} from "../../types";
import {getUser} from "../../api/user";

const google = require('../../image/google.png');

export default function Greeting() {
    const userContext = useContext(UserContext)
    const history = useHistory();

    function signUp(user: any) {
        if (!userContext) return
        userContext.setUser(user)
        history.push("/sign-up/main-interests")
    }

    function signIn(user: User) {
        if (!userContext) return
        getUser(user.uid, userContext.setUser)
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