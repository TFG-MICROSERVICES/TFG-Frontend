import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const updatePassword = async (email, data) => {
    return sendApiRequest(METHOD.PATCH, API_HOST + `/api/auth/password/${email}`, data);
};
