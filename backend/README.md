# SpaceBooker Backend API

**Proyecto Final - Programación 3**

- **Autor:** Isaac Concepcion Peralta - Matricula: 2023-1932
- **Profesor:** Kely Tejada Belliard
- **Materia:** Programación 3
- **Fecha:** 10/12/2025

---

## 🚀 Inicio Rápido

### Instalación de dependencias
```bash
npm install
```

### Configurar variables de entorno
Crear archivo `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spacebooker_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=24h
NODE_ENV=development
```

### Crear la base de datos
```bash
mysql -u root -p < BD/spacebooker_db.sql
```

### Ejecutar servidor
```bash
# Desarrollo
npm start

# Con nodemon
npm run dev
```

Servidor disponible en: **http://localhost:5000**

---

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── controllers/        # Lógica de negocio por módulo
│   │   ├── authController.js          # SPRINT 1: Autenticación
│   │   ├── espaciosController.js      # SPRINT 2: Gestión de Espacios
│   │   └── reservasController.js      # SPRINT 3: Sistema de Reservas
│   ├── routes/            # Definición de endpoints
│   │   ├── authRoutes.js
│   │   ├── espaciosRoutes.js
│   │   └── reservasRoutes.js
│   ├── database/          # Patrón Singleton
│   │   └── Database.js
│   ├── middlewares/       # Autenticación y Autorización
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/            # Entidades (para futuros modelos ORM)
│   └── index.js           # Servidor principal
├── BD/
│   └── spacebooker_db.sql # Schema de base de datos
├── .env                   # Variables de entorno
├── .gitignore
└── package.json
```

---

## 🔑 Patrón Singleton - Gestión de Base de Datos

La conexión a MySQL se implementa con el **Patrón Singleton** para asegurar:

✓ Una única instancia del pool de conexión  
✓ Eficiencia de recursos  
✓ Manejo centralizado de conexiones  
✓ Soporte para 100+ peticiones concurrentes  

**Uso:**
```javascript
const Database = require('./database/Database');

// Ejecutar consulta
const results = await Database.query('SELECT * FROM usuarios', []);

// Obtener instancia
const pool = await Database.getInstance();
```

---

## 📡 API Endpoints

### Status
```
GET /api/status → Estado del servidor
```

### Autenticación (SPRINT 1)
```
POST   /api/v1/auth/register       - Registrar usuario
POST   /api/v1/auth/login          - Iniciar sesión
POST   /api/v1/auth/logout         - Cerrar sesión
GET    /api/v1/auth/profile        - Ver perfil
PUT    /api/v1/auth/profile        - Actualizar perfil
```

### Espacios (SPRINT 2)
```
GET    /api/v1/espacios            - Listar espacios
GET    /api/v1/espacios/:id        - Detalle de espacio
POST   /api/v1/espacios            - Crear espacio (Admin)
PUT    /api/v1/espacios/:id        - Editar espacio (Admin)
DELETE /api/v1/espacios/:id        - Eliminar espacio (Admin)
POST   /api/v1/espacios/:id/recursos - Asociar recursos (Admin)
```

### Reservas (SPRINT 3)
```
GET    /api/v1/reservas/disponibilidad   - Consultar disponibilidad
GET    /api/v1/reservas/mis_reservas    - Ver mis reservas
POST   /api/v1/reservas                 - Crear reserva
GET    /api/v1/reservas/:id             - Detalle de reserva
PATCH  /api/v1/reservas/:id             - Actualizar reserva
DELETE /api/v1/reservas/:id             - Cancelar reserva
```

---

## 🔐 Autenticación

### Registro
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "id_rol": 2
  }
}
```

### Usar Token en Requests
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Base de Datos

### Tablas Principales

**usuarios**
- id_usuario (PK)
- nombre
- email (UNIQUE)
- password_hash (Bcrypt)
- id_rol (FK)
- fecha_creacion

**roles**
- id_rol (PK)
- nombre_rol (Admin, Usuario)

**espacios**
- id_espacio (PK)
- nombre (UNIQUE)
- descripcion
- capacidad_maxima
- disponible

**reservas**
- id_reserva (PK)
- id_usuario (FK)
- id_espacio (FK)
- fecha_inicio
- fecha_fin
- descripcion_uso
- estado (Activa, Vencida, Cancelada)

**recursos**
- id_recurso (PK)
- nombre_recurso

**espacio_recurso** (N:M)
- id_espacio (FK)
- id_recurso (FK)

---

## 🔍 Lógica Crítica: Validación de Solapamientos (HU14)

**Algoritmo de Detección de Conflictos:**

```sql
SELECT * FROM reservas 
WHERE id_espacio = ? 
  AND estado != "Cancelada"
  AND fecha_inicio < nueva_fecha_fin 
  AND fecha_fin > nueva_fecha_inicio
```

**Condición:** `nueva_inicio < existente_fin AND nueva_fin > existente_inicio`

**Respuesta en caso de conflicto:**
```json
{
  "error": "El espacio ya está reservado en ese horario.",
  "status": 409
}
```

---

## 🧪 Testing

### Ejemplo de Prueba de Reserva (Postman/Thunder Client)

```
POST /api/v1/reservas
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "id_espacio": 1,
  "fecha_inicio": "2025-01-20T10:00:00",
  "fecha_fin": "2025-01-20T11:00:00",
  "descripcion_uso": "Reunión de equipo"
}
```

---

## ⚙️ Variables de Entorno

```env
# Puerto del servidor
PORT=5000

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spacebooker_db

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=24h

# Entorno
NODE_ENV=development
```

---

## 🚨 Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | OK |
| 201 | Creado |
| 400 | Solicitud Inválida |
| 401 | No Autenticado |
| 403 | No Autorizado |
| 404 | No Encontrado |
| 409 | Conflicto (Ej: Solapamiento) |
| 500 | Error Interno |

---

## 📚 Documentación Adicional

- **[API Documentation](./API_DOCUMENTATION.md)** - Documentación completa de todos los endpoints
- **[Performance Testing Guide](./PERFORMANCE_TESTING.md)** - Guía para pruebas de carga y rendimiento
- **[Postman Collection](./SpaceBooker_API.postman_collection.json)** - Colección de pruebas

---

## 📚 Dependencias Principales

- **express** - Framework web
- **mysql2/promise** - Driver MySQL
- **bcrypt** - Hashing de contraseñas (10 rounds)
- **jsonwebtoken** - Autenticación JWT
- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Parser de JSON
- **jest** - Framework de pruebas unitarias

---

## 🧪 Testing

### Ejecutar Pruebas Unitarias
```bash
npm test
```

### Ejecutar Pruebas con Cobertura
```bash
npm run test:coverage
```

### Pruebas de Rendimiento
Ver guía completa en [PERFORMANCE_TESTING.md](./PERFORMANCE_TESTING.md)

---

## 🛠️ Desarrollo

### Crear una nueva ruta

1. Crear controlador en `src/controllers/`
2. Definir ruta en `src/routes/`
3. Importar en `src/index.js`

### Agregar Swagger Documentation

En el controlador, agrega comentarios JSDoc:
```javascript
/**
 * @swagger
 * /api/v1/endpoint:
 *   get:
 *     summary: Descripción
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Success
 */
```

---

## 📝 Notas Técnicas

- **Patrón Singleton:** Asegura una única conexión a la BD
- **Seguridad:** Passwords hasheados con Bcrypt (10 rounds - RNF03)
- **JWT:** Tokens expiran en 24 horas
- **Roles:** 1 = Admin, 2 = Usuario
- **Estados de Reserva:** Activa, Vencida, Cancelada
- **Validación RF04:** Detección de solapamientos implementada
- **Índices MySQL:** Optimizados para rendimiento < 500ms

---

## 🎯 Cumplimiento de Requisitos

### Requisitos Funcionales (RF)
- ✅ RF01: Gestión de usuarios con roles
- ✅ RF02: CRUD completo de espacios
- ✅ RF03: Sistema de reservas
- ✅ RF04: Validación de solapamientos (lógica de rangos)
- ✅ RF05: Historial de reservas

### Requisitos No Funcionales (RNF)
- ✅ RNF01: Respuesta < 500ms (verificar con pruebas de carga)
- ✅ RNF02: Arquitectura escalable (Patrón Singleton)
- ✅ RNF03: Contraseñas cifradas con Bcrypt
- ✅ RNF04: Validación de entradas (preparación SQL)
- ✅ RNF05: Soporta 100+ peticiones concurrentes

---

**Última actualización:** Diciembre 10, 2025
