import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const createResultsLeague = async (data, event_id) => {
    return sendApiRequest(METHOD.POST, API_HOST + `/api/result/${event_id}`, data);
};
