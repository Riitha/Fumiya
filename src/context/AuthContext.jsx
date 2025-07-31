import { createContext } from "react";

//create context
export const AuthContext = createContext({
    user: null,
    role:null,
    name:null,
    setUser: () => {},
});