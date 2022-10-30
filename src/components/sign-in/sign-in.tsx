import React, {useState, useContext} from 'react';
import {AppContext} from "../../context/app-context";
import {UserContext} from "../../context/user-context";
import {InputEmpty} from "../shared/input-empty";
import './style.scss'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {Link, useHistory} from "react-router-dom";

export function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({
        password: false,
        email: false,
        incorrect: false
    })
    const appContext = useContext(AppContext)
    const userContext = useContext(UserContext)
    const history = useHistory()

    function checkError(key: 'password' | 'email', value: string) {
        errors[key] = !value;
        if (key === "email" && value) errors[key] = errors[key] || !checkEmail(value)
        if (key === "password") errors.password = value.length < 6;

        setErrors({...errors});
    }

    function checkEmail(value: string) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }

    function submit() {
        if (!appContext || !userContext) return;
        if (!email || !password) {
            errors.email = !email
            errors.password = !password
            setErrors({...errors})
        } else {
            signInWithEmailAndPassword(appContext.auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    userContext.setUID(user.uid);
                    history.push('/home')
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    }

    return (
        <div className="sign_in_page  jc_c fd_c page h100per">
            <div className="big-header">Тиньк</div>
            <InputEmpty<"email"> value={email}
                                 change={(key, value) => {
                                     checkError(key, value)
                                     setEmail(value)
                                 }}
                                 placeholder={""}
                                 helpText={"Email"}
                                 keyField={"email"}
                                 errorText={errors.email ? "Введите корретную почту" : ""}/>
            <InputEmpty<"password"> value={password}
                                    change={(key, value) => {
                                        checkError(key, value)
                                        setPassword(value)
                                    }}
                                    type="password"
                                    placeholder={""}
                                    helpText={"Пароль"}
                                    keyField={"password"}
                                    errorText={errors.password ? "Введите пароль(длина больше 6 символов)" : ""}/>
            <div className="big_yellow_btn jc_c ai_c" onClick={submit}>Начать общаться</div>
            <Link to="/sign-up/name" className="grey_a">Зарегистрироваться</Link>
        </div>
    )
}