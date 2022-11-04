import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import {auth} from "./initialize";
import {User} from "../types";
import {getUser} from "./get";

export function signInGoogle(signUp: (user: any) => void, signIn: (user: User) => void) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            getUser(user.uid, signIn, () => signUp(user))
        }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export function signInEmail(email: string, password: string, setUID: (uid: string) => void, catchIncorrect: () => void) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setUID(user.uid)
        })
        .catch((error) => {
            if (error.code == 'auth/wrong-password' || error.code == "auth/user-not-found")
                catchIncorrect()

            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export function signUpEmail(email: string, password: string, setUser: (uid: string) => void) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredital => {
            setUser(userCredital.user.uid)
        })
        .catch(error => {
            console.log(error)
        })
}