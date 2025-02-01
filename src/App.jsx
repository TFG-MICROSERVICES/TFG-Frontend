import{ Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/*' element={<Login />} />
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
