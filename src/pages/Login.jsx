import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LoginContext } from '../context/LoginContext'
import { useContext, useEffect } from 'react'
import { FormProvider } from '../context/FormProvider'
import { schemaLogin } from '../schemas/schemaLogin.js'
import { getToken } from '../utils/getToken.js'
const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

const initialValue = {
    email: '',
    password: ''
};

export const Login = () =>{

    const { loading, handleLogin, login  } = useContext(LoginContext);
    const navigate = useNavigate();


    useEffect(() =>{
        if(login && !loading){
            navigate('/home');
        }
        
        const token = getToken(CURRENT_USER_STORAGE);

        if(token){
            navigate('/home');
        }
    },[login, navigate])

    return(
        <>
        <div className="flex flex-col w h-screen gap-2 items-center justify-center p-4">    

            <h2 className="text-4xl mb-4">Iniciar sesión</h2>

            <FormProvider 
                onSubmit={handleLogin} 
                initialValue={initialValue} 
                schema={schemaLogin} 
                clase="w-full gap-4 flex flex-col items-center"
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
                />

            </FormProvider>

            <hr />

            <Link
                className="mt-4"
                to="/"
            >
                Olvide mi contraseña
            </Link>

            <Link
                className="mt-4 text-blue-600"
                to="/register"
            >
                ¿No tienes cuenta? Registrate ahora
            </Link>
        </div>
        </>
    )
}