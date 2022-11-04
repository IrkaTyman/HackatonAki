import React, {useContext, useState, useEffect} from 'react'
import {UserContext} from "../../context/user-context";
import {Chats} from "../../types";
import {CheckBox} from "../shared/check-box";
import {useHistory} from "react-router-dom";
import cat4 from '../../image/cat4.png'
import {getChats} from "../../firebase/get";
import {setUser, setMember} from "../../firebase/set";

export function SignUpChats() {
    const userContext = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState<Chats>({})
    let [selected, setSelected] = useState<string[]>([])
    const history = useHistory()

    useEffect(() => {
        if (!userContext) return

        let allInterests = Object.keys(userContext.user.mainInterests)
            .concat(Object.keys(userContext.user.interests))
        getChats(allInterests, (chats) => {
            setChats(chats)
            setLoading(false)
        })
    }, [])

    function select(checked: boolean, uid: string) {
        if (checked) selected.push(uid);
        else {
            selected = selected.filter(item => item != uid)
        }
        setSelected([...selected])
    }

    function submitChats() {
        if (!userContext) return;

        if (selected.length > 0) {
            selected.map(uid => {
                setMember(uid, userContext.user)
            })

            selected.forEach(uid => {
                userContext.user.chats[uid] = {
                    name: chats[uid].name,
                    uid: uid,
                    imageUrl: chats[uid].imageUrl
                }
            })
        }

        userContext.setUID(userContext.user.uid)
        setUser(userContext.user)

        history.push('/home')
    }

    if (loading) return null;
    return (
        <div className="sign_up_chats_page page">
            <p className="big-header">Последний рывок</p>
            <p className="background-text">
                Выбери чаты, которые тебе интересны. Позже ты сможешь вступить в другие
            </p>
            <img src={cat4} alt="" className="cat"/>
            <p className="weight700">Чаты для тебя</p>
            {Object.keys(chats).map((uidChat, i) => (
                <div key={i} className="chat_container ai_c w100per">
                    <img src={chats[uidChat].imageUrl} alt="" className="chat_image"/>
                    <div className="chat_info">
                        <p className="chat_name">{chats[uidChat].name}</p>
                        <p className="chat_members min_text grey ">Участники: {chats[uidChat].members ? Object.keys(chats[uidChat].members).length : 0}</p>
                    </div>
                    <CheckBox checked={selected.includes(uidChat)} change={(checked) => select(checked, uidChat)}/>
                </div>
            ))}
            <div onClick={submitChats} className="big_yellow_btn jc_c ai_c">Начать общаться</div>
        </div>
    )
}