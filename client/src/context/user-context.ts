import {createContext} from "react";
import {User} from "../types";

type Context={
    user:User | null;
    setUser:(user:User) => void;
    isOAuth:boolean,
    setIsOAuth:(isOAuth:boolean)=>void
}

export const UserContext = createContext<Context | null>(null);