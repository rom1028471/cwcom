import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Извините, страница, которую вы ищете, не существует.</p>
      <Link to="/" className="back-home-link">Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;
