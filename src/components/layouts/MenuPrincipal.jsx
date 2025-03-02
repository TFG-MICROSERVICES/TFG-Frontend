import { useContext } from 'react';
import { MenuItem } from '../ui/MenuItem';
import { LoginContext } from '../../context/LoginContext';

export const MenuPrincipal = () => {
    const { login } = useContext(LoginContext);

    const menuItems = [
        { text: 'Inicio', to: '/home', icon: 'lineicons:home' },
        { text: 'Deportes', to: '/deportes', icon: 'iconoir:soccer-ball' },
        { text: 'Equipos', to: '/equipos', icon: 'ri:team-line' },
        { text: 'Eventos', to: '/eventos-puntuales', icon: 'ri:calendar-line' },
        ...(login?.admin ? [{ text: 'Gestión', to: '/admin', icon: 'material-symbols:manage-accounts-outline' }] : []),
    ];

    return (
        <nav className="md:relative fixed bottom-0 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0">
            <div className="flex md:flex-col flex-row justify-around md:justify-start gap-2">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        text={item.text}
                        to={item.to}
                        icon={item.icon}
                        className="md:flex-row flex-col items-center text-xs md:text-base"
                    />
                ))}
            </div>
        </nav>
    );
};
