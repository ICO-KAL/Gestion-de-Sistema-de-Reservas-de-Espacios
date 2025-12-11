import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/apiService';

/**
 * Context de Autenticación Global
 * Gestiona el usuario actual, token y estado de autenticación
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Verificar si hay token al cargar
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      // Opcionalmente verificar validez del token
      verifyToken();
    }
  }, []);

  /**
   * Verifica si el token es válido
   */
  const verifyToken = async () => {
    try {
      const response = await apiService.getProfile();
      // Asegurar que el rol esté en el formato correcto
      const userData = {
        ...response,
        role: response.id_rol === 1 ? 'admin' : 'usuario'
      };
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      logout();
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (nombre, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.register(nombre, email, password);
      // Guardar el token si viene en la respuesta
      if (response.token) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error en el registro';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia sesión
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.login(email, password);
      console.log('📥 Respuesta del backend:', response);
      
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      // Guardar usuario inmediatamente con el rol correcto
      const userData = {
        ...response.user,
        role: response.user.id_rol === 1 ? 'admin' : 'usuario'
      };
      
      console.log('💾 Guardando usuario:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('✓ Usuario autenticado correctamente');
      
      return response;
    } catch (err) {
      // Obtener mensaje de error específico del backend
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMsg);
      
      // Log para debugging
      console.error('Login error:', {
        status: err.response?.status,
        message: errorMsg,
        data: err.response?.data
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cierra sesión
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    // Llamar endpoint de logout (opcional)
    apiService.logout().catch(() => {
      // Ignorar errores en logout del servidor
    });
  };

  /**
   * Actualiza el perfil del usuario
   */
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.updateProfile(userData);
      setUser(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
