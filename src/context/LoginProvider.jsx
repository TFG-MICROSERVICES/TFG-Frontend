import { useCallback, useEffect, useState } from 'react';
import { LoginContext } from './LoginContext';
import { postLogin } from '../api/request/post/postLogin';
import { getToken } from '../utils/getToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/request/get/checkAuth';

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(null);
    const [loading, setLoading] = useState(false);

    // Constante para el tiempo de expiración (30 segundos antes)
    const EXPIRATION_THRESHOLD = 5 * 60 * 1000;

    // Modificar el tiempo de verificación a cada 4 minutos
    const TOKEN_CHECK_INTERVAL = 4 * 60 * 1000; // 4 minutos en milisegundos

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                const token = getToken(CURRENT_USER_STORAGE);
                if (!token) throw new Error('No token found');

                const tokenExpirationTime = token.exp * 1000;
                const currentTime = Date.now();

                console.log('Token expiration:', tokenExpirationTime);
                console.log('Current time:', currentTime);

                // Si el token está próximo a expirar o ya expiró
                if (tokenExpirationTime < currentTime + EXPIRATION_THRESHOLD) {
                    const response = await checkAuth();
                    console.log('Response:', response?.user);
                    if (response?.status === 200) {
                        localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(response.user.newToken));
                        setLogin(response.user);
                    } else {
                        console.log('Authentication check failed');
                        throw new Error('Authentication check failed');
                    }
                }
            } catch (error) {
                localStorage.removeItem(CURRENT_USER_STORAGE);
                setLogin(null);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const intervalId = setInterval(initializeAuth, TOKEN_CHECK_INTERVAL);

        return () => clearInterval(intervalId);
    }, [navigate]);

    const handleLogin = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await postLogin(credentials);

            if (!response || response.status !== 200) {
                throw new Error('Credenciales inválidas');
            }

            toast.success('Inicio de sesión exitoso');
            setLogin(response.user);
            localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(response.user.token));
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Error en el inicio de sesión');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return (
        <LoginContext.Provider value={{ login, setLogin, loading, handleLogin }}>
            {children}
        </LoginContext.Provider>
    );
};
