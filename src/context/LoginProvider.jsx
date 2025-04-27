import { useCallback, useEffect, useRef, useState } from 'react';
import { LoginContext } from './LoginContext';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/request/get/checkAuth';
import { getToken } from '../utils/getToken';

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate();
    const [login, setLogin] = useState();
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const auth = useCallback(async () => {
        try {
            const response = await checkAuth();
            setLogin(response.user);
        } catch (error) {
            console.log(error);
            localStorage.removeItem(CURRENT_USER_STORAGE);
            setLogin(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkTokenExpiration = async () => {
            try {
                const token = getToken();
                if (!token) {
                    localStorage.removeItem(CURRENT_USER_STORAGE);
                    setLogin(null);
                    return;
                }

                const expirationTime = token.exp;
                const currentTimestamp = Math.floor(Date.now() / 1000);

                if (currentTimestamp >= expirationTime) {
                    localStorage.removeItem(CURRENT_USER_STORAGE);
                    setLogin(null);
                }
            } catch (error) {
                console.log(error);
                setLogin(null);
            }
        };

        const handleStorageChange = async (e) => {
            if (e.key === CURRENT_USER_STORAGE) {
                await auth();
                setLoading(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        intervalRef.current = setInterval(checkTokenExpiration, 4 * 60 * 1000);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        auth();
    }, []);

    useEffect(() => {
        if (!login && !loading && !window.location.pathname.includes('register')) {
            navigate('/login');
        }
    }, [navigate, login, loading]);

    return <LoginContext.Provider value={{ login, setLogin, loading, setLoading }}>{children}</LoginContext.Provider>;
};
