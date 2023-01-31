import {set, ref, get, push,} from "firebase/database";
import {auth, db} from "./initialize";
import {User} from "../types";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import {Response} from "express";

export function getUser(uid: string, response: Response, setUser?: () => void) {
    get(ref(db, '/users/' + uid))
        .then(snap => {
            if (snap.exists()) response.status(200).json(snap.val())
            else setUser && setUser()
        })
        .catch(err => console.log(err))
}

export function setUser(user: User, response: Response) {
    set(ref(db, '/users/' + user.uid), user)
        .then(() => response.status(200).json(null))
        .catch(() => response.status(404).json(null))
}

export function searchCompanionDB(dialogsUid: string[], user: User, response: Response) {
    get(ref(db, '/users'))
        .then(snap => {
            let currUsers: User[] = Object.values(snap.val())
            let hasChange = false
            let interestsList = Object.keys(user.interests)

            let filterUsers = currUsers.filter(companion => {
                return (dialogsUid
                    ? !dialogsUid.includes(companion.uid)
                    : true) && companion.uid != user.uid
            });

            interestsList.forEach(key => {
                currUsers = [...filterUsers];
                filterUsers = filterUsers.filter(user => user.interests[key] && user.interests[key].priority >= user.interests[key].priority)
                if (filterUsers.length == 0) filterUsers = [...currUsers];
                else hasChange = true
            })

            let maxActivity = 0;
            let orderRelevantPeople = -1;
            filterUsers.forEach((user, i) => {
                if (user.activity > maxActivity) {
                    maxActivity = user.activity;
                    orderRelevantPeople = i
                }
            })

            let companion = filterUsers[orderRelevantPeople]

            let dialogRef = push(ref(db, '/dialogs'))
            set(ref(db, '/users/' + user.uid + '/dialogs/' + dialogRef.key), {
                name: companion.name,
                surname: companion.surname,
                imageUrl: companion.imageUrl,
                userUid: companion.uid,
                uid: dialogRef.key
            });

            set(ref(db, '/users/' + companion.uid + '/dialogs/' + dialogRef.key), {
                name: user.name,
                surname: user.surname,
                imageUrl: user.imageUrl,
                userUid: user.uid,
                uid: dialogRef.key
            });

            set(dialogRef, {
                interests: interestsList.filter(interest => companion.interests[interest]),
                members: [
                    {name: user.name, surname: user.surname, imageUrl: user.imageUrl, uid: user.uid},
                    {name: companion.name, surname: companion.surname, imageUrl: companion.imageUrl, uid: companion.uid}
                ],
                uid: dialogRef.key
            })

            response.status(200).json(dialogRef.key)
        })
}

export function signInEmail(email: string, password: string, response: Response) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            response.status(200).json(user.uid)
        })
        .catch((error) => {
            if (error.code == 'auth/wrong-password' || error.code == "auth/user-not-found")
                response.status(400).json(null)
            else
                response.status(400).json(null)
        });
}

export function signUpEmail(email: string, password: string, response: Response) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredital => {
            response.status(200).json(userCredital.user.uid)
        })
        .catch(error => response.status(404).json(null))
}
