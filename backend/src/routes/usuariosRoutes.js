const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const Database = require('../database/Database');

/**
 * GET /api/v1/usuarios
 * Obtener todos los usuarios (Solo Admin)
 */
router.get('/', authMiddleware.verify, roleMiddleware.requireAdmin, async (req, res) => {
  try {
    const usuarios = await Database.query(
      `SELECT id_usuario, nombre, email, id_rol, fecha_creacion 
       FROM usuarios 
       ORDER BY fecha_creacion DESC`
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Get Usuarios Error:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/**
 * DELETE /api/v1/usuarios/:id
 * Eliminar usuario (Solo Admin)
 */
router.delete('/:id', authMiddleware.verify, roleMiddleware.requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const usuarios = await Database.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitir eliminar administradores
    if (usuarios[0].id_rol === 1) {
      return res.status(403).json({ error: 'No se pueden eliminar usuarios administradores' });
    }

    // Verificar si tiene reservas activas
    const reservas = await Database.query(
      'SELECT * FROM reservas WHERE id_usuario = ? AND estado = "Activa"',
      [id]
    );

    if (reservas.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el usuario porque tiene reservas activas' 
      });
    }

    // Eliminar usuario
    await Database.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Delete Usuario Error:', error.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
