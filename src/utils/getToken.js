import { jwtDecode } from "jwt-decode";
const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

export function getToken() {

    const token = localStorage.getItem(CURRENT_USER_STORAGE);
    if(token){
        const user = jwtDecode(token);
        return user;
    }
    return null;
}