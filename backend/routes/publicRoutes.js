// backend/routes/publicRoutes.js
import express from "express";
import { verifyCertificate } from "../controllers/publicController.js";

const router = express.Router();

// ============================================
// PUBLIC CERTIFICATE VERIFICATION
// ============================================
router.get("/verify/:certId", verifyCertificate);

export default router;