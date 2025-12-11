// Modelo Espacio - Define la estructura y métodos de espacios
class Espacio {
  constructor(id, nombre, descripcion, capacidad, tipo = 'sala') {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.capacidad = capacidad;
    this.tipo = tipo; // 'sala', 'oficina', 'auditorio', etc
    this.activo = true;
    this.fecha_creacion = new Date();
  }

  // Validar estructura de espacio
  validar() {
    if (!this.nombre || this.nombre.length < 3) {
      throw new Error('Nombre del espacio debe tener mínimo 3 caracteres');
    }
    if (!this.descripcion || this.descripcion.length < 5) {
      throw new Error('Descripción debe tener mínimo 5 caracteres');
    }
    if (!this.capacidad || this.capacidad < 1) {
      throw new Error('Capacidad debe ser mayor a 0');
    }
    return true;
  }

  // Convertir a objeto JSON para respuesta
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      capacidad: this.capacidad,
      tipo: this.tipo,
      activo: this.activo,
      fecha_creacion: this.fecha_creacion,
    };
  }
}

module.exports = Espacio;
