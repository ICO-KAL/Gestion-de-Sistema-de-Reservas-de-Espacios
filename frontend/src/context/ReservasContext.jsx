import React, { createContext, useState, useContext, useCallback } from 'react';
import { apiService } from '../services/apiService';

/**
 * Context de Reservas
 * Gestiona el estado de las reservas y espacios
 */
const ReservasContext = createContext();

export const ReservasProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todas las reservas del usuario
   */
  const fetchMisReservas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getMisReservas();
      setReservas(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener reservas';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtiene todos los espacios
   */
  const fetchEspacios = useCallback(async (filtros = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getEspacios(filtros);
      setEspacios(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener espacios';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtiene la disponibilidad de un espacio en una fecha
   */
  const fetchDisponibilidad = useCallback(async (espacioId, fecha) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getDisponibilidad(espacioId, fecha);
      setDisponibilidad(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener disponibilidad';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Crea una nueva reserva
   */
  const crearReserva = useCallback(async (datosReserva) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.crearReserva(datosReserva);
      setReservas([...reservas, response]);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear reserva';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reservas]);

  /**
   * Cancela una reserva
   */
  const cancelarReserva = useCallback(async (reservaId) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.cancelarReserva(reservaId);
      setReservas(reservas.filter(r => r.id_reserva !== reservaId));
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cancelar reserva';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reservas]);

  /**
   * Crea un espacio (solo Admin)
   */
  const crearEspacio = useCallback(async (datosEspacio) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.crearEspacio(datosEspacio);
      setEspacios([...espacios, response]);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear espacio';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [espacios]);

  /**
   * Edita un espacio (solo Admin)
   */
  const editarEspacio = useCallback(async (espacioId, datosEspacio) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.editarEspacio(espacioId, datosEspacio);
      setEspacios(
        espacios.map(e => e.id === espacioId ? response : e)
      );
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al editar espacio';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [espacios]);

  /**
   * Elimina un espacio (solo Admin)
   */
  const eliminarEspacio = useCallback(async (espacioId) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.eliminarEspacio(espacioId);
      setEspacios(espacios.filter(e => e.id !== espacioId));
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar espacio';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [espacios]);

  const value = {
    reservas,
    espacios,
    disponibilidad,
    isLoading,
    error,
    fetchMisReservas,
    fetchEspacios,
    fetchDisponibilidad,
    crearReserva,
    cancelarReserva,
    crearEspacio,
    editarEspacio,
    eliminarEspacio,
  };

  return (
    <ReservasContext.Provider value={value}>
      {children}
    </ReservasContext.Provider>
  );
};

// Hook para usar ReservasContext
export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe usarse dentro de un ReservasProvider');
  }
  return context;
};
