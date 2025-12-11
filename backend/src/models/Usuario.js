// Modelo Usuario - Define la estructura y métodos de usuarios
class Usuario {
  constructor(id, nombre, email, contraseña, rol = 'usuario') {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.contraseña = contraseña;
    this.rol = rol; // 'usuario' o 'admin'
    this.fecha_creacion = new Date();
  }

  // Validar estructura de usuario
  validar() {
    if (!this.nombre || this.nombre.length < 3) {
      throw new Error('Nombre debe tener mínimo 3 caracteres');
    }
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Email inválido');
    }
    if (!this.contraseña || this.contraseña.length < 6) {
      throw new Error('Contraseña debe tener mínimo 6 caracteres');
    }
    return true;
  }

  // Convertir a objeto JSON para respuesta
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      fecha_creacion: this.fecha_creacion,
    };
  }
}

module.exports = Usuario;
