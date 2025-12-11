import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading, ErrorMessage } from '../components/LoadingStates';
import { ProtectedRoute } from '../components/ProtectedRoute';
import '../styles/AdminPanel.css';

/**
 * Panel Admin - Gestión de Espacios
 */
const AdminPanelContent = () => {
  const [tab, setTab] = useState('espacios');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  
  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const { espacios, fetchEspacios, crearEspacio, editarEspacio, eliminarEspacio, isLoading } = useReservas();
  const { notifications, showNotification, removeNotification } = useNotifications();

  useEffect(() => {
    fetchEspacios();
    if (tab === 'usuarios') {
      fetchUsuarios();
    }
  }, [tab]);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      showNotification('Error al cargar usuarios', 'error');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleEliminarUsuario = async (id_usuario) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/v1/usuarios/${id_usuario}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showNotification('Usuario eliminado exitosamente', 'success');
        fetchUsuarios();
      } catch (error) {
        showNotification('Error al eliminar usuario', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.capacidad) {
      showNotification('Por favor completa todos los campos', 'warning');
      return;
    }

    try {
      // Mapear 'capacidad' a 'capacidad_maxima' que espera el backend
      const datosParaEnviar = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad_maxima: parseInt(formData.capacidad)
      };

      if (editandoId) {
        await editarEspacio(editandoId, datosParaEnviar);
        showNotification('Espacio actualizado exitosamente', 'success');
      } else {
        await crearEspacio(datosParaEnviar);
        showNotification('Espacio creado exitosamente', 'success');
      }
      setFormData({ nombre: '', descripcion: '', capacidad: '' });
      setShowForm(false);
      setEditandoId(null);
    } catch (error) {
      showNotification('Error al guardar el espacio', 'error');
    }
  };

  const handleEditar = (espacio) => {
    setFormData({
      nombre: espacio.nombre,
      descripcion: espacio.descripcion,
      capacidad: espacio.capacidad_maxima,
    });
    setEditandoId(espacio.id_espacio);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este espacio?')) {
      try {
        await eliminarEspacio(id);
        showNotification('Espacio eliminado exitosamente', 'success');
      } catch (error) {
        showNotification('Error al eliminar el espacio', 'error');
      }
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setFormData({ nombre: '', descripcion: '', capacidad: '' });
    setEditandoId(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>⚙️ Panel de Administración</h1>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${tab === 'espacios' ? 'active' : ''}`}
            onClick={() => setTab('espacios')}
          >
            Gestionar Espacios
          </button>
          <button
            className={`tab-btn ${tab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setTab('usuarios')}
          >
            Ver Usuarios
          </button>
        </div>

        {/* Tab de Espacios */}
        {tab === 'espacios' && (
          <section className="admin-section">
            <div className="section-header">
              <h2>Espacios</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) handleCancelar();
                }}
              >
                {showForm ? 'Cancelar' : '+ Nuevo Espacio'}
              </button>
            </div>

            {/* Formulario */}
            {showForm && (
              <div className="admin-form">
                <h3>{editandoId ? 'Editar Espacio' : 'Crear Nuevo Espacio'}</h3>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Sala de Conferencias"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Ej: Sala equipada con proyector y pizarra"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Capacidad</label>
                    <input
                      type="number"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      placeholder="Ej: 20"
                      min="1"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                      {editandoId ? 'Actualizar' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleCancelar}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabla de Espacios */}
            {espacios?.length > 0 ? (
              <div className="espacios-table-wrapper">
                <table className="espacios-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Capacidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {espacios.map(espacio => (
                      <tr key={espacio.id_espacio}>
                        <td>{espacio.nombre}</td>
                        <td className="desc-cell">{espacio.descripcion}</td>
                        <td>{espacio.capacidad_maxima}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-primary"
                              onClick={() => handleEditar(espacio)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleEliminar(espacio.id_espacio)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">No hay espacios creados aún</p>
            )}
          </section>
        )}

        {/* Tab de Usuarios */}
        {tab === 'usuarios' && (
          <section className="admin-section">
            <h2>Usuarios Registrados</h2>
            
            {loadingUsuarios ? (
              <Loading />
            ) : usuarios.length > 0 ? (
              <div className="table-container">
                <table className="espacios-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario.id_usuario}>
                        <td>{usuario.id_usuario}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className={`role-badge ${usuario.id_rol === 1 ? 'admin' : 'user'}`}>
                            {usuario.id_rol === 1 ? '👑 Admin' : '👤 Usuario'}
                          </span>
                        </td>
                        <td>{new Date(usuario.fecha_creacion).toLocaleDateString('es-ES')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                              disabled={usuario.id_rol === 1}
                              title={usuario.id_rol === 1 ? 'No se pueden eliminar administradores' : 'Eliminar usuario'}
                            >
                              <span className="material-icons">delete</span>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="info-message">No hay usuarios registrados</p>
            )}
          </section>
        )}
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

export const AdminPanel = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminPanelContent />
  </ProtectedRoute>
);
