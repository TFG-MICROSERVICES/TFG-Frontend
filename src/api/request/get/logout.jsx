import { METHOD, sendApiRequest } from "../../sendApiRequest";
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const logout = async () =>{
    return sendApiRequest(METHOD.GET, API_HOST + `/api/auth/logout`);
}