import React, {useState} from 'react';
import './style.scss';
import {useHistory} from "react-router-dom";
import {InputEmpty} from "../shared/inputs/input-empty";
import {User} from "../../types";

const cat1 = require('../../image/cat1.png');

export function SingUpName() {
    const [user, setUser] = useState<User>(createUser())
    const [error, setError] = useState({
        name: false,
        surname: false,
    })
    const history = useHistory();

    function change(key: "name" | "surname", value: string | null) {
        if (!value != error[key]) {
            error[key] = !value;
            setError(error)
        }
        user[key] = value;
        setUser({...user});
    }

    function createUser():User{
        return {
            name: null,
            activity: 50,
            surname: null,
            location: null,
            interests: {},
            password: null,
            imageUrl: null,
            email: null,
            birth: null,
            firstEntry: true,
            mainInterests: {},
            uid: "",
            chats: {},
            dialogs: {}
        }
    }

    function submitName() {
        if (!user.name || !user.surname) {
            setError({
                name: !user.name,
                surname: !user.surname
            })
        } else {
            history.push("/sign-up/email-password", {user})
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