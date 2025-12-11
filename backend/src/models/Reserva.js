// Modelo Reserva - Define la estructura y métodos de reservas
class Reserva {
  constructor(id, usuario_id, espacio_id, fecha, hora_inicio, hora_fin, estado = 'activa') {
    this.id = id;
    this.usuario_id = usuario_id;
    this.espacio_id = espacio_id;
    this.fecha = fecha; // Formato: YYYY-MM-DD
    this.hora_inicio = hora_inicio; // Formato: HH:MM
    this.hora_fin = hora_fin; // Formato: HH:MM
    this.estado = estado; // 'activa', 'cancelada', 'completada'
    this.fecha_creacion = new Date();
  }

  // Validar estructura de reserva
  validar() {
    if (!this.usuario_id) {
      throw new Error('Usuario ID requerido');
    }
    if (!this.espacio_id) {
      throw new Error('Espacio ID requerido');
    }
    if (!this.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(this.fecha)) {
      throw new Error('Fecha debe estar en formato YYYY-MM-DD');
    }
    if (!this.hora_inicio || !/^\d{2}:\d{2}$/.test(this.hora_inicio)) {
      throw new Error('Hora inicio debe estar en formato HH:MM');
    }
    if (!this.hora_fin || !/^\d{2}:\d{2}$/.test(this.hora_fin)) {
      throw new Error('Hora fin debe estar en formato HH:MM');
    }

    // Validar que hora_fin > hora_inicio
    const [hInicio, mInicio] = this.hora_inicio.split(':').map(Number);
    const [hFin, mFin] = this.hora_fin.split(':').map(Number);
    const minInicio = hInicio * 60 + mInicio;
    const minFin = hFin * 60 + mFin;

    if (minFin <= minInicio) {
      throw new Error('La hora de fin debe ser posterior a la de inicio');
    }

    return true;
  }

  // Convertir a objeto JSON para respuesta
  toJSON() {
    return {
      id: this.id,
      usuario_id: this.usuario_id,
      espacio_id: this.espacio_id,
      fecha: this.fecha,
      hora_inicio: this.hora_inicio,
      hora_fin: this.hora_fin,
      estado: this.estado,
      fecha_creacion: this.fecha_creacion,
    };
  }
}

module.exports = Reserva;
