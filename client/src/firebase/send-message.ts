import {push, ref, update} from "firebase/database";
import {db} from "./initialize";
import {Chat, Dialog, User} from "../types";

export function sendMessage(text: string, chatUid: string, user: User, chat: Chat | Dialog) {
    push(ref(db, '/messages/' + chatUid), {
        dateSend: Date.now(),
        isEdit: false,
        senderName: user.name,
        senderSurname: user.surname,
        text: text,
        senderUID: user.uid,
        senderImageUrl: user.imageUrl
    })

    const updates: { [key: string]: number } = {};
    const interestList = Object.keys(user.interests)

    if (chat.interests)
        interestList.forEach(interest => {
            chat.interests.includes(interest) && addUpdateValue(user, interest, updates)
        })

    update(ref(db), updates);
}

function addUpdateValue(user: User, interest: string, updates: { [key: string]: number }) {
    updates['/users/' + user.uid + '/interests/' + interest + "/activity"] = user.interests[interest].activity + user.interests[interest].priority;
}