import React from 'react';
import {Chat, Grid, Home as HomeIcon} from "../data-display/icons";
import {NavLink} from "react-router-dom";

export function Footer(){
    return(
        <div className="footer w100per">
            <div className="link jc_c fd_c ai_c ">
                <HomeIcon width={20} height={20}/>
                <NavLink to={'/home'} className="link_text">Главная</NavLink>
            </div>
            <div className="link jc_c fd_c ai_c active">
                <Chat width={18} height={18}/>
                <NavLink to={'/messenger'} className="link_text">Мессенджер</NavLink>
            </div>
            <div className="link jc_c fd_c ai_c">
                <Grid width={20} height={20}/>
                <NavLink to={'/catalog-chats'} className="link_text">Все чаты</NavLink>
            </div>
        </div>
    )
}