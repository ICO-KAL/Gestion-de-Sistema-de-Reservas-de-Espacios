const express = require('express');
const router = express.Router();
const espaciosController = require('../controllers/espaciosController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * SPRINT 2: Gestión de Espacios
 * HU07 - Crear espacio
 * HU08 - Editar espacio
 * HU09 - Eliminar espacio
 * HU10 - Asociar recursos
 * HU11 - Filtrar espacios
 */

// Obtener todos los espacios (HU06, HU11)
router.get('/', espaciosController.getEspacios);

// Obtener detalle de un espacio
router.get('/:id', espaciosController.getEspacioDetail);

// Crear espacio - Solo Admin (HU07)
router.post('/', authMiddleware.verify, roleMiddleware.requireAdmin, espaciosController.createEspacio);

// Editar espacio - Solo Admin (HU08)
router.put('/:id', authMiddleware.verify, roleMiddleware.requireAdmin, espaciosController.updateEspacio);

// Eliminar espacio - Solo Admin (HU09)
router.delete('/:id', authMiddleware.verify, roleMiddleware.requireAdmin, espaciosController.deleteEspacio);

// Asociar recursos a espacio - Solo Admin (HU10)
router.post('/:id/recursos', authMiddleware.verify, roleMiddleware.requireAdmin, espaciosController.asociarRecursos);

module.exports = router;
