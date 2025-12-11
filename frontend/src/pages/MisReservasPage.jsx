import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { useNotifications, Toast } from '../components/Toast';
import { Loading, EmptyState, ErrorMessage } from '../components/LoadingStates';
import { ProtectedRoute } from '../components/ProtectedRoute';
import '../styles/MisReservas.css';

/**
 * Página de Mis Reservas - HU15
 */
const MisReservasContent = () => {
  const { reservas, fetchMisReservas, cancelarReserva, isLoading, error } = useReservas();
  const { notifications, showNotification, removeNotification } = useNotifications();

  useEffect(() => {
    fetchMisReservas();
  }, []);

  const handleCancelar = async (reservaId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      try {
        await cancelarReserva(reservaId);
        showNotification('Reserva cancelada exitosamente', 'success');
        // Recargar las reservas automáticamente para actualizar la vista
        await fetchMisReservas();
      } catch (error) {
        showNotification('Error al cancelar la reserva', 'error');
      }
    }
  };

  const ahora = new Date();
  const proximasReservas = reservas?.filter(
    r => new Date(r.fecha_inicio) > ahora && r.estado !== 'Cancelada'
  ) || [];
  const reservasPasadas = reservas?.filter(
    r => new Date(r.fecha_inicio) <= ahora && r.estado !== 'Cancelada'
  ) || [];

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMisReservas} />;

  return (
    <div className="mis-reservas-page">
      <div className="container">
        <h1>📋 Mis Reservas</h1>

        {/* Próximas Reservas */}
        <section className="reservas-section">
          <h2>Próximas Reservas ({proximasReservas.length})</h2>

          {proximasReservas.length > 0 ? (
            <div className="reservas-list">
              {proximasReservas.map(reserva => (
                <ReservaCard
                  key={reserva.id_reserva}
                  reserva={reserva}
                  onCancelar={() => handleCancelar(reserva.id_reserva)}
                  isPasada={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sin próximas reservas"
              message="No tienes reservas próximas. ¡Crea una nueva!"
              icon="📅"
            />
          )}
        </section>

        {/* Reservas Pasadas */}
        {reservasPasadas.length > 0 && (
          <section className="reservas-section">
            <h2>Historial de Reservas ({reservasPasadas.length})</h2>
            <div className="reservas-list">
              {reservasPasadas.map(reserva => (
                <ReservaCard
                  key={reserva.id_reserva}
                  reserva={reserva}
                  isPasada={true}
                />
              ))}
            </div>
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

/**
 * Componente de Tarjeta de Reserva
 */
const ReservaCard = ({ reserva, onCancelar, isPasada }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const puedeCancelar = !isPasada;

  return (
    <div className={`reserva-card ${isPasada ? 'pasada' : 'proxima'}`}>
      <div className="reserva-header">
        <h3>{reserva.espacio?.nombre || 'Espacio Desconocido'}</h3>
        <span className={`status-badge ${isPasada ? 'completada' : 'confirmada'}`}>
          {isPasada ? '✓ Completada' : '✓ Confirmada'}
        </span>
      </div>

      <div className="reserva-content">
        <div className="reserva-detail">
          <span className="detail-label">📅 Fecha Inicio:</span>
          <span className="detail-value">{formatDate(reserva.fecha_inicio)}</span>
        </div>

        <div className="reserva-detail">
          <span className="detail-label">⏱️ Fecha Fin:</span>
          <span className="detail-value">{formatDate(reserva.fecha_fin)}</span>
        </div>

        {reserva.descripcion && (
          <div className="reserva-detail">
            <span className="detail-label">📝 Notas:</span>
            <span className="detail-value">{reserva.descripcion}</span>
          </div>
        )}
      </div>

      {puedeCancelar && (
        <button
          onClick={onCancelar}
          className="btn btn-danger btn-small"
        >
          Cancelar Reserva
        </button>
      )}
    </div>
  );
};

export const MisReservasPage = () => (
  <ProtectedRoute>
    <MisReservasContent />
  </ProtectedRoute>
);
