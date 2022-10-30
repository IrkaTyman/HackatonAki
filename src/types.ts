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
    dialogs: { [key:string]:{ name: string, surname: string, imageUrl: string, uid: string }}
}

type Interest = {
    [key:string]:{
        priority:number,
        activity:number,
    }
}

type UserChats = {
    [key:string]:UserChat
}

type UserChat = {
    name:string,
    imageUrl:string,
    uid:string
}

export type Chat = {
    name:string,
    uid:string,
    imageUrl:string,
    interest:string,
    members:{name:string,surname:string,uid:string}[]
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