/**
 * Pruebas unitarias para AuthService
 */
const AuthService = require('../../src/services/authService');

describe('AuthService', () => {
  describe('verifyToken', () => {
    test('Debería retornar error para token inválido', () => {
      expect(() => {
        AuthService.verifyToken('token_invalido');
      }).toThrow('Token inválido o expirado');
    });

    test('Debería retornar error para token vacío', () => {
      expect(() => {
        AuthService.verifyToken('');
      }).toThrow();
    });

    test('Debería retornar error para token nulo', () => {
      expect(() => {
        AuthService.verifyToken(null);
      }).toThrow();
    });
  });

  describe('register', () => {
    test('Debería rechazar email vacío', async () => {
      try {
        await AuthService.register('Juan Pérez', '', 'password123');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería rechazar nombre muy corto', async () => {
      try {
        await AuthService.register('Jo', 'test@example.com', 'password123');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería rechazar contraseña muy corta', async () => {
      try {
        await AuthService.register('Juan Pérez', 'test@example.com', '123');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });
  });

  describe('login', () => {
    test('Debería rechazar email vacío', async () => {
      try {
        await AuthService.login('', 'password123');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería rechazar contraseña vacía', async () => {
      try {
        await AuthService.login('test@example.com', '');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería retornar error para usuario no encontrado', async () => {
      try {
        await AuthService.login('noexiste@example.com', 'password123');
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('inválidos');
      }
    });
  });
});
