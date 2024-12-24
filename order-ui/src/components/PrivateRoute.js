import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles = ['USER'] }) => {
  const { user } = useAuth();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Нормализуем роль для корректной проверки
  const normalizeRole = (role) => {
    return role.replace('ROLE_', '');
  };

  // Проверяем роль с учетом возможных префиксов
  const userRole = normalizeRole(user.role || user.roles?.[0] || '');
  const hasRequiredRole = allowedRoles.some(role => 
    normalizeRole(role) === userRole
  );

  // Если роль не подходит, перенаправляем на страницу неавторизованного доступа
  return hasRequiredRole ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
