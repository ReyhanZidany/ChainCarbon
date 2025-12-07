// backend/routes/projectRoutes.js
import express from "express";
import authMiddleware, { authenticateOptional } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import { 
  submitProject, 
  getPendingProjects, 
  validateProject, 
  rejectProject, 
  getProjectById,
  getMyPurchasedProjects
} from "../controllers/projectController.js";
import db from "../config/db.js"; 

const router = express.Router();

// ============================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================

// Default route - get all validated projects
router.get("/", authenticateOptional, (req, res) => {
  console.log("\n📋 GET /api/projects (default)");
  
  const sql = `
    SELECT 
      p. project_id,
      p.user_id,
      p.company_id,
      p.category,
      p.title,
      p.location,
      p.description,
      p.start_date,
      p.end_date,
      p.est_volume,
      p.price_per_unit,
      p.is_validated,
      p.created_at,
      p.updated_at,
      u.company as company_name,
      u.email as company_email,
      COUNT(c.cert_id) as certificate_count
    FROM projects p
    LEFT JOIN users u ON p.company_id = u.company_id
    LEFT JOIN certificates c ON p.project_id = c.project_id
    WHERE p.is_validated = 1
    GROUP BY p.project_id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching projects:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    console.log(`✅ Found ${rows. length} validated projects`);
    
    return res.json({ 
      success: true, 
      data: rows,
      total: rows.length
    });
  });
});

// Get all validated projects (alias for /)
router.get("/all", authenticateOptional, (req, res) => {
  console.log("\n📋 GET /api/projects/all");
  
  const sql = `
    SELECT 
      p. project_id,
      p. user_id,
      p. company_id,
      p. category,
      p.title,
      p.location,
      p.description,
      p. start_date,
      p. end_date,
      p. est_volume,
      p. price_per_unit,
      p. is_validated,
      p. created_at,
      p. updated_at,
      u. company as company_name,
      u.email as company_email,
      COUNT(c.cert_id) as certificate_count
    FROM projects p
    LEFT JOIN users u ON p.company_id = u.company_id
    LEFT JOIN certificates c ON p.project_id = c.project_id
    WHERE p.is_validated = 1
    GROUP BY p. project_id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching all projects:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    console.log(`✅ Found ${rows.length} validated projects`);
    
    const enrichedProjects = rows.map(project => ({
      ...project,
      age_days: Math.floor((new Date() - new Date(project. created_at)) / (1000 * 60 * 60 * 24)),
      is_new: Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)) <= 30
    }));
    
    return res.json({ 
      success: true, 
      data: enrichedProjects,
      total: enrichedProjects.length
    });
  });
});

// ============================================
// AUTHENTICATED ENDPOINTS (Auth Required)
// ============================================
// ⚠️ CRITICAL: SPECIFIC ROUTES MUST COME BEFORE "/:id"

// Submit new project (with file upload)
router.post(
  "/submit",
  authMiddleware,
  upload.fields([
    { name: "dokumen", maxCount: 1 },
    { name: "gambarProyek", maxCount: 10 },
  ]),
  submitProject
);

// ✅ Get user's own projects (simple) - BEFORE /:id
router.get("/mine", authMiddleware, (req, res) => {
  console.log("\n📝 GET /api/projects/mine");
  const userId = req.user.id;
  
  console.log("  User ID:", userId);
  
  const sql = `
    SELECT 
      p.*,
      u.company as company_name,
      u.email as company_email,
      COUNT(c.cert_id) as certificate_count
    FROM projects p
    LEFT JOIN users u ON p.company_id = u.company_id
    LEFT JOIN certificates c ON p.project_id = c.project_id
    WHERE p.user_id = ?
    GROUP BY p.project_id
    ORDER BY p. created_at DESC
  `;
  
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching user projects:", err);
      return res. status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }
    
    console.log(`✅ Found ${rows.length} projects for user ${userId}`);
    
    return res.json({ 
      success: true, 
      data: rows 
    });
  });
});

// ✅ Get user's own projects (all, including sold) - BEFORE /:id
router.get("/mine-all", authMiddleware, (req, res) => {
  const userId = req.user?. id;
  const companyId = req.user?. companyId;

  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized" 
    });
  }

  console.log("\n📝 GET /api/projects/mine-all");
  console.log("  User ID:", userId);
  console.log("  Company ID:", companyId);

  const sql = `
    SELECT 
      p.*,
      c.cert_id,
      c.status as cert_status,
      c. owner_company_id as cert_owner,
      c.amount as cert_amount,
      c.listed as cert_listed,
      CASE 
        WHEN c. cert_id IS NULL THEN 0
        WHEN c.owner_company_id != ? THEN 1
        ELSE 0
      END as is_sold,
      buyer.company as buyer_company,
      ct.transaction_date as sold_date,
      ct.total_price as sold_price
    FROM projects p
    LEFT JOIN certificates c ON c.project_id = p.project_id
    LEFT JOIN certificate_transactions ct ON ct.cert_id = c.cert_id
    LEFT JOIN users buyer ON buyer.company_id = ct.buyer_company_id
    WHERE p.user_id = ? 
    ORDER BY p.created_at DESC
  `;

  db.query(sql, [companyId, userId], (err, rows) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    console.log(`✅ Found ${rows. length} projects`);
    const soldCount = rows.filter(r => r.is_sold === 1).length;
    console.log(`  - ${soldCount} sold`);
    console.log(`  - ${rows.length - soldCount} active`);
    
    return res.json({ 
      success: true, 
      data: rows 
    });
  });
});

// ✅ Get user's purchased projects - BEFORE /:id
router.get("/purchased", authMiddleware, getMyPurchasedProjects);

// ============================================
// REGULATOR ENDPOINTS - BEFORE /:id
// ============================================

// Get pending projects (awaiting validation)
router.get("/regulator/pending-projects", authMiddleware, getPendingProjects);

// Get rejected projects
router.get("/regulator/rejected-projects", authMiddleware, (req, res) => {
  console.log("\n🚫 GET /api/projects/regulator/rejected-projects");
  
  const days = parseInt(req.query.days) || 30;
  
  const sql = `
    SELECT 
      rp.*,
      p.title,
      p.category,
      p.location,
      p.description,
      p.start_date,
      p.end_date,
      p.est_volume,
      p.price_per_unit,
      p.created_at,
      u.company as company_name,
      u.email
    FROM rejected_projects rp
    INNER JOIN projects p ON rp. project_id = p.project_id
    LEFT JOIN users u ON p.company_id = u.company_id
    WHERE rp.rejected_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    ORDER BY rp.rejected_at DESC
  `;

  db.query(sql, [days], (err, results) => {
    if (err) {
      console.error("❌ Error fetching rejected projects:", err);
      return res. status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    console. log(`✅ Found ${results.length} rejected projects (last ${days} days)`);
    
    return res.json({ 
      success: true, 
      data: results,
      total: results.length
    });
  });
});

// Validate project (issue certificate)
router.post("/regulator/validate-project", authMiddleware, validateProject);

// Reject project
router.post("/regulator/reject-project", authMiddleware, rejectProject);

// ============================================
// UPDATE & DELETE - BEFORE /:id
// ============================================

// Update project
router.put("/:id", authMiddleware, (req, res) => {
  console.log("\n📝 PUT /api/projects/:id");
  const projectId = req.params.id;
  const userId = req.user.id;
  
  console.log("  Project ID:", projectId);
  console.log("  User ID:", userId);

  const checkSql = `
    SELECT project_id, user_id, is_validated 
    FROM projects 
    WHERE project_id = ? 
  `;

  db.query(checkSql, [projectId], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    if (results.length === 0) {
      console.log("❌ Project not found");
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    const project = results[0];

    if (project.user_id !== userId) {
      console.log("❌ Unauthorized");
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to update this project" 
      });
    }

    if (project.is_validated === 1) {
      console. log("❌ Cannot edit validated project");
      return res. status(400).json({ 
        success: false, 
        message: "Cannot edit validated projects" 
      });
    }

    const {
      title,
      category,
      location,
      description,
      start_date,
      end_date,
      est_volume,
      price_per_unit,
      methodology
    } = req.body;

    const updateSql = `
      UPDATE projects
      SET 
        title = ?,
        category = ?,
        location = ?,
        description = ?,
        start_date = ?,
        end_date = ?,
        est_volume = ?,
        price_per_unit = ?,
        methodology = ?,
        updated_at = NOW()
      WHERE project_id = ?
    `;

    const values = [
      title,
      category,
      location,
      description,
      start_date,
      end_date,
      est_volume,
      price_per_unit,
      methodology,
      projectId
    ];

    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error("❌ Update error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to update project",
          error: err.message 
        });
      }

      console.log("✅ Project updated successfully");
      
      return res.json({ 
        success: true, 
        message: "Project updated successfully",
        data: {
          project_id: projectId,
          updated_at: new Date()
        }
      });
    });
  });
});

// Delete project
router.delete("/:id", authMiddleware, (req, res) => {
  console.log("\n🗑️ DELETE /api/projects/:id");
  const projectId = req. params.id;
  const userId = req.user.id;
  
  console.log("  Project ID:", projectId);
  console.log("  User ID:", userId);

  const checkSql = `
    SELECT 
      project_id, 
      user_id, 
      is_validated,
      title
    FROM projects 
    WHERE project_id = ?
  `;

  db.query(checkSql, [projectId], (err, results) => {
    if (err) {
      console. error("❌ Database error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message 
      });
    }

    if (results.length === 0) {
      console.log("❌ Project not found");
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    const project = results[0];

    if (project.user_id !== userId) {
      console.log("❌ Unauthorized");
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this project" 
      });
    }

    if (project. is_validated === 1) {
      console.log("❌ Cannot delete validated project");
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete validated projects.  Contact administrator." 
      });
    }

    const certCheckSql = `SELECT COUNT(*) as cert_count FROM certificates WHERE project_id = ?`;
    
    db.query(certCheckSql, [projectId], (err, certResults) => {
      if (err) {
        console.error("❌ Error checking certificates:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Database error" 
        });
      }

      if (certResults[0].cert_count > 0) {
        console. log("❌ Cannot delete: has certificates");
        return res.status(400).json({ 
          success: false, 
          message: "Cannot delete projects with issued certificates" 
        });
      }

      const deleteSql = `DELETE FROM projects WHERE project_id = ? `;
      
      db.query(deleteSql, [projectId], (err, result) => {
        if (err) {
          console.error("❌ Delete error:", err);
          return res.status(500).json({ 
            success: false, 
            message: "Failed to delete project",
            error: err.message 
          });
        }

        console. log(`✅ Project "${project.title}" deleted successfully`);
        
        return res.json({ 
          success: true, 
          message: "Project deleted successfully",
          data: {
            project_id: projectId,
            title: project.title
          }
        });
      });
    });
  });
});

// ============================================
// DYNAMIC ROUTE (MUST BE LAST!)
// ============================================

// ✅ Get project by ID (public + auth optional)
// ⚠️ MUST BE LAST because it matches any "/:id"
router.get("/:id", authenticateOptional, getProjectById);

export default router;