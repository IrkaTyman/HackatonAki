import {createContext} from "react";
import {User} from "../types";

type Context={
    user:User;
    setUser:(user:User) => void;
    UID:string,
    setUID:(UID:string)=>void,
    isOAuth:boolean,
    setIsOAuth:(isOAuth:boolean)=>void
}

export const UserContext = createContext<Context | null>(null);