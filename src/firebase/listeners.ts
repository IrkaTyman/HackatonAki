import {onChildAdded, ref} from "firebase/database";
import {getMessages as getMessagesDB} from "./get";
import {db} from "./initialize";

export function listenChat(uid:string, updateMessage:() => void){
    onChildAdded(ref(db, '/messages/' + uid), updateMessage)
}