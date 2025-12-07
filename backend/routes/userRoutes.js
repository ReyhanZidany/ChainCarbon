import express from "express";
import { updateUser, getUserById } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Ambil data user by ID (untuk profile page)
router.get("/:id", authMiddleware, getUserById);

// Update profil user
router.put("/:id", authMiddleware, updateUser);

export default router;
