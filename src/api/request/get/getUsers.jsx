import { METHOD, sendApiRequest } from '../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getUsers = async (search = null) => {
    let params = new URLSearchParams();
    if (search) {
        params.append('search', search);
    }
    return sendApiRequest(METHOD.GET, API_HOST + `/api/user${params ? '?' + params.toString() : ''}`);
};
