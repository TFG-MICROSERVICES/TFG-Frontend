import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const updateSport = async (sportId, data) => {
    return sendApiRequest(METHOD.PUT, API_HOST + `/api/sport/${sportId}`, data);
};
