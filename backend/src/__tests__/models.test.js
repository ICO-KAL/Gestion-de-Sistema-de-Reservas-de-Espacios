/**
 * Pruebas unitarias para Modelos
 */

describe('Modelos', () => {
  const Usuario = require('../../src/models/Usuario');
  const Espacio = require('../../src/models/Espacio');
  const Reserva = require('../../src/models/Reserva');

  describe('Usuario Model', () => {
    test('Debería crear usuario válido', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(usuario.nombre).toBe('Juan Pérez');
      expect(usuario.email).toBe('juan@example.com');
      expect(usuario.rol).toBe('usuario');
    });

    test('Debería rechazar nombre muy corto', () => {
      const usuario = new Usuario(1, 'Jo', 'test@example.com', 'password123');
      expect(() => usuario.validar()).toThrow('mínimo 3 caracteres');
    });

    test('Debería rechazar email inválido', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'email-invalido', 'password123');
      expect(() => usuario.validar()).toThrow('Email inválido');
    });

    test('Debería rechazar contraseña muy corta', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', '123');
      expect(() => usuario.validar()).toThrow('mínimo 6 caracteres');
    });

    test('Debería convertir a JSON correctamente', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123', 'admin');
      const json = usuario.toJSON();
      expect(json).not.toHaveProperty('contraseña');
      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('nombre', 'Juan Pérez');
      expect(json).toHaveProperty('rol', 'admin');
    });
  });

  describe('Espacio Model', () => {
    test('Debería crear espacio válido', () => {
      const espacio = new Espacio(1, 'Sala de Reuniones', 'Sala grande con aire acondicionado', 20, 'sala');
      expect(espacio.nombre).toBe('Sala de Reuniones');
      expect(espacio.capacidad).toBe(20);
      expect(espacio.activo).toBe(true);
    });

    test('Debería rechazar nombre muy corto', () => {
      const espacio = new Espacio(1, 'AB', 'Descripción', 10);
      expect(() => espacio.validar()).toThrow('mínimo 3 caracteres');
    });

    test('Debería rechazar descripción muy corta', () => {
      const espacio = new Espacio(1, 'Sala 1', 'Desc', 10);
      expect(() => espacio.validar()).toThrow('mínimo 5 caracteres');
    });

    test('Debería rechazar capacidad cero', () => {
      const espacio = new Espacio(1, 'Sala 1', 'Descripción válida', 0);
      expect(() => espacio.validar()).toThrow('mayor a 0');
    });

    test('Debería rechazar capacidad negativa', () => {
      const espacio = new Espacio(1, 'Sala 1', 'Descripción válida', -5);
      expect(() => espacio.validar()).toThrow('mayor a 0');
    });

    test('Debería convertir a JSON correctamente', () => {
      const espacio = new Espacio(1, 'Sala 1', 'Descripción', 10);
      const json = espacio.toJSON();
      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('nombre', 'Sala 1');
      expect(json).toHaveProperty('capacidad', 10);
      expect(json).toHaveProperty('activo', true);
    });
  });

  describe('Reserva Model', () => {
    test('Debería crear reserva válida', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '09:00', '10:00');
      expect(reserva.usuario_id).toBe(1);
      expect(reserva.espacio_id).toBe(1);
      expect(reserva.fecha).toBe('2025-12-10');
      expect(reserva.estado).toBe('activa');
    });

    test('Debería rechazar fecha inválida', () => {
      const reserva = new Reserva(1, 1, 1, 'fecha-invalida', '09:00', '10:00');
      expect(() => reserva.validar()).toThrow('YYYY-MM-DD');
    });

    test('Debería rechazar hora_inicio inválida', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '25:00', '10:00');
      expect(() => reserva.validar()).toThrow('HH:MM');
    });

    test('Debería rechazar hora_fin inválida', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '09:00', 'invalida');
      expect(() => reserva.validar()).toThrow('HH:MM');
    });

    test('Debería rechazar hora_fin <= hora_inicio', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '10:00', '09:00');
      expect(() => reserva.validar()).toThrow('posterior');
    });

    test('Debería rechazar hora_fin = hora_inicio', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '10:00', '10:00');
      expect(() => reserva.validar()).toThrow('posterior');
    });

    test('Debería validar correctamente con horas válidas', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '09:00', '10:00');
      expect(() => reserva.validar()).not.toThrow();
    });

    test('Debería convertir a JSON correctamente', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '09:00', '10:00', 'activa');
      const json = reserva.toJSON();
      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('usuario_id', 1);
      expect(json).toHaveProperty('estado', 'activa');
    });

    test('Debería manejar reservas canceladas', () => {
      const reserva = new Reserva(1, 1, 1, '2025-12-10', '09:00', '10:00', 'cancelada');
      expect(reserva.estado).toBe('cancelada');
    });
  });
});
