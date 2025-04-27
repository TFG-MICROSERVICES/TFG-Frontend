import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Registration } from './pages/Registration';
import { Sports } from './pages/Sports';
import { ToastContainer } from 'react-toastify';
import { LayoutBase } from './components/layouts/LayoutBase';
import { Users } from './pages/Users';
import { Teams } from './pages/Teams';
import { Admin } from './pages/Admin';
import { Events } from './pages/Events';
import { Evento } from './pages/Evento';
import { Perfil } from './pages/Perfil';
function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/google/register" element={<Registration />} />
                <Route path="/" element={<LayoutBase />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/deportes" element={<Sports />} />
                    <Route path="/equipos" element={<Teams />} />
                    <Route path="/usuarios" element={<Users />} />
                    <Route path="/eventos" element={<Events />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/evento/:event_id" element={<Evento />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/*" element={<Login />} />
                </Route>
            </Routes>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default App;
