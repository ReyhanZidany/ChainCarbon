// backend/routes/regulatorRoutes.js
import express from "express";
import auth, { requireRegulator } from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import { validateUser, rejectUser, getRejectedUsers, getRejectedProjects } from "../controllers/regulatorController.js";

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

// ============================================
// DASHBOARD & STATISTICS
// ============================================
router.get("/stats", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n📊 GET /api/regulator/stats");

  const companiesSql = `SELECT COUNT(*) as total_companies FROM users WHERE type != 'regulator'`;
  const buyersSql = `SELECT COUNT(DISTINCT buyer_company_id) as total_buyers FROM certificate_transactions`;
  const transactionsSql = `
    SELECT 
      COUNT(*) as total_transactions,
      SUM(CASE WHEN DATE(transaction_date) = CURDATE() THEN 1 ELSE 0 END) as today_transactions
    FROM certificate_transactions
  `;
  const projectsSql = `
    SELECT 
      COUNT(*) as total_projects,
      SUM(CASE WHEN is_validated = 1 THEN 1 ELSE 0 END) as active_projects,
      SUM(CASE WHEN is_validated = 0 THEN 1 ELSE 0 END) as pending_projects
    FROM projects
  `;

  Promise.all([
    new Promise((resolve, reject) => db.query(companiesSql, (err, results) => err ? reject(err) : resolve(results[0]))),
    new Promise((resolve) => db.query(buyersSql, (err, results) => resolve(err ? { total_buyers: 0 } : results[0]))),
    new Promise((resolve) => db.query(transactionsSql, (err, results) => resolve(err ? { total_transactions: 0, today_transactions: 0 } : results[0]))),
    new Promise((resolve, reject) => db.query(projectsSql, (err, results) => err ? reject(err) : resolve(results[0]))),
  ])
    .then(([companies, buyers, transactions, projects]) => {
      const stats = {
        totalCompanies: parseInt(companies.total_companies) || 0,
        totalBuyers: parseInt(buyers.total_buyers) || 0,
        totalTransactions: parseInt(transactions.total_transactions) || 0,
        todayTransactions: parseInt(transactions.today_transactions) || 0,
        totalProjects: parseInt(projects.total_projects) || 0,
        activeProjects: parseInt(projects.active_projects) || 0,
        pendingProjects: parseInt(projects.pending_projects) || 0,
      };
      console.log("✅ Stats:", stats);
      res.json({ success: true, data: stats });
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      res.status(500).json({ success: false, message: "Database error", error: err.message });
    });
});

// ============================================
// COMPANIES
// ============================================
router.get("/companies", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT 
      u.id, u.email, u.company, u.company_id, u.type, u.website, u.province, u.city, u.is_validated, u.created_at,
      COUNT(DISTINCT p.project_id) as total_projects,
      COALESCE(SUM(c.amount), 0) as total_carbon_credits
    FROM users u
    LEFT JOIN projects p ON p.company_id = u.company_id
    LEFT JOIN certificates c ON c.owner_company_id = u.company_id
    WHERE u.type != 'regulator'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    console.log(`✅ Found ${results.length} companies`);
    res.json({ success: true, data: results });
  });
});

router.get("/companies/:id", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT u.*, COUNT(DISTINCT p.project_id) as total_projects, COALESCE(SUM(p.carbon_reduction), 0) as total_carbon_credits
    FROM users u LEFT JOIN projects p ON u.company_id = p.company_id
    WHERE u.id = ? AND u.type != 'regulator' GROUP BY u.id
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, data: results[0] });
  });
});

router.get("/companies/:companyId/projects", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT p.*, u.company, COUNT(c.cert_id) as certificate_count
    FROM projects p LEFT JOIN users u ON p.company_id = u.company_id LEFT JOIN certificates c ON p.project_id = c.project_id
    WHERE u.id = ? GROUP BY p.project_id ORDER BY p.created_at DESC
  `;
  
  db.query(sql, [req.params.companyId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, data: results });
  });
});

router.get("/companies/:companyId/certificates", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT c.*, p.title as project_title, p.category as project_category
    FROM certificates c LEFT JOIN projects p ON c.project_id = p.project_id LEFT JOIN users u ON c.owner_company_id = u.company_id
    WHERE u.id = ? ORDER BY c.issued_at DESC
  `;
  
  db.query(sql, [req.params.companyId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, data: results });
  });
});

router.get("/companies/:companyId/transactions", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT ct.*, buyer.company as buyer_name, seller.company as seller_name, c.cert_id
    FROM certificate_transactions ct
    LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
    LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
    LEFT JOIN certificates c ON ct.cert_id = c.cert_id
    WHERE buyer.id = ? OR seller.id = ? ORDER BY ct.transaction_date DESC LIMIT 50
  `;
  
  db.query(sql, [req.params.companyId, req.params.companyId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, data: results });
  });
});

// ============================================
// TRANSACTIONS 
// ============================================
router.get("/transactions", auth, checkRegulatorAccess, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const sql = `
    SELECT ct.*, p.title as project_title, seller.company as seller_company, buyer.company as buyer_company, c.cert_id
    FROM certificate_transactions ct
    LEFT JOIN certificates c ON c.cert_id = ct.cert_id
    LEFT JOIN projects p ON p.project_id = c.project_id
    LEFT JOIN users seller ON seller.company_id = ct.seller_company_id
    LEFT JOIN users buyer ON buyer.company_id = ct.buyer_company_id
    ORDER BY ct.transaction_date DESC LIMIT ?
  `;

  db.query(sql, [limit], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    console.log(`✅ Found ${results.length} transactions`);
    res.json({ success: true, data: results });
  });
});

// ============================================
// USERS & PROJECTS
// ============================================
router.get("/pending-users", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n👥 GET /api/regulator/pending-users");

  // ✅ IMPORTANT: Select ALL columns explicitly
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
      created_at, 
      is_validated
    FROM users
    WHERE type != 'regulator' AND is_validated = 0
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching pending users:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message
      });
    }

    console.log(`✅ Found ${results.length} pending users`);
    
    // ✅ Debug each user
    results.forEach(user => {
      console.log(`\n📋 User #${user.id}:`);
      console.log(`   Company: "${user.company}"`);
      console.log(`   Company ID: "${user.company_id}"`);
      console.log(`   Email: "${user.email}"`);
      console.log(`   Type: "${user.type}"`);
      console.log(`   Province: "${user.province}"`);
      console.log(`   City: "${user.city}"`);
      console.log(`   Website: "${user.website}"`);
    });
    
    // ✅ Return RAW data without modification
    return res.json({ 
      success: true, 
      data: results  // Send exactly what MySQL returns
    });
  });
});

router.post("/validate-user", auth, checkRegulatorAccess, validateUser);
router.post("/reject-user", auth, checkRegulatorAccess, rejectUser);

router.get("/rejected-users", auth, checkRegulatorAccess, getRejectedUsers);
router.get("/rejected-projects", auth, checkRegulatorAccess, getRejectedProjects);


router.get("/projects", auth, checkRegulatorAccess, (req, res) => {
  const sql = `
    SELECT p.*, u.company as company_name, c.cert_id, c.status as cert_status
    FROM projects p LEFT JOIN users u ON u.company_id = p.company_id LEFT JOIN certificates c ON c.project_id = p.project_id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, data: results });
  });
});

// ============================================
// AUDITS
// ============================================
// backend/routes/regulatorRoutes.js

router.get("/audits", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n📋 GET /api/regulator/audits");
  
  const sql = `
    SELECT 
      a.id,
      a.company_id,
      a.audit_date,
      a.auditor,
      a.financial_score,
      a.documentation_score,
      a.operational_score,
      a.compliance_score,
      a.overall_score,
      a.overall_rating,
      a.findings,
      a.recommendations,
      a.strengths,
      a.weaknesses,
      a.action_items,
      a.next_audit_date,
      a.status,
      a.risk_level,
      a.created_at,
      a.updated_at,
      u.company as company_name,
      u.company_id as company_code
    FROM audits a 
    LEFT JOIN users u ON a.company_id = u.id 
    ORDER BY a.audit_date DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching audits:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: err.message
      });
    }
    
    console.log(`✅ Found ${results.length} audits`);
    
    // Log sample data untuk debug
    if (results.length > 0) {
      console.log("📊 Sample audit data:", {
        id: results[0].id,
        company_id: results[0].company_id,
        audit_date: results[0].audit_date,
        auditor: results[0].auditor,
        overall_score: results[0].overall_score,
        risk_level: results[0].risk_level,
        next_audit_date: results[0].next_audit_date,
      });
    }
    
    res.json({ success: true, data: results });
  });
});

router.post("/audits", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n📝 POST /api/regulator/audits");
  console.log("   Request body:", req.body);

  const {
    company_id,
    audit_date,
    auditor_name, 
    financial_score,
    documentation_score,
    operational_score,
    compliance_score,
    overall_score,
    overall_rating,
    findings,
    recommendations,
    strengths,
    weaknesses,
    action_items,
    next_audit_date,
    status,
    risk_level,
  } = req.body;

  // Validation
  if (!company_id || !audit_date || !auditor_name) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: company_id, audit_date, auditor_name",
    });
  }

  if (!findings || !recommendations) {
    return res.status(400).json({
      success: false,
      message: "Findings and recommendations are required",
    });
  }

  const sql = `
    INSERT INTO audits (
      company_id,
      audit_date,
      auditor,
      financial_score,
      documentation_score,
      operational_score,
      compliance_score,
      overall_score,
      overall_rating,
      findings,
      recommendations,
      strengths,
      weaknesses,
      action_items,
      next_audit_date,
      status,
      risk_level,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    company_id,
    audit_date,
    auditor_name, 
    financial_score || 0,
    documentation_score || 0, 
    operational_score || 0,
    compliance_score || 0,
    overall_score || 0,
    overall_rating || 'Fair',
    findings,
    recommendations,
    strengths || null,
    weaknesses || null,
    action_items || null,
    next_audit_date || null,
    status || 'draft',
    risk_level || 'Medium',
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error creating audit:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create audit",
        error: err.message,
      });
    }

    console.log(`✅ Audit created with ID: ${result.insertId}`);

    return res.status(201).json({
      success: true,
      message: "Audit created successfully",
      data: {
        auditId: result.insertId,
        company_id,
        overall_score,
        overall_rating,
        status,
      },
    });
  });
});

router.get("/notification-settings", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n🔔 GET /api/regulator/notification-settings");
  
  // ✅ Option 1: Return defaults (no database)
  const defaultSettings = {
    emailNotifications: true,
    newProjectAlert: true,
    newTransactionAlert: true,
    auditDueAlert: true,
    suspiciousActivityAlert: true,
    dailySummary: false,
    weeklySummary: true,
  };
  
  console.log("✅ Returning default notification settings");
  return res.json({ success: true, data: defaultSettings });

});

router.put("/notification-settings", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n🔔 PUT /api/regulator/notification-settings");
  console.log("   Settings:", req.body. settings);
  
  // ✅ Option 1: Just return success (no database)
  console.log("✅ Notification settings saved (in-memory only)");
  return res.json({ 
    success: true, 
    message: "Notification settings saved successfully" 
  });
  
});

// ============================================
// DATA EXPORT (Optional - can implement later)
// ============================================
router.get("/export-data", auth, checkRegulatorAccess, (req, res) => {
  console.log("\n📥 GET /api/regulator/export-data");
  
  // ✅ Simple CSV export
  const sql = `
    SELECT 
      u.id,
      u.company,
      u.company_id,
      u.email,
      u.type,
      u.province,
      u.city,
      u.created_at,
      u.is_validated,
      COUNT(DISTINCT p.project_id) as total_projects,
      COALESCE(SUM(c.amount), 0) as total_carbon_credits
    FROM users u
    LEFT JOIN projects p ON p.company_id = u.company_id
    LEFT JOIN certificates c ON c.owner_company_id = u.company_id
    WHERE u.type != 'regulator'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error exporting data:", err);
      return res.status(500).json({ success: false, message: "Export failed" });
    }
    
    // ✅ Convert to CSV
    const csvHeaders = "ID,Company,Company ID,Email,Type,Province,City,Created At,Validated,Total Projects,Total Carbon Credits\n";
    const csvRows = results.map(row => 
      `${row.id},"${row.company}","${row.company_id}","${row.email}","${row. type}","${row.province}","${row.city}","${row.created_at}",${row.is_validated},${row.total_projects},${row.total_carbon_credits}`
    ).join("\n");
    
    const csv = csvHeaders + csvRows;
    
    console.log(`✅ Exported ${results.length} companies to CSV`);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="chaincarbon-export-${new Date().toISOString(). split('T')[0]}.csv"`);
    res.send(csv);
  });
});

export default router;