
USE spacebooker_db;

UPDATE usuarios 
SET 
  email = 'isaac.admin@spacebooker.com',
  nombre = 'Isaac Concepcion Peralta',
  password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
WHERE email = 'admin@spacebooker.com';

-- Verificar el resultado
SELECT id_usuario, nombre, email, id_rol 
FROM usuarios 
WHERE id_rol = 1; -- desde el id rol 1 es donde puedes saber quienes son los administradores en si 
