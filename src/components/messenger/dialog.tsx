import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from "../../context/app-context";
import {UserContext} from "../../context/user-context";
import {useParams, useHistory} from "react-router-dom";
import {get, ref, push, onChildAdded, update} from 'firebase/database'
import {Chat as ChatType, Message, User} from "../../types";
import './style.scss'
import {Micro, PaperClip, RightArrow, Send} from "../shared/icons";

export function Dialog() {
    const appContext = useContext(AppContext)
    const userContext = useContext(UserContext)
    const {uid} = useParams<{ uid: string }>();
    const [companion, setCompanion] = useState<User | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const history = useHistory()

    useEffect(() => {
        if (!appContext || !userContext) return;
        getMessages()
        onChildAdded(ref(appContext.db, '/messages/' +  userContext.user.uid + '/' + uid), (data) => {
            getMessages()
        })
        get(ref(appContext.db, '/users/' + uid))
            .then(snap => {
                if (snap.val()) setCompanion(snap.val())
                setLoading(false)
            })
    }, [])

    function getMessages() {
        if (!appContext || !userContext) return;
        get(ref(appContext.db, '/messages/' + userContext.user.uid + '/' + uid))
            .then(snap => {
                const messages = snap.val()
                if (messages) {
                    setMessages(Object.keys(messages).map(uid => messages[uid]))
                }
            })
    }

    function sendMessage(e: React.KeyboardEvent) {
        if (!appContext || !userContext || e.key != "Enter" || !companion) return;
        if (text.trim().length > 0) {
            push(ref(appContext.db, '/messages/' + userContext.user.uid + '/' + uid), {
                dateSend: Date.now(),
                isEdit: false,
                senderName: userContext.user.name,
                senderSurname: userContext.user.surname,
                text: text,
                senderUID: userContext.user.uid,
                senderImageUrl: userContext.user.imageUrl
            })

            const companionInterests = Object.keys(companion.interests)
            const updates: { [key: string]: number } = {};
            Object.keys(userContext.user.interests).forEach(interest => {
                if (companionInterests.includes(interest)) {
                    updates['/users/' + userContext.user.uid + '/interests'] = userContext.user.interests[interest].activity + userContext.user.interests[interest].priority;
                }
            })
            update(ref(appContext.db), updates);
            setText("")
        }
    }

    if (loading || !appContext || !companion || !userContext) return null;
    return (
        <div className="chat_page h100per">
            <div className="header_chat w100per ">
                <RightArrow className="comeback" onClick={() => history.goBack()}/>
                <div className="chat_info fd_c ai_c">
                    <p className="chat_name">{companion.name}</p>
                </div>
                <img className="chat_img" alt="" src={companion.imageUrl || ""}/>
            </div>

            <div className="messages-wrapper w100per">
                <div className="messages_scroll fd_c">
                    {messages.map(message => (
                        <div className={"message " + (message.senderUID != userContext.user.uid ? "left" : "")}>
                            {message.senderUID != userContext.user.uid &&
                                <p className="name_sender weight700">{message.senderName}</p>}
                            {message.senderUID != userContext.user.uid &&
                                <div style={{backgroundImage: `url("${message.senderImageUrl}")`}}
                                     className="img_user"/>}
                            <p className="text">{message.text}</p>
                            <p className="date_send">{(new Date(message.dateSend)).getHours() + ':' + (new Date(message.dateSend)).getMinutes()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="footer_chat w100per">
                <div className="add_file ai_c jc_c">
                    <PaperClip width={20} height={20}/>
                </div>
                <div className="search_container">
                    <input type="text" placeholder="Сообщение" value={text} onChange={(e) => setText(e.target.value)}
                           onKeyDown={sendMessage}/>
                </div>
                {text.length == 0
                    ? <div className="send_voice ai_c jc_c">
                        <Micro fill={"#fff"} width={18} height={18}/>
                    </div>
                    : <div className="add_file ai_c jc_c">
                        <Send width={20} height={20}/>
                    </div>
                }
            </div>
        </div>
    )
}