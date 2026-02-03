// backend/routes/regulatorRoutes.js
import express from "express";
import auth, { requireRegulator } from "../middleware/authMiddleware.js";
import {
  validateUser,
  rejectUser,
  getRejectedUsers,
  getRejectedProjects,
  getRegulatorStats,
  getAllCompanies,
  getCompanyById,
  getCompanyProjects,
  getCompanyCertificates,
  getCompanyTransactions,
  getAllTransactions,
  getPendingUsers,
  getAllRegulatorProjects,
  getAudits,
  createAudit,
  getNotificationSettings,
  updateNotificationSettings,
  exportRegulatorData
} from "../controllers/regulatorController.js";

const router = express.Router();

router.use(auth);              // Check authentication
router.use(requireRegulator);    // Check regulator role

const checkRegulatorAccess = (req, res, next) => {
  const isRegulator = req.user?.type === "regulator" || req.user?.role === "regulator";

  if (!isRegulator) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Regulator only."
    });
  }

  next();
};

router.use(checkRegulatorAccess); // Apply to all routes below

// ============================================
// DASHBOARD & STATISTICS
// ============================================
router.get("/stats", getRegulatorStats);

// ============================================
// COMPANIES
// ============================================
router.get("/companies", getAllCompanies);
router.get("/companies/:id", getCompanyById);
router.get("/companies/:companyId/projects", getCompanyProjects);
router.get("/companies/:companyId/certificates", getCompanyCertificates);
router.get("/companies/:companyId/transactions", getCompanyTransactions);

// ============================================
// TRANSACTIONS 
// ============================================
router.get("/transactions", getAllTransactions);

// ============================================
// USERS & PROJECTS
// ============================================
router.get("/pending-users", getPendingUsers);
router.post("/validate-user", validateUser);
router.post("/reject-user", rejectUser);
router.get("/rejected-users", getRejectedUsers);
router.get("/rejected-projects", getRejectedProjects);
router.get("/projects", getAllRegulatorProjects);

// ============================================
// AUDITS
// ============================================
router.get("/audits", getAudits);
router.post("/audits", createAudit);

// ============================================
// SETTINGS
// ============================================
router.get("/notification-settings", getNotificationSettings);
router.put("/notification-settings", updateNotificationSettings);

// ============================================
// DATA EXPORT
// ============================================
router.get("/export-data", exportRegulatorData);

export default router;