import {createContext} from "react";
import {Database} from 'firebase/database'
import {Auth} from 'firebase/auth'
import {FirebaseStorage} from 'firebase/storage'

type Context={
    db:Database;
    auth:Auth;
    storage: FirebaseStorage;
}

export const AppContext = createContext<Context | null>(null);