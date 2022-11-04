import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from "../../context/user-context";
import {NavLink, useHistory} from "react-router-dom";
import {Chats, Dialogs, Message, Messages} from "../../types";
import './style.scss'
import {Chat, Grid, Home as HomeIcon, Search} from "../shared/icons";
import {getLastMessage as getLastMessageDB} from "../../firebase/get";
import {searchCompanionDB} from "../../firebase/search-companion";
import {useCustomizedDayjs} from "../../hooks/useCustomizedDayjs";
import {listenChat} from "../../firebase/listeners";

export function Messenger() {
    const userContext = useContext(UserContext)
    const [messages, setMessages] = useState<Messages>({})
    const [loading, setLoading] = useState(true)
    const dayjs = useCustomizedDayjs()
    const history = useHistory()

    useEffect(() => {
        if (!userContext) return;

        function setMessage(message:Message[], uid:string){
            setMessages((messages) => ({...messages, [uid]:message}))
        }

        function getLastMessage(chats:any){
            Object.keys(chats).map(uid => {
                getLastMessageDB(uid, (message) => setMessage(message,uid))
                listenChat(uid,() =>  getLastMessageDB(uid, (message) => setMessage(message,uid)))
            })
        }

        getLastMessage(userContext.user.chats)
        getLastMessage(userContext.user.dialogs)

        setLoading(false)
    }, [])

    function searchCompanion() {
        if (!userContext) return;
        let dialogUIDs = userContext.user.dialogs
            ? Object.values(userContext.user.dialogs).map(dialog => dialog.userUid)
            : [];
        searchCompanionDB(dialogUIDs, userContext.user,
            (uid) => history.push('/messenger/dialog/' + uid)
        )
    }

    if (!userContext || loading) return null;
    return (
        <div className="messenger_page page">
            <div className="header ai_c">
                <img src={userContext.user.imageUrl || ""} alt="" className="user_image"/>
                <p className="fs18 user_name weight700">Чаты</p>
            </div>

            <div className="messenger">
                <div className="search_container">
                    <Search width={15} height={15}/>
                    <input type="text" placeholder="Поиск"/>
                </div>
                <div className="buttons jc_sb ai_c w100per">
                    <div className="little_yellow_btn jc_c">+ чат</div>
                    <div className="little_yellow_btn w jc_c " onClick={searchCompanion}>
                        <Search width={14} height={14}/>
                        собеседника
                    </div>
                    <div className="little_yellow_btn jc_c">+ встреча</div>
                </div>
                {userContext.user.chats && Object.values(userContext.user.chats).map((chat, i) => (
                    <div key={i} className="chat ai_c" onClick={() => history.push('/messenger/chat/' + chat.uid)}>
                        <img src={chat.imageUrl} alt="" className="chat_img"/>
                        <div className="chat_info">
                            <div className="chat_top_line w100per jc_sb">
                                <p className="chat_name">{chat.name}</p>
                                <p className=" chat_time min_text ">{messages[chat.uid] && dayjs(messages[chat.uid][0].dateSend).format("hh:mm")}</p>
                            </div>
                            <p className="chat_message w100per">
                                {messages && messages[chat.uid]
                                    ? `${messages[chat.uid][0].senderName} ${messages[chat.uid][0].senderSurname}: ${messages[chat.uid][0].text}`
                                    : ""
                                }
                            </p>
                        </div>
                    </div>
                ))}
                {userContext.user.dialogs && Object.values(userContext.user.dialogs).map((dialog, i) => (
                    <div key={i} className="chat ai_c" onClick={() => history.push('/messenger/dialog/' + dialog.uid)}>
                        <img src={dialog.imageUrl} alt="" className="chat_img"/>
                        <div className="chat_info">
                            <div className="chat_top_line w100per jc_sb">
                                <p className="chat_name">{dialog.name}</p>
                                <p className=" chat_time min_text ">{messages[dialog.uid] && dayjs(messages[dialog.uid][0].dateSend).format("hh:mm")}</p>
                            </div>
                            <p className="chat_message w100per">
                                {messages && messages[dialog.uid]
                                    ? `${messages[dialog.uid][0].senderName} ${messages[dialog.uid][0].senderSurname}: ${messages[dialog.uid][0].text}`
                                    : ""
                                }

                            </p>
                        </div>
                    </div>
                ))}
            </div>


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
                    <NavLink to={'/chats'} className="link_text">Все чаты</NavLink>
                </div>
            </div>
        </div>
    )
}