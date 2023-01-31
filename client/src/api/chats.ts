import {commonOptions} from "./index";
import {Chat, Chats, Dialog, Message, User} from "../types";
import {SERVER_URI} from "../config";

export function getChats(interests: string[], setChats: (chats: Chats) => void) {
    fetch(SERVER_URI + "/chats", commonOptions({interests}))
        .then(res => {
            if (res.ok)
                return res.json() as Promise<Chats>
            else
                console.log("нет чатов")
        })
        .then(chats => {
            if (chats) setChats(chats)
        })
}

export function setMember(uid: string, user: User, success: () => void, error: () => void) {
    fetch(`${SERVER_URI}/chats/${uid}/join`, commonOptions(user))
        .then(res => {
            if (res.ok)
                success()
            else
                error()
        })
}

export function getLastMessage(uid: string, setMessage: (message: any) => void) {
    fetch(`${SERVER_URI}/chats/${uid}/lastmessages`)
        .then(res => {
            if (res.ok)
                return res.json()
            else
                console.log("error")
        })
        .then(messages => {
            if (messages)
                setMessage(messages)
        })
}

export function postSearchCompanion(dialogsUid: string[], user: User, setUID: (uid: string) => void) {
    fetch(`${SERVER_URI}/user/searchcompanion`, commonOptions({dialogsUid, user}))
        .then(res => {
            if (res.ok)
                return res.json() as Promise<string>
            else
                console.log("error")
        })
        .then(uid => {
            if (uid)
                setUID(uid)
        })
}

export function getChat(uid: string, isChat: boolean, setChat: (chat: Chat) => void) {
    fetch(`${SERVER_URI}/chats/${uid}`, commonOptions({isChat}))
        .then(res => {
            if (res.ok)
                return res.json() as Promise<Chat>
            else
                console.log("error")
        })
        .then(chat => {
            if (chat)
                setChat(chat)
        })
}

export function postMessage(text: string, user: User, chat: Chat | Dialog) {
    fetch(`${SERVER_URI}/chats/${chat.uid}/message`, commonOptions({text, user, chat}))
        .then(res => {
            if (res.ok)
                console.log("success")
            else
                console.log("error")
        })
}

export function getMessages(uid: string, setMessages: (messages: Message[]) => void) {
    fetch(`${SERVER_URI}/chats/${uid}/messages`)
        .then(res => {
            if (res.ok)
                return res.json() as Promise<Message[]>
            else
                console.log("error")
        })
        .then(messages => {
            if (messages)
                setMessages(messages)
        })
}