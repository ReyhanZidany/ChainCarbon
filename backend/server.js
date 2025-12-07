// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import listEndpoints from "express-list-endpoints";

// Import routes
import regulatorRoutes from "./routes/regulatorRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

// Import database config
import db from "./config/db.js";

// ============================================
// CONFIGURATION
// ============================================

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Path helper for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CORS CONFIGURATION
// ============================================

// Parse allowed origins from environment variable
let allowedOrigins = [];

if (process.env. FRONTEND_URL) {
  allowedOrigins = process.env. FRONTEND_URL
    .split(',')
    . map(url => url.trim())
    . filter(Boolean);
}

// Default development origins
const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5173"
];

// Merge origins
allowedOrigins = [... new Set([...allowedOrigins, ...defaultOrigins])];

console.log("\n🌐 CORS Configuration:");
console.log("   Environment:", NODE_ENV);
console.log("   Allowed Origins:", allowedOrigins);

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (! origin) {
      return callback(null, true);
    }
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all local network IPs
    if (NODE_ENV === 'development') {
      // Match localhost variants
      if (origin.includes('localhost') || origin.includes('127. 0.0.1')) {
        console.log("✅ CORS allowed (localhost):", origin);
        return callback(null, true);
      }
      
      // Match local network IPs (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
      const localIPPatterns = [
        /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
        /^http:\/\/192\. 168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
        /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/
      ];
      
      const isLocalIP = localIPPatterns.some(pattern => pattern.test(origin));
      
      if (isLocalIP) {
        console.log("✅ CORS allowed (local IP):", origin);
        return callback(null, true);
      }
    }
    
    // Block all other origins
    console.log("❌ CORS blocked origin:", origin);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ FIXED: Handle OPTIONS requests for all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// ============================================
// MIDDLEWARE
// ============================================

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving
app.use("/uploads", express. static(path.join(__dirname, "uploads")));
app.use("/retirements", express.static(path.join(process.cwd(), "public", "retirements")));

// Request logging (development only)
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console. log(`📨 ${req. method} ${req.path}`);
    next();
  });
}

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ ChainCarbon API is running!",
    version: "1.0.0",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      projects: "/api/projects",
      certificates: "/api/certificates",
      transactions: "/api/transactions",
      regulator: "/api/regulator",
      public: "/api/public"
    }
  });
});

// Health check endpoint (for monitoring tools)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "connected"
  });
});

// Database health check
app.get("/health/db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        error: err.message
      });
    }
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/regulator", regulatorRoutes);
app.use("/api/public", publicRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: NODE_ENV === "development" ? err.stack : undefined
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 ChainCarbon API Server Started");
  console.log("=".repeat(60));
  console.log(`   Environment: ${NODE_ENV}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Local URL: http://localhost:${PORT}`);
  console.log(`   Network URL: http://10.131.182.232:${PORT}`); // ✅ Your IP
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  console.log(`   Fabric API: ${process.env. FABRIC_API || 'http://localhost:3000'}`);
  console.log("=".repeat(60));
  
  console.log("\n🌐 CORS: Allowing requests from:");
  allowedOrigins.forEach(origin => console.log(`   ✅ ${origin}`));
  if (NODE_ENV === 'development') {
    console.log(`   ✅ All local IPs (10.x.x.x, 192.168.x.x)`);
  }
  
  // List all registered routes
  const routes = listEndpoints(app);
  console.log("\n📌 Registered Endpoints:");
  console.log("=".repeat(60));
  
  // Group by prefix
  const grouped = {};
  routes.forEach((r) => {
    const prefix = r.path.split('/')[2] || r.path.split('/')[1] || 'root';
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(r);
  });
  
  Object.keys(grouped).sort().forEach(prefix => {
    console.log(`\n📂 /${prefix}`);
    grouped[prefix].forEach(r => {
      console.log(`   ${r.methods.join(", ").padEnd(10)} ${r.path}`);
    });
  });
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ Server ready to accept requests!");
  console.log("=".repeat(60) + "\n");
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

export default app;