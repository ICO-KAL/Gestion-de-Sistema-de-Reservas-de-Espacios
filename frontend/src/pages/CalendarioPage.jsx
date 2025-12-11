import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useReservas } from '../context/ReservasContext';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/LoadingStates';
import { useNotifications, Toast } from '../components/Toast';
import '../styles/Calendario.css';

/**
 * Página de Calendario Visual (HU17)
 * Permite ver disponibilidad de espacios en formato calendario
 * con vistas por día, semana y mes
 */
export const CalendarioPage = () => {
  const [date, setDate] = useState(new Date());
  const [vistaActual, setVistaActual] = useState('mes'); // 'dia', 'semana', 'mes'
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [mostrarFormReserva, setMostrarFormReserva] = useState(false);
  
  const [formReserva, setFormReserva] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    descripcion_uso: ''
  });

  const { espacios, fetchEspacios, crearReserva, isLoading } = useReservas();
  const { user } = useAuth();
  const { notifications, showNotification, removeNotification } = useNotifications();

  useEffect(() => {
    fetchEspacios();
  }, []);

  useEffect(() => {
    if (espacioSeleccionado) {
      cargarReservasDelDia(date, espacioSeleccionado);
    }
  }, [date, espacioSeleccionado]);

  const cargarReservasDelDia = async (fecha, espacioId) => {
    try {
      const fechaStr = fecha.toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/v1/reservas/disponibilidad?id_espacio=${espacioId}&fecha_inicio=${fechaStr} 00:00:00&fecha_fin=${fechaStr} 23:59:59`
      );
      const data = await response.json();
      
      if (data.conflictos) {
        setReservasDelDia(data.conflictos);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  };

  const obtenerColorDia = ({ date, view }) => {
    if (view === 'month' && espacioSeleccionado) {
      // Aquí podrías consultar si hay reservas en este día
      // Por ahora mostramos colores básicos
      const hoy = new Date();
      if (date < hoy) {
        return 'dia-pasado';
      }
      return null;
    }
    return null;
  };

  const handleFechaChange = (nuevaFecha) => {
    setDate(nuevaFecha);
  };

  const handleCrearReserva = () => {
    if (!espacioSeleccionado) {
      showNotification('❌ Por favor selecciona un espacio', 'error');
      return;
    }

    const fechaSeleccionada = date.toISOString().split('T')[0];
    setFormReserva({
      fecha_inicio: `${fechaSeleccionada} 08:00:00`,
      fecha_fin: `${fechaSeleccionada} 09:00:00`,
      descripcion_uso: ''
    });
    setMostrarFormReserva(true);
  };

  const handleSubmitReserva = async (e) => {
    e.preventDefault();

    if (!formReserva.fecha_inicio || !formReserva.fecha_fin) {
      showNotification('❌ Completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      await crearReserva({
        id_espacio: espacioSeleccionado,
        fecha_inicio: formReserva.fecha_inicio,
        fecha_fin: formReserva.fecha_fin,
        descripcion_uso: formReserva.descripcion_uso
      });

      showNotification('✅ Reserva creada exitosamente', 'success');
      setMostrarFormReserva(false);
      setFormReserva({ fecha_inicio: '', fecha_fin: '', descripcion_uso: '' });
      
      // Recargar reservas del día
      if (espacioSeleccionado) {
        cargarReservasDelDia(date, espacioSeleccionado);
      }
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al crear reserva';
      showNotification(`❌ ${mensaje}`, 'error');
    }
  };

  const generarHorasDelDia = () => {
    const horas = [];
    for (let h = 7; h <= 22; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return horas;
  };

  const generarDiasSemana = () => {
    const dias = [];
    const inicioSemana = new Date(date);
    inicioSemana.setDate(date.getDate() - date.getDay()); // Domingo

    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const esHoraReservada = (hora, fecha) => {
    if (!reservasDelDia.length) return false;

    const fechaStr = fecha.toISOString().split('T')[0];
    const horaCompleta = `${fechaStr} ${hora}:00`;

    return reservasDelDia.some(reserva => {
      const inicio = new Date(reserva.fecha_inicio);
      const fin = new Date(reserva.fecha_fin);
      const actual = new Date(horaCompleta);
      return actual >= inicio && actual < fin;
    });
  };

  if (isLoading && !espacios.length) return <Loading />;

  return (
    <div className="calendario-page">
      <div className="calendario-header">
        <h1>
          <span className="material-icons">calendar_today</span>
          Calendario de Reservas
        </h1>
        <p>Visualiza y gestiona la disponibilidad de espacios</p>
      </div>

      <div className="calendario-container">
        {/* Panel de Control */}
        <div className="calendario-sidebar">
          <div className="sidebar-section">
            <h3>
              <span className="material-icons">room</span>
              Seleccionar Espacio
            </h3>
            <select
              className="form-control"
              value={espacioSeleccionado || ''}
              onChange={(e) => setEspacioSeleccionado(e.target.value)}
            >
              <option value="">-- Selecciona un espacio --</option>
              {espacios.map(espacio => (
                <option key={espacio.id_espacio} value={espacio.id_espacio}>
                  {espacio.nombre} (Cap: {espacio.capacidad_maxima})
                </option>
              ))}
            </select>
          </div>

          <div className="sidebar-section">
            <h3>
              <span className="material-icons">view_module</span>
              Vista del Calendario
            </h3>
            <div className="vista-buttons">
              <button
                className={`btn btn-vista ${vistaActual === 'dia' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setVistaActual('dia')}
              >
                <span className="material-icons">today</span>
                Día
              </button>
              <button
                className={`btn btn-vista ${vistaActual === 'semana' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setVistaActual('semana')}
              >
                <span className="material-icons">view_week</span>
                Semana
              </button>
              <button
                className={`btn btn-vista ${vistaActual === 'mes' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setVistaActual('mes')}
              >
                <span className="material-icons">calendar_view_month</span>
                Mes
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>
              <span className="material-icons">info</span>
              Leyenda
            </h3>
            <div className="leyenda">
              <div className="leyenda-item">
                <span className="color-box disponible"></span>
                <span>Disponible</span>
              </div>
              <div className="leyenda-item">
                <span className="color-box ocupado"></span>
                <span>Ocupado</span>
              </div>
              <div className="leyenda-item">
                <span className="color-box seleccionado"></span>
                <span>Seleccionado</span>
              </div>
            </div>
          </div>

          {espacioSeleccionado && (
            <button className="btn btn-success btn-block" onClick={handleCrearReserva}>
              <span className="material-icons">add</span>
              Nueva Reserva
            </button>
          )}
        </div>

        {/* Área de Calendario */}
        <div className="calendario-main">
          {vistaActual === 'mes' && (
            <div className="vista-mes">
              <Calendar
                onChange={handleFechaChange}
                value={date}
                tileClassName={obtenerColorDia}
                locale="es-ES"
                minDate={new Date()}
              />
            </div>
          )}

          {vistaActual === 'dia' && espacioSeleccionado && (
            <div className="vista-dia">
              <h2>
                {date.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <div className="horas-grid">
                {generarHorasDelDia().map(hora => (
                  <div 
                    key={hora} 
                    className={`hora-slot ${esHoraReservada(hora, date) ? 'ocupado' : 'disponible'}`}
                  >
                    <span className="hora-label">{hora}</span>
                    <span className="estado-label">
                      {esHoraReservada(hora, date) ? 'Ocupado' : 'Disponible'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vistaActual === 'semana' && espacioSeleccionado && (
            <div className="vista-semana">
              <h2>Semana del {date.toLocaleDateString('es-ES')}</h2>
              <div className="semana-grid">
                <div className="semana-header">
                  <div className="hora-column"></div>
                  {generarDiasSemana().map((dia, idx) => (
                    <div key={idx} className="dia-column">
                      <div className="dia-nombre">
                        {dia.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </div>
                      <div className="dia-numero">
                        {dia.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="semana-body">
                  {generarHorasDelDia().map(hora => (
                    <div key={hora} className="semana-row">
                      <div className="hora-label">{hora}</div>
                      {generarDiasSemana().map((dia, idx) => (
                        <div 
                          key={idx} 
                          className={`celda ${esHoraReservada(hora, dia) ? 'ocupado' : 'disponible'}`}
                        >
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!espacioSeleccionado && vistaActual !== 'mes' && (
            <div className="empty-state">
              <span className="material-icons">event_busy</span>
              <p>Selecciona un espacio para ver la disponibilidad</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Crear Reserva */}
      {mostrarFormReserva && (
        <div className="modal-overlay" onClick={() => setMostrarFormReserva(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Reserva</h2>
              <button className="close-btn" onClick={() => setMostrarFormReserva(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitReserva}>
              <div className="form-group">
                <label>Fecha y Hora de Inicio</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formReserva.fecha_inicio.replace(' ', 'T')}
                  onChange={(e) => setFormReserva({
                    ...formReserva,
                    fecha_inicio: e.target.value.replace('T', ' ')
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha y Hora de Fin</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formReserva.fecha_fin.replace(' ', 'T')}
                  onChange={(e) => setFormReserva({
                    ...formReserva,
                    fecha_fin: e.target.value.replace('T', ' ')
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formReserva.descripcion_uso}
                  onChange={(e) => setFormReserva({
                    ...formReserva,
                    descripcion_uso: e.target.value
                  })}
                  placeholder="Describe el uso del espacio..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMostrarFormReserva(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioPage;
