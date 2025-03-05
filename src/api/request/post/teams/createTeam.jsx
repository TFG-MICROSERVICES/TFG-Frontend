import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const postCreateTeam = async (data) => {
    return sendApiRequest(METHOD.POST, API_HOST + `/api/team/register`, data);
};
