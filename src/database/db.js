const mysql = require("mysql2/promise");
const { USER, PASSWORD, HOST, DATABASE, PORT_DB } = require('../config');
require("dotenv").config();

let pool;

const getDB = async () => {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
      port: PORT_DB,
    });
  }
  return await pool.getConnection();
};

const pingDatabase = async () => {
  try {
    const connect = await getDB();
    const [results, fields] = await connect.query('SELECT 1')
    connect.release();

  } catch (error) {
    console.error('Error al hacer ping a la base de datos:', error);
  }
}

// Programa una tarea que ejecute pingDatabase cada 4 horas (en milisegundos)
const fourHours = 4 * 60 * 60 * 1000;
setInterval(pingDatabase, fourHours);

module.exports = getDB;