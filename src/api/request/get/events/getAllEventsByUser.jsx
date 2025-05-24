import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getAllEventsByUser = async (user_id) => {
    return sendApiRequest(METHOD.GET, API_HOST + `/api/event/user/${user_id}`);
};
