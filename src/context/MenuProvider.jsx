import { useState } from "react";
import { MenuContext } from "./MenuContext";

export const MenuProvider = ({ children, initialOptions = null }) => {
    const [menuState, setMenuState] = useState({
        isMenuOpen: false,
    });
    const [options, setOptions] = useState(initialOptions);

    const toggleMenu = () => {
        setMenuState((oldMenuState) => ({
            ...oldMenuState,
            isMenuOpen: !oldMenuState.isMenuOpen,
        }));
    };

    return (
        <MenuContext.Provider value={{ menuState, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
}