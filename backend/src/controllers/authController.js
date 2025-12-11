const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('../database/Database');

const authController = {
  /**
   * POST /api/v1/auth/register
   * Registrar una nueva cuenta (HU02)
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Registrar nuevo usuario
   *     description: Crea una nueva cuenta de usuario en el sistema
   *     tags: [Autenticación]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - email
   *               - password
   *             properties:
   *               nombre:
   *                 type: string
   *                 description: Nombre completo del usuario
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Correo electrónico único
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 description: Contraseña (mínimo 6 caracteres)
   *               id_rol:
   *                 type: integer
   *                 enum: [1, 2]
   *                 description: Rol del usuario (1=Admin, 2=Usuario)
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *       400:
   *         description: Datos inválidos
   *       409:
   *         description: Email ya registrado
   */
  register: async (req, res) => {
    try {
      const { nombre, email, password, id_rol } = req.body;

      // Validaciones
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres.' });
      }

      // Verificar si el correo ya existe
      const emailCheck = await Database.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (emailCheck.length > 0) {
        return res.status(409).json({ error: 'El correo ya está registrado.' });
      }

      // Hashear contraseña con Bcrypt (Seguridad RF06)
      const passwordHash = await bcrypt.hash(password, 10);

      // Determinar rol: si viene id_rol en el body, usarlo; si no, usar rol 2 (Usuario por defecto)
      const rolFinal = id_rol || 2;

      // Validar que el rol sea 1 o 2
      if (rolFinal !== 1 && rolFinal !== 2) {
        return res.status(400).json({ error: 'Rol inválido. Debe ser 1 (Admin) o 2 (Usuario).' });
      }

      // Insertar nuevo usuario
      const result = await Database.query(
        'INSERT INTO usuarios (nombre, email, password_hash, id_rol, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
        [nombre, email, passwordHash, rolFinal]
      );

      res.status(201).json({
        message: 'Registro completado exitosamente',
        userId: result.insertId,
      });
    } catch (error) {
      console.error('Register Error:', error.message);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  /**
   * POST /api/v1/auth/login
   * Iniciar sesión (HU01)
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     description: Autentica un usuario y retorna un token JWT
   *     tags: [Autenticación]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *       401:
   *         description: Credenciales incorrectas
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
      }

      // Buscar usuario por email
      const users = await Database.query('SELECT * FROM usuarios WHERE email = ?', [email]);

      console.log('🔍 Login attempt for:', email);
      console.log('📊 Users found:', users.length);
      console.log('🗄️ Query result:', JSON.stringify(users, null, 2));

      if (users.length === 0) {
        console.log('❌ Usuario no encontrado');
        return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
      }

      const user = users[0];
      console.log('👤 Usuario encontrado:', { id: user.id_usuario, email: user.email, rol: user.id_rol });

      // Verificar contraseña con Bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      console.log('🔑 Password válido:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Contraseña incorrecta');
        return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
      }

      // Generar JWT (Token con expiración de 24h)
      const token = jwt.sign(
        { id_usuario: user.id_usuario, email: user.email, id_rol: user.id_rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          email: user.email,
          id_rol: user.id_rol,
        },
      });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  /**
   * POST /api/v1/auth/logout
   * Cerrar sesión (HU06)
   */
  logout: (req, res) => {
    try {
      res.json({
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  },

  /**
   * GET /api/v1/auth/profile
   * Ver perfil (HU04)
   */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id_usuario;

      const users = await Database.query('SELECT id_usuario, nombre, email, fecha_creacion FROM usuarios WHERE id_usuario = ?', [
        userId,
      ]);

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        user: users[0],
      });
    } catch (error) {
      console.error('Get Profile Error:', error.message);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },

  /**
   * PUT /api/v1/auth/profile
   * Actualizar perfil (HU05)
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id_usuario;
      const { nombre, passwordActual, passwordNueva } = req.body;

      // Obtener usuario actual
      const users = await Database.query('SELECT * FROM usuarios WHERE id_usuario = ?', [userId]);

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = users[0];

      // Si se desea cambiar contraseña, verificar la actual
      if (passwordNueva) {
        if (!passwordActual) {
          return res.status(400).json({ error: 'Debe proporcionar la contraseña actual para cambiarla.' });
        }

        const isPasswordValid = await bcrypt.compare(passwordActual, user.password_hash);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
        }

        if (passwordNueva.length < 6) {
          return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 6 caracteres.' });
        }
      }

      // Preparar actualizaciones
      let updateQuery = 'UPDATE usuarios SET ';
      const updateValues = [];

      if (nombre) {
        updateQuery += 'nombre = ?, ';
        updateValues.push(nombre);
      }

      if (passwordNueva) {
        const passwordHash = await bcrypt.hash(passwordNueva, 10);
        updateQuery += 'password_hash = ?, ';
        updateValues.push(passwordHash);
      }

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_usuario = ?';
      updateValues.push(userId);

      await Database.query(updateQuery, updateValues);

      res.json({
        message: 'Perfil actualizado exitosamente',
      });
    } catch (error) {
      console.error('Update Profile Error:', error.message);
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  },
};

module.exports = authController;
