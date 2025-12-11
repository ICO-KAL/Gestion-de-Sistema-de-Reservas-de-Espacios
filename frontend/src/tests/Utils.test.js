/**
 * Pruebas para utils de funciones comunes
 */
import { describe, it, expect, beforeEach } from 'vitest';

// Función para detectar solapamientos (HU14)
const detectarSolapamientos = (reservas, nuevaReserva) => {
  const { fecha, hora_inicio, hora_fin } = nuevaReserva;

  return reservas.some((reserva) => {
    if (reserva.fecha !== fecha) return false;

    const [nuevoInicio, nuevoFin] = [
      horaAMinutos(hora_inicio),
      horaAMinutos(hora_fin),
    ];

    const [existentInicio, existentFin] = [
      horaAMinutos(reserva.hora_inicio),
      horaAMinutos(reserva.hora_fin),
    ];

    // Hay solapamiento si los rangos se superponen
    return nuevoInicio < existentFin && nuevoFin > existentInicio;
  });
};

const horaAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

// Función para separar reservas próximas y pasadas
const separarReservas = (reservas) => {
  const ahora = new Date();
  const proximas = [];
  const pasadas = [];

  reservas.forEach((reserva) => {
    const fechaReserva = new Date(reserva.fecha);
    if (fechaReserva > ahora) {
      proximas.push(reserva);
    } else {
      pasadas.push(reserva);
    }
  });

  return { proximas, pasadas };
};

describe('Utilidades del Frontend', () => {
  describe('HU14 - Detección de solapamientos', () => {
    it('Debería detectar solapamiento total', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(true);
    });

    it('Debería detectar solapamiento parcial (inicio)', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '08:30', hora_fin: '09:30' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(true);
    });

    it('Debería detectar solapamiento parcial (fin)', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '09:30', hora_fin: '10:30' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(true);
    });

    it('No debería detectar solapamiento antes de la reserva existente', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '07:00', hora_fin: '08:00' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(false);
    });

    it('No debería detectar solapamiento después de la reserva existente', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '10:00', hora_fin: '11:00' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(false);
    });

    it('No debería detectar solapamiento si son fechas diferentes', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-16', hora_inicio: '09:00', hora_fin: '10:00' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(false);
    });

    it('Debería manejar múltiples reservas existentes', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '08:00', hora_fin: '09:00' },
        { fecha: '2025-12-15', hora_inicio: '10:00', hora_fin: '11:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '09:30', hora_fin: '10:30' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(true);
    });

    it('Debería no detectar solapamiento cuando hay hueco entre reservas', () => {
      const reservasExistentes = [
        { fecha: '2025-12-15', hora_inicio: '08:00', hora_fin: '09:00' },
        { fecha: '2025-12-15', hora_inicio: '10:00', hora_fin: '11:00' },
      ];

      const nuevaReserva = { fecha: '2025-12-15', hora_inicio: '09:00', hora_fin: '10:00' };

      expect(detectarSolapamientos(reservasExistentes, nuevaReserva)).toBe(false);
    });
  });

  describe('Separación de reservas próximas y pasadas', () => {
    it('Debería separar reservas correctamente', () => {
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);

      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);

      const reservas = [
        { id: 1, fecha: mañana.toISOString().split('T')[0] },
        { id: 2, fecha: ayer.toISOString().split('T')[0] },
      ];

      const { proximas, pasadas } = separarReservas(reservas);

      expect(proximas.length).toBe(1);
      expect(pasadas.length).toBe(1);
      expect(proximas[0].id).toBe(1);
      expect(pasadas[0].id).toBe(2);
    });

    it('Debería retornar arrays vacíos si no hay reservas', () => {
      const { proximas, pasadas } = separarReservas([]);

      expect(proximas.length).toBe(0);
      expect(pasadas.length).toBe(0);
    });

    it('Debería clasificar correctamente todas las reservas futuras', () => {
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);

      const proximoDia = new Date();
      proximoDia.setDate(proximoDia.getDate() + 2);

      const reservas = [
        { id: 1, fecha: mañana.toISOString().split('T')[0] },
        { id: 2, fecha: proximoDia.toISOString().split('T')[0] },
      ];

      const { proximas, pasadas } = separarReservas(reservas);

      expect(proximas.length).toBe(2);
      expect(pasadas.length).toBe(0);
    });
  });

  describe('Conversión de hora a minutos', () => {
    it('Debería convertir "09:00" a 540 minutos', () => {
      expect(horaAMinutos('09:00')).toBe(540);
    });

    it('Debería convertir "10:30" a 630 minutos', () => {
      expect(horaAMinutos('10:30')).toBe(630);
    });

    it('Debería convertir "00:00" a 0 minutos', () => {
      expect(horaAMinutos('00:00')).toBe(0);
    });

    it('Debería convertir "23:59" a 1439 minutos', () => {
      expect(horaAMinutos('23:59')).toBe(1439);
    });
  });
});
