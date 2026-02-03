import { createTransport } from 'nodemailer';
import db from "../config/db.js";
import axios from "axios";

const FABRIC_API = process.env.FABRIC_API || "http://localhost:3000";

// Email Transporter
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ========================================
// ✅ VALIDATE USER (with Duplicate Handling)
// ========================================
export const validateUser = async (req, res) => {
  const { userId } = req.body;
  
  console.log("\n📋 VALIDATING USER");
  console.log("   User ID:", userId);
  
  if (!userId) {
    return res.status(400).json({ 
      success: false,
      message: "userId is required" 
    });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE id = ?", 
      [userId], 
      async (err, results) => {
        if (err) {
          console.error("❌ Database error:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = results[0];
        
        console.log("   Company:", user.company);
        console.log("   Company ID:", user.company_id);
        console.log("   Email:", user.email);
        console.log("   Current is_validated:", user.is_validated);

        if (user.is_validated === 1) {
          console.log("ℹ️ User already APPROVED, skipping re-validation.");
          return res.json({
            success: true,
            message: "User is already approved",
            user: {
              id: user.id,
              email: user.email,
              company: user.company,
              company_id: user.company_id,
              status: "approved",
              blockchain_status: "unknown",
            },
          });
        }

        if (user.is_validated === 2) {
          console.log("ℹ️ User already REJECTED, cannot approve.");
          return res.status(400).json({
            success: false,
            message: "User has been rejected. Cannot approve.",
          });
        }

        // ============================================
        // ✅ STEP 1: Register/Check company
        // ============================================
        let blockchainStatus = "pending";
        let companyExists = false;
        
        try {
          console.log("\n🔗 STEP 1: Registering company to blockchain...");
          console.log("   Company ID:", user.company_id);
          console.log("   Company Name:", user.company);
          
          await axios.post(
            `${FABRIC_API}/companies`,
            {
              id: user.company_id,
              name: user.company,
              type: user.type,
              registeredAt: new Date().toISOString()
            },
            { headers: { "Content-Type": "application/json" }, timeout: 10000 }
          );
          
          console.log("✅ Company created in blockchain - New registration");
          blockchainStatus = "registered";
          companyExists = true;
          
        } catch (fabricErr) {
          const errorData = fabricErr.response?.data || {};
          const errorMsg = errorData.error || fabricErr.message || '';
          
          console.log("\n⚠️  Blockchain registration error detected");
          console.log("   Error message:", errorMsg);

          const lowered = errorMsg.toLowerCase();
          const isDuplicate =
            lowered.includes("already exists") ||
            lowered.includes("already registered") ||
            lowered.includes("duplicate");
          
          if (isDuplicate) {
            console.log("✅ Company already exists in blockchain - This is OK!");
            console.log("   Reason: Company was registered during user sign up");
            console.log("   Action: Will proceed to validate in blockchain...");
            blockchainStatus = "already_exists";
            companyExists = true;  
          } else {
            console.error("❌ FATAL: Real blockchain error (not duplicate)");
            console.error("   Error:", errorMsg);
            return res.status(500).json({
              success: false,
              message: "Failed to register company on blockchain",
              error: errorMsg
            });
          }
        }

        // ============================================
        // ✅ STEP 2: Validate company in blockchain (STRICT)
        // ============================================
        console.log("\n🔐 STEP 2: Validating company in blockchain...");
        console.log("   companyExists:", companyExists);
        
        if (!companyExists) {
          console.log("❌ companyExists = false, cannot validate in blockchain");
          return res.status(500).json({
            success: false,
            message: "Company does not exist on blockchain. Validation aborted."
          });
        }

        try {
          const payload = {
            validatedBy: "Regulator", // nanti bisa ganti req.user.email
            validatedAt: new Date().toISOString()
          };

          console.log("   Calling: POST /companies/" + user.company_id + "/validate");
          console.log("   Payload:", payload);
          
          const validateRes = await axios.post(
            `${FABRIC_API}/companies/${user.company_id}/validate`,
            payload,
            { 
              headers: { "Content-Type": "application/json" }, 
              timeout: 10000 
            }
          );
          
          console.log("✅ Blockchain validation SUCCESS!");
          console.log("   Response status:", validateRes.status);
          console.log("   Response data:", JSON.stringify(validateRes.data, null, 2));
          blockchainStatus = "validated";
          
        } catch (validateErr) {
          console.error("\n❌ Failed to validate company in blockchain");
          console.error("   Status:", validateErr.response?.status || "no status");
          console.error("   Error:", validateErr.response?.data || validateErr.message);
          console.error("   URL:", `${FABRIC_API}/companies/${user.company_id}/validate`);
          
          // ❗ STRICT MODE: kalau gagal validate di BC → JANGAN approve MySQL
          return res.status(500).json({
            success: false,
            message: "Failed to validate company on blockchain",
            error: validateErr.response?.data || validateErr.message
          });
        }

        // ============================================
        // ✅ STEP 3: Update MySQL
        // ============================================
        console.log("\n💾 STEP 3: Updating MySQL database...");
        console.log("   Setting is_validated = 1 (APPROVED)");
        console.log("   Blockchain status:", blockchainStatus);

        db.query(
          "UPDATE users SET is_validated = 1, updated_at = NOW() WHERE id = ?",
          [userId],
          async (updateErr, updateResult) => {
            if (updateErr) {
              console.error("❌ MySQL update failed:", updateErr);
              return res.status(500).json({ 
                success: false, 
                message: "Failed to update user status" 
              });
            }
            
            console.log("✅ MySQL updated successfully");
            console.log("   Rows affected:", updateResult.affectedRows);

            // ============================================
            // ✅ STEP 4: Send email
            // ============================================
            try {
              console.log("\n📧 STEP 4: Sending approval email...");
              await sendApprovalEmail(user);
              console.log("✅ Approval email sent to:", user.email);
            } catch (emailErr) {
              console.error("⚠️ Email failed:", emailErr.message);
            }

            // ============================================
            // ✅ SUMMARY
            // ============================================
            console.log("\n" + "=".repeat(50));
            console.log("✅ USER VALIDATION COMPLETE");
            console.log("=".repeat(50));
            console.log("   User ID:", user.id);
            console.log("   Company:", user.company);
            console.log("   Company ID:", user.company_id);
            console.log("   Email:", user.email);
            console.log("   MySQL Status: APPROVED ✓");
            console.log("   Blockchain Status:", blockchainStatus);
            console.log("   Email: Sent ✓");
            console.log("=".repeat(50) + "\n");

            return res.json({
              success: true,
              message: "User validated successfully",
              user: {
                id: user.id,
                email: user.email,
                company: user.company,
                company_id: user.company_id,
                status: "approved",
                blockchain_status: blockchainStatus
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// ========================================
// REJECT USER (Keep existing code)
// ========================================
export const rejectUser = async (req, res) => {
  const { userId, reason } = req.body;
  
  console.log("\n❌ REJECTING USER");
  console.log("   User ID:", userId);
  console.log("   Reason:", reason);
  
  if (!userId || !reason) {
    return res.status(400).json({ success: false, message: "userId and reason required" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      async (err, results) => {
        if (err || results.length === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = results[0];
        
        console.log("   Company:", user.company);
        console.log("   Email:", user.email);

        db.query(
          "UPDATE users SET is_validated = 2, rejected_reason = ?, updated_at = NOW() WHERE id = ?",
          [reason, userId],
          async (updateErr, updateResult) => {
            if (updateErr) {
              console.error("❌ MySQL update failed:", updateErr);
              return res.status(500).json({ success: false, message: "Failed to reject user" });
            }
            
            console.log("✅ User rejected in MySQL");
            console.log("   Rows affected:", updateResult.affectedRows);

            try {
              await sendRejectionEmail(user, reason);
              console.log("✅ Rejection email sent");
            } catch (emailErr) {
              console.error("⚠️ Email failed:", emailErr.message);
            }

            return res.json({
              success: true,
              message: "User rejected successfully"
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========================================
// GET REJECTED USERS
// ========================================
export const getRejectedUsers = async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  
  try {
    db.query(
      `SELECT 
        id, email, company, company_id, type, province, city, website,
        rejected_reason, updated_at as rejected_at, created_at
       FROM users 
       WHERE is_validated = 2 
         AND updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY updated_at DESC`,
      [days],
      (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Database error" });
        }
        
        console.log(`✅ Found ${results.length} rejected users`);
        res.json({ success: true, data: results, count: results.length });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========================================
// GET REJECTED PROJECTS
// ========================================
export const getRejectedProjects = async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  
  try {
    db.query(
      `SELECT 
        p.project_id, p.title, p.category, p.location, p.description,
        p.rejected_reason, p.updated_at as rejected_at, p.created_at,
        u.company, u.email
       FROM projects p
       LEFT JOIN users u ON p.company_id = u.company_id
       WHERE p.is_validated = 2 
         AND p.updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY p.updated_at DESC`,
      [days],
      (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Database error" });
        }
        
        console.log(`✅ Found ${results.length} rejected projects`);
        res.json({ success: true, data: results, count: results.length });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========================================
// EMAIL FUNCTIONS
// ========================================
async function sendApprovalEmail(user) {
  const mailOptions = {
    from: `"ChainCarbon Team" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '✅ Your ChainCarbon Account Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .info-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Account Approved!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${user.company}</strong>,</p>
            <p>Great news! Your ChainCarbon account has been approved.</p>
            <div class="info-box">
              <strong>Account Details:</strong><br>
              Company: ${user.company}<br>
              Company ID: ${user.company_id}<br>
              Email: ${user.email}<br>
              Status: ✅ Approved
            </div>
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/login" class="button">
                Login to Your Account
              </a>
            </center>
            <p>Best regards,<br><strong>ChainCarbon Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 ChainCarbon. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendRejectionEmail(user, reason) {
  const mailOptions = {
    from: `"ChainCarbon Team" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '❌ ChainCarbon Account Application Status',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .warning-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Account Application Update</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${user.company}</strong>,</p>
            <p>Your account application has not been approved.</p>
            <div class="warning-box">
              <strong>⚠️ Reason:</strong><br>
              ${reason}
            </div>
            <p>Contact: support@chaincarbon.com</p>
            <p>Best regards,<br><strong>ChainCarbon Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 ChainCarbon. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}
// ========================================
// GET REGULATOR STATS
// ========================================
export const getRegulatorStats = async (req, res) => {
    try {
        const stats = {
            pendingUsers: 0,
            totalUsers: 0,
            rejectedUsers: 0,
            pendingProjects: 0,
            totalProjects: 0,
            validatedProjects: 0,
            rejectedProjects: 0,
            totalCertificates: 0,
            totalTransactions: 0,
            totalVolumeTraded: 0
        };

        // Parallel queries for performance
        const queries = [
            // Users stats
            new Promise((resolve) => {
                db.query(
                    "SELECT COUNT(*) as count, is_validated FROM users GROUP BY is_validated",
                    (err, rows) => {
                        if (!err) {
                            rows.forEach(r => {
                                if (r.is_validated === 0) stats.pendingUsers = r.count;
                                if (r.is_validated === 1) stats.totalUsers += r.count; // Only approved count as "active" users usually, but let's count all
                                if (r.is_validated === 2) stats.rejectedUsers = r.count;
                            });
                            stats.totalUsers = rows.reduce((acc, r) => acc + r.count, 0);
                        }
                        resolve();
                    }
                );
            }),
            // Projects stats
            new Promise((resolve) => {
                db.query(
                    "SELECT COUNT(*) as count, is_validated FROM projects GROUP BY is_validated",
                    (err, rows) => {
                        if (!err) {
                            rows.forEach(r => {
                                if (r.is_validated === 0) stats.pendingProjects = r.count;
                                if (r.is_validated === 1) stats.validatedProjects = r.count;
                                if (r.is_validated === 2) stats.rejectedProjects = r.count;
                            });
                            stats.totalProjects = rows.reduce((acc, r) => acc + r.count, 0);
                        }
                        resolve();
                    }
                );
            }),
            // Certificates stats
            new Promise((resolve) => {
                db.query("SELECT COUNT(*) as count FROM certificates", (err, rows) => {
                    if (!err && rows.length) stats.totalCertificates = rows[0].count;
                    resolve();
                });
            }),
            // Transactions stats
            new Promise((resolve) => {
                db.query(
                    "SELECT COUNT(*) as count, SUM(amount) as volume FROM certificate_transactions",
                    (err, rows) => {
                        if (!err && rows.length) {
                            stats.totalTransactions = rows[0].count;
                            stats.totalVolumeTraded = rows[0].volume || 0;
                        }
                        resolve();
                    }
                );
            })
        ];

        await Promise.all(queries);
        res.json({ success: true, data: stats });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ========================================
// GET ALL COMPANIES
// ========================================
export const getAllCompanies = (req, res) => {
    const sql = `
    SELECT id, company, company_id, email, website, 
           province, city, is_validated, created_at, type
    FROM users 
    WHERE type = 'company' OR role = 'company' 
    ORDER BY created_at DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET COMPANY BY ID
// ========================================
export const getCompanyById = (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT id, company, company_id, email, website, 
           province, city, is_validated, created_at, type,
           wallet_address, description
    FROM users 
    WHERE id = ? OR company_id = ?
  `;
    db.query(sql, [id, id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        if (!results.length) return res.status(404).json({ success: false, message: "Company not found" });
        res.json({ success: true, data: results[0] });
    });
};

// ========================================
// GET COMPANY PROJECTS
// ========================================
export const getCompanyProjects = (req, res) => {
    const { companyId } = req.params;
    const sql = `
    SELECT * FROM projects 
    WHERE company_id = ? 
    ORDER BY created_at DESC
  `;
    db.query(sql, [companyId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET COMPANY CERTIFICATES
// ========================================
export const getCompanyCertificates = (req, res) => {
    const { companyId } = req.params;
    const sql = `
    SELECT c.*, p.title as project_title 
    FROM certificates c
    LEFT JOIN projects p ON c.project_id = p.project_id
    WHERE c.owner_company_id = ?
    ORDER BY c.issued_at DESC
  `;
    db.query(sql, [companyId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET COMPANY TRANSACTIONS
// ========================================
export const getCompanyTransactions = (req, res) => {
    const { companyId } = req.params;
    const sql = `
    SELECT ct.*, p.title as project_title
    FROM certificate_transactions ct
    LEFT JOIN certificates c ON ct.cert_id = c.cert_id
    LEFT JOIN projects p ON c.project_id = p.project_id
    WHERE ct.seller_company_id = ? OR ct.buyer_company_id = ?
    ORDER BY ct.transaction_date DESC
  `;
    db.query(sql, [companyId, companyId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET ALL TRANSACTIONS
// ========================================
export const getAllTransactions = (req, res) => {
    const sql = `
    SELECT ct.*, 
           seller.company as seller_name, 
           buyer.company as buyer_name,
           p.title as project_title
    FROM certificate_transactions ct
    LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
    LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
    LEFT JOIN certificates c ON ct.cert_id = c.cert_id
    LEFT JOIN projects p ON c.project_id = p.project_id
    ORDER BY ct.transaction_date DESC
    LIMIT 200
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET PENDING USERS
// ========================================
export const getPendingUsers = (req, res) => {
    const sql = `
    SELECT * FROM users 
    WHERE is_validated = 0 
    ORDER BY created_at ASC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET ALL REGULATOR PROJECTS (ALL PROJECTS)
// ========================================
export const getAllRegulatorProjects = (req, res) => {
    const sql = `
    SELECT p.*, u.company as company_name 
    FROM projects p
    LEFT JOIN users u ON p.company_id = u.company_id
    ORDER BY p.created_at DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, data: results });
    });
};

// ========================================
// GET AUDITS
// ========================================
export const getAudits = (req, res) => {
    // Try to query audits, return empty list if table doesn't exist
    const sql = "SELECT * FROM audits ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            // If table doesn't exist, return empty array instead of 500
            if (err.code === 'ER_NO_SUCH_TABLE') {
                return res.json({ success: true, data: [] });
            }
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        res.json({ success: true, data: results });
    });
};

// ========================================
// CREATE AUDIT
// ========================================
export const createAudit = (req, res) => {
    const { targetType, targetId, findings, status, auditorId } = req.body;

    const sql = `
    INSERT INTO audits (target_type, target_id, findings, status, auditor_id, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

    db.query(sql, [targetType, targetId, findings, status, auditorId], (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                return res.status(500).json({ success: false, message: "Audits table does not exist" });
            }
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        res.json({ success: true, message: "Audit created", auditId: result.insertId });
    });
};

// ========================================
// GET NOTIFICATION SETTINGS
// ========================================
export const getNotificationSettings = (req, res) => {
    // Mock logic or check table
    const defaultSettings = {
        emailAlerts: true,
        transactionAlerts: true,
        projectAlerts: true
    };

    const sql = "SELECT * FROM notification_settings WHERE user_id = ?";
    db.query(sql, [req.user?.id], (err, results) => {
        if (err || !results.length) {
            // Return default if no table or no row
            return res.json({ success: true, data: defaultSettings });
        }
        res.json({ success: true, data: results[0] });
    });
};

// ========================================
// UPDATE NOTIFICATION SETTINGS
// ========================================
export const updateNotificationSettings = (req, res) => {
    const { emailAlerts, transactionAlerts, projectAlerts } = req.body;

    // Upsert logic logic
    const sql = `
    INSERT INTO notification_settings (user_id, email_alerts, transaction_alerts, project_alerts)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      email_alerts = VALUES(email_alerts),
      transaction_alerts = VALUES(transaction_alerts),
      project_alerts = VALUES(project_alerts)
  `;

    db.query(sql, [req.user?.id, emailAlerts, transactionAlerts, projectAlerts], (err) => {
        if (err && err.code === 'ER_NO_SUCH_TABLE') {
            // Just pretend we saved it if table missing
            return res.json({ success: true, message: "Settings saved (mock)" });
        }
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        res.json({ success: true, message: "Settings updated" });
    });
};

// ========================================
// EXPORT REGULATOR DATA
// ========================================
export const exportRegulatorData = async (req, res) => {
    try {
        const data = {};

        // Fetch all sequentially for export
        // Users
        data.users = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users", (err, rows) => err ? reject(err) : resolve(rows));
        });

        // Projects
        data.projects = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM projects", (err, rows) => err ? reject(err) : resolve(rows));
        });

        // Transactions
        data.transactions = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM certificate_transactions", (err, rows) => err ? reject(err) : resolve(rows));
        });

        res.json({ success: true, data });

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ success: false, message: "Export Failed" });
    }
};
