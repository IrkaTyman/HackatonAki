import React, {useState, useContext} from 'react'
import {UserContext} from "../../context/user-context";
import {AppContext} from "../../context/app-context";
import {User} from "../../types";
import {InputEmpty} from "../shared/input-empty";
import {useHistory} from "react-router-dom";
import cat3 from '../../image/cat3.png';
import {createUserWithEmailAndPassword} from "firebase/auth";

export function SignUpEmailPassword() {
    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);
    const [user, setUser] = useState<User | null>(userContext && userContext.user)
    const [repeatPassword, setRepeatPassword] = useState<string | null>(null)
    const [error, setError] = useState({
        email: false,
        repeatPassword: false,
        password: false,
    })
    const history = useHistory();

    function change(key: "email" | "password" | "repeatPassword", value: string | null) {
        if (!user) return;

        error[key] = !value;
        if (key === "email" && value) error[key] = error[key] || !checkEmail(value)
        if (key === "repeatPassword") error[key] = error[key] || user.password != value
        if(key == "password") error.repeatPassword = value != repeatPassword
        setError(error)

        if (key == "repeatPassword")
            setRepeatPassword(value)
        else {
            user[key] = value;
            setUser({...user});
        }
    }

    function submitName() {
        if (!userContext || !user || !appContext) return;

        if (!user.email || !user.password || user.password != repeatPassword) {
            setError({
                email: !user.email,
                password: !user.password,
                repeatPassword: user.password != repeatPassword,
            })
        } else {
            createUserWithEmailAndPassword(appContext.auth, user.email, user.password)
                .then(userCredital => {
                    user.uid = userCredital.user.uid
                    userContext.setUser({...user});
                    history.push("/sign-up/photo")
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    function checkEmail(value: string) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }

    if (!user) return null;
    return (
        <div className="sign_up_email_password_page page h100per">
            <div className="big-header">О серьезном</div>
            <InputEmpty value={user.email}
                        change={change}
                        placeholder={"tinkmew.@tink.ru"}
                        helpText={"Почта"}
                        type="email"
                        keyField={"email"}
                        errorText={error.email ? "Введите корректную почту" : ""}/>
            <InputEmpty value={user.password}
                        change={change}
                        placeholder={""}
                        helpText={"Пароль"}
                        type="password"
                        keyField={"password"}
                        errorText={error.password ? "Введите пароль" : ""}/>
            <div className="repeat_password_container ai_c">
                <img src={cat3} alt="" className="repeat_password_image"/>
                <p className="repeat_password_text">Повтори пароль</p>
            </div>
            <InputEmpty value={repeatPassword}
                        change={change}
                        placeholder={""}
                        helpText={"Пароль"}
                        type="password"
                        keyField={"repeatPassword"}
                        errorText={error.repeatPassword ? "Пароли не совпадают" : ""}/>
            <div onClick={submitName} className="big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}