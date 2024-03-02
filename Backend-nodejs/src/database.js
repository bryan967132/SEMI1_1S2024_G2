const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Base de Datos Proyecto CONECTADA');
});

module.exports = pool;
