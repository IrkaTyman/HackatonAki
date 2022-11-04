import {ref, set} from "firebase/database";
import {db} from "./initialize";
import {User} from "../types";

export function setMember(chatUid:string,user:User){
    set(ref(db, '/chats/' + chatUid + '/members/' + user.uid), {
        name: user.name,
        surname: user.surname,
        uid: user.uid
    })
}

export function setUser(user:User){
    set(ref(db, '/users/' + user.uid), user)
}