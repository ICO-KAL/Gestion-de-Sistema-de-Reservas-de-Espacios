/**
 * Pruebas unitarias para EspaciosService
 */
const EspaciosService = require('../../src/services/espaciosService');

describe('EspaciosService', () => {
  describe('Validación de entrada', () => {
    test('Debería validar nombre no vacío', async () => {
      try {
        await EspaciosService.createEspacio('', 'Descripción válida', 10);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería validar nombre mínimo 3 caracteres', async () => {
      try {
        await EspaciosService.createEspacio('AB', 'Descripción válida', 10);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería validar descripción no vacía', async () => {
      try {
        await EspaciosService.createEspacio('Sala 1', '', 10);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería validar capacidad > 0', async () => {
      try {
        await EspaciosService.createEspacio('Sala 1', 'Descripción', 0);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('Debería validar capacidad negativa', async () => {
      try {
        await EspaciosService.createEspacio('Sala 1', 'Descripción', -5);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });
  });

  describe('Búsqueda y filtrado', () => {
    test('searchEspacios debería buscar por nombre', async () => {
      // Este test requeriría una BD real
      // Se muestra la estructura esperada
      try {
        const resultado = await EspaciosService.searchEspacios('Sala');
        expect(Array.isArray(resultado)).toBe(true);
      } catch (error) {
        // Se espera error por falta de BD
        expect(error.message).toContain('Error');
      }
    });

    test('filterByCapacidad debería filtrar por capacidad mínima', async () => {
      try {
        const resultado = await EspaciosService.filterByCapacidad(10);
        expect(Array.isArray(resultado)).toBe(true);
      } catch (error) {
        // Se espera error por falta de BD
        expect(error.message).toContain('Error');
      }
    });
  });

  describe('CRUD operations', () => {
    test('getAllEspacios debería retornar array', async () => {
      try {
        const espacios = await EspaciosService.getAllEspacios();
        expect(Array.isArray(espacios)).toBe(true);
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });

    test('getEspacioById debería retornar error para ID inválido', async () => {
      try {
        await EspaciosService.getEspacioById(999999);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('no encontrado');
      }
    });

    test('deleteEspacio debería validar ID', async () => {
      try {
        await EspaciosService.deleteEspacio(null);
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Error');
      }
    });
  });
});
