import { jwtDecode } from "jwt-decode";
const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;
const  REFRESH_TOKEN_STORAGE = import.meta.env.VITE_REFRESH_TOKEN_STORAGE;

export function getToken(token) {

    if(token === CURRENT_USER_STORAGE){
        const token = localStorage.getItem(CURRENT_USER_STORAGE);
        if(token){
            const user = jwtDecode(token);
            return user;
        }
        return null;
    }
    
    if(token === REFRESH_TOKEN_STORAGE){
        const token = localStorage.getItem(REFRESH_TOKEN_STORAGE);
        if(token){
            const user = jwtDecode(token);
            return user;
        }
        return null;
    }
    
    return null;
}