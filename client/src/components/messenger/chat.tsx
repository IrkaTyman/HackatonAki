import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from "../../context/user-context";
import {useParams, useHistory} from "react-router-dom";
import {Chat as ChatType, Message, User} from "../../types";
import './style.scss'
import {Micro, PaperClip, RightArrow, Send} from "../shared/icons";
import {getChat, getMessages as getMessagesDB, getUser} from "../../firebase/get";
import {listenChat, removeListenerValue} from "../../firebase/listeners";
import {sendMessage as sendMessageDB} from "../../firebase/send-message";
import {useCustomizedDayjs} from "../../hooks/useCustomizedDayjs";

type Props = { isDialog?: boolean }

export function Chat({isDialog = false}: Props) {
    const userContext = useContext(UserContext)
    const {uid} = useParams<{ uid: string }>();
    const [companion, setCompanion] = useState<User | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const [chat, setChat] = useState<ChatType | null>(null)
    const history = useHistory()
    const dayjs = useCustomizedDayjs()

    useEffect(() => {
        if (!userContext) return;
        getMessagesDB(uid, setMessages)
        listenChat(uid, () => getMessagesDB(uid, setMessages))

        getChat(uid, (chat) => {
            setChat(chat)
            setLoading(false)
        }, isDialog ? '/dialogs/' : '/chats/')

        isDialog && getUser(userContext.user.dialogs[uid].userUid, (user) => {
            setCompanion(user)
            setLoading(false)
        })

        return () => removeListenerValue('/chats/' + uid)
    }, [])

    function sendMessage(e: React.KeyboardEvent) {
        if (!userContext || e.key != "Enter" || !companion && isDialog || !chat) return;
        if (text.trim().length > 0) {
            sendMessageDB(text, uid, userContext.user, chat)
            setText("")
        }
    }

    function getChatImg() {
        if (isDialog && companion) return companion.imageUrl || ""
        else if (chat) return chat.imageUrl
        return ""
    }

    if (loading || !companion && isDialog || !chat || !userContext) return null;
    return (
        <div className="chat_page h100per">
            <div className="header_chat w100per ">
                <RightArrow className="comeback" onClick={() => history.goBack()}/>
                <div className="chat_info fd_c ai_c">
                    <p className="chat_name">{isDialog && companion ? companion.name : chat.name}</p>
                </div>
                <img className="chat_img" alt="" src={getChatImg()}/>
            </div>

            <div className="messages-wrapper w100per">
                <div className="messages_scroll fd_c">
                    {messages.map((message, i) => (
                        <div key={i} className={"message " + (message.senderUID != userContext.user.uid ? "left" : "")}>
                            {message.senderUID != userContext.user.uid &&
                                <p className="name_sender weight700">{message.senderName}</p>}
                            {message.senderUID != userContext.user.uid &&
                                <div style={{backgroundImage: `url("${message.senderImageUrl}")`}}
                                     className="img_user"/>}
                            <p className="text">{message.text}</p>
                            <p className="date_send">{dayjs(message.dateSend).format("hh:mm")}</p>
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