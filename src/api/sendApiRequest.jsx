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

    if (requestObject) {
        if (requestObject instanceof FormData) {
            body = requestObject;
        } else {
            body = JSON.stringify(requestObject);
            headers['Content-type'] = 'application/json';
        }
    }

    const token = localStorage.getItem(CURRENT_USER_STORAGE);

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['Cache-Control'] = 'no-store';
    }

    const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers,
        body,
    });

    const nuevoTokenBearer = response?.headers?.get('authorization');

    if (nuevoTokenBearer) {
        const nuevoToken = nuevoTokenBearer.split(' ')[1];
        try {
            localStorage.setItem(CURRENT_USER_STORAGE, nuevoToken);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            localStorage.removeItem(CURRENT_USER_STORAGE);
        }
    }

    console.log(response);

    return await response.json();
};
