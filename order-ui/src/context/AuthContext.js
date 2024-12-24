import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Базовая конфигурация axios
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const setupAxiosInterceptors = (token) => {
    // Удаляем все предыдущие интерцепторы
    axios.interceptors.request.handlers = [];
    
    // Добавляем новый интерцептор
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Добавляем интерцептор для обработки ответов с ошибкой авторизации
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );
  };

  const login = async (email, password) => {
    console.log('Logging in with:', { email });
    try {
      const response = await axios.post('/api/auth/authenticate', {
        email: email.trim(),
        password: password.trim()
      });

      if (!response.data || !response.data.token) {
        throw new Error('Неверный ответ сервера');
      }

      const { token, role } = response.data;

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (!decodedToken.exp || decodedToken.exp <= currentTime) {
          throw new Error('Недействительный токен');
        }

        localStorage.setItem('token', token);
        const userData = {
          email: email,
          role: role || decodedToken.role || decodedToken.authorities?.[0]?.authority || 'USER'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        setupAxiosInterceptors(token);
        setUser(userData);
        setToken(token);
        return true;
      } catch (tokenError) {
        console.error('Ошибка обработки токена:', tokenError);
        throw new Error('Ошибка аутентификации');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      if (error.response?.status === 401) {
        throw new Error('Неверное имя пользователя или пароль');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Ошибка входа в систему');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    axios.interceptors.request.handlers = [];
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh');
      const newToken = response.data.accessToken;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
              setupAxiosInterceptors(token);
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        refreshToken();
      }
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
