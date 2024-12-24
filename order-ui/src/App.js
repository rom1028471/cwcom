import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

// User Pages
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Publications from './pages/user/Publications';
import Cart from './pages/user/Cart';
import Profile from './pages/user/Profile';

// Other Pages
import Unauthorized from './pages/Unauthorized';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes - доступны всем */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected User Routes - требуют авторизации */}
            <Route element={<PrivateRoute allowedRoles={['USER', 'ROLE_USER']} />}>
              <Route path="/publications" element={<Publications />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
