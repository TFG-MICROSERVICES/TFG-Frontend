import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const updateUser = async (email, data) => {
    return sendApiRequest(METHOD.PUT, API_HOST + `/api/user/${email}`, data);
};
