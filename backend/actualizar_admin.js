const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function actualizarAdmin() {
  try {
    console.log('🔄 Actualizando usuario admin...\n');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Generar hash para Admin123456
    const passwordHash = await bcrypt.hash('Admin123456', 10);
    
    console.log('📝 Nueva configuración:');
    console.log('  Email: isaac.admin@spacebooker.com');
    console.log('  Password: Admin123456');
    console.log('  Hash:', passwordHash);
    console.log('');

    // Actualizar el admin existente
    const [result] = await connection.query(
      `UPDATE usuarios 
       SET email = ?,
           nombre = ?,
           password_hash = ?
       WHERE email = ? OR id_rol = 1`,
      ['isaac.admin@spacebooker.com', 'Isaac Concepcion Peralta', passwordHash, 'admin@spacebooker.com']
    );

    console.log('✅ Actualización exitosa');
    console.log('   Filas afectadas:', result.affectedRows);
    console.log('');

    // Verificar el resultado
    const [admin] = await connection.query(
      'SELECT id_usuario, nombre, email, id_rol FROM usuarios WHERE id_rol = 1'
    );

    console.log('👑 Usuario ADMIN actualizado:');
    admin.forEach(user => {
      console.log(`  ID: ${user.id_usuario}`);
      console.log(`  Nombre: ${user.nombre}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Rol: ${user.id_rol}`);
    });

    await connection.end();
    
    console.log('\n✅ Proceso completado exitosamente!');
    console.log('\n🔐 Credenciales para iniciar sesión:');
    console.log('   Email: isaac.admin@spacebooker.com');
    console.log('   Password: Admin123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

actualizarAdmin();
