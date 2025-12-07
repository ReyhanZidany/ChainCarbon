// backend/controllers/userController.js
import db from "../config/db.js";

// ============================================
// GET USER BY ID
// ============================================
export const getUserById = (req, res) => {
  const { id } = req.params;

  console.log("\n👤 GET /api/users/:id");
  console.log("   User ID:", id);

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      company_id, 
      website, 
      type, 
      province, 
      city, 
      is_validated,
      created_at, 
      updated_at 
    FROM users 
    WHERE id = ?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching user:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch user data",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (rows.length === 0) {
      console.log("⚠️  User not found");
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const user = rows[0];
    
    console.log("✅ User found:", user.company);
    console.log("   Email:", user.email);
    console.log("   Type:", user.type);
    console.log("   Validated:", user.is_validated);

    res.json({ 
      success: true,
      data: user
    });
  });
};

// ============================================
// UPDATE USER PROFILE
// ============================================
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { company, website, province, city } = req.body;

  console.log("\n✏️  PUT /api/users/:id");
  console.log("   User ID:", id);
  console.log("   Updates:", { company, website, province, city });

  // ✅ Validation
  if (!company) {
    return res.status(400).json({ 
      success: false,
      message: "Company name is required" 
    });
  }

  // ✅ Check if user is updating their own profile
  if (req.user && req.user.id !== parseInt(id)) {
    console.log("⚠️  Unauthorized: User trying to update another user's profile");
    return res.status(403).json({ 
      success: false,
      message: "You can only update your own profile" 
    });
  }

  const sql = `
    UPDATE users 
    SET 
      company = ?, 
      website = ?, 
      province = ?, 
      city = ?, 
      updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [company, website, province, city, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating user:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to update profile",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (result.affectedRows === 0) {
      console.log("⚠️  User not found");
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("✅ User updated successfully");
    console.log("   Rows affected:", result.affectedRows);

    // ✅ Fetch updated user data
    db.query(
      `SELECT 
        id, 
        email, 
        company, 
        company_id, 
        website, 
        type, 
        province, 
        city, 
        is_validated,
        created_at, 
        updated_at 
      FROM users 
      WHERE id = ?`,
      [id],
      (err, rows) => {
        if (err) {
          console.error("❌ Error fetching updated user:", err);
          return res.status(500).json({ 
            success: false,
            message: "Profile updated but failed to fetch latest data" 
          });
        }

        const updatedUser = rows[0];
        
        console.log("✅ Updated user data fetched");
        console.log("   Company:", updatedUser.company);
        console.log("   Website:", updatedUser.website);
        console.log("   Location:", `${updatedUser.city}, ${updatedUser.province}`);

        res.json({ 
          success: true,
          message: "Profile updated successfully",
          data: updatedUser
        });
      }
    );
  });
};

// ============================================
// GET CURRENT USER (ME)
// ============================================
export const getCurrentUser = (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized" 
    });
  }

  console.log("\n👤 GET /api/users/me");
  console.log("   User ID:", userId);

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      company_id, 
      website, 
      type, 
      role,
      province, 
      city, 
      is_validated,
      created_at, 
      updated_at 
    FROM users 
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching current user:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch user data" 
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const user = rows[0];
    
    console.log("✅ Current user:", user.company);

    res.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.company,  // ✅ Map company to name for frontend
        company: user.company,
        companyId: user.company_id,
        website: user.website,
        type: user.type,
        role: user.role || user.type,
        province: user.province,
        city: user.city,
        isValidated: user.is_validated === 1,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  });
};

// ============================================
// GET ALL USERS (Admin/Regulator Only)
// ============================================
export const getAllUsers = (req, res) => {
  console.log("\n👥 GET /api/users");

  // ✅ Check if requester is admin/regulator
  if (req.user?.type !== 'regulator' && req.user?.type !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Admin/Regulator only." 
    });
  }

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      company_id, 
      website, 
      type, 
      province, 
      city, 
      is_validated,
      rejected_reason,
      created_at, 
      updated_at 
    FROM users 
    ORDER BY created_at DESC
  `;

  db.query(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch users" 
      });
    }

    console.log(`✅ Found ${rows.length} users`);

    res.json({ 
      success: true,
      data: rows,
      count: rows.length
    });
  });
};

// ============================================
// GET PENDING USERS (Regulator)
// ============================================
export const getPendingUsers = (req, res) => {
  console.log("\n⏳ GET /api/users/pending");

  // ✅ Check if requester is regulator
  if (req.user?.type !== 'regulator') {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Regulator only." 
    });
  }

  const sql = `
    SELECT 
      id, 
      email, 
      company, 
      company_id, 
      website, 
      type, 
      province, 
      city, 
      created_at 
    FROM users 
    WHERE is_validated = 0
    ORDER BY created_at DESC
  `;

  db.query(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching pending users:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch pending users" 
      });
    }

    console.log(`✅ Found ${rows.length} pending users`);

    res.json({ 
      success: true,
      data: rows,
      count: rows.length
    });
  });
};