const mysql = require('mysql2/promise');
require('dotenv').config();

async function verificarConexion() {
  console.log('🔍 Verificando conexión a la base de datos...\n');
  
  console.log('📝 Configuración:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  User:', process.env.DB_USER);
  console.log('  Password:', process.env.DB_PASSWORD ? '********' : 'NO DEFINIDA');
  console.log('  Database:', process.env.DB_NAME);
  console.log('');

  try {
    // Intentar conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conexión exitosa a MySQL!\n');

    // Verificar base de datos actual
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log('📊 Base de datos actual:', dbResult[0].db);
    console.log('');

    // Listar todas las tablas
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log('  -', Object.values(table)[0]);
    });
    console.log('');

    // Contar usuarios
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
    console.log('👥 Total de usuarios en la tabla:', countResult[0].total);
    console.log('');

    // Listar usuarios admin
    const [adminUsers] = await connection.query(
      'SELECT id_usuario, nombre, email, id_rol FROM usuarios WHERE id_rol = 1'
    );
    console.log('👑 Usuarios ADMIN (id_rol = 1):');
    if (adminUsers.length === 0) {
      console.log('  ❌ NO HAY USUARIOS ADMIN');
    } else {
      adminUsers.forEach(user => {
        console.log(`  - ID: ${user.id_usuario} | Nombre: ${user.nombre} | Email: ${user.email}`);
      });
    }
    console.log('');

    // Listar TODOS los usuarios
    const [allUsers] = await connection.query(
      'SELECT id_usuario, nombre, email, id_rol FROM usuarios'
    );
    console.log('📋 TODOS los usuarios:');
    allUsers.forEach(user => {
      const rolName = user.id_rol === 1 ? 'ADMIN' : 'USUARIO';
      console.log(`  - ID: ${user.id_usuario} | ${rolName} | ${user.email} | ${user.nombre}`);
    });
    console.log('');

    // Buscar específicamente el admin que intentas usar
    const [specificAdmin] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ?',
      ['isaac.admin@spacebooker.com']
    );
    console.log('🔍 Búsqueda específica de isaac.admin@spacebooker.com:');
    if (specificAdmin.length === 0) {
      console.log('  ❌ NO EXISTE en la base de datos');
    } else {
      console.log('  ✅ ENCONTRADO:');
      console.log('     ID:', specificAdmin[0].id_usuario);
      console.log('     Nombre:', specificAdmin[0].nombre);
      console.log('     Email:', specificAdmin[0].email);
      console.log('     Rol:', specificAdmin[0].id_rol);
      console.log('     Hash:', specificAdmin[0].password_hash);
    }

    await connection.end();
    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('\n❌ Error al conectar:', error.message);
    console.error('Código de error:', error.code);
    console.error('SQL State:', error.sqlState);
  }
}

verificarConexion();
