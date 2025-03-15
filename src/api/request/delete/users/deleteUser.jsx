import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const deleteUser = async (email) => {
    return sendApiRequest(METHOD.DELETE, API_HOST + `/api/user/${email}`);
};
