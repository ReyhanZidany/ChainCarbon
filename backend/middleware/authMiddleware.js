// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// ============================================
// Helper: Format log message
// ============================================
const logAuth = (type, message, details = {}) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const emoji = {
    success: '✅',
    info: 'ℹ️ ',
    warning: '⚠️ ',
    error: '❌',
    guest: '👤'
  };

  const detailsStr = Object.keys(details).length > 0 
    ? ` | ${Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ')}`
    : '';

  console.log(`${emoji[type] || 'ℹ️ '} [${timestamp}] ${message}${detailsStr}`);
};

// ============================================
// Middleware untuk route yang OPTIONAL login
// ============================================
const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const endpoint = `${req.method} ${req.originalUrl || req.url}`;

  // Jika tidak ada token, lanjutkan sebagai guest
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`👤 [Guest] ${endpoint}`);
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type || null,
      companyId: decoded.companyId || null,
      name: decoded.name || decoded.company || decoded.email || null,
    };

    next();
  } catch (err) {
    // Token invalid, lanjutkan sebagai guest (TIDAK error)
    console.log(`⚠️  [Invalid Token] ${endpoint} - Continuing as guest`);
    req.user = null;
    next();
  }
};

// ============================================
// Middleware untuk route yang WAJIB login
// ============================================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const endpoint = `${req.method} ${req.originalUrl || req.url}`;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logAuth('guest', 'Unauthorized access attempt', { 
      endpoint,
      ip: req.ip || req.connection.remoteAddress
    });
    
    return res.status(401).json({ 
      success: false,
      message: "Access denied, token not found" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type || null,
      companyId: decoded.companyId || null,
      name: decoded.name || decoded.company || decoded.email || null,
    };

    next();
  } catch (err) {
    logAuth('error', 'Authentication failed', {
      reason: err.message,
      endpoint
    });
    
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};

// ============================================
// Middleware untuk route yang WAJIB REGULATOR
// ============================================
const requireRegulator = (req, res, next) => {
  const endpoint = `${req.method} ${req.originalUrl || req.url}`;

  if (!req.user) {
    logAuth('error', 'Regulator access denied: Not authenticated', { endpoint });
    
    return res.status(401).json({ 
      success: false,
      message: "Authentication required" 
    });
  }

  if (req.user.type !== "regulator" && req.user.role !== "regulator") {
    logAuth('warning', 'Regulator access denied', {
      user: req.user.name || req.user.email,
      type: req.user.type,
      role: req.user.role,
      endpoint
    });
    
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Regulator role required." 
    });
  }

  logAuth('success', 'Regulator access granted', {
    user: req.user.name || req.user.email,
    endpoint
  });

  next();
};

// ============================================
// EXPORTS - ✅ PERBAIKAN: Export di sini langsung
// ============================================
export default authMiddleware;
export { authMiddleware, authenticateOptional, requireRegulator };