import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getEvents = async (sport_id) => {
    return sendApiRequest(METHOD.GET, API_HOST + `/api/event?sport_id=${sport_id}`);
};
