import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from "../../context/app-context";
import {UserContext} from "../../context/user-context";
import {useParams, useHistory} from "react-router-dom";
import {get, ref, push, onChildAdded, update} from 'firebase/database'
import {Chat as ChatType, Message} from "../../types";
import './style.scss'
import {Micro, PaperClip, RightArrow, Send} from "../shared/icons";

export function Chat() {
    const appContext = useContext(AppContext)
    const userContext = useContext(UserContext)
    const {uid} = useParams<{ uid: string }>();
    const [chat, setChat] = useState<ChatType | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const history = useHistory()

    useEffect(() => {
        if (!appContext) return;
        getMessages()
        onChildAdded(ref(appContext.db, '/messages/' + uid), (data) => {
            getMessages()
        })
        get(ref(appContext.db, '/chats/' + uid))
            .then(snap => {
                setChat(snap.val())
                setLoading(false)
            })
    }, [])

    function getMessages() {
        if (!appContext) return;
        get(ref(appContext.db, '/messages/' + uid))
            .then(snap => {
                const messages = snap.val()
                if (messages) {
                    setMessages(Object.keys(messages).map(uid => messages[uid]))
                }
            })
    }

    function sendMessage(e: React.KeyboardEvent) {
        if (!appContext || !userContext || e.key != "Enter" || !chat) return;
        if (text.trim().length > 0) {
            push(ref(appContext.db, '/messages/' + uid), {
                dateSend: Date.now(),
                isEdit: false,
                senderName: userContext.user.name,
                senderSurname: userContext.user.surname,
                text: text,
                senderUID: userContext.user.uid,
                senderImageUrl: userContext.user.imageUrl
            })

            if (Object.keys(userContext.user.interests).includes(chat.interest)) {
                const updates: { [key: string]: number } = {};
                updates['/users/' + userContext.user.uid + '/interests/' + chat.interest + "/activity"] = userContext.user.interests[chat.interest].activity + userContext.user.interests[chat.interest].priority;
                update(ref(appContext.db), updates);

            }
            setText("")
        }
    }

    if (loading || !appContext || !chat || !userContext) return null;
    return (
        <div className="chat_page h100per">
            <div className="header_chat w100per ">
                <RightArrow className="comeback" onClick={() => history.goBack()}/>
                <div className="chat_info fd_c ai_c">
                    <p className="chat_name">{chat.name}</p>
                    <p className="chat_count">Участников: {Object.keys(chat.members).length}</p>
                </div>
                <img className="chat_img" alt="" src={chat.imageUrl}/>
            </div>

            <div className="messages-wrapper w100per">
                <div className="messages_scroll fd_c">
                    <div className={"message left"}>
                        <div
                            style={{backgroundImage: 'url("https://shutniks.com/wp-content/uploads/2020/01/6f3947d9d83877d-700x393.jpg")'}}
                            className="img_user"/>
                        <p className="text">А скинешь схему зайчика с ушками?</p>
                        <p className="date_send">10:30</p>
                    </div>
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