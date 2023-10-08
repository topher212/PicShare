const mysql = require("mysql2/promise");
const {USER, PASSWORD, HOST, DATABASE, PORT_DB} = require('../config');
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

module.exports = getDB;