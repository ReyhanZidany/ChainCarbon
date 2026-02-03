// backend/config/db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Best Practice: Use Connection Pool instead of single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "chaincarbon",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Max 10 concurrent connections
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database pool connection failed:", err.message);
    console.error("Code:", err.code);
    return;
  }
  console.log("✅ Connected to MySQL database (Connection Pool)");
  console.log("Database:", process.env.DB_NAME || "chaincarbon");

  // Release connection back to pool
  connection.release();
});

export default pool;
