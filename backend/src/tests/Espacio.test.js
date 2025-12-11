const Espacio = require('../models/Espacio');

describe('Modelo Espacio', () => {
  describe('Constructor', () => {
    test('debe crear un espacio válido', () => {
      const espacio = new Espacio(1, 'Sala A', 'Sala de reuniones', 10, 'sala');
      expect(espacio.id).toBe(1);
      expect(espacio.nombre).toBe('Sala A');
      expect(espacio.capacidad).toBe(10);
      expect(espacio.tipo).toBe('sala');
      expect(espacio.activo).toBe(true);
    });
  });

  describe('Validación', () => {
    test('debe validar un espacio correcto', () => {
      const espacio = new Espacio(1, 'Sala A', 'Descripción válida', 10);
      expect(() => espacio.validar()).not.toThrow();
    });

    test('debe fallar si el nombre es muy corto', () => {
      const espacio = new Espacio(1, 'Sa', 'Descripción válida', 10);
      expect(() => espacio.validar()).toThrow('Nombre del espacio debe tener mínimo 3 caracteres');
    });

    test('debe fallar si la descripción es muy corta', () => {
      const espacio = new Espacio(1, 'Sala', 'Desc', 10);
      expect(() => espacio.validar()).toThrow('Descripción debe tener mínimo 5 caracteres');
    });

    test('debe fallar si la capacidad es 0 o negativa', () => {
      const espacio = new Espacio(1, 'Sala', 'Descripción válida', 0);
      expect(() => espacio.validar()).toThrow('Capacidad debe ser mayor a 0');
    });
  });

  describe('toJSON', () => {
    test('debe retornar el espacio correctamente', () => {
      const espacio = new Espacio(1, 'Sala A', 'Descripción', 10, 'sala');
      const json = espacio.toJSON();
      expect(json.id).toBe(1);
      expect(json.nombre).toBe('Sala A');
      expect(json.capacidad).toBe(10);
      expect(json.activo).toBe(true);
    });
  });
});
