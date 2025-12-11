const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/Database');

class AuthService {
  // Registrar nuevo usuario
  static async register(nombre, email, contraseña) {
    try {
      // Verificar si email ya existe
      const queryCheck = 'SELECT * FROM usuarios WHERE email = ?';
      const [existingUser] = await db.query(queryCheck, [email]);

      if (existingUser.length > 0) {
        throw new Error('El email ya está registrado');
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Insertar nuevo usuario
      const queryInsert = 'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)';
      const [result] = await db.query(queryInsert, [nombre, email, hashedPassword, 'usuario']);

      return {
        id: result.insertId,
        nombre,
        email,
        rol: 'usuario',
      };
    } catch (error) {
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  // Login de usuario
  static async login(email, contraseña) {
    try {
      // Buscar usuario por email
      const query = 'SELECT * FROM usuarios WHERE email = ?';
      const [users] = await db.query(query, [email]);

      if (users.length === 0) {
        throw new Error('Email o contraseña inválidos');
      }

      const user = users[0];

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

      if (!isPasswordValid) {
        throw new Error('Email o contraseña inválidos');
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET || 'secret_key_spacebooker',
        { expiresIn: '24h' }
      );

      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token,
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  // Verificar token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_spacebooker');
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId) {
    try {
      const query = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';
      const [users] = await db.query(query, [userId]);

      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return users[0];
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  // Actualizar perfil de usuario
  static async updateProfile(userId, nombre, email) {
    try {
      const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
      await db.query(query, [nombre, email, userId]);

      return {
        id: userId,
        nombre,
        email,
      };
    } catch (error) {
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  }

  // Cambiar contraseña
  static async changePassword(userId, contraseñaActual, contraseñaNueva) {
    try {
      // Obtener usuario
      const querySelect = 'SELECT contraseña FROM usuarios WHERE id = ?';
      const [users] = await db.query(querySelect, [userId]);

      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isPasswordValid = await bcrypt.compare(contraseñaActual, users[0].contraseña);

      if (!isPasswordValid) {
        throw new Error('Contraseña actual inválida');
      }

      // Hash nueva contraseña
      const hashedPassword = await bcrypt.hash(contraseñaNueva, 10);

      // Actualizar contraseña
      const queryUpdate = 'UPDATE usuarios SET contraseña = ? WHERE id = ?';
      await db.query(queryUpdate, [hashedPassword, userId]);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }
}

module.exports = AuthService;
