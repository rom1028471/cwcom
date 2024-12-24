import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function UserFooter() {
  return (
    <footer className="user-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">О нас</Link>
            <Link to="/terms">Условия использования</Link>
            <Link to="/privacy">Политика конфиденциальности</Link>
            <Link to="/contacts">Контакты</Link>
          </div>
          <div className="footer-social">
            <Link to="https://facebook.com" target="_blank" aria-label="Facebook"><FaFacebook /></Link>
            <Link to="https://twitter.com" target="_blank" aria-label="Twitter"><FaTwitter /></Link>
            <Link to="https://instagram.com" target="_blank" aria-label="Instagram"><FaInstagram /></Link>
            <Link to="https://linkedin.com" target="_blank" aria-label="LinkedIn"><FaLinkedin /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p> 2024 PublicationHub. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
