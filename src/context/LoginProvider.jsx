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

    const auth = useCallback(async () =>{
        try{
            const response = await checkAuth();
            setLogin(response.user.user);
        }catch(error){
            setLogin(null);
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkTokenExpiration = async () =>{
            try{
                const token = getToken();
                if(!token || !token.exp){
                    localStorage.removeItem(CURRENT_USER_STORAGE);
                    await auth();
                }
    
                if(token || token.exp){
                    if(token.exp * 1000 >= Date.now() + 4 * 60 * 1000 ){
                        console.log("Expiracion de token",token.exp);
                        console.log("4 minutos antes",Date.now() + 4 * 60 * 1000 );
                        localStorage.removeItem(CURRENT_USER_STORAGE);
                        await auth();
                    }
                }else{
                    setLogin(null);
                    await auth();
                }
            }catch(error){
                console.log(error);
                setLogin(null);
            }
        }

        const interval = setInterval(checkTokenExpiration, 4 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() =>{
        auth();
    },[])

    useEffect(() =>{
        if(!login && !loading && !window.location.pathname.includes('register')){
            navigate('/login');
        }
    },[navigate,login])

    return (
        <LoginContext.Provider value={{ login, setLogin, loading, setLoading }}>
            {children}
        </LoginContext.Provider>
    );
};
