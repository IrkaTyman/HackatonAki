import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from "../../context/user-context";
import '../style.scss'
import './style.scss'
import {NavLink} from "react-router-dom";
import {Chat, Grid, Home as HomeIcon} from "../shared/data-display/icons";
import {getUser} from "../../firebase/get";
import {Footer} from "../shared/page-component/footer";

export function Home() {
    const userContext = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userContext) return;
        getUser(userContext.UID,userContext.setUser);
    }, [])

    if (!userContext) return null;
    return (
        <div className="home_page page">
            <div className="header ai_c">
                <img src={userContext.user.imageUrl || ""} alt="" className="user_image"/>
                <p className="fs18 user_name weight700">{userContext.user.name}</p>
            </div>

            <div className="news_container ai_c">
                <div className="news">
                    <p>Тут должна быть новость</p>
                </div>
                <div className="news">
                    <p>Тут должна быть новость</p>
                </div>
                <div className="news">
                    <p>Тут должна быть новость</p>
                </div>
            </div>

            <div className="popular_tinkets ai_fs fd_c">
                <p className="fs18 jc_sb w100per ai_c">
                    Полулярные тинькеты
                    <span className="additional ">Еще</span>
                </p>
                <div className="tinkets">

                </div>
                <div className="little_yellow_btn ">Создать тинькету</div>
            </div>

            <div className="popular_chats">
                <p className="fs18 jc_sb w100per ai_c">
                    Полулярные чаты
                    <span className="additional">Еще</span>
                </p>
                <div className="chats"></div>
            </div>

            <Footer/>
        </div>
    )
}