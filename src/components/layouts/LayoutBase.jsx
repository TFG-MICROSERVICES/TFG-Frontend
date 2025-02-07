import { Outlet } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { useContext } from "react";
import { MenuContext } from "../../context/MenuContext";
import { MenuPrincipal } from "./MenuPrincipal";

export const LayoutBase = () => {
    
    const { isOpen, toggleMenu } = useContext(MenuContext);
    
    return (
        <div className="flex flex-col h-screen">
            <header className="fixed top-0 left-0 w-full h-24 flex items-center shadow-lg z-40 bg-white p-4">
                <Menu size={40} className="text-gray-600 mr-4 cursor-pointer" onClick={toggleMenu}/>
                <h1 className="text-left font-bold text-3xl text-blue-400">SPORT CONNECT</h1>
                <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <User size={40} className="text-gray-600" />
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                        Cerrar sesión
                    </button>
                </div>
            </header>
            
            <div className="flex pt-24 h-full">
                {isOpen && (
                    <aside className="fixed top-24 left-0 w-56 h-[calc(100vh-6rem)] bg-white transition-all shadow-lg duration-100 z-30">
                        <MenuPrincipal />
                    </aside>
                )}
                <main className={`flex-1 transition-all ${isOpen ? "ml-56" : "ml-0"} p-4 bg-slate-100`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}