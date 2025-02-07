import { useState } from "react";
import { MenuContext } from "./MenuContext";

export const MenuProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        console.log('TOGGLE MENU');
        setIsOpen(!isOpen);
    };

    return (
        <MenuContext.Provider value={{ isOpen, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
};