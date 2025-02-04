const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  connectionLimit: 10,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
}

// Create the connection pool  
const pool = mysql.createPool(dbConfig);
console.log("Database connected");

// function that will execute the SQL queries asynchronously
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

// function to get a connection from the pool
async function getConnection() {
  return await pool.getConnection();
}

module.exports = { getConnection, query };