import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from "../../context/user-context";
import {AppContext} from "../../context/app-context";
import '../style.scss'
import './style.scss'
import {get, ref} from 'firebase/database'
import {NavLink} from "react-router-dom";
import {Chat, Grid, Home as HomeIcon} from "../shared/icons";

export function Home() {
    const userContext = useContext(UserContext)
    const appContext = useContext(AppContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userContext || !appContext) return;
        get(ref(appContext.db, '/users/' + userContext.UID))
            .then(snap => {
                userContext.setUser(snap.val())
            })
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

            <div className="footer w100per">
                <NavLink to={'/home'} className="link jc_c fd_c ai_c active">
                    <HomeIcon width={20} height={20}/>
                    <p className="link_text">Главная</p>
                </NavLink>
                <div className="link jc_c fd_c ai_c">
                    <Chat width={18} height={18}/>
                    <NavLink to={'/messenger'} className="link_text">Мессенджер</NavLink>
                </div>
                <div className="link jc_c fd_c ai_c">
                    <Grid width={20} height={20}/>
                    <NavLink to={'/chats'} className="link_text">Все чаты</NavLink>
                </div>
            </div>
        </div>
    )
}