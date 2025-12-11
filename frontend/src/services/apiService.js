import axios from 'axios';

// URL base de la API (configurar según ambiente)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicio de API - Contiene todos los endpoints
 */
export const apiService = {
  // ==================== AUTENTICACIÓN ====================

  /**
   * Registra un nuevo usuario
   */
  register: (nombre, email, password) =>
    axiosInstance.post('/auth/register', {
      nombre,
      email,
      password,
    }),

  /**
   * Inicia sesión
   */
  login: (email, password) =>
    axiosInstance.post('/auth/login', {
      email,
      password,
    }),

  /**
   * Cierra sesión
   */
  logout: () =>
    axiosInstance.post('/auth/logout'),

  /**
   * Obtiene el perfil del usuario actual
   */
  getProfile: () =>
    axiosInstance.get('/auth/profile'),

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile: (userData) =>
    axiosInstance.put('/auth/profile', userData),

  // ==================== ESPACIOS ====================

  /**
   * Obtiene todos los espacios
   */
  getEspacios: (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    return axiosInstance.get(`/espacios?${params}`);
  },

  /**
   * Obtiene un espacio por ID
   */
  getEspacioById: (id) =>
    axiosInstance.get(`/espacios/${id}`),

  /**
   * Crea un nuevo espacio (solo Admin)
   */
  crearEspacio: (datos) =>
    axiosInstance.post('/espacios', datos),

  /**
   * Edita un espacio (solo Admin)
   */
  editarEspacio: (id, datos) =>
    axiosInstance.put(`/espacios/${id}`, datos),

  /**
   * Elimina un espacio (solo Admin)
   */
  eliminarEspacio: (id) =>
    axiosInstance.delete(`/espacios/${id}`),

  /**
   * Asocia recursos a un espacio
   */
  asociarRecursos: (espacioId, recursos) =>
    axiosInstance.post(`/espacios/${espacioId}/recursos`, { recursos }),

  // ==================== RESERVAS ====================

  /**
   * Obtiene la disponibilidad de un espacio
   */
  getDisponibilidad: (espacioId, fecha) =>
    axiosInstance.get('/reservas/disponibilidad', {
      params: {
        espacio_id: espacioId,
        fecha,
      },
    }),

  /**
   * Obtiene las reservas del usuario actual
   */
  getMisReservas: () =>
    axiosInstance.get('/reservas/mis_reservas'),

  /**
   * Obtiene una reserva por ID
   */
  getReservaById: (id) =>
    axiosInstance.get(`/reservas/${id}`),

  /**
   * Crea una nueva reserva
   */
  crearReserva: (datos) =>
    axiosInstance.post('/reservas', datos),

  /**
   * Actualiza una reserva
   */
  actualizarReserva: (id, datos) =>
    axiosInstance.patch(`/reservas/${id}`, datos),

  /**
   * Cancela una reserva
   */
  cancelarReserva: (id) =>
    axiosInstance.delete(`/reservas/${id}`),
};

export default apiService;
