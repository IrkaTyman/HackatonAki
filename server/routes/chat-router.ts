import {Router} from "express";
import {setMember, getChat, getChats, getLastMessage, getMessages, sendMessage} from "../firebase/chat-function";

const chatRouter = Router();

chatRouter.post("/:id/join", (req, res) => {
    if (req.body.user === undefined)
        res.status(404).send(null)
    else
        setMember(req.params.id, req.body.user, res)
})

chatRouter.post("/:id/message", (req, res) => {
    if (req.body.user === undefined || req.body.chat === undefined || req.body.text === undefined)
        res.status(404).send(null)
    else
        sendMessage(req.body.text,  req.body.user, req.body.chat, res)
})

chatRouter.get('/:id/lastmessages', (req, res) => {
    getLastMessage(req.params.id, res)
})

chatRouter.get('/:id/messages', (req, res) => {
    getMessages(req.params.id, res)
})

chatRouter.post("/:id", (req, res) => {
    if (req.body.isChat === undefined)
        res.status(404)
    else
        getChat(req.params.id, req.body.isChat ? "/chats/" : "/dialogs/", res)
})

chatRouter.post("/", (req, res) => {
    if (req.body.interests === undefined)
        res.status(404).send(null)
    else
        getChats(req.body.interests, res)
})

export {chatRouter}