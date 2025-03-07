import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const deleteTeam = async (teamId) => {
    return sendApiRequest(METHOD.DELETE, API_HOST + `/api/team/${teamId}`);
};
