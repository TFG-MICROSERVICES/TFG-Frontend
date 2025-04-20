import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const createTeamEvent = async (data) => {
    return sendApiRequest(METHOD.POST, API_HOST + `/api/team-event/`, data);
};
