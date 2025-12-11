import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading } from '../components/LoadingStates';
import { ProtectedRoute } from '../components/ProtectedRoute';
import '../styles/Perfil.css';

/**
 * Página de Perfil de Usuario - HU04, HU05
 */
const PerfilContent = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    passwordActual: '',
    passwordNueva: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});
  const { notifications, showNotification, removeNotification } = useNotifications();

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        nombre: user.nombre || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña si se intenta cambiar
    if (formData.passwordNueva) {
      if (!formData.passwordActual) {
        newErrors.passwordActual = 'Debes ingresar tu contraseña actual';
      }
      if (formData.passwordNueva.length < 6) {
        newErrors.passwordNueva = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (formData.passwordNueva !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor revisa los errores', 'error');
      return;
    }

    try {
      const updateData = {
        nombre: formData.nombre,
        email: formData.email,
      };

      // Solo incluir contraseña si se va a cambiar
      if (formData.passwordNueva) {
        updateData.passwordActual = formData.passwordActual;
        updateData.passwordNueva = formData.passwordNueva;
      }

      await updateProfile(updateData);
      showNotification('Perfil actualizado exitosamente', 'success');
      setEditMode(false);
      setFormData({
        ...formData,
        passwordActual: '',
        passwordNueva: '',
        passwordConfirm: '',
      });
    } catch (error) {
      showNotification('Error al actualizar el perfil', 'error');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="perfil-page">
      <div className="container">
        <h1>👤 Mi Perfil</h1>

        <div className="perfil-card">
          {!editMode ? (
            // Modo Lectura
            <>
              <div className="perfil-info">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{formData.nombre}</span>
                </div>

                <div className="info-item">
                  <label>Email:</label>
                  <span>{formData.email}</span>
                </div>

                <div className="info-item">
                  <label>Rol:</label>
                  <span className={`role-badge role-${user?.role}`}>
                    {user?.role === 'admin' ? '⚙️ Administrador' : '👤 Usuario'}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setEditMode(true)}
              >
                ✏️ Editar Perfil
              </button>
            </>
          ) : (
            // Modo Edición
            <>
              <form onSubmit={handleSubmit} className="perfil-form">
                <h2>Editar Información</h2>

                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={errors.nombre ? 'input-error' : ''}
                  />
                  {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <hr className="form-divider" />

                <h3>Cambiar Contraseña (Opcional)</h3>

                <div className="form-group">
                  <label htmlFor="passwordActual">Contraseña Actual</label>
                  <input
                    id="passwordActual"
                    type="password"
                    name="passwordActual"
                    value={formData.passwordActual}
                    onChange={handleInputChange}
                    placeholder="Deja en blanco si no deseas cambiar"
                    className={errors.passwordActual ? 'input-error' : ''}
                  />
                  {errors.passwordActual && (
                    <span className="error-text">{errors.passwordActual}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="passwordNueva">Nueva Contraseña</label>
                  <input
                    id="passwordNueva"
                    type="password"
                    name="passwordNueva"
                    value={formData.passwordNueva}
                    onChange={handleInputChange}
                    placeholder="Deja en blanco si no deseas cambiar"
                    className={errors.passwordNueva ? 'input-error' : ''}
                  />
                  {errors.passwordNueva && (
                    <span className="error-text">{errors.passwordNueva}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="passwordConfirm">Confirmar Nueva Contraseña</label>
                  <input
                    id="passwordConfirm"
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    placeholder="Confirma tu nueva contraseña"
                    className={errors.passwordConfirm ? 'input-error' : ''}
                  />
                  {errors.passwordConfirm && (
                    <span className="error-text">{errors.passwordConfirm}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-success" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setEditMode(false);
                      setErrors({});
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Notificaciones */}
      {notifications.map((notif) => (
        <Toast
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};

export const PerfilPage = () => (
  <ProtectedRoute>
    <PerfilContent />
  </ProtectedRoute>
);
