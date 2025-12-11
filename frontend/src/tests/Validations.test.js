import { describe, it, expect } from 'vitest';

/**
 * Tests de validación de formularios
 */
describe('Validación de Formularios', () => {
  // Test de validación de email
  it('valida email correctamente', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid.email')).toBe(false);
    expect(emailRegex.test('user@domain')).toBe(false);
  });

  // Test de validación de contraseña
  it('valida longitud mínima de contraseña', () => {
    const validatePassword = (pwd) => pwd.length >= 6;
    
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('password123')).toBe(true);
  });

  // Test de validación de nombre
  it('valida nombre correctamente', () => {
    const validateName = (name) => name && name.length >= 3;
    
    expect(validateName('Juan')).toBe(true);
    expect(validateName('Jo')).toBe(false);
    expect(!validateName('')).toBe(true); // String vacío es falsy
  });

  // Test de validación de capacidad
  it('valida capacidad de espacio', () => {
    const validateCapacity = (cap) => cap > 0 && Number.isInteger(cap);
    
    expect(validateCapacity(20)).toBe(true);
    expect(validateCapacity(0)).toBe(false);
    expect(validateCapacity(-5)).toBe(false);
    expect(validateCapacity(10.5)).toBe(false);
  });

  // Test de fechas
  it('valida rango de fechas', () => {
    const validateDateRange = (start, end) => {
      return new Date(start) < new Date(end);
    };
    
    expect(
      validateDateRange('2025-01-01T09:00', '2025-01-01T10:00')
    ).toBe(true);
    
    expect(
      validateDateRange('2025-01-01T10:00', '2025-01-01T09:00')
    ).toBe(false);
  });
});
