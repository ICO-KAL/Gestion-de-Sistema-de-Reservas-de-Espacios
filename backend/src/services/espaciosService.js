const db = require('../database/Database');

class EspaciosService {
  // Obtener todos los espacios
  static async getAllEspacios() {
    try {
      const query = 'SELECT * FROM espacios WHERE activo = true ORDER BY nombre ASC';
      const [espacios] = await db.query(query);
      return espacios;
    } catch (error) {
      throw new Error(`Error al obtener espacios: ${error.message}`);
    }
  }

  // Obtener espacio por ID
  static async getEspacioById(espacioId) {
    try {
      const query = 'SELECT * FROM espacios WHERE id = ? AND activo = true';
      const [espacios] = await db.query(query, [espacioId]);

      if (espacios.length === 0) {
        throw new Error('Espacio no encontrado');
      }

      return espacios[0];
    } catch (error) {
      throw new Error(`Error al obtener espacio: ${error.message}`);
    }
  }

  // Crear nuevo espacio
  static async createEspacio(nombre, descripcion, capacidad, tipo = 'sala') {
    try {
      const query = 'INSERT INTO espacios (nombre, descripcion, capacidad, tipo) VALUES (?, ?, ?, ?)';
      const [result] = await db.query(query, [nombre, descripcion, capacidad, tipo]);

      return {
        id: result.insertId,
        nombre,
        descripcion,
        capacidad,
        tipo,
        activo: true,
      };
    } catch (error) {
      throw new Error(`Error al crear espacio: ${error.message}`);
    }
  }

  // Actualizar espacio
  static async updateEspacio(espacioId, nombre, descripcion, capacidad, tipo) {
    try {
      const query = 'UPDATE espacios SET nombre = ?, descripcion = ?, capacidad = ?, tipo = ? WHERE id = ?';
      await db.query(query, [nombre, descripcion, capacidad, tipo, espacioId]);

      return {
        id: espacioId,
        nombre,
        descripcion,
        capacidad,
        tipo,
      };
    } catch (error) {
      throw new Error(`Error al actualizar espacio: ${error.message}`);
    }
  }

  // Eliminar espacio (soft delete)
  static async deleteEspacio(espacioId) {
    try {
      const query = 'UPDATE espacios SET activo = false WHERE id = ?';
      await db.query(query, [espacioId]);

      return { message: 'Espacio eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar espacio: ${error.message}`);
    }
  }

  // Buscar espacios por nombre
  static async searchEspacios(nombre) {
    try {
      const query = 'SELECT * FROM espacios WHERE nombre LIKE ? AND activo = true ORDER BY nombre ASC';
      const [espacios] = await db.query(query, [`%${nombre}%`]);
      return espacios;
    } catch (error) {
      throw new Error(`Error al buscar espacios: ${error.message}`);
    }
  }

  // Filtrar espacios por capacidad
  static async filterByCapacidad(capacidadMinima) {
    try {
      const query = 'SELECT * FROM espacios WHERE capacidad >= ? AND activo = true ORDER BY capacidad ASC';
      const [espacios] = await db.query(query, [capacidadMinima]);
      return espacios;
    } catch (error) {
      throw new Error(`Error al filtrar espacios: ${error.message}`);
    }
  }
}

module.exports = EspaciosService;
