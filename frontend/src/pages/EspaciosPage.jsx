import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading, EmptyState, ErrorMessage } from '../components/LoadingStates';
import { ProtectedRoute } from '../components/ProtectedRoute';
import '../styles/Espacios.css';

/**
 * Página de Listado de Espacios - HU19
 */
const EspaciosContent = () => {
  const [filtro, setFiltro] = useState({
    capacidad: '',
    recurso: '',
    busqueda: '',
  });
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  const { espacios, fetchEspacios, isLoading, error } = useReservas();
  const { notifications, showNotification, removeNotification } = useNotifications();

  useEffect(() => {
    fetchEspacios(filtro);
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    const nuevoFiltro = { ...filtro, [name]: value };
    setFiltro(nuevoFiltro);
    fetchEspacios(nuevoFiltro);
  };

  const espaciosFiltrados = espacios?.filter(e => {
    if (filtro.capacidad && e.capacidad < parseInt(filtro.capacidad)) return false;
    if (filtro.busqueda && !e.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchEspacios()} />;

  return (
    <div className="espacios-page">
      <div className="container">
        <h1>🏢 Explorar Espacios</h1>

        {/* Filtros */}
        <div className="filtros-section">
          <input
            type="text"
            name="busqueda"
            placeholder="Buscar por nombre..."
            value={filtro.busqueda}
            onChange={handleFiltroChange}
            className="filtro-input"
          />
          <select
            name="capacidad"
            value={filtro.capacidad}
            onChange={handleFiltroChange}
            className="filtro-input"
          >
            <option value="">Capacidad mínima</option>
            <option value="5">5+ personas</option>
            <option value="10">10+ personas</option>
            <option value="20">20+ personas</option>
            <option value="50">50+ personas</option>
          </select>
        </div>

        {/* Grid de Espacios */}
        {espaciosFiltrados?.length > 0 ? (
          <div className="espacios-grid">
            {espaciosFiltrados.map(espacio => (
              <div key={espacio.id_espacio} className="espacio-card">
                <div className="espacio-header">
                  <h3>{espacio.nombre}</h3>
                  <span className="capacity-badge">
                    👥 {espacio.capacidad_maxima}
                  </span>
                </div>

                <p className="espacio-desc">{espacio.descripcion}</p>

                {espacio.recursos?.length > 0 && (
                  <div className="recursos">
                    <strong>Recursos:</strong>
                    <div className="recursos-list">
                      {espacio.recursos.map(r => (
                        <span key={r.id} className="resource-badge">
                          {r.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setEspacioSeleccionado(espacio)}
                  className="btn btn-primary"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin espacios"
            message="No hay espacios que coincidan con tus filtros"
            icon="🔍"
          />
        )}
      </div>

      {/* Modal de Detalles */}
      {espacioSeleccionado && (
        <DetalleEspacioModal
          espacio={espacioSeleccionado}
          onClose={() => setEspacioSeleccionado(null)}
          showNotification={showNotification}
        />
      )}

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

/**
 * Modal de Detalles del Espacio
 */
const DetalleEspacioModal = ({ espacio, onClose, showNotification }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('10:00');

  const { fetchDisponibilidad, crearReserva, isLoading } = useReservas();

  const handleReservar = async () => {
    try {
      const fechaInicio = `${fecha} ${horaInicio}`;
      const fechaFin = `${fecha} ${horaFin}`;

      await crearReserva({
        espacio_id: espacio.id_espacio,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      showNotification('¡Reserva creada exitosamente!', 'success');
      onClose();
    } catch (error) {
      showNotification('Error al crear la reserva', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{espacio.nombre}</h2>
        <p className="modal-desc">{espacio.descripcion}</p>

        <div className="modal-info">
          <div className="info-item">
            <strong>Capacidad:</strong>
            <span>{espacio.capacidad_maxima} personas</span>
          </div>
          {espacio.recursos?.length > 0 && (
            <div className="info-item">
              <strong>Recursos:</strong>
              <div className="recursos-list">
                {espacio.recursos.map(r => (
                  <span key={r.id} className="resource-badge">
                    {r.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Reserva */}
        <div className="reserva-form">
          <h3>Crear Reserva</h3>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora Inicio</label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Hora Fin</label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleReservar}
            disabled={isLoading}
            className="btn btn-primary btn-large"
          >
            {isLoading ? 'Creando reserva...' : 'Crear Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EspaciosPage = () => (
  <ProtectedRoute>
    <EspaciosContent />
  </ProtectedRoute>
);
