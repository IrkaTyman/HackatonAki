import React, {useContext, useState, useEffect} from 'react'
import {UserContext} from "../../context/user-context";
import {AppContext} from "../../context/app-context";
import {Chats} from "../../types";
import {set, ref, push, get} from 'firebase/database'
import {CheckBox} from "../shared/check-box";
import {useHistory} from "react-router-dom";
import cat4 from '../../image/cat4.png'

export function SignUpChats() {
    const userContext = useContext(UserContext)
    const appContext = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState<Chats>({})
    let [selected, setSelected] = useState<string[]>([])
    const history = useHistory()

    useEffect(() => {
        if (!appContext || !userContext) return
        get(ref(appContext.db, '/chats'))
            .then(snap => {
                let chats = snap.val()
                let currChats: Chats = {}
                let allInterests = Object.keys(userContext.user.mainInterests)
                    .concat(Object.keys(userContext.user.interests))
                Object.keys(chats).map(key => {
                    if (allInterests.includes(chats[key].interest)) {
                        currChats[key] = chats[key]
                    }
                })

                setChats(currChats)
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
        if (!appContext || !userContext) return;

        if (selected.length > 0) {
            selected.map(uid => {
                set(ref(appContext.db, '/chats/' + uid + '/members/' + userContext.user.uid), {
                    name: userContext.user.name,
                    surname: userContext.user.surname,
                    uid: userContext.user.uid
                })
            })

            selected.forEach(uid => {
                userContext.user.chats[uid] = {
                    name: chats[uid].name,
                    uid: uid,
                    imageUrl: chats[uid].imageUrl
                }
            })

            userContext.setUID(userContext.user.uid)

            set(ref(appContext.db, '/users/' + userContext.user.uid), userContext.user)
            history.push('/home')
        }
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
            {Object.keys(chats).map(uidChat => (
                <div className="chat_container ai_c w100per">
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