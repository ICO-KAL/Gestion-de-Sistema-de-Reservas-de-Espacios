CREATE DATABASE IF NOT EXISTS spacebooker_db;
USE spacebooker_db;

-- Tabla ROLES
CREATE TABLE roles (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE,
  CONSTRAINT chk_roles_nombre CHECK (nombre_rol IN ('Admin', 'Usuario'))
);

INSERT INTO roles (id_rol, nombre_rol) VALUES (1, 'Admin'), (2, 'Usuario');

-- Tabla USUARIOS
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  id_rol INT NOT NULL DEFAULT 2,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla ESPACIOS
CREATE TABLE espacios (
  id_espacio INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  capacidad_maxima INT NOT NULL,
  disponible BOOLEAN DEFAULT true,
  CONSTRAINT chk_espacios_capacidad CHECK (capacidad_maxima > 0)
);

-- Tabla RECURSOS
CREATE TABLE recursos (
  id_recurso INT PRIMARY KEY AUTO_INCREMENT,
  nombre_recurso VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO recursos (nombre_recurso) VALUES 
  ('Proyector HD'),
  ('Pizarra'),
  ('Aire Acondicionado'),
  ('Sistema de Sonido'),
  ('Internet de Alta Velocidad'),
  ('Mesas y Sillas'),
  ('Estacionamiento');

-- Tabla ESPACIO_RECURSO (Relación N:M)
CREATE TABLE espacio_recurso (
  id_espacio INT NOT NULL,
  id_recurso INT NOT NULL,
  PRIMARY KEY (id_espacio, id_recurso),
  FOREIGN KEY (id_espacio) REFERENCES espacios(id_espacio) ON DELETE CASCADE,
  FOREIGN KEY (id_recurso) REFERENCES recursos(id_recurso) ON DELETE CASCADE
);

-- Tabla RESERVAS (Core del sistema)
CREATE TABLE reservas (
  id_reserva INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_espacio INT NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  descripcion_uso VARCHAR(255),
  estado ENUM('Activa', 'Vencida', 'Cancelada') DEFAULT 'Activa',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_espacio) REFERENCES espacios(id_espacio),
  -- Índice compuesto para optimizar búsqueda de solapamientos (RF04)
  INDEX idx_espacio_fechas (id_espacio, fecha_inicio, fecha_fin),
  CONSTRAINT chk_reservas_fechas CHECK (fecha_fin > fecha_inicio)
);

-- Índices adicionales para rendimiento
CREATE INDEX idx_usuario_reservas ON reservas(id_usuario);
CREATE INDEX idx_espacio_disponible ON espacios(disponible);
CREATE INDEX idx_usuario_email ON usuarios(email);
