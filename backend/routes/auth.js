// routes/auth.js
import express from "express";
import { loginUser, registerUser, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register
router.post("/register", registerUser);

// ✅ GET /api/auth/me - Clean Code: Logic moved to controller
router.get("/me", authMiddleware, getMe);

// Test route (opsional)
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

export default router;