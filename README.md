# 🎓 SpaceBooker - Sistema Integral para la Gestión de Reservas de Espacios

**Proyecto Final - Programación 3**

- **Autor:** Isaac Concepcion Peralta
- **Matrícula:** 2023-1932
- **Profesor:** Kely Tejada Belliard
- **Materia:** Programación 3
- **Fecha:** 10 de Diciembre, 2025

---

## 📋 Descripción del Proyecto

SpaceBooker es un sistema completo de gestión de reservas de espacios físicos (aulas, salas de conferencia, laboratorios, etc.) desarrollado siguiendo la **metodología Scrum**. El proyecto implementa un backend robusto con **Node.js y Express**, una base de datos **MySQL** optimizada, y un frontend moderno con **React + Vite**.

### 🎯 Objetivo Principal
Permitir la gestión eficiente de espacios y reservas, evitando conflictos de horarios mediante validación de solapamientos, control de acceso por roles y una interfaz visual intuitiva.

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de login y registro con JWT
- Contraseñas cifradas con Bcrypt (10 rounds)
- Roles diferenciados (Administrador y Usuario)
- Tokens con expiración de 24 horas
- Protección contra SQL Injection

### 🏢 Gestión de Espacios (Admin)
- CRUD completo de espacios
- Asociación de recursos (proyector, pizarra, etc.)
- Filtros por capacidad y recursos
- Validación de datos (capacidad > 0)

### 📅 Sistema de Reservas
- Creación y cancelación de reservas
- **Validación RF04:** Detección automática de solapamientos
- Consulta de disponibilidad en tiempo real
- Historial completo de reservas
- Estados: Activa, Vencida, Cancelada

### 📊 Calendario Visual Interactivo (HU17)
- **Vista Mes:** Calendario completo navegable
- **Vista Semana:** Grid de 7 días con horarios
- **Vista Día:** Horarios detallados (7am - 10pm)
- Indicadores visuales de disponibilidad (verde/rojo)
- Creación de reservas directamente desde el calendario

### 🎨 Interfaz Moderna
- Diseño responsivo (mobile, tablet, desktop)
- Notificaciones tipo Toast
- Estados de carga optimizados
- Material Icons
- Experiencia de usuario fluida

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **Bcrypt** - Cifrado de contraseñas
- **Jest** - Testing unitario

#### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Calendar** - Calendario interactivo
- **Context API** - Estado global
- **Vitest** - Testing

### Patrón de Diseño: Singleton
El proyecto implementa el **Patrón Singleton** para la gestión de conexiones a MySQL:
- Una única instancia del pool de conexión
- Optimización de recursos
- Soporte para 100+ peticiones concurrentes
- Manejo centralizado de errores

```javascript
// Uso del Singleton
const Database = require('./database/Database');
const results = await Database.query('SELECT * FROM usuarios');
```

---

## 📂 Estructura del Proyecto

```
Proyecto/
├── backend/                    # API REST + Base de datos
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Endpoints de la API
│   │   ├── database/          # Singleton MySQL
│   │   ├── middlewares/       # Auth y validación
│   │   ├── models/            # Entidades
│   │   ├── services/          # Lógica de servicios
│   │   └── __tests__/         # Pruebas unitarias
│   ├── BD/
│   │   └── spacebooker_db.sql # Schema de la base de datos
│   ├── API_DOCUMENTATION.md   # Documentación de endpoints
│   ├── PERFORMANCE_TESTING.md # Guía de pruebas de carga
│   └── README.md
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Estado global
│   │   ├── pages/             # Páginas principales
│   │   │   ├── CalendarioPage.jsx  # ⭐ Nuevo - HU17
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── EspaciosPage.jsx
│   │   │   ├── MisReservasPage.jsx
│   │   │   └── ...
│   │   ├── services/          # API service
│   │   ├── styles/            # CSS
│   │   │   ├── Calendario.css      # ⭐ Nuevo
│   │   │   └── ...
│   │   └── tests/             # Pruebas
│   └── README.md
│
└── README.md                   # Este archivo
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v18+ 
- MySQL Server 8.0+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <url-repositorio>
cd Proyecto
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=spacebooker_db
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRY=24h
NODE_ENV=development
```

Crear base de datos:
```bash
mysql -u root -p < BD/spacebooker_db.sql
```

Ejecutar servidor:
```bash
npm start
```

Backend disponible en: **http://localhost:5000**

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Ejecutar aplicación:
```bash
npm run dev
```

Frontend disponible en: **http://localhost:5173**

---

## 👥 Usuarios de Prueba

### Administrador
- **Email:** admin@spacebooker.com
- **Contraseña:** admin123
- **Código de registro admin:** `SPACEBOOKER2025`

### Usuario Regular
- Crear cuenta desde: http://localhost:5173/register

---

## 📊 Endpoints Principales

### Autenticación
```
POST   /api/v1/auth/register      # Registrar usuario
POST   /api/v1/auth/login          # Iniciar sesión
POST   /api/v1/auth/logout         # Cerrar sesión
GET    /api/v1/auth/profile        # Ver perfil
PUT    /api/v1/auth/profile        # Actualizar perfil
```

### Espacios
```
GET    /api/v1/espacios            # Listar espacios
GET    /api/v1/espacios/:id        # Detalle de espacio
POST   /api/v1/espacios            # Crear espacio (Admin)
PUT    /api/v1/espacios/:id        # Editar espacio (Admin)
DELETE /api/v1/espacios/:id        # Eliminar espacio (Admin)
POST   /api/v1/espacios/:id/recursos  # Asociar recursos (Admin)
```

### Reservas
```
GET    /api/v1/reservas/disponibilidad  # Consultar disponibilidad
GET    /api/v1/reservas/mis_reservas    # Mis reservas
POST   /api/v1/reservas                 # Crear reserva
GET    /api/v1/reservas/:id             # Detalle de reserva
PATCH  /api/v1/reservas/:id             # Actualizar reserva
DELETE /api/v1/reservas/:id             # Cancelar reserva
```

📚 **Documentación completa:** Ver [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🎯 Historias de Usuario Implementadas

### ÉPICA 1 - Gestión de Usuarios y Autenticación ✅
- ✅ HU01: Iniciar sesión
- ✅ HU02: Registrar una nueva cuenta
- ✅ HU03: Autorización por roles
- ✅ HU04: Ver perfil
- ✅ HU05: Actualizar perfil
- ✅ HU06: Cerrar sesión

### ÉPICA 2 - Gestión de Espacios ✅
- ✅ HU06: Listar espacios
- ✅ HU07: Crear espacio (Admin)
- ✅ HU08: Editar espacio (Admin)
- ✅ HU09: Eliminar espacio (Admin)
- ✅ HU10: Asociar recursos
- ✅ HU11: Filtrar espacios por capacidad

### ÉPICA 3 - Sistema de Reservas ✅
- ✅ HU12: Consultar disponibilidad
- ✅ HU13: Crear reserva
- ✅ HU14: Validación de solapamientos (RF04)
- ✅ HU15: Ver historial de reservas
- ✅ HU16: Cancelar reserva

### ÉPICA 4 - Interfaz de Usuario ✅
- ✅ HU17: Calendario visual interactivo (Día/Semana/Mes) ⭐
- ✅ HU18: Notificaciones internas
- ✅ HU19: Ver listado general de espacios

### ÉPICA 5 - Pruebas y Seguridad ✅
- ✅ HU20: Validar seguridad y rendimiento
- ✅ Pruebas unitarias (30+ casos)
- ✅ Documentación completa

---

## 🧪 Testing

### Backend
```bash
cd backend
npm test                    # Ejecutar pruebas
npm run test:watch          # Modo watch
```

**Pruebas incluidas:**
- Autenticación y JWT
- Validación de solapamientos (RF04)
- CRUD de espacios
- Modelos y servicios

### Frontend
```bash
cd frontend
npm run test                # Ejecutar pruebas
npm run test:coverage       # Con cobertura
```

**Pruebas incluidas:**
- Contextos de autenticación
- Flujos de reserva
- Validaciones de formulario
- Componentes de notificación

### Pruebas de Rendimiento
Ver guía completa: [backend/PERFORMANCE_TESTING.md](./backend/PERFORMANCE_TESTING.md)

---

## 🔒 Requisitos Funcionales (RF)

| RF | Descripción | Estado |
|----|-------------|--------|
| RF01 | Gestión de usuarios con roles (Admin/Usuario) | ✅ |
| RF02 | CRUD completo de espacios | ✅ |
| RF03 | Sistema de reservas con validación | ✅ |
| RF04 | Detección de solapamientos de horarios | ✅ |
| RF05 | Historial y cancelación de reservas | ✅ |
| RF06 | Seguridad y cifrado de contraseñas | ✅ |

---

## ⚡ Requisitos No Funcionales (RNF)

| RNF | Descripción | Estado |
|-----|-------------|--------|
| RNF01 | Tiempo de respuesta < 500ms | ✅ |
| RNF02 | Arquitectura escalable (Singleton) | ✅ |
| RNF03 | Contraseñas cifradas con Bcrypt | ✅ |
| RNF04 | Validación de entradas (SQL Injection) | ✅ |
| RNF05 | Soportar 100+ peticiones concurrentes | ✅ |

---

## 📈 Metodología Scrum Aplicada

El proyecto fue desarrollado en **4 Sprints de 2 semanas** cada uno:

### Sprint 1 - Infraestructura y Autenticación
- Configuración de entorno
- Patrón Singleton para MySQL
- Sistema de autenticación JWT
- Roles y permisos

### Sprint 2 - Gestión de Espacios
- CRUD completo de espacios
- Asociación de recursos
- Panel administrativo
- Validaciones de negocio

### Sprint 3 - Sistema de Reservas
- Módulo de reservas
- Validación RF04 (solapamientos)
- Historial y cancelaciones
- Optimización de consultas

### Sprint 4 - Interfaz y Optimización
- **Calendario visual interactivo (HU17)** ⭐
- Pruebas de rendimiento
- Documentación completa
- Correcciones finales

**Ceremonias realizadas:**
- Sprint Planning (inicio de cada sprint)
- Daily Standups (5 días por sprint)
- Sprint Review (demo de incremento)
- Sprint Retrospective (mejoras del proceso)

---

## 🎨 Capturas de Pantalla

### Calendario Visual - Vista Mes
![Vista Mes](docs/screenshots/calendario-mes.png)

### Calendario Visual - Vista Semana
![Vista Semana](docs/screenshots/calendario-semana.png)

### Calendario Visual - Vista Día
![Vista Día](docs/screenshots/calendario-dia.png)

### Panel de Administración
![Admin Panel](docs/screenshots/admin-panel.png)

*(Nota: Agregar capturas reales en la carpeta docs/screenshots)*

---

## 📦 Dependencias Principales

### Backend
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "jest": "^30.2.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "axios": "^1.6.2",
  "react-calendar": "^4.2.1",
  "vitest": "^1.0.4"
}
```

---

## 🔐 Seguridad Implementada

- ✅ Contraseñas hasheadas con Bcrypt (10 rounds)
- ✅ Tokens JWT con expiración
- ✅ Validación de inputs en frontend y backend
- ✅ Prepared statements (protección SQL Injection)
- ✅ CORS configurado
- ✅ Variables de entorno para credenciales
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Control de acceso por roles

---

## 📊 Modelo de Base de Datos

### Tablas Principales
- **usuarios** - Información de usuarios
- **roles** - Admin (1) y Usuario (2)
- **espacios** - Aulas, salas, laboratorios
- **recursos** - Proyector, pizarra, etc.
- **espacio_recurso** - Relación N:M
- **reservas** - Registro de reservas

### Índices Optimizados
```sql
-- Índice compuesto para validación RF04
INDEX idx_espacio_fechas (id_espacio, fecha_inicio, fecha_fin)

-- Índices adicionales
INDEX idx_usuario_reservas (id_usuario)
INDEX idx_espacio_disponible (disponible)
INDEX idx_usuario_email (email)
```

---

## 🚀 Siguientes Pasos (Mejoras Futuras)

- [ ] Implementar sistema de notificaciones por email
- [ ] Agregar exportación de reservas a PDF/Excel
- [ ] Dashboard de estadísticas para administradores
- [ ] Sistema de valoraciones de espacios
- [ ] Integración con calendario de Google/Outlook
- [ ] App móvil con React Native
- [ ] Sistema de confirmación de reservas
- [ ] Recordatorios automáticos

---

## 📖 Documentación Adicional

- **[Backend README](./backend/README.md)** - Documentación del servidor
- **[Frontend README](./frontend/README.md)** - Documentación de la UI
- **[API Documentation](./backend/API_DOCUMENTATION.md)** - Endpoints completos
- **[Performance Testing](./backend/PERFORMANCE_TESTING.md)** - Guía de pruebas de carga

---


---

## 👨‍💻 Autor

**Isaac Concepcion Peralta**
- Matrícula: 2023-1932
---

## 🙏 Agradecimientos

- **Prof. Kely Tejada Belliard** - Por la guía y enseñanza durante el curso
- **Comunidad de desarrollo** - Por las herramientas y recursos open source
- **Metodología Scrum** - Por proporcionar un marco de trabajo eficiente

---

**Proyecto Final - Programación 3**  
**Fecha de Entrega:** 10 de Diciembre, 2025  
**Estado:** ✅ Completado al 100%

---

