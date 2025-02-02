import { useCallback, useEffect, useRef, useState } from 'react';
import { LoginContext } from './LoginContext';
import { postLogin } from '../api/request/post/postLogin';
import { getToken } from '../utils/getToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/request/get/checkAuth';

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;
const EXPIRATION_THRESHOLD = 5 * 60 * 1000;

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const handleLogin = useCallback(async (credentials) => {
        try {
            const response = await postLogin(credentials);

            if (!response || response.status !== 200) {
                throw new Error('Error al iniciar sesión');
            }

            toast.success('Inicio de sesión exitoso');
            setLogin(response.user.user);
            localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(response.user.token));
            const token = getToken(CURRENT_USER_STORAGE);
        } catch (error) {
            toast.error(error.message || 'Error en el inicio de sesión');
        } finally {
            setLoading(false);
        }
    }, []);

    console.log('Login:', login);

    useEffect(() => {
        const checkToken = async () => {
            setLoading(true);
            try {
                const token = getToken(CURRENT_USER_STORAGE);

                if(token){

                    const tokenExpirationTime = token.exp * 1000;
                    const currentTime = Date.now();
    
                    // Verificar el token y obtener los datos del usuario siempre al inicio
                    const response = await checkAuth();
                    if (response?.status === 200) {
                        localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(response.user.newToken));
                        setLogin(response.user.user);
                        
                        // Solo configurar el intervalo si el token está próximo a expirar
                        if (tokenExpirationTime < currentTime + EXPIRATION_THRESHOLD) {
                            intervalRef.current = setInterval(checkToken, 4 * 60 * 1000);
                        }
                    } else {
                        throw new Error('Authentication check failed');
                    }
                }
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem(CURRENT_USER_STORAGE);
                setLogin(null);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkToken();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [navigate]);

    return (
        <LoginContext.Provider value={{ login, setLogin, loading, handleLogin }}>
            {children}
        </LoginContext.Provider>
    );
};
