import { METHOD, sendApiRequest } from '../../../sendApiRequest';
const API_HOST = import.meta.env.VITE_CURRENT_API_HOST;

export const getAllTeamsByUser = async (user_email) => {
    return sendApiRequest(METHOD.GET, API_HOST + `/api/team/user/all/${user_email}`);
};
