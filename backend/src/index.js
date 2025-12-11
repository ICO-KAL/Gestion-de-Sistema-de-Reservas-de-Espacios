const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Database = require('./database/Database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const espaciosRoutes = require('./routes/espaciosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta de status del servidor
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SpaceBooker API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/espacios', espaciosRoutes);
app.use('/api/v1/reservas', reservasRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Inicializar conexión a BD (Singleton)
    await Database.getInstance();

    app.listen(PORT, () => {
      console.log(`\n🚀 SpaceBooker Backend corriendo en http://localhost:${PORT}`);
      console.log(`📝 Documentación: http://localhost:${PORT}/api/docs`);
      console.log(`📊 Status: http://localhost:${PORT}/api/status\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n📴 Cerrando servidor...');
  await Database.closePool();
  process.exit(0);
});

startServer();

module.exports = app;
