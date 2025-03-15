import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { LoginProvider } from './context/LoginProvider';
import { MenuProvider } from './context/MenuProvider';
import { SportProvider } from './context/SportProvider';
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <LoginProvider>
            <MenuProvider>
                <SportProvider>
                    <App />
                </SportProvider>
            </MenuProvider>
        </LoginProvider>
    </BrowserRouter>
);
