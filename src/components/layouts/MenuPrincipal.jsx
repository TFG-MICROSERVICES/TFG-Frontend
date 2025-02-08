import { useContext } from "react";
import { MenuItem } from "../ui/MenuItem";
import { LoginContext } from "../../context/LoginContext";

export const MenuPrincipal = () => {

    const { login } = useContext(LoginContext);
    console.log(login);

    const menuItems = [
        { text: "Inicio", to: "/home" },
        { text: "Deportes", to: "/deportes" },
        { text: "Equipos", to: "/equipos" },
        { text: "Torneos", to: "/torneos" },
        { text: "Ligas", to: "/ligas" },
        { text: "Eventos", to: "/eventos-puntuales" },
        ...(login?.admin ? [{ text: "Usuarios", to: "/usuarios" }] : [])
    ];
    
    return (
        <>
            <nav className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                    <MenuItem key={index} text={item.text} to={item.to} />
                ))}
            </nav>
        </>
    );
}