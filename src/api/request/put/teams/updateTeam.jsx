import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const updateTeam = async (teamId, data) => {
    return sendApiRequest(METHOD.PUT, API_HOST + `/api/team/${teamId}`, data);
};
