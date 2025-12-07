// backend/routes/userRoutes.js
import express from "express";
import db from "../config/db.js";
import authMiddleware, { authenticateOptional } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// PUBLIC ENDPOINT: Get Users Count (for Landing Page)
// ============================================
router.get("/count", authenticateOptional, (req, res) => {  
  // Count total users (exclude regulators)
  const countSql = "SELECT COUNT(*) as count FROM users WHERE role = 'company'";
  
  // Count new users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsersSql = "SELECT COUNT(*) as count FROM users WHERE role = 'company' AND created_at >= ?";
  
  db.query(countSql, (err1, countResult) => {
    if (err1) {
      console.error("❌ Get users count error:", err1);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err1.message
      });
    }
    
    db.query(newUsersSql, [thirtyDaysAgo], (err2, newUsersResult) => {
      if (err2) {
        console.error("❌ Get new users error:", err2);
        return res.status(500).json({ 
          success: false, 
          message: "Database error",
          error: err2.message
        });
      }
      
      const totalCount = countResult[0]?.count || 0;
      const newUsersCount = newUsersResult[0]?.count || 0;
      
      console.log(`✅ Total users: ${totalCount}`);
      console.log(`✅ New users (30 days): ${newUsersCount}`);
      
      return res.json({ 
        success: true, 
        count: totalCount,
        newUsers: newUsersCount
      });
    });
  });
});

// ============================================
// AUTHENTICATED ENDPOINTS
// ============================================

// ✅ GET /api/users/me - Ambil data user dari token (profil)
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      company_id,
      website, 
      province, 
      city, 
      type, 
      role,
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

    // ✅ Log dengan format yang jelas
    console.log(`👤 Authenticated User: ${user.company || user.email} (ID: ${user.id}, Type: ${user.type})`);

    // ✅ Return format yang konsisten untuk frontend
    res.json({
      success: true,
      user: {
        id: user.id,
        user_id: user.id,  // Backward compatibility
        name: user.company || user.email,
        email: user.email,
        company: user.company,
        companyId: user.company_id,  // ✅ camelCase untuk frontend
        company_id: user.company_id, // snake_case untuk backward compatibility
        website: user.website,
        province: user.province,
        city: user.city,
        type: user.type,
        role: user.role,  // ✅ Alias for backward compatibility
        isValidated: user.is_validated === 1,  // ✅ camelCase
        is_validated: user.is_validated,       // snake_case backward compatibility
        createdAt: user.created_at,  // ✅ camelCase
        created_at: user.created_at, // snake_case backward compatibility
        updatedAt: user.updated_at
      }
    });
  });
});

// ✅ PUT /api/users/me - Update profil user
router.put("/me", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { company, website, province, city } = req.body;

  const sql = "UPDATE users SET company=?, website=?, province=?, city=?, updated_at=NOW() WHERE id=?";
  
  db.query(sql, [company, website, province, city, userId], (err) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to update profile" 
      });
    }

    console.log(`✅ Profile updated for user ID: ${userId}`);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: userId,
        email: req.user.email,
        company,
        website,
        province,
        city,
        type: req.user.type,
      }
    });
  });
});

export default router;