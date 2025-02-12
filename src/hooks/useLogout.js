import { toast } from "react-toastify";
import { logout } from "../api/request/get/logout";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

const CURRENT_USER_STORAGE = import.meta.env.VITE_CURRENT_USER_STORAGE;

export const useLogout = () =>{

    const { setLogin } = useContext(LoginContext);

    const handleLogout = async () =>{
        try{
            localStorage.removeItem(CURRENT_USER_STORAGE);
            const response = await logout();
            if(response.status !== 200) toast.error('Error al cerrar sesión');
            else{
                toast.success('Cierre de sesión correcto');
                setLogin(null);
            }
        }catch{
            console.log(error);
        }
    }

    return {
        handleLogout
    }
}