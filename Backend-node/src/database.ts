import mysql, { PoolConnection } from 'mysql';
import keys from './keys';

// Configuración de la conexión
const pool = mysql.createPool(keys.database);

// Obtener una conexión del pool
pool.getConnection((err: mysql.MysqlError, connection: PoolConnection | undefined) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Base de Datos Proyecto CONECTADA');
});

export default pool;
