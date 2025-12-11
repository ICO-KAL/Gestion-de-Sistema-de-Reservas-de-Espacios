describe('Validaciones de Entrada', () => {
  describe('Validación de Email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    test('debe validar email correcto', () => {
      expect(emailRegex.test('usuario@example.com')).toBe(true);
    });

    test('debe validar email con subdominios', () => {
      expect(emailRegex.test('usuario@mail.example.com')).toBe(true);
    });

    test('debe rechazar email sin @', () => {
      expect(emailRegex.test('usuarioexample.com')).toBe(false);
    });

    test('debe rechazar email sin dominio', () => {
      expect(emailRegex.test('usuario@')).toBe(false);
    });

    test('debe rechazar email vacío', () => {
      expect(emailRegex.test('')).toBe(false);
    });
  });

  describe('Validación de Contraseña', () => {
    function validarPassword(password) {
      return password && password.length >= 6;
    }

    test('debe aceptar contraseña válida', () => {
      expect(validarPassword('password123')).toBe(true);
    });

    test('debe rechazar contraseña muy corta', () => {
      expect(validarPassword('12345')).toBe(false);
    });

    test('debe rechazar contraseña vacía', () => {
      expect(!validarPassword('')).toBe(true);
    });

    test('debe rechazar null', () => {
      expect(!validarPassword(null)).toBe(true);
    });
  });

  describe('Validación de Nombre', () => {
    function validarNombre(nombre) {
      return nombre && nombre.length >= 3;
    }

    test('debe aceptar nombre válido', () => {
      expect(validarNombre('Juan')).toBe(true);
    });

    test('debe rechazar nombre muy corto', () => {
      expect(validarNombre('Jo')).toBe(false);
    });

    test('debe rechazar nombre vacío', () => {
      expect(!validarNombre('')).toBe(true);
    });
  });

  describe('Validación de Capacidad', () => {
    function validarCapacidad(capacidad) {
      return Number.isInteger(capacidad) && capacidad > 0;
    }

    test('debe aceptar capacidad válida', () => {
      expect(validarCapacidad(10)).toBe(true);
    });

    test('debe rechazar capacidad cero', () => {
      expect(validarCapacidad(0)).toBe(false);
    });

    test('debe rechazar capacidad negativa', () => {
      expect(validarCapacidad(-5)).toBe(false);
    });

    test('debe rechazar capacidad decimal', () => {
      expect(validarCapacidad(10.5)).toBe(false);
    });

    test('debe rechazar capacidad string', () => {
      expect(validarCapacidad('10')).toBe(false);
    });
  });

  describe('Validación de Fecha', () => {
    function validarFecha(fecha) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(fecha)) return false;
      const date = new Date(fecha);
      return !isNaN(date.getTime());
    }

    test('debe aceptar fecha válida', () => {
      expect(validarFecha('2024-12-20')).toBe(true);
    });

    test('debe rechazar fecha en formato incorrecto', () => {
      expect(validarFecha('20-12-2024')).toBe(false);
    });

    test('debe rechazar fecha inválida', () => {
      expect(validarFecha('2024-13-45')).toBe(false); // Mes y día inválidos
    });

    test('debe rechazar fecha vacía', () => {
      expect(validarFecha('')).toBe(false);
    });
  });

  describe('Validación de Hora', () => {
    function validarHora(hora) {
      const regex = /^\d{2}:\d{2}$/;
      if (!regex.test(hora)) return false;
      const [h, m] = hora.split(':').map(Number);
      return h >= 0 && h < 24 && m >= 0 && m < 60;
    }

    test('debe aceptar hora válida', () => {
      expect(validarHora('09:30')).toBe(true);
    });

    test('debe rechazar hora sin formato', () => {
      expect(validarHora('9:30')).toBe(false);
    });

    test('debe rechazar hora inválida', () => {
      expect(validarHora('25:00')).toBe(false);
    });

    test('debe rechazar minutos inválidos', () => {
      expect(validarHora('10:60')).toBe(false);
    });
  });
});
