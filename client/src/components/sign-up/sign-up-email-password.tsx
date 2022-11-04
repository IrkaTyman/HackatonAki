import React, {useContext} from 'react'
import {UserContext} from "../../context/user-context";
import {InputEmpty} from "../shared/input-empty";
import {useHistory} from "react-router-dom";
import cat3 from '../../image/cat3.png';
import {useForm} from "../../hooks/useForm";
import {signUpEmail} from "../../firebase/sign";

export function SignUpEmailPassword() {
    const userContext = useContext(UserContext);
    const {form, errors, checkErrors, changeForm} = useForm(["password", "email", "repeatPassword"])
    const history = useHistory();

    function submitName() {
        if (!userContext || !form) return;

        if (!form.email || !form.password || form.password != form.repeatPassword) {
            checkErrors(["email", "email", "repeatPassword"])
        } else {
            signUpEmail(form.email, form.password, (uid) => {
                userContext.setUser({...userContext.user, email: form.email, password: form.password, uid});
                history.push("/sign-up/photo")
            })
        }
    }

    if (!form || !errors) return null;
    return (
        <div className="sign_up_email_password_page page h100per">
            <div className="big-header">О серьезном</div>
            <InputEmpty value={form.email}
                        change={changeForm}
                        placeholder={"tinkmew.@tink.ru"}
                        helpText={"Почта"}
                        type="email"
                        keyField={"email"}
                        errorText={errors.email.empty ? "Введите корректную почту" : ""}/>
            <InputEmpty value={form.password}
                        change={changeForm}
                        placeholder={""}
                        helpText={"Пароль"}
                        type="password"
                        keyField={"password"}
                        errorText={errors.password.empty ? "Введите пароль" : ""}/>
            <div className="repeat_password_container ai_c">
                <img src={cat3} alt="" className="repeat_password_image"/>
                <p className="repeat_password_text">Повтори пароль</p>
            </div>
            <InputEmpty value={form.repeatPassword}
                        change={changeForm}
                        placeholder={""}
                        helpText={"Пароль"}
                        type="password"
                        keyField={"repeatPassword"}
                        errorText={errors.repeatPassword.repeat ? "Пароли не совпадают" : ""}/>
            <div onClick={submitName} className="big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}