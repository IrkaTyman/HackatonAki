export type User={
    name:null | string,
    surname:null | string,
    location:null | string,
    interests:Interest,
    password:null | string,
    imageUrl:null | string,
    email:null | string,
    birth:null | Date,
    firstEntry:true,
    uid:string,
    activity:number;
    mainInterests:Interest,
    chats:UserChats,
    dialogs: UserDialogs
}

export type Interest = {
    [key:string]:{
        priority:number,
        activity:number,
    }
}

type UserChats = {
    [key:string]:UserChat
}

type UserDialogs = {
    [key:string]:UserDialog
}

type UserChat = {
    name:string,
    imageUrl:string,
    uid:string
}

type UserDialog = UserChat & {
    userUid:string,
    surname:string,
    interests:string[]
}

export type Chat = {
    name:string,
    uid:string,
    imageUrl:string,
    interests:string[],
    members:{name:string,surname:string,uid:string}[]
}
export type Dialog = {
    interests:string[]
    uid:string,
    members:{name:string,surname:string,uid:string, imageUrl:string}[]
}

export type Messages = {
    [key:string]:Message[]
}

export type Message = {
    dateSend:Date,
    isEdit:boolean,
    senderName:string,
    senderSurname:string,
    text:string,
    senderUID:string,
    senderImageUrl:string
}

export type Chats={
    [key:string]:Chat
}
export type Dialogs={
    [key:string]:Dialog
}