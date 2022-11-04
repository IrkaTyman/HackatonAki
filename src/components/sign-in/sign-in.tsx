import React, {useContext} from 'react';
import {UserContext} from "../../context/user-context";
import {InputEmpty} from "../shared/input-empty";
import './style.scss'
import {Link, useHistory} from "react-router-dom";
import {useForm} from "../../hooks/useForm";
import {signInEmail} from "../../firebase/sign";

export function SignIn() {
    const {form, errors, changeForm, checkErrors} = useForm(["email", "password"])
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
                })
        }
    }

    if (!form || !errors) return null;
    return (
        <div className="sign_in_page  jc_c fd_c page h100per">
            <div className="big-header">Тиньк</div>
            <InputEmpty<"email"> value={form.email}
                                 change={changeForm}
                                 placeholder={""}
                                 helpText={"Email"}
                                 keyField={"email"}
                                 errorText={errors.email.empty ? "Введите корретную почту" : ""}/>
            <InputEmpty<"password"> value={form.password}
                                    change={changeForm}
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