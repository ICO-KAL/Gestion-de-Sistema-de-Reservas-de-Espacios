# SpaceBooker Frontend

**Proyecto Final - Programación 3**

- **Autor:** Isaac Concepcion Peralta - Matricula: 2023-1932
- **Profesor:** Kely Tejada Belliard
- **Materia:** Programación 3
- **Fecha:** 10/12/2025

---

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Calendar** - Calendario interactivo
- **Context API** - Manejo de estado global

---

## 📦 Inicio Rápido

### Instalación
```bash
npm install
```

### Configurar Variables de Entorno
Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

Aplicación disponible en: **http://localhost:5173**

### Build para Producción
```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── LoadingStates.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── context/            # Estado global
│   │   ├── AuthContext.jsx
│   │   └── ReservasContext.jsx
│   ├── pages/              # Páginas principales
│   │   ├── AdminPanel.jsx
│   │   ├── AdminRegisterPage.jsx
│   │   ├── CalendarioPage.jsx      # HU17 - Calendario Visual
│   │   ├── EspaciosPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MisReservasPage.jsx
│   │   ├── PerfilPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/           # Servicios de API
│   │   └── apiService.js
│   ├── styles/             # Estilos CSS
│   │   ├── AdminPanel.css
│   │   ├── AuthPages.css
│   │   ├── Calendario.css
│   │   ├── Espacios.css
│   │   ├── Global.css
│   │   ├── HomePage.css
│   │   ├── Loading.css
│   │   ├── MisReservas.css
│   │   ├── Navbar.css
│   │   ├── Perfil.css
│   │   └── Toast.css
│   ├── tests/              # Pruebas unitarias
│   │   ├── AuthContext.test.jsx
│   │   ├── AuthFlow.test.jsx
│   │   ├── Reservas.test.js
│   │   ├── Toast.test.jsx
│   │   ├── Utils.test.js
│   │   └── Validations.test.jsx
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Entry point
│   └── index.css
├── public/
├── .env
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── vitest.config.js
```

---

## 🎯 Funcionalidades por Página

### 🏠 HomePage
- Dashboard con estadísticas
- Accesos rápidos
- Vista de bienvenida

### 🔐 LoginPage & RegisterPage
- Autenticación de usuarios
- Validaciones de formulario
- Manejo de errores

### 👨‍💼 AdminPanel (Solo Administradores)
- CRUD completo de espacios
- Gestión de recursos
- Vista de todas las reservas

### 🏢 EspaciosPage
- Listado de espacios disponibles
- Filtros por capacidad y recursos
- Información detallada

### 📅 CalendarioPage (HU17)
- **Vista Mes:** Calendario completo con react-calendar
- **Vista Semana:** Grid de 7 días con horarios
- **Vista Día:** Horarios por hora (7am - 10pm)
- Indicadores visuales de disponibilidad
- Creación de reservas desde el calendario

### 📋 MisReservasPage
- Historial de reservas
- Filtros por estado
- Cancelación de reservas

### 👤 PerfilPage
- Visualización de datos personales
- Edición de perfil
- Cambio de contraseña

---

## 🎨 Sistema de Diseño

### Colores Principales
```css
--primary: #3498db      /* Azul primario */
--success: #27ae60      /* Verde éxito */
--danger: #e74c3c       /* Rojo error */
--warning: #f39c12      /* Amarillo advertencia */
--dark: #2c3e50         /* Gris oscuro */
--light: #ecf0f1        /* Gris claro */
```

### Componentes Clave
- **Toast Notifications:** Feedback visual para acciones
- **Loading States:** Indicadores de carga
- **Protected Routes:** Control de acceso por rol
- **Modal Dialogs:** Formularios emergentes

---

## 🔒 Contextos de Estado

### AuthContext
Maneja la autenticación y sesión del usuario:
```javascript
const { user, login, logout, isAuthenticated, isLoading } = useAuth();
```

### ReservasContext
Gestiona espacios y reservas:
```javascript
const { 
  espacios, 
  reservas, 
  fetchEspacios, 
  crearReserva, 
  cancelarReserva,
  isLoading 
} = useReservas();
```

---

## 🧪 Testing

### Ejecutar Pruebas
```bash
npm run test
```

### Cobertura de Pruebas
```bash
npm run test:coverage
```

### Pruebas Incluidas
- Validaciones de formularios
- Flujos de autenticación
- Contextos de estado
- Componentes de notificación
- Utilidades generales

---

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run test         # Ejecutar tests
```

---

## 🔗 Integración con Backend

El frontend se comunica con el backend a través del archivo `apiService.js`:

```javascript
// Ejemplo de uso
import { apiService } from './services/apiService';

// Login
const response = await apiService.login(email, password);

// Crear reserva
const reserva = await apiService.crearReserva({
  id_espacio: 1,
  fecha_inicio: "2025-12-15 10:00:00",
  fecha_fin: "2025-12-15 12:00:00"
});
```

---

## 📱 Responsive Design

La aplicación es totalmente responsive:
- 📱 **Mobile:** < 768px
- 💻 **Tablet:** 768px - 1024px
- 🖥️ **Desktop:** > 1024px

---

## 🎯 Historias de Usuario Implementadas

### ÉPICA 1 - Autenticación
- ✅ HU01: Iniciar sesión
- ✅ HU02: Registrar cuenta
- ✅ HU03: Autorización por roles
- ✅ HU04: Ver perfil
- ✅ HU05: Actualizar perfil
- ✅ HU06: Cerrar sesión

### ÉPICA 2 - Gestión de Espacios
- ✅ HU06: Listar espacios
- ✅ HU07: Crear espacio (Admin)
- ✅ HU08: Editar espacio (Admin)
- ✅ HU09: Eliminar espacio (Admin)
- ✅ HU11: Filtrar espacios

### ÉPICA 3 - Sistema de Reservas
- ✅ HU12: Consultar disponibilidad
- ✅ HU13: Crear reserva
- ✅ HU14: Validación de solapamientos
- ✅ HU15: Ver historial de reservas
- ✅ HU16: Cancelar reserva

### ÉPICA 4 - Interfaz Visual
- ✅ HU17: Calendario interactivo (Día/Semana/Mes)
- ✅ HU18: Notificaciones internas
- ✅ HU19: Listado de espacios

---

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`

### Variables de Entorno en Producción
Asegúrate de configurar:
```env
VITE_API_URL=https://tu-api-produccion.com/api/v1
```

---

## 📝 Notas de Desarrollo

- Usa `useState` y `useEffect` para estado local
- Usa `Context API` para estado global
- Todas las peticiones pasan por `apiService.js`
- Los tokens se almacenan en `localStorage`
- Material Icons para iconografía
- CSS modules no usados (CSS tradicional)

---

**Última actualización:** Diciembre 10, 2025
