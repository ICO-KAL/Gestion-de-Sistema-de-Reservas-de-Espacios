const Usuario = require('../models/Usuario');

describe('Modelo Usuario', () => {
  describe('Constructor', () => {
    test('debe crear un usuario válido', () => {
      const usuario = new Usuario(1, 'Juan', 'juan@example.com', 'password123', 'usuario');
      expect(usuario.id).toBe(1);
      expect(usuario.nombre).toBe('Juan');
      expect(usuario.email).toBe('juan@example.com');
      expect(usuario.rol).toBe('usuario');
    });

    test('debe crear un usuario admin', () => {
      const usuario = new Usuario(2, 'Admin', 'admin@example.com', 'admin123', 'admin');
      expect(usuario.rol).toBe('admin');
    });
  });

  describe('Validación', () => {
    test('debe validar un usuario correcto', () => {
      const usuario = new Usuario(1, 'Juan', 'juan@example.com', 'password123');
      expect(() => usuario.validar()).not.toThrow();
    });

    test('debe fallar si el nombre es muy corto', () => {
      const usuario = new Usuario(1, 'Jo', 'juan@example.com', 'password123');
      expect(() => usuario.validar()).toThrow('Nombre debe tener mínimo 3 caracteres');
    });

    test('debe fallar si el email es inválido', () => {
      const usuario = new Usuario(1, 'Juan', 'email-invalido', 'password123');
      expect(() => usuario.validar()).toThrow('Email inválido');
    });

    test('debe fallar si la contraseña es muy corta', () => {
      const usuario = new Usuario(1, 'Juan', 'juan@example.com', '12345');
      expect(() => usuario.validar()).toThrow('Contraseña debe tener mínimo 6 caracteres');
    });
  });

  describe('toJSON', () => {
    test('debe retornar el usuario sin contraseña', () => {
      const usuario = new Usuario(1, 'Juan', 'juan@example.com', 'password123', 'usuario');
      const json = usuario.toJSON();
      expect(json.contraseña).toBeUndefined();
      expect(json.id).toBe(1);
      expect(json.nombre).toBe('Juan');
      expect(json.email).toBe('juan@example.com');
    });
  });
});
