import { Outlet, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { MenuPrincipal } from './MenuPrincipal';
import { useLogout } from '../../hooks/useLogout';
import { useMobile } from '../../hooks/useMobile';
import { LoginContext } from '../../context/LoginContext';
import { BlueLoader } from '../../components/ui/Loader';
import { SportsTabs } from './SporsTabs';

export const LayoutBase = () => {
    const { isOpen, toggleMenu } = useContext(MenuContext);
    const { handleLogout } = useLogout();
    const { isMobile } = useMobile();
    const { login, loading } = useContext(LoginContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isEventPage = matchPath('/evento/:event_id', location.pathname);
    const isProfilePage = matchPath('/perfil', location.pathname);

    useEffect(() => {
        if (!login && !loading) {
            navigate('/login');
        }
    }, [login, loading]);

    return (
        <>
            {loading ? (
                <BlueLoader size="lg" />
            ) : (
                <div className="flex flex-col min-h-screen w-screen overflow-x-hidden">
                    <header className="fixed top-0 left-0 right-0 h-24 flex items-center shadow-lg z-40 bg-white px-2">
                        <div className="w-full flex items-center justify-between px-2">
                            <div className="flex items-center w-full">
                                {!isMobile && <Menu size={40} className="text-gray-600 mr-4 cursor-pointer" onClick={toggleMenu} />}
                                <h1 className="text-left font-bold text-xl  md:text-3xl text-primary w-full">SPORT CONNECT</h1>
                            </div>
                            <div className="flex flex-col gap-2 items-end w-full md:w-1/4">
                                <div className="flex items-end justify-end w-full gap-2">
                                    <div className="flex flex-col items-center md:items-end md:w-full">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-gray-600">{login?.name + ' ' + login?.lastName}</p>
                                            <User size={24} className="text-gray-600 md:items-center" />
                                        </div>
                                        <button className="text-sm text-primary w-full md:text-end" onClick={() => handleLogout()}>
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    {!isEventPage && !isProfilePage && (
                        <SportsTabs className={`${isOpen && !isMobile ? 'ml-56' : 'ml-0'} relative top-24`} />
                    )}

                    <div className="flex pt-24 min-h-screen w-full">
                        {!isMobile && isOpen && (
                            <aside className="fixed top-24 left-0 w-56 h-[calc(100vh-6rem)] bg-white shadow-lg z-30 p-2">
                                <MenuPrincipal />
                            </aside>
                        )}
                        {isMobile && (
                            <aside className="fixed bottom-0 left-0 w-full h-auto bg-white shadow-lg z-30">
                                <MenuPrincipal />
                            </aside>
                        )}
                        <main
                            className={`flex-1 w-full transition-all duration-300 p-4 pb-24 md:pb-4 bg-slate-100 min-h-[calc(100vh-6rem)] ${
                                isOpen && !isMobile ? 'ml-56' : 'ml-0'
                            }`}
                        >
                            <div className="w-full h-full max-w-[2000px] mx-auto">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </>
    );
};
