const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME, 
  waitForConnections: true, // Prevents too many simultaneous connections
  connectionLimit: 10, // Max concurrent connections
  queueLimit: 0, // No limit on connection queue
  connectTimeout: 10000 // Connection timeout in milliseconds
});

// Test the database connection
pool.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL Database:", process.env.DB_NAME);
    connection.release(); // Release connection back to the pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

module.exports = pool;


