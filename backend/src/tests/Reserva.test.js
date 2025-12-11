const Reserva = require('../models/Reserva');

describe('Modelo Reserva', () => {
  describe('Constructor', () => {
    test('debe crear una reserva válida', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '09:00', '10:00');
      expect(reserva.id).toBe(1);
      expect(reserva.usuario_id).toBe(1);
      expect(reserva.espacio_id).toBe(1);
      expect(reserva.fecha).toBe('2024-12-20');
      expect(reserva.hora_inicio).toBe('09:00');
      expect(reserva.hora_fin).toBe('10:00');
      expect(reserva.estado).toBe('activa');
    });
  });

  describe('Validación', () => {
    test('debe validar una reserva correcta', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '09:00', '10:00');
      expect(() => reserva.validar()).not.toThrow();
    });

    test('debe fallar si falta usuario_id', () => {
      const reserva = new Reserva(1, null, 1, '2024-12-20', '09:00', '10:00');
      expect(() => reserva.validar()).toThrow('Usuario ID requerido');
    });

    test('debe fallar si falta espacio_id', () => {
      const reserva = new Reserva(1, 1, null, '2024-12-20', '09:00', '10:00');
      expect(() => reserva.validar()).toThrow('Espacio ID requerido');
    });

    test('debe fallar si la fecha es inválida', () => {
      const reserva = new Reserva(1, 1, 1, '20-12-2024', '09:00', '10:00');
      expect(() => reserva.validar()).toThrow('Fecha debe estar en formato YYYY-MM-DD');
    });

    test('debe fallar si la hora_inicio es inválida', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '9:00', '10:00');
      expect(() => reserva.validar()).toThrow('Hora inicio debe estar en formato HH:MM');
    });

    test('debe fallar si hora_fin <= hora_inicio', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '10:00', '09:00');
      expect(() => reserva.validar()).toThrow('La hora de fin debe ser posterior a la de inicio');
    });

    test('debe fallar si hora_fin = hora_inicio', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '10:00', '10:00');
      expect(() => reserva.validar()).toThrow('La hora de fin debe ser posterior a la de inicio');
    });
  });

  describe('toJSON', () => {
    test('debe retornar la reserva correctamente', () => {
      const reserva = new Reserva(1, 1, 1, '2024-12-20', '09:00', '10:00', 'activa');
      const json = reserva.toJSON();
      expect(json.id).toBe(1);
      expect(json.usuario_id).toBe(1);
      expect(json.espacio_id).toBe(1);
      expect(json.estado).toBe('activa');
    });
  });
});
