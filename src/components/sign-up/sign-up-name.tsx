import React, {useState, useContext} from 'react';
import './style.scss';
import cat1 from '../../image/cat1.png';
import {Link, useHistory} from "react-router-dom";
import {UserContext} from "../../context/user-context";
import {InputEmpty} from "../shared/input-empty";
import {User} from "../../types";

export function SingUpName() {
    const userContext = useContext(UserContext)

    const [user, setUser] = useState<User | null>(userContext && userContext.user || null)
    const [error, setError] = useState({
        name: false,
        surname: false,
    })
    const history = useHistory();

    function change(key: "name" | "surname", value: string | null) {
        if (!user) return;
        if (!value != error[key]) {
            error[key] = !value;
            setError(error)
        }
        user[key] = value;
        setUser({...user});
    }

    function submitName() {
        if (!userContext || !user) return;
        if (!user.name || !user.surname) {
            setError({
                name: !user.name,
                surname: !user.surname
            })
        } else {
            userContext.setUser({...user});
            history.push("/sign-up/email-password")
        }
    }

    if (!user) return null;
    return (
        <div className="h100per sign_up_name_page page ai_fs fd_c">
            <div className="big-header">Здравствуйте!</div>
            <div className="tink_greeting ai_c">
                <img src={cat1} className="tink_image"/>
                <p className="tink_text">
                    Я Тиньк, черное бедствие, гроза всех дорог!
                </p>
            </div>

            <div className="big-header who">А ты кто?</div>
            <InputEmpty<"name"> value={user.name}
                                change={change}
                                placeholder={"Например, кот"}
                                helpText="Имя"
                                className="name"
                                errorText={error.name ? "Введите имя" : ""}
                                keyField="name"/>
            <InputEmpty<"surname"> value={user.surname}
                                   change={change}
                                   placeholder={"Например, Гордеев"}
                                   helpText="Фамилия"
                                   className="surname"
                                   errorText={error.surname ? "Введите фамилию" : ""}
                                   keyField="surname"/>
            <div onClick={submitName} className="greating_sing_on big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}