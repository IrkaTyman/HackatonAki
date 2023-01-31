import {get, ref} from "firebase/database";
import {db} from "./initialize";
import {Response} from "express";

export function getSecondaryInterests(key: string, response:Response) {
    get(ref(db, '/Interests/' + key))
        .then(snap => {
            if (snap.val())
                response.status(200).json((snap.val() as string[]).map(value => ({value, label: value})))
            else
                response.status(404).json(null)
        })
}