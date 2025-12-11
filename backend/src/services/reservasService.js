const db = require('../database/Database');

class ReservasService {
  // Obtener todas las reservas de un usuario
  static async getReservasByUsuario(usuarioId) {
    try {
      const query = `
        SELECT r.*, e.nombre as espacio_nombre, e.descripcion, u.nombre as usuario_nombre
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.usuario_id = ? AND r.estado != 'cancelada'
        ORDER BY r.fecha DESC, r.hora_inicio ASC
      `;
      const [reservas] = await db.query(query, [usuarioId]);
      return reservas;
    } catch (error) {
      throw new Error(`Error al obtener reservas: ${error.message}`);
    }
  }

  // Obtener todas las reservas
  static async getAllReservas() {
    try {
      const query = `
        SELECT r.*, e.nombre as espacio_nombre, u.nombre as usuario_nombre
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.estado != 'cancelada'
        ORDER BY r.fecha DESC, r.hora_inicio ASC
      `;
      const [reservas] = await db.query(query);
      return reservas;
    } catch (error) {
      throw new Error(`Error al obtener reservas: ${error.message}`);
    }
  }

  // Crear nueva reserva
  static async createReserva(usuarioId, espacioId, fecha, horaInicio, horaFin) {
    try {
      // Verificar disponibilidad (HU14 - Detectar solapamientos)
      const queryCheck = `
        SELECT COUNT(*) as count FROM reservas
        WHERE espacio_id = ? 
        AND fecha = ? 
        AND estado != 'cancelada'
        AND (
          (hora_inicio < ? AND hora_fin > ?)
          OR (hora_inicio < ? AND hora_fin > ?)
          OR (hora_inicio >= ? AND hora_fin <= ?)
        )
      `;

      const [result] = await db.query(queryCheck, [
        espacioId,
        fecha,
        horaFin,
        horaInicio,
        horaFin,
        horaInicio,
        horaInicio,
        horaFin,
      ]);

      if (result[0].count > 0) {
        throw new Error('El espacio no está disponible en ese horario (solapamiento detectado)');
      }

      // Crear reserva
      const queryInsert = `
        INSERT INTO reservas (usuario_id, espacio_id, fecha, hora_inicio, hora_fin, estado)
        VALUES (?, ?, ?, ?, ?, 'activa')
      `;

      const [insertResult] = await db.query(queryInsert, [usuarioId, espacioId, fecha, horaInicio, horaFin]);

      return {
        id: insertResult.insertId,
        usuario_id: usuarioId,
        espacio_id: espacioId,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: 'activa',
      };
    } catch (error) {
      throw new Error(`Error al crear reserva: ${error.message}`);
    }
  }

  // Cancelar reserva
  static async cancelReserva(reservaId) {
    try {
      const query = 'UPDATE reservas SET estado = "cancelada" WHERE id = ?';
      await db.query(query, [reservaId]);

      return { message: 'Reserva cancelada correctamente' };
    } catch (error) {
      throw new Error(`Error al cancelar reserva: ${error.message}`);
    }
  }

  // Verificar disponibilidad de un espacio
  static async checkDisponibilidad(espacioId, fecha, horaInicio, horaFin) {
    try {
      const query = `
        SELECT COUNT(*) as count FROM reservas
        WHERE espacio_id = ? 
        AND fecha = ? 
        AND estado != 'cancelada'
        AND (
          (hora_inicio < ? AND hora_fin > ?)
          OR (hora_inicio < ? AND hora_fin > ?)
          OR (hora_inicio >= ? AND hora_fin <= ?)
        )
      `;

      const [result] = await db.query(query, [
        espacioId,
        fecha,
        horaFin,
        horaInicio,
        horaFin,
        horaInicio,
        horaInicio,
        horaFin,
      ]);

      return result[0].count === 0; // true si está disponible
    } catch (error) {
      throw new Error(`Error al verificar disponibilidad: ${error.message}`);
    }
  }

  // Obtener reservas de un espacio en una fecha
  static async getReservasEspacio(espacioId, fecha) {
    try {
      const query = `
        SELECT * FROM reservas
        WHERE espacio_id = ? 
        AND fecha = ? 
        AND estado != 'cancelada'
        ORDER BY hora_inicio ASC
      `;

      const [reservas] = await db.query(query, [espacioId, fecha]);
      return reservas;
    } catch (error) {
      throw new Error(`Error al obtener reservas del espacio: ${error.message}`);
    }
  }

  // Obtener una reserva por ID
  static async getReservaById(reservaId) {
    try {
      const query = `
        SELECT r.*, e.nombre as espacio_nombre
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        WHERE r.id = ?
      `;

      const [reservas] = await db.query(query, [reservaId]);

      if (reservas.length === 0) {
        throw new Error('Reserva no encontrada');
      }

      return reservas[0];
    } catch (error) {
      throw new Error(`Error al obtener reserva: ${error.message}`);
    }
  }
}

module.exports = ReservasService;
