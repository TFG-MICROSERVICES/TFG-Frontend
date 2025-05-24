import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getTeamsByUser = async (user_email, sportId) => {
    return sendApiRequest(METHOD.GET, API_HOST + `/api/team/user/${user_email}${sportId ? `?sport_id=${sportId}` : ''}`);
};
