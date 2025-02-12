import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LoginContext } from '../context/LoginContext'
import { useContext, useEffect, useCallback } from 'react'
import { FormProvider } from '../context/FormProvider'
import { schemaLogin } from '../schemas/schemaLogin.js'
import { getToken } from '../utils/getToken.js'
import { postLogin } from '../api/request/post/postLogin.jsx'
import { toast } from 'react-toastify';
import { authGoogle } from '../api/request/get/authGoogle.jsx'

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = import.meta.env.VITE_GOOGLE_CALLBACK_URL;

const initialValue = {
    email: '',
    password: ''
};

export const Login = () =>{

    const { loading, setLogin, login, setLoading  } = useContext(LoginContext);
    const navigate = useNavigate();

    const handleLogin = useCallback(async (credentials) => {
        try {
            setLoading(true);
            const response = await postLogin(credentials);

            if (!response || response.status !== 200) {
                throw new Error('Error al iniciar sesión');
            }

            toast.success('Inicio de sesión exitoso');
            setLogin(response.user.user);
            localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(response.user.token));
        } catch (error) {
            toast.error(error.message || 'Error en el inicio de sesión');
        }finally{
            setLoading(false);
        }
    }, []);

    const handleLoginGoogle = async () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&scope=profile%20email`;
        window.location.href = authUrl;
    }

    const handleGoogleCallback = useCallback( async() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
    
        if (code) {
            try{
                const response = await authGoogle(code);
                if(response.status === 200) toast.success('Inicio de sesión exitoso');
                else toast.error('Error en el inicio de sesión');
                setLogin(response.data.user);
                localStorage.setItem(CURRENT_USER_STORAGE,response.data.token);
                if(response.data.user.new){
                    navigate('/google/register');
                }else{
                    navigate('/home');
                }
            }catch(error){
                console.log(error);
            }
        }
    }, []);

    useEffect(() => {
        handleGoogleCallback();
    },[]);


    useEffect(() =>{
        if(login && !loading){
            navigate('/home');
        }

        const token = getToken(CURRENT_USER_STORAGE);

        if(token){
            navigate('/home');
        }
    },[login])

    return(
        <>
        <div className="flex flex-col w h-screen gap-2 items-center justify-center p-4">    

            <h2 className="text-4xl text-primary mb-4">Iniciar sesión</h2>

            <FormProvider 
                onSubmit={handleLogin} 
                initialValue={initialValue} 
                schema={schemaLogin} 
                clase="w-1/4 gap-4 flex flex-col items-center"
            >

                <Input 
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    required
                    placeholder="Introduzca su correo electrónico"
                />

                <Input
                    label="Contraseña"
                    className="max-w-lg"
                    name="password"
                    type="password"
                    required
                    placeholder="Introduzca su contraseña"
                />

                <Button
                    type="submit"
                    text="Iniciar Sesión"
                    clase="text-primary"
                />

                <div className="flex items-center my-4 w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500">O</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    onClick={() => handleLoginGoogle()}
                    className="flex w-full items-center justify-center gap-2 p-2 rounded-lg h-100 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Continuar con Google
                </button>

            </FormProvider>

            <hr />

            <Link
                className="mt-4"
                to="/"
            >
                Olvide mi contraseña
            </Link>

            <p className="text-gray-400 text-center">
                ¿No tienes cuenta?
                <Link
                    className="mt-4 ml-2 text-primary hover:text-blue-700"
                    to="/register"
                >
                    Registrate ahora
                </Link>
            </p>


        </div>
        </>
    )
}