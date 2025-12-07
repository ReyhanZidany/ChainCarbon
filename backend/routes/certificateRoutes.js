// backend/routes/certificateRoutes.js
import express from "express";
import authMiddleware, { authenticateOptional } from "../middleware/authMiddleware.js";
import {
  listCertificate,
  unlistCertificate,
  buyCertificate,
  retireCertificate,
  getMarketplace,
  getMyCertificates,
  getCertificateById,
  getCertificateByProject,
  getCertificateDetail,
  getActiveCertificatesCount, // ✅ ADD THIS
} from "../controllers/certificateController.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (with optional auth)
// ============================================
// ✅ Use authenticateOptional so logged-in users can be detected
router.get("/marketplace", authenticateOptional, getMarketplace);

// ============================================
// PROTECTED ROUTES
// ============================================
// ✅ CRITICAL: Stats endpoint MUST come BEFORE :id route to avoid conflicts
router.get("/my-certificates/stats", authMiddleware, getActiveCertificatesCount);

// My certificates routes
router.get("/my", authMiddleware, getMyCertificates);
router.get("/mine", authMiddleware, getMyCertificates);
router.get("/my-certificates", authMiddleware, getMyCertificates);

// Certificate operations
router.get("/by-project/:projectId", authMiddleware, getCertificateByProject);
router.get("/:certId/detail", authMiddleware, getCertificateDetail);
router.post("/:certId/list", authMiddleware, listCertificate);
router.post("/:certId/unlist", authMiddleware, unlistCertificate);
router.post("/:certId/buy", authMiddleware, buyCertificate);
router.post("/:certId/retire", authMiddleware, retireCertificate);

// ✅ CRITICAL: Generic :id route MUST be LAST to avoid catching other routes
router.get("/:id", authMiddleware, getCertificateById);

export default router;