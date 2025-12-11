const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar autenticación mediante JWT
 * HU03 - Autorización por roles
 */
const authMiddleware = {
  verify: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  },
};

module.exports = authMiddleware;
