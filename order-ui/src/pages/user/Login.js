import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Валидация формы
    if (!email.trim() || !password.trim()) {
      setError('Пожалуйста, введите email и пароль');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await login(email.trim(), password.trim());
      if (success) {
        navigate('/publications');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Не удалось войти. Проверьте email и пароль.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Вход</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="auth-form-group">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
          <div className="auth-links">
            Нет аккаунта? <Link to="/signup">Зарегистрируйтесь</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
