import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const updateResult = async (result_id, data) => {
    return sendApiRequest(METHOD.PUT, API_HOST + `/api/result/${result_id}`, data);
};
