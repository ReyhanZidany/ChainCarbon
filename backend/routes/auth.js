// routes/auth.js
import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register
router.post("/register", registerUser);

// ✅ GET /api/auth/me - Get authenticated user (alias untuk /api/users/me)
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      website, 
      province, 
      city,
      role, 
      type, 
      is_validated,
      created_at
    FROM users 
    WHERE id = ?
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch user profile" 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const user = results[0];

    console.log(`👤 [AUTH] User authenticated: ${user.company || user.email} (ID: ${user.id}, Type: ${user.type})`);

    res.json({
      success: true,
      user: {
        user_id: user.id,
        name: user.company || user.email,
        email: user.email,
        company: user.company,
        website: user.website,
        role: user.role,
        type: user.type,
        province: user.province,
        city: user.city,
        is_validated: user.is_validated
      }
    });
  });
});

// Test route (opsional)
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

export default router;