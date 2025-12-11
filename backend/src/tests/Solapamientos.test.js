describe('Solapamientos de Reservas (HU14)', () => {
  /**
   * Test para detectar solapamientos de reservas
   * Casos:
   * 1. Solapamiento total: nueva reserva dentro de existente
   * 2. Solapamiento parcial inicio: nueva reserva comienza dentro de existente
   * 3. Solapamiento parcial fin: nueva reserva termina dentro de existente
   * 4. Sin solapamiento (antes): nueva reserva termina antes de existente
   * 5. Sin solapamiento (después): nueva reserva comienza después de existente
   * 6. Límites exactos: reservas adyacentes sin solapamiento
   */

  function detectarSolapamiento(nuevaReserva, reservasExistentes) {
    return reservasExistentes.some(existente => {
      // Verificar si hay solapamiento
      return (
        (nuevaReserva.hora_inicio < existente.hora_fin &&
          nuevaReserva.hora_fin > existente.hora_inicio) ||
        (nuevaReserva.hora_inicio < existente.hora_fin &&
          nuevaReserva.hora_fin > existente.hora_inicio)
      );
    });
  }

  test('debe detectar solapamiento total', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '09:30', hora_fin: '10:30' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(true);
  });

  test('debe detectar solapamiento parcial al inicio', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '08:30', hora_fin: '09:30' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(true);
  });

  test('debe detectar solapamiento parcial al final', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '10:30', hora_fin: '11:30' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(true);
  });

  test('no debe detectar solapamiento (antes)', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '07:00', hora_fin: '08:00' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(false);
  });

  test('no debe detectar solapamiento (después)', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '12:00', hora_fin: '13:00' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(false);
  });

  test('no debe detectar solapamiento en límites exactos (antes)', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '08:00', hora_fin: '09:00' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(false);
  });

  test('no debe detectar solapamiento en límites exactos (después)', () => {
    const existentes = [{ hora_inicio: '09:00', hora_fin: '11:00' }];
    const nueva = { hora_inicio: '11:00', hora_fin: '12:00' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(false);
  });

  test('debe manejar múltiples reservas existentes', () => {
    const existentes = [
      { hora_inicio: '09:00', hora_fin: '11:00' },
      { hora_inicio: '14:00', hora_fin: '16:00' },
    ];
    const nueva = { hora_inicio: '15:00', hora_fin: '15:30' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(true);
  });

  test('debe permitir reserva entre dos existentes sin solapamiento', () => {
    const existentes = [
      { hora_inicio: '09:00', hora_fin: '11:00' },
      { hora_inicio: '14:00', hora_fin: '16:00' },
    ];
    const nueva = { hora_inicio: '12:00', hora_fin: '13:00' };
    expect(detectarSolapamiento(nueva, existentes)).toBe(false);
  });
});
