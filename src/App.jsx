import{ Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Sport } from './pages/Sport';
import { ToastContainer } from 'react-toastify';
import { LayoutBase } from './components/layouts/LayoutBase';
import { Users } from './pages/Users';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} /> 
        <Route path='/' element={<LayoutBase />}>
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/deportes' element={<Sport />} />
          <Route path='/usuarios' element={<Users />} /> 
          <Route path='/*' element={<Login />} />
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
