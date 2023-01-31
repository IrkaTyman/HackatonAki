import {commonOptions} from "./index";
import {User} from "../types";
import {SERVER_URI} from "../config";

export function setUser(user: User) {
    fetch(`${SERVER_URI}/user/${user.uid}`, commonOptions(user))
        .then(res => {
            if (res)
                console.log("success")
            else
                console.log("error")
        })
}

export function getUser(uid: string, setUser: (user: User) => void) {
    fetch(`${SERVER_URI}/user/${uid}`)
        .then(res => {
            if (res.ok)
                return res.json() as Promise<User>
            else
                console.log("error")
        })
        .then(user => {
            if (user)
                setUser(user)
        })
}

export function signIn(email: string, password: string, setUser: (user: User) => void) {
    fetch(SERVER_URI + "/user/signin", commonOptions({email, password}))
        .then(res => {
            if (res.ok)
                return res.json() as Promise<User>
            else
                console.log("error")
        })
        .then(user => {
            if (user)
                setUser(user)
        })
}