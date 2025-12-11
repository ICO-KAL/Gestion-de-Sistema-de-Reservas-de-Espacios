const Database = require('../database/Database');

const espaciosController = {
  /**
   * GET /api/v1/espacios
   * Obtener todos los espacios (HU06, HU11)
   */
  getEspacios: async (req, res) => {
    try {
      const { capacidad_minima, recursos } = req.query;

      let query = 'SELECT * FROM espacios WHERE disponible = true';
      const values = [];

      if (capacidad_minima) {
        query += ' AND capacidad_maxima >= ?';
        values.push(parseInt(capacidad_minima));
      }

      query += ' ORDER BY nombre ASC';

      const espacios = await Database.query(query, values);

      // Si se filtran por recursos, agregar info de recursos
      if (recursos) {
        const recursoIds = recursos.split(',').map(id => parseInt(id));
        // Lógica de filtrado por recursos (se puede optimizar)
      }

      res.json(espacios);
    } catch (error) {
      console.error('Get Espacios Error:', error.message);
      res.status(500).json({ error: 'Error al obtener espacios' });
    }
  },

  /**
   * GET /api/v1/espacios/:id
   * Obtener detalle de un espacio
   */
  getEspacioDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const espacios = await Database.query('SELECT * FROM espacios WHERE id_espacio = ?', [id]);

      if (espacios.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      // Obtener recursos asociados
      const recursos = await Database.query(
        `SELECT r.* FROM recursos r 
         JOIN espacio_recurso er ON r.id_recurso = er.id_recurso 
         WHERE er.id_espacio = ?`,
        [id]
      );

      res.json({
        espacio: espacios[0],
        recursos,
      });
    } catch (error) {
      console.error('Get Espacio Detail Error:', error.message);
      res.status(500).json({ error: 'Error al obtener detalle del espacio' });
    }
  },

  /**
   * POST /api/v1/espacios
   * Crear nuevo espacio (HU07) - Solo Admin
   */
  createEspacio: async (req, res) => {
    try {
      const { nombre, descripcion, capacidad_maxima } = req.body;

      // Validaciones
      if (!nombre || !capacidad_maxima) {
        return res.status(400).json({ error: 'Nombre y capacidad son requeridos.' });
      }

      if (capacidad_maxima <= 0) {
        return res.status(400).json({ error: 'La capacidad debe ser mayor a 0.' });
      }

      // Verificar nombre único
      const existing = await Database.query('SELECT * FROM espacios WHERE nombre = ?', [nombre]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Ya existe un espacio con ese nombre.' });
      }

      // Insertar espacio
      const result = await Database.query(
        'INSERT INTO espacios (nombre, descripcion, capacidad_maxima, disponible) VALUES (?, ?, ?, true)',
        [nombre, descripcion || null, capacidad_maxima]
      );

      res.status(201).json({
        message: 'Espacio creado correctamente',
        id_espacio: result.insertId,
      });
    } catch (error) {
      console.error('Create Espacio Error:', error.message);
      res.status(500).json({ error: 'Error al crear espacio' });
    }
  },

  /**
   * PUT /api/v1/espacios/:id
   * Editar espacio (HU08) - Solo Admin
   */
  updateEspacio: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, capacidad_maxima, disponible } = req.body;

      // Verificar que existe
      const espacios = await Database.query('SELECT * FROM espacios WHERE id_espacio = ?', [id]);
      if (espacios.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      // Si cambia el nombre, verificar que no exista otro con ese nombre
      if (nombre) {
        const existing = await Database.query('SELECT * FROM espacios WHERE nombre = ? AND id_espacio != ?', [nombre, id]);
        if (existing.length > 0) {
          return res.status(409).json({ error: 'Ya existe otro espacio con ese nombre.' });
        }
      }

      let updateQuery = 'UPDATE espacios SET ';
      const updateValues = [];

      if (nombre) {
        updateQuery += 'nombre = ?, ';
        updateValues.push(nombre);
      }
      if (descripcion !== undefined) {
        updateQuery += 'descripcion = ?, ';
        updateValues.push(descripcion);
      }
      if (capacidad_maxima) {
        updateQuery += 'capacidad_maxima = ?, ';
        updateValues.push(capacidad_maxima);
      }
      if (disponible !== undefined) {
        updateQuery += 'disponible = ?, ';
        updateValues.push(disponible);
      }

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_espacio = ?';
      updateValues.push(id);

      await Database.query(updateQuery, updateValues);

      res.json({
        message: 'Espacio actualizado correctamente',
      });
    } catch (error) {
      console.error('Update Espacio Error:', error.message);
      res.status(500).json({ error: 'Error al actualizar espacio' });
    }
  },

  /**
   * DELETE /api/v1/espacios/:id
   * Eliminar espacio (HU09) - Solo Admin
   */
  deleteEspacio: async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar si tiene reservas activas
      const reservas = await Database.query(
        'SELECT * FROM reservas WHERE id_espacio = ? AND estado != "Cancelada"',
        [id]
      );

      if (reservas.length > 0) {
        return res.status(400).json({
          error: 'No se puede eliminar un espacio que tiene reservas activas.',
        });
      }

      // Eliminar recursos asociados
      await Database.query('DELETE FROM espacio_recurso WHERE id_espacio = ?', [id]);

      // Eliminar espacio
      await Database.query('DELETE FROM espacios WHERE id_espacio = ?', [id]);

      res.json({
        message: 'Espacio eliminado correctamente',
      });
    } catch (error) {
      console.error('Delete Espacio Error:', error.message);
      res.status(500).json({ error: 'Error al eliminar espacio' });
    }
  },

  /**
   * POST /api/v1/espacios/:id/recursos
   * Asociar recursos a un espacio (HU10) - Solo Admin
   */
  asociarRecursos: async (req, res) => {
    try {
      const { id } = req.params;
      const { recursos } = req.body; // Array de IDs de recursos

      if (!Array.isArray(recursos) || recursos.length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un recurso.' });
      }

      // Verificar que existe el espacio
      const espacios = await Database.query('SELECT * FROM espacios WHERE id_espacio = ?', [id]);
      if (espacios.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      // Eliminar recursos anteriores
      await Database.query('DELETE FROM espacio_recurso WHERE id_espacio = ?', [id]);

      // Agregar nuevos recursos
      for (const recursoId of recursos) {
        await Database.query('INSERT INTO espacio_recurso (id_espacio, id_recurso) VALUES (?, ?)', [id, recursoId]);
      }

      res.json({
        message: 'Recursos asociados correctamente',
      });
    } catch (error) {
      console.error('Asociar Recursos Error:', error.message);
      res.status(500).json({ error: 'Error al asociar recursos' });
    }
  },
};

module.exports = espaciosController;
