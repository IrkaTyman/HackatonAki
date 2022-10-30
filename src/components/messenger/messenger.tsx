import React, {useContext, useState, useEffect} from 'react';
import {AppContext} from "../../context/app-context";
import {UserContext} from "../../context/user-context";
import {NavLink, useHistory} from "react-router-dom";
import {Chats, Message, Messages, User} from "../../types";
import {get, ref, limitToFirst, query, onChildAdded, push, set} from 'firebase/database'
import './style.scss'
import {Chat, Grid, Home as HomeIcon, Search} from "../shared/icons";

export function Messenger() {
    const userContext = useContext(UserContext)
    const appContext = useContext(AppContext)
    const [chats, setChats] = useState<Chats>({})
    const [messages, setMessages] = useState<Messages>({})
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
        if (!appContext || !userContext) return;
        userContext.user.chats && Object.keys(userContext.user.chats).map(uid => {
            get(ref(appContext.db, '/chats/' + userContext.user.chats[uid].uid))
                .then(snap => {
                    chats[userContext.user.chats[uid].uid] = snap.val()
                    setChats({...chats})
                })
                .catch(error => console.log(error))

            const chatMessageRef = ref(appContext.db, '/messages/' + uid)
            get(query(chatMessageRef, limitToFirst(1)))
                .then(snap => {
                    if (snap.val()) {
                        messages[uid] = Object.values(snap.val())
                        setMessages(messages)
                    }
                })
            onChildAdded(chatMessageRef, (data) => {
                //console.log(data)
            })
        })

        userContext.user.dialogs && Object.keys(userContext.user.dialogs).map(uid => {
            console.log(userContext.user.dialogs)
            const chatMessageRef = ref(appContext.db, '/messages/' + userContext.user.uid + '/' + uid)
            get(query(chatMessageRef, limitToFirst(1)))
                .then(snap => {
                    if (snap.val()) {
                        messages[uid] = Object.values(snap.val())
                        setMessages(messages)
                    }
                })
            onChildAdded(chatMessageRef, (data) => {
                //console.log(data)
            })
        })

        setLoading(false)
    }, [])

    function searchCompanion() {
        if (!appContext || !userContext) return;
        get(ref(appContext.db, '/users'))
            .then(snap => {
                let currUsers: User[] = Object.values(snap.val())
                let hasChange = false
                let filterUsers = currUsers.filter(user => {
                    return (userContext.user.dialogs
                        ? !Object.keys(userContext.user.dialogs).includes(user.uid)
                        : true) && user.uid != userContext.user.uid
                });
                Object.keys(userContext.user.interests).forEach(key => {
                    currUsers = filterUsers;
                    filterUsers = filterUsers.filter(user => user.interests[key] && user.interests[key].priority >= userContext.user.interests[key].priority)
                    if (filterUsers.length == 0) filterUsers = currUsers;
                    else hasChange = true
                })
                console.log(filterUsers)
                let maxActivity = 0;
                let orderRelevantPeople = -1;
                filterUsers.forEach((user, i) => {
                    if (user.activity > maxActivity) {
                        maxActivity = user.activity;
                        orderRelevantPeople = i
                    }
                })
                if (hasChange) {
                    push(ref(appContext.db, '/users/' + userContext.user.uid + '/dialogs/'), {
                        name: filterUsers[orderRelevantPeople].name,
                        surname: filterUsers[orderRelevantPeople].surname,
                        imageUrl: filterUsers[orderRelevantPeople].imageUrl,
                        uid: filterUsers[orderRelevantPeople].uid
                    });
                    history.push('/messenger/dialog/' + filterUsers[0].uid)
                } else {

                }
            })
    }

    if (!userContext || !appContext || loading) return null;
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
                {chats && Object.values(chats).map(chat => (
                    <div className="chat ai_c" onClick={() => history.push('/messenger/chat/' + chat.uid)}>
                        <img src={chat.imageUrl} alt="" className="chat_img"/>
                        <div className="chat_info">
                            <div className="chat_top_line w100per jc_sb">
                                <p className="chat_name">{chat.name}</p>
                                <p className=" chat_time min_text ">{messages[chat.uid] && new Date(messages[chat.uid][0].dateSend).toLocaleTimeString()}</p>
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
                {userContext.user.dialogs && Object.values(userContext.user.dialogs).map(dialog => (
                    <div className="chat ai_c" onClick={() => history.push('/messenger/dialog/' + dialog.uid)}>
                        <img src={dialog.imageUrl} alt="" className="chat_img"/>
                        <div className="chat_info">
                            <div className="chat_top_line w100per jc_sb">
                                <p className="chat_name">{dialog.name}</p>
                                <p className=" chat_time min_text ">{messages[dialog.uid] && new Date(messages[dialog.uid][0].dateSend).toLocaleTimeString()}</p>
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