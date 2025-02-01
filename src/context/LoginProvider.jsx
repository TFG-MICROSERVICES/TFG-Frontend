import { useCallback, useEffect, useState } from 'react';
import { LoginContext } from './LoginContext';
import { postLogin } from '../api/request/post/postLogin';
import { getToken } from '../utils/getToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;
const REFRESH_TOKEN_STORAGE = import.meta.env.VITE_REFRESH_TOKEN_STORAGE;

export const LoginProvider = ({children}) =>{
    const navigate = useNavigate();
    const [login, setLogin] = useState(null);
    const [loading, setLoading] = useState(null); 

    useEffect(() =>{
        const token = getToken(CURRENT_USER_STORAGE);
        const refreshToken = getToken(REFRESH_TOKEN_STORAGE);
        if(!token){
            localStorage.removeItem(CURRENT_USER_STORAGE);
            navigate('/login');
        }

        console.log('TOKEN', token);

        if(token && token.exp * 1000 < new Date().getTime()){
            console.log('TOKEN EXPIRADO');
            console.log(token);
        }

    }, [login]);
    
    const handleLogin = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await postLogin(credentials);
            console.log('response', response);
            if (response) {
                setLogin(response.user);
                localStorage.setItem(CURRENT_USER_STORAGE, response.user.token);
                localStorage.setItem(REFRESH_TOKEN_STORAGE, response.user.refreshToken);
                navigate('/home');
            }else{
                toast.error('Error en el inicio de sesión');
                throw new Error('Error en el inicio sesión');
            }
        } catch (error) {
            toast.error('Error en el inicio de sesión');
            throw new Error('Error en el inicio sesión');
        } finally {
            setLoading(false);
        }
    }, []);
    
    return (
        <LoginContext.Provider value={{ login, setLogin, loading, handleLogin }}>
            {children}
        </LoginContext.Provider>
    );
}