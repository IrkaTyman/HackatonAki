import {get, ref, query, limitToLast, set, push, update} from "firebase/database";
import {Message, Chats, User, Chat, Dialog} from "../types";
import {db} from "./initialize";
import {Response} from "express";

export function setMember(chatUid: string, user: User, response: Response) {
    set(ref(db, '/chats/' + chatUid + '/members/' + user.uid), {
        name: user.name,
        surname: user.surname,
        uid: user.uid
    })
        .then(() => response.status(200).json(null))
        .catch(() => response.status(400).json(null))
}

export function sendMessage(text: string, user: User, chat: Chat | Dialog, response: Response) {
    push(ref(db, '/messages/' + chat.uid), {
        dateSend: Date.now(),
        isEdit: false,
        senderName: user.name,
        senderSurname: user.surname,
        text: text,
        senderUID: user.uid,
        senderImageUrl: user.imageUrl
    })
        .then(() => response.status(200).json(null))
        .catch(() => response.status(400).json(null))

    const updates: { [key: string]: number } = {};
    const interestList = Object.keys(user.interests)

    if (chat.interests)
        interestList.forEach(interest => {
            chat.interests.includes(interest) && addUpdateValue(user, interest, updates)
        })

    update(ref(db), updates);
}

export function getLastMessage(chatUid: string, response: Response) {
    const chatMessageRef = ref(db, '/messages/' + chatUid)
    get(query(chatMessageRef, limitToLast(1)))
        .then(snap => {
            if (snap.val())
                response.status(200).json(Object.values(snap.val()))
            else
                response.status(404).json(null)
        })
}

export function getMessages(uid: string, response: Response) {
    get(ref(db, '/messages/' + uid))
        .then(snap => {
            if (snap.val())
                response.status(200).json(Object.values(snap.val()))
            else
                response.status(404).json(null)
        })
}

export function getChat(uid: string, url: string = "/chats/", response: Response) {
    get(ref(db, url + uid))
        .then(snap => {
            if (snap.val()) response.status(200).json(snap.val())
            else response.status(404).json(null)
        })
        .catch(() => response.status(404).json(null))
}

export function getChats(interests: string[], response: Response) {
    get(ref(db, '/chats'))
        .then(snap => {
            let chats = snap.val()
            let currChats: Chats = {}
            Object.keys(chats).map(key => {
                if (interests.includes(chats[key].interest)) {
                    currChats[key] = chats[key]
                }
            })
            response.status(200).json(currChats)
        })
}


function addUpdateValue(user: User, interest: string, updates: { [key: string]: number }) {
    updates['/users/' + user.uid + '/interests/' + interest + "/activity"] = user.interests[interest].activity + user.interests[interest].priority;
}
