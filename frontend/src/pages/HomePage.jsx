import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { Loading, EmptyState } from '../components/LoadingStates';
import '../styles/HomePage.css';

/**
 * Página Principal / Dashboard Usuario - HU19
 */
export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { espacios, reservas, fetchEspacios, fetchMisReservas, isLoading } = useReservas();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMisReservas();
      fetchEspacios();
    }
  }, [isAuthenticated]);

  if (isLoading) return <Loading />;

  return (
    <div className="home-page">
      {/* Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          {isAuthenticated ? (
            <>
              <h1>¡Bienvenido, {user?.nombre}!</h1>
              <p>Gestiona tus reservas y explora espacios disponibles</p>
            </>
          ) : (
            <>
              <h1>Bienvenido a SpaceBooker</h1>
              <p>Tu solución para gestionar reservas de espacios</p>
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-primary btn-large">
                  <span className="material-icons">login</span>
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-secondary btn-large">
                  <span className="material-icons">person_add</span>
                  Crear Cuenta
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="container">
        {/* Sección de Estadísticas */}
        {isAuthenticated && (
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><span className="material-icons">event</span></div>
                <div className="stat-content">
                  <div className="stat-number">{reservas?.length || 0}</div>
                  <div className="stat-label">Mis Reservas</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><span className="material-icons">business</span></div>
                <div className="stat-content">
                  <div className="stat-number">{espacios?.length || 0}</div>
                  <div className="stat-label">Espacios Disponibles</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><span className="material-icons">schedule</span></div>
                <div className="stat-content">
                  <div className="stat-number">
                    {reservas?.filter(r => new Date(r.fecha_inicio) > new Date()).length || 0}
                  </div>
                  <div className="stat-label">Próximas Reservas</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección de Acciones Rápidas */}
        {isAuthenticated && (
          <section className="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div className="actions-grid">
              <Link to="/espacios" className="action-card">
                <div className="action-icon"><span className="material-icons">search</span></div>
                <h3>Explorar Espacios</h3>
                <p>Busca y reserva un espacio</p>
              </Link>

              <Link to="/mis-reservas" className="action-card">
                <div className="action-icon"><span className="material-icons">list_alt</span></div>
                <h3>Mis Reservas</h3>
                <p>Ve tu historial de reservas</p>
              </Link>

              <Link to="/perfil" className="action-card">
                <div className="action-icon"><span className="material-icons">person</span></div>
                <h3>Mi Perfil</h3>
                <p>Actualiza tu información</p>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin" className="action-card admin-only">
                  <div className="action-icon"><span className="material-icons">settings</span></div>
                  <h3>Panel Admin</h3>
                  <p>Gestiona espacios y usuarios</p>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Sección de Espacios Destacados */}
        {isAuthenticated && espacios?.length > 0 && (
          <section className="featured-spaces">
            <h2>Espacios Destacados</h2>
            <div className="spaces-grid">
              {espacios.slice(0, 6).map(espacio => (
                <div key={espacio.id_espacio} className="space-card">
                  <div className="space-header">
                    <h3>{espacio.nombre}</h3>
                    <span className="capacity-badge">
                      👥 {espacio.capacidad_maxima} personas
                    </span>
                  </div>
                  <p className="space-description">{espacio.descripcion}</p>
                  <div className="space-resources">
                    {espacio.recursos?.length > 0 && (
                      <>
                        <strong>Recursos:</strong>
                        <div className="resources-list">
                          {espacio.recursos.map(r => (
                            <span key={r.id} className="resource-tag">
                              {r.nombre}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <Link 
                    to={`/espacios/${espacio.id_espacio}`}
                    className="btn btn-primary btn-small"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mensaje cuando no hay espacios */}
        {isAuthenticated && !isLoading && espacios?.length === 0 && (
          <EmptyState
            title="Sin Espacios Disponibles"
            message="Por el momento no hay espacios disponibles. Intenta más tarde."
            icon="🏢"
          />
        )}

        {/* Información cuando no está autenticado */}
        {!isAuthenticated && (
          <section className="info-section">
            <h2>¿Qué es SpaceBooker?</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <h3>Reservas Fáciles</h3>
                <p>Reserva espacios en minutos con nuestro sistema intuitivo</p>
              </div>

              <div className="info-card">
                <div className="info-icon">✅</div>
                <h3>Disponibilidad en Tiempo Real</h3>
                <p>Ve la disponibilidad actualizada de todos nuestros espacios</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🔒</div>
                <h3>Seguridad Garantizada</h3>
                <p>Tus datos están protegidos con encriptación de grado empresarial</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📱</div>
                <h3>Acceso Multiplataforma</h3>
                <p>Accede desde cualquier dispositivo en cualquier momento</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
