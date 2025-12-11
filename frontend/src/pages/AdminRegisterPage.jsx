import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading } from '../components/LoadingStates';
import '../styles/AuthPages.css';

/**
 * Página de Registro para Administradores
 */
export const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '' // Código secreto para verificar que es admin
  });
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { isLoading } = useAuth();
  const { notifications, showNotification, removeNotification } = useNotifications();

  // Código secreto para registrar admins (puedes cambiarlo)
  const ADMIN_SECRET_CODE = 'SPACEBOOKER2025';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Confirmar password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Código admin
    if (!formData.adminCode) {
      newErrors.adminCode = 'El código de administrador es requerido';
    } else if (formData.adminCode !== ADMIN_SECRET_CODE) {
      newErrors.adminCode = 'Código de administrador incorrecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          id_rol: 1 // Rol de administrador
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar administrador');
      }

      showNotification('✅ Administrador registrado exitosamente. Ya puedes iniciar sesión.', 'success', 5000);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('❌ Error en registro admin:', err);
      
      const errorMessage = err.message;
      
      if (errorMessage.includes('existe')) {
        showNotification('❌ Este email ya está registrado.', 'error', 10000);
      } else {
        showNotification(`❌ ${errorMessage}`, 'error', 10000);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="auth-container">
      <div className="auth-card admin-register-card">
        <div className="auth-header admin-header">
          <span className="material-icons auth-icon">admin_panel_settings</span>
          <h1>Registro de Administrador</h1>
          <p>Crea tu cuenta de administrador de SpaceBooker</p>
        </div>

        <div className="admin-warning">
          <span className="material-icons">info</span>
          <span>Necesitas un código especial para registrarte como administrador</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@spacebooker.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Código Administrador */}
          <div className="form-group">
            <label htmlFor="adminCode">
              Código de Administrador
              <span className="material-icons info-icon" title="Solicita este código al administrador del sistema">info</span>
            </label>
            <input
              id="adminCode"
              name="adminCode"
              type="text"
              value={formData.adminCode}
              onChange={handleChange}
              placeholder="Código secreto"
              className={errors.adminCode ? 'input-error' : ''}
            />
            {errors.adminCode && <span className="error-text">{errors.adminCode}</span>}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-large"
          >
            {isLoading ? 'Registrando...' : 'Registrar Administrador'}
          </button>
        </form>

        {/* Link a Login */}
        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
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
