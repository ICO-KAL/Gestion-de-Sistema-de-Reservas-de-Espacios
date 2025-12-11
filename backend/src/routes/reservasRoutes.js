const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * SPRINT 3: Sistema de Reservas
 * HU12 - Consultar disponibilidad
 * HU13 - Crear reserva
 * HU14 - Validar solapamientos
 * HU15 - Ver historial
 * HU16 - Cancelar reserva
 */

// Consultar disponibilidad de espacios (HU12)
router.get('/disponibilidad', reservasController.checkDisponibilidad);

// Obtener mis reservas (HU15)
router.get('/mis_reservas', authMiddleware.verify, reservasController.getMisReservas);

// Crear reserva (HU13, HU14)
router.post('/', authMiddleware.verify, reservasController.createReserva);

// Obtener detalle de reserva
router.get('/:id', authMiddleware.verify, reservasController.getReservaDetail);

// Actualizar reserva
router.patch('/:id', authMiddleware.verify, reservasController.updateReserva);

// Cancelar reserva (HU16)
router.delete('/:id', authMiddleware.verify, reservasController.cancelReserva);

module.exports = router;
