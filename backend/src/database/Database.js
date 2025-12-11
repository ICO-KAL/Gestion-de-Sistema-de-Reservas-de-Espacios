const mysql = require('mysql2/promise');

/**
 * Patrón Singleton para gestionar la conexión a MySQL
 * Asegura que solo exista una instancia del pool de conexión
 * Esto optimiza el rendimiento y evita múltiples conexiones innecesarias
 */
class Database {
  constructor() {
    // Si ya existe una instancia, devolverla
    if (Database.instance) {
      return Database.instance;
    }

    // Crear el pool de conexión
    this.pool = null;
    Database.instance = this;
  }

  /**
   * Obtener la instancia única del pool de conexión
   * @returns {Promise} Pool de conexión a MySQL
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance.getPool();
  }

  /**
   * Inicializar el pool de conexión
   */
  async getPool() {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      console.log('✓ Conexión a MySQL inicializada (Singleton Pattern)');
    }
    return this.pool;
  }

  /**
   * Ejecutar una consulta
   * @param {string} query - Consulta SQL
   * @param {array} values - Valores para la consulta
   * @returns {Promise} Resultado de la consulta
   */
  static async query(query, values = []) {
    try {
      const pool = await Database.getInstance();
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, values);
      connection.release();
      return rows;
    } catch (error) {
      console.error('Database Query Error:', error.message);
      throw error;
    }
  }

  /**
   * Cerrar la conexión del pool
   */
  static async closePool() {
    if (Database.instance && Database.instance.pool) {
      await Database.instance.pool.end();
      console.log('✓ Pool de conexión cerrado');
    }
  }
}

module.exports = Database;
