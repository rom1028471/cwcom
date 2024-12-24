import React from 'react';
import { Link } from 'react-router-dom';
import UserFooter from './user/Footer';

// Специальный хедер для неавторизованных пользователей
function UnauthorizedHeader() {
  return (
    <header className="user-header">
      <div className="container">
        <div className="header-content">
          <span className="logo">PublicationHub</span>
          <nav className="unauthorized-nav">
            <Link to="/login" className="nav-link">Войти</Link>
            <Link to="/signup" className="nav-link">Регистрация</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Unauthorized() {
  return (
    <>
      <UnauthorizedHeader />
      <div className="container unauthorized-page">
        <div className="unauthorized-content">
          <h1>Доступ запрещен</h1>
          <p>У вас нет прав для просмотра этой страницы</p>
          <div className="unauthorized-actions">
            <Link to="/login" className="btn btn-primary">Войти</Link>
            <Link to="/signup" className="btn btn-secondary">Регистрация</Link>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default Unauthorized;
