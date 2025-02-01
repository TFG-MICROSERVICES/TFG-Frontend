import { jwtDecode } from 'jwt-decode';

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

export const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

export const sendApiRequest = async (method, endpoint, requestObject) => {
    const headers = {};

    let body;

    if(requestObject){
        if(requestObject instanceof FormData){
            body = requestObject;
        }else{
            body = JSON.stringify(requestObject);
            headers['Content-type'] = 'application/json';
        }
    }

    const token = localStorage.getItem(CURRENT_USER_STORAGE);

    if(token){
        headers['Authorization'] = `Bearer ${token}`;
        headers['Cache-Control'] = 'no-store';
    }

    const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers,
        body,
    });

    const newTokenBearer = response.headers.get('Authorization');
    if(newTokenBearer){
        const newToken = newTokenBearer.split(' ')[1];
        try{
            const dataToken = jwtDecode(newToken);
            if(dataToken && dataToken.exp){
                const expirationTimestamp = dataToken.exp;
                const currentTimeStamp = Math.floor(Date.now()/1000);

                if(currentTimeStamp >= expirationTimestamp){
                    localStorage.removeItem(CURRENT_USER_STORAGE);
                }else{
                    localStorage.setItem(CURRENT_USER_STORAGE, 'Bearer ' + newToken);
                }
            }else{
                localStorage.removeItem(CURRENT_USER_STORAGE);
            }
        }catch(error){
            localStorage.removeItem(CURRENT_USER_STORAGE);
        }
    }
    return await response.json();
}