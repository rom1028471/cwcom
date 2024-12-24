import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function UserHeader() {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = getCartItemsCount();

  const isActive = (path) => {
    if (path === '/publications') {
      return location.pathname === path || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="user-header">
      <div className="container">
        <div className="header-content">
          <Link to="/publications" className="logo">PublicationHub</Link>
          <nav>
            <Link 
              to="/publications" 
              className={isActive('/publications') ? 'active' : ''}
            >
              Каталог
            </Link>
            <Link 
              to="/cart" 
              className={`cart-link ${isActive('/cart') ? 'active' : ''}`}
            >
              Корзина 
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
            <Link 
              to="/profile" 
              className={isActive('/profile') ? 'active' : ''}
            >
              Профиль
            </Link>
            {user && (
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
