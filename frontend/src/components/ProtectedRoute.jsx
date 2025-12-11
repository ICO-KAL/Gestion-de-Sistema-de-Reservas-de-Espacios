import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="protected-route-error">
        <h2>Acceso Denegado</h2>
        <p>Debes iniciar sesión para acceder a esta página.</p>
        <a href="/login">Ir a Iniciar Sesión</a>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="protected-route-error">
        <h2>Permiso Insuficiente</h2>
        <p>No tienes permiso para acceder a esta página.</p>
        <a href="/">Volver al Inicio</a>
      </div>
    );
  }

  return children;
};

/**
 * HOC para proteger componentes
 */
export const withProtectedRoute = (Component, requiredRole = null) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
