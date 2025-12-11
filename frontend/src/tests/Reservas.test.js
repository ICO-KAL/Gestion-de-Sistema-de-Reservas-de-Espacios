import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests de lógica de reservas
 */
describe('Lógica de Reservas', () => {
  // Test de detección de solapamientos (HU14)
  it('detecta solapamientos de reservas correctamente', () => {
    const detectOverlap = (nueva, existente) => {
      const nuevaStart = new Date(nueva.fecha_inicio);
      const nuevaEnd = new Date(nueva.fecha_fin);
      const existStart = new Date(existente.fecha_inicio);
      const existEnd = new Date(existente.fecha_fin);

      return nuevaStart < existEnd && nuevaEnd > existStart;
    };

    const existente = {
      fecha_inicio: '2025-01-15T09:00:00',
      fecha_fin: '2025-01-15T10:00:00',
    };

    // Solapamiento total
    const solapada1 = {
      fecha_inicio: '2025-01-15T08:30:00',
      fecha_fin: '2025-01-15T09:30:00',
    };
    expect(detectOverlap(solapada1, existente)).toBe(true);

    // Sin solapamiento (antes)
    const noSolapada1 = {
      fecha_inicio: '2025-01-15T07:00:00',
      fecha_fin: '2025-01-15T08:00:00',
    };
    expect(detectOverlap(noSolapada1, existente)).toBe(false);

    // Sin solapamiento (después)
    const noSolapada2 = {
      fecha_inicio: '2025-01-15T11:00:00',
      fecha_fin: '2025-01-15T12:00:00',
    };
    expect(detectOverlap(noSolapada2, existente)).toBe(false);

    // Solapamiento parcial (inicio)
    const solapada2 = {
      fecha_inicio: '2025-01-15T09:45:00',
      fecha_fin: '2025-01-15T10:45:00',
    };
    expect(detectOverlap(solapada2, existente)).toBe(true);
  });

  // Test de filtrado de espacios
  it('filtra espacios por capacidad', () => {
    const espacios = [
      { id: 1, nombre: 'Sala A', capacidad: 10 },
      { id: 2, nombre: 'Sala B', capacidad: 20 },
      { id: 3, nombre: 'Sala C', capacidad: 50 },
    ];

    const filterByCapacity = (espacios, minCapacity) =>
      espacios.filter(e => e.capacidad >= minCapacity);

    const resultado = filterByCapacity(espacios, 20);
    
    expect(resultado.length).toBe(2);
    expect(resultado[0].capacidad).toBe(20);
    expect(resultado[1].capacidad).toBe(50);
  });

  // Test de búsqueda de espacios
  it('busca espacios por nombre', () => {
    const espacios = [
      { id: 1, nombre: 'Sala de Conferencias' },
      { id: 2, nombre: 'Oficina Principal' },
      { id: 3, nombre: 'Sala de Capacitación' },
    ];

    const search = (espacios, query) =>
      espacios.filter(e =>
        e.nombre.toLowerCase().includes(query.toLowerCase())
      );

    const resultado = search(espacios, 'sala');
    
    expect(resultado.length).toBe(2);
    expect(resultado[0].nombre).toContain('Sala');
  });

  // Test de próximas vs pasadas reservas
  it('separa reservas próximas de pasadas', () => {
    const ahora = new Date();
    const proxima = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días
    const pasada = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000); // -7 días

    const reservas = [
      { id: 1, fecha_inicio: proxima.toISOString() },
      { id: 2, fecha_inicio: pasada.toISOString() },
      { id: 3, fecha_inicio: proxima.toISOString() },
    ];

    const separateReservas = (reservas) => {
      const ahora = new Date();
      return {
        proximas: reservas.filter(r => new Date(r.fecha_inicio) > ahora),
        pasadas: reservas.filter(r => new Date(r.fecha_inicio) <= ahora),
      };
    };

    const { proximas, pasadas } = separateReservas(reservas);

    expect(proximas.length).toBe(2);
    expect(pasadas.length).toBe(1);
  });
});
