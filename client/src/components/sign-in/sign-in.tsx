import React, {useContext, useState} from 'react';
import {UserContext} from "../../context/user-context";
import {InputEmpty} from "../shared/inputs/input-empty";
import './style.scss'
import {Link, useHistory} from "react-router-dom";
import {useForm} from "../../hooks/useForm";
import {signInEmail} from "../../firebase/sign";

export function SignIn() {
    const {form, errors, changeForm, checkErrors} = useForm(["email", "password"])
    const [incorrect, setIncorrect] = useState(false)
    const userContext = useContext(UserContext)
    const history = useHistory()

    function submit() {
        if (!userContext || !form) return;
        if (!form.email || !form.password) {
            checkErrors(["email", "password"])
        } else {
            signInEmail(form.email,
                form.password,
                (uid) => {
                    userContext.setUID(uid);
                    history.push('/home')
                }, () => setIncorrect(true)
            )
        }
    }

    function change(key:string, value:string){
        changeForm(key,value)
        incorrect && setIncorrect(false)
    }

    if (!form || !errors) return null;
    return (
        <div className="sign_in_page  jc_c fd_c page h100per">
            <div className="big-header">Тиньк</div>
            {incorrect && <p className="error_message">Неверная почта или пароль</p>}
            <InputEmpty<"email"> value={form.email}
                                 change={change}
                                 placeholder={""}
                                 helpText={"Email"}
                                 keyField={"email"}
                                 errorText={errors.email.empty ? "Введите корретную почту" : ""}/>
            <InputEmpty<"password"> value={form.password}
                                    change={change}
                                    type="password"
                                    placeholder={""}
                                    helpText={"Пароль"}
                                    keyField={"password"}
                                    errorText={errors.password.empty ? "Введите пароль(длина больше 6 символов)" : ""}/>
            <div className="big_yellow_btn jc_c ai_c" onClick={submit}>Начать общаться</div>
            <Link to="/sign-up/name" className="grey_a">Зарегистрироваться</Link>
        </div>
    )
}