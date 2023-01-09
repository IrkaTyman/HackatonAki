const {get, limitToLast, query, ref}= require("firebase/database");
const {db} =  require("./initialize.ts");
const {Chats, Message} = require("../types.ts");

function getUser(uid: string) {
    get(ref(db, '/users/' + uid))
        .then(snap => {
            if(snap.exists()) return snap.val()
            else return null
        })
        .catch(err => console.log(err))
}

function getChats(interests: string[], setChats: (chats: Chats) => void) {
    get(ref(db, '/chats'))
        .then(snap => {
            let chats = snap.val()
            let currChats: Chats = {}
            Object.keys(chats).map(key => {
                if (interests.includes(chats[key].interest)) {
                    currChats[key] = chats[key]
                }
            })

            setChats(currChats)
        })
}

function getChat(uid: string, setChats: (chat: any, uid: string) => void, url:string="/chats/") {
    get(ref(db, url + uid))
        .then(snap => snap.val() && setChats(snap.val(), uid))
        .catch(error => console.log(error))
}

function getLastMessage(chatUid: string, setMessage: (message: any) => void) {
    const chatMessageRef = ref(db, '/messages/' + chatUid)
    get(query(chatMessageRef, limitToLast(1)))
        .then(snap => snap.val() && setMessage(Object.values(snap.val())))
}

function getMessages(uid: string, setMessages: (messages: Message[]) => void) {
    get(ref(db, '/messages/' + uid))
        .then(snap => snap.val() && setMessages(Object.values(snap.val())))
}

function getSecondaryInterests(key: string, setInterests: (interests: any[]) => void) {
    get(ref(db, '/Interests/' + key))
        .then(snap => {
            if (snap.val())
                setInterests((snap.val() as string[]).map(value => ({value, label: value})))
        })
}

module.exports = {getUser, getChats, getChat, getLastMessage, getMessages, getSecondaryInterests}
