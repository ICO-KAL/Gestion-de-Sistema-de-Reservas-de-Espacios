import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading, ErrorMessage } from '../components/LoadingStates';
import '../styles/AuthPages.css';

/**
 * Página de Login - HU01
 */
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const { notifications, showNotification, removeNotification } = useNotifications();

  /**
   * Valida el formulario
   */
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor, revisa los errores en el formulario', 'error');
      return;
    }

    try {
      const response = await login(email, password);
      console.log('✅ Login exitoso:', response);
      console.log('👤 Usuario:', response.user);
      console.log('🔑 Rol:', response.user.id_rol);
      
      showNotification('¡Bienvenido! Redirigiendo...', 'success');
      
      // Redirigir inmediatamente según el rol
      if (response.user.id_rol === 1) {
        console.log('➡️ Redirigiendo a /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('➡️ Redirigiendo a /');
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      
      // Mensajes de error específicos con duración de 15 segundos
      const errorMessage = err.response?.data?.error || err.message;
      
      if (errorMessage.includes('Email o contraseña incorrectos')) {
        showNotification('❌ Credenciales incorrectas. Verifica tu email y contraseña.', 'error', 15000);
      } else if (errorMessage.includes('no existe') || errorMessage.includes('not found') || errorMessage.includes('Usuario no encontrado')) {
        showNotification('❌ Esta cuenta no existe en el sistema. Verifica tu email o regístrate.', 'error', 15000);
      } else if (errorMessage.includes('contraseña')) {
        showNotification('❌ Contraseña incorrecta. Intenta nuevamente.', 'error', 15000);
      } else {
        showNotification('❌ Error al iniciar sesión. Verifica que tu cuenta exista y la contraseña sea correcta.', 'error', 15000);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="material-icons auth-icon">lock</span>
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta de SpaceBooker</p>
        </div>

        {authError && (
          <div className="alert alert-error">
            <span className="material-icons">error</span>
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-large"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Link a Registro */}
        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Sección Administradores */}
        <div className="admin-section">
          <div className="admin-divider">
            <span>Acceso Administrativo</span>
          </div>
          <div className="admin-info">
            <span className="material-icons">admin_panel_settings</span>
            <p>¿Eres administrador? <Link to="/admin-register" className="admin-link">Regístrate como Admin</Link></p>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {notifications.map((notif) => (
        <Toast
          key={notif.id}
          message={notif.message}
          type={notif.type}
          duration={notif.duration}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};
