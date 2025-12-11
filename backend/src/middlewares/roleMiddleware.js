/**
 * Middleware para verificar roles
 * HU03 - Autorización por roles
 */
const roleMiddleware = {
  requireAdmin: (req, res, next) => {
    if (!req.user || req.user.id_rol !== 1) {
      return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de Administrador.' });
    }
    next();
  },

  requireUser: (req, res, next) => {
    if (!req.user || (req.user.id_rol !== 1 && req.user.id_rol !== 2)) {
      return res.status(403).json({ error: 'Acceso no autorizado.' });
    }
    next();
  },
};

module.exports = roleMiddleware;
