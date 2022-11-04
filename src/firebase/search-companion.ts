import {get, push, ref, set} from "firebase/database";
import {User} from "../types";
import {db} from "./initialize";
export function searchCompanionDB(dialogsUid:string[], user:User, goChat:(userUid:string)=>void){
    get(ref(db, '/users'))
        .then(snap => {
            let currUsers: User[] = Object.values(snap.val())
            let hasChange = false
            let interestsList = Object.keys(user.interests)

            let filterUsers = currUsers.filter(user => {
                return (dialogsUid
                    ? !dialogsUid.includes(user.uid)
                    : true) && user.uid != user.uid
            });

            interestsList.forEach(key => {
                currUsers = filterUsers;
                filterUsers = filterUsers.filter(user => user.interests[key] && user.interests[key].priority >= user.interests[key].priority)
                if (filterUsers.length == 0) filterUsers = currUsers;
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
            if (hasChange) {
                let companion = filterUsers[orderRelevantPeople]
                let dialogRef = push(ref(db, '/dialogs'))
                set(ref(db, '/users/' + user.uid + '/dialogs/' + dialogRef.key), {
                    name: companion.name,
                    surname: companion.surname,
                    imageUrl: companion.imageUrl,
                    userUid: companion.uid,
                    uid:dialogRef.key
                });

                set(ref(db, '/users/' +companion.uid + '/dialogs/' + dialogRef.key), {
                    name:user.name,
                    surname:user.surname,
                    imageUrl:user.imageUrl,
                    userUid: user.uid,
                    uid:dialogRef.key
                });

                set(dialogRef,{
                    interests:interestsList.filter(interest => companion.interests[interest]),
                    members:[
                        {name:user.name, surname:user.surname, imageUrl:user.imageUrl, uid:user.uid},
                        {name:companion.name, surname: companion.surname, imageUrl: companion.imageUrl, uid: companion.uid}
                    ],
                    uid:dialogRef.key
                })
                goChat(filterUsers[0].uid)
            } else {

            }
        })
}
