const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * SPRINT 1: Autenticación y Gestión de Usuarios
 * HU01 - Iniciar sesión
 * HU02 - Registrar una nueva cuenta
 * HU06 - Cerrar sesión
 */

// POST /api/v1/auth/register - Crear nueva cuenta (HU02)
router.post('/register', authController.register);

// POST /api/v1/auth/login - Iniciar sesión (HU01)
router.post('/login', authController.login);

// POST /api/v1/auth/logout - Cerrar sesión (HU06)
router.post('/logout', authMiddleware.verify, authController.logout);

// GET /api/v1/auth/profile - Ver perfil (HU04)
router.get('/profile', authMiddleware.verify, authController.getProfile);

// PUT /api/v1/auth/profile - Actualizar perfil (HU05)
router.put('/profile', authMiddleware.verify, authController.updateProfile);

module.exports = router;
