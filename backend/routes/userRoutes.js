// backend/routes/userRoutes.js
import express from "express";
import authMiddleware, { authenticateOptional } from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile, getUsersCount } from "../controllers/userController.js";

const router = express.Router();

// ============================================
// PUBLIC ENDPOINT: Get Users Count (for Landing Page)
// ============================================
router.get("/count", authenticateOptional, getUsersCount);

// ============================================
// AUTHENTICATED ENDPOINTS
// ============================================

// ✅ GET /api/users/me - Ambil data user dari token (profil)
router.get("/me", authMiddleware, getUserProfile);

// ✅ PUT /api/users/me - Update profil user
router.put("/me", authMiddleware, updateUserProfile);

export default router;