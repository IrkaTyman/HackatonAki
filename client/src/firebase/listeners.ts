import {onChildAdded, ref, onValue,off} from "firebase/database";
import {db} from "./initialize";

export function listenChat(uid:string, updateMessage:() => void){
    onChildAdded(ref(db, '/messages/' + uid), updateMessage)
}

export function listenValue(url:string, update:()=>void){
    onValue(ref(db,url),update)
}

export function removeListenerValue(url:string){
    off(ref(db, url))
}