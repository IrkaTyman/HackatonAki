import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import {auth} from "./initialize";

export function signInGoogle(setUser:(user:any) => void) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            setUser(user)
        }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export function signInEmail(email:string, password:string, setUID:(uid:string)=>void){
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setUID(user.uid)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export function signUpEmail(email:string, password:string, setUser:(uid:string) => void){
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredital => {
            setUser(userCredital.user.uid)
        })
        .catch(error => {
            console.log(error)
        })
}