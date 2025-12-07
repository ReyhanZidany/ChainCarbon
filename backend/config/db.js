// backend/config/db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "chaincarbon",
  port: process.env.DB_PORT || 3306,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Tes koneksi sekali di awal
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Code:", err.code);
    console.error("Errno:", err.errno);
    return;
  }
  console.log("✅ Connected to MySQL database");
  console.log("Database:", process.env.DB_NAME || "chaincarbon");
  console.log("Host:", process.env.DB_HOST || "localhost");
});

// Handle disconnect (misalnya server MySQL restart)
db.on("error", (err) => {
  console.error("⚠️ Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("🔄 Reconnecting...");
    db.connect();
  } else {
    throw err;
  }
});

export default db;
