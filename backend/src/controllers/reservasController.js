const Database = require('../database/Database');
const reservasController = {
  /**
   * GET /api/v1/reservas/disponibilidad
   * Consultar disponibilidad (HU12)
   * @swagger
   * /api/v1/reservas/disponibilidad:
   *   get:
   *     summary: Consultar disponibilidad de un espacio
   *     description: Verifica si un espacio está disponible en un rango de fechas
   *     tags: [Reservas]
   *     parameters:
   *       - in: query
   *         name: id_espacio
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del espacio a consultar
   *       - in: query
   *         name: fecha_inicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Fecha y hora de inicio (YYYY-MM-DD HH:MM:SS)
   *       - in: query
   *         name: fecha_fin
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Fecha y hora de fin (YYYY-MM-DD HH:MM:SS)
   *     responses:
   *       200:
   *         description: Disponibilidad consultada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 disponible:
   *                   type: boolean
   *                 conflictos:
   *                   type: array
   *                   items:
   *                     type: object
   *       400:
   *         description: Parámetros faltantes
   *       404:
   *         description: Espacio no encontrado
   */
  checkDisponibilidad: async (req, res) => {
    try {
      const { id_espacio, fecha_inicio, fecha_fin } = req.query;

      if (!id_espacio || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          error: 'id_espacio, fecha_inicio y fecha_fin son requeridos.',
        });
      }

      // Verificar que el espacio existe
      const espacios = await Database.query('SELECT * FROM espacios WHERE id_espacio = ?', [id_espacio]);
      if (espacios.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      // Buscar conflictos de reserva (RF04 - Validación de solapamientos)
      const conflictos = await Database.query(
        `SELECT * FROM reservas 
         WHERE id_espacio = ? 
         AND estado != "Cancelada"
         AND fecha_inicio < ? 
         AND fecha_fin > ?`,
        [id_espacio, fecha_fin, fecha_inicio]
      );

      res.json({
        disponible: conflictos.length === 0,
        conflictos: conflictos,
      });
    } catch (error) {
      console.error('Check Disponibilidad Error:', error.message);
      res.status(500).json({ error: 'Error al consultar disponibilidad' });
    }
  },

  /**
   * GET /api/v1/reservas/mis_reservas
   * Ver historial de mis reservas (HU15)
   * @swagger
   * /api/v1/reservas/mis_reservas:
   *   get:
   *     summary: Obtener reservas del usuario autenticado
   *     description: Retorna el historial completo de reservas del usuario
   *     tags: [Reservas]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de reservas del usuario
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: No autenticado
   */
  getMisReservas: async (req, res) => {
    try {
      const userId = req.user.id_usuario;

      const reservas = await Database.query(
        `SELECT r.*, e.nombre as espacio_nombre 
         FROM reservas r 
         JOIN espacios e ON r.id_espacio = e.id_espacio 
         WHERE r.id_usuario = ? 
         ORDER BY r.fecha_inicio DESC`,
        [userId]
      );

      res.json(reservas);
    } catch (error) {
      console.error('Get Mis Reservas Error:', error.message);
      res.status(500).json({ error: 'Error al obtener historial de reservas' });
    }
  },

  /**
   * POST /api/v1/reservas
   * Crear reserva (HU13, HU14)
   */
  createReserva: async (req, res) => {
    try {
      const userId = req.user.id_usuario;
      const { id_espacio, espacio_id, fecha_inicio, fecha_fin, descripcion_uso } = req.body;

      console.log('📝 Datos recibidos para crear reserva:', req.body);
      console.log('👤 Usuario ID:', userId);

      // Usar espacio_id si viene, si no id_espacio
      const espacioId = id_espacio || espacio_id;

      // Validaciones
      if (!espacioId || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          error: 'id_espacio, fecha_inicio y fecha_fin son requeridos.',
        });
      }

      // Validar que fin > inicio
      if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
        return res.status(400).json({
          error: 'La fecha de fin debe ser posterior a la fecha de inicio.',
        });
      }

      // Verificar que el espacio existe
      const espacios = await Database.query('SELECT * FROM espacios WHERE id_espacio = ?', [espacioId]);
      if (espacios.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      // VALIDACIÓN CRÍTICA RF04: Verificar solapamientos
      // Condición: nueva_fecha_inicio < existente_fecha_fin AND nueva_fecha_fin > existente_fecha_inicio
      const solapamientos = await Database.query(
        `SELECT * FROM reservas 
         WHERE id_espacio = ? 
         AND estado != "Cancelada"
         AND fecha_inicio < ? 
         AND fecha_fin > ?`,
        [espacioId, fecha_fin, fecha_inicio]
      );

      if (solapamientos.length > 0) {
        return res.status(409).json({
          error: 'El espacio ya está reservado en ese horario.',
          conflicto: solapamientos[0],
        });
      }

      // Crear reserva
      const result = await Database.query(
        `INSERT INTO reservas (id_usuario, id_espacio, fecha_inicio, fecha_fin, descripcion_uso, estado) 
         VALUES (?, ?, ?, ?, ?, "Activa")`,
        [userId, espacioId, fecha_inicio, fecha_fin, descripcion_uso || null]
      );

      res.status(201).json({
        message: 'Reserva creada exitosamente',
        id_reserva: result.insertId,
      });
    } catch (error) {
      console.error('Create Reserva Error:', error.message);
      res.status(500).json({ error: 'Error al crear reserva' });
    }
  },

  /**
   * GET /api/v1/reservas/:id
   * Obtener detalle de reserva
   */
  getReservaDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id_usuario;

      const reservas = await Database.query(
        `SELECT r.*, e.nombre as espacio_nombre, e.capacidad_maxima, u.nombre as usuario_nombre 
         FROM reservas r 
         JOIN espacios e ON r.id_espacio = e.id_espacio 
         JOIN usuarios u ON r.id_usuario = u.id_usuario
         WHERE r.id_reserva = ? AND r.id_usuario = ?`,
        [id, userId]
      );

      if (reservas.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      res.json({
        reserva: reservas[0],
      });
    } catch (error) {
      console.error('Get Reserva Detail Error:', error.message);
      res.status(500).json({ error: 'Error al obtener detalle de reserva' });
    }
  },

  /**
   * PATCH /api/v1/reservas/:id
   * Actualizar reserva
   */
  updateReserva: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id_usuario;
      const { fecha_inicio, fecha_fin, descripcion_uso } = req.body;

      // Obtener reserva actual
      const reservas = await Database.query('SELECT * FROM reservas WHERE id_reserva = ? AND id_usuario = ?', [
        id,
        userId,
      ]);

      if (reservas.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      const reserva = reservas[0];

      // Validar que fin > inicio si se actualiza
      if (fecha_inicio && fecha_fin && new Date(fecha_fin) <= new Date(fecha_inicio)) {
        return res.status(400).json({
          error: 'La fecha de fin debe ser posterior a la fecha de inicio.',
        });
      }

      // Si cambian las fechas, validar solapamientos
      if (fecha_inicio || fecha_fin) {
        const newFechaInicio = fecha_inicio || reserva.fecha_inicio;
        const newFechaFin = fecha_fin || reserva.fecha_fin;

        const solapamientos = await Database.query(
          `SELECT * FROM reservas 
           WHERE id_espacio = ? 
           AND id_reserva != ?
           AND estado != "Cancelada"
           AND fecha_inicio < ? 
           AND fecha_fin > ?`,
          [reserva.id_espacio, id, newFechaFin, newFechaInicio]
        );

        if (solapamientos.length > 0) {
          return res.status(409).json({
            error: 'El espacio ya está reservado en ese horario.',
          });
        }
      }

      let updateQuery = 'UPDATE reservas SET ';
      const updateValues = [];

      if (fecha_inicio) {
        updateQuery += 'fecha_inicio = ?, ';
        updateValues.push(fecha_inicio);
      }
      if (fecha_fin) {
        updateQuery += 'fecha_fin = ?, ';
        updateValues.push(fecha_fin);
      }
      if (descripcion_uso !== undefined) {
        updateQuery += 'descripcion_uso = ?, ';
        updateValues.push(descripcion_uso);
      }

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_reserva = ?';
      updateValues.push(id);

      await Database.query(updateQuery, updateValues);

      res.json({
        message: 'Reserva actualizada correctamente',
      });
    } catch (error) {
      console.error('Update Reserva Error:', error.message);
      res.status(500).json({ error: 'Error al actualizar reserva' });
    }
  },

  /**
   * DELETE /api/v1/reservas/:id
   * Cancelar reserva (HU16)
   */
  cancelReserva: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id_usuario;

      const reservas = await Database.query('SELECT * FROM reservas WHERE id_reserva = ? AND id_usuario = ?', [
        id,
        userId,
      ]);

      if (reservas.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      const reserva = reservas[0];

      // No permitir cancelar reservas vencidas
      if (new Date(reserva.fecha_fin) < new Date()) {
        return res.status(400).json({
          error: 'No se puede cancelar una reserva que ya ha vencido.',
        });
      }

      // Actualizar estado a Cancelada
      await Database.query('UPDATE reservas SET estado = "Cancelada" WHERE id_reserva = ?', [id]);

      res.json({
        message: 'Reserva cancelada correctamente',
      });
    } catch (error) {
      console.error('Cancel Reserva Error:', error.message);
      res.status(500).json({ error: 'Error al cancelar reserva' });
    }
  },
};

module.exports = reservasController;
