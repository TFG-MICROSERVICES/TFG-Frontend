import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getSport = async (sportId) => {
    return sendApiRequest(METHOD.GET, API_HOST + `/api/sport/${sportId}`);
};
