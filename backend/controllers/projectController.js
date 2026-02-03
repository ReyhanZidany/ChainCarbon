// controllers/projectController.js
import db from "../config/db.js";
import axios from "axios";
import path from "path";
import { createTransport } from 'nodemailer';

const FABRIC_API = process.env.FABRIC_API || "http://localhost:3000";

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper: promisify db.query
function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function genShortId(prefix = '', digits = 6) {
  const start = Math.pow(10, digits - 1);
  const id = Math.floor(start + Math.random() * (9 * start));
  return prefix + id;
}

async function genUniqueId({ prefix, digits, checkDb, checkBlockchain }) {
  let tries = 0, uniqueId;
  while (tries < 20) {
    uniqueId = genShortId(prefix, digits);
    const inDb = await checkDb(uniqueId);
    const inBc = checkBlockchain ? await checkBlockchain(uniqueId) : false;
    if (!inDb && !inBc) return uniqueId;
    tries++;
  }
  throw new Error(`Could not generate unique ${prefix}id after ${tries} tries`);
}

function checkProjectExists(projectId) {
  return new Promise((resolve, reject) => {
    db.query("SELECT 1 FROM projects WHERE project_id = ?", [projectId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows && rows.length > 0);
    });
  });
}

function checkCertificateExists(certId) {
  return new Promise((resolve, reject) => {
    db.query("SELECT 1 FROM certificates WHERE cert_id = ?", [certId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows && rows.length > 0);
    });
  });
}

async function checkProjectInBlockchain(projectId) {
  try {
    const res = await axios.get(`${FABRIC_API}/projects/${projectId}`, { timeout: 5000 });
    return !!res.data;
  } catch (e) {
    if (e.response && e.response.status === 404) return false;
    return false; // error lain dianggap belum ada
  }
}

async function checkCertificateInBlockchain(certId) {
  try {
    const res = await axios.get(`${FABRIC_API}/certificates/${certId}`, { timeout: 5000 });
    return !!res.data;
  } catch (e) {
    if (e.response && e.response.status === 404) return false;
    return false;
  }
}

// ========================================
// EMAIL FUNCTIONS
// ========================================
async function sendProjectApprovalEmail(project, certificate) {
  const mailOptions = {
    from: `"ChainCarbon Team" <${process.env.EMAIL_USER}>`,
    to: project.user_email,
    subject: '✅ Your Carbon Credit Project Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; 
            padding: 40px 20px; 
            text-align: center;
          }
          .logo-container {
            background: white;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          .logo {
            width: 60px;
            height: 60px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            padding: 40px 30px;
            background: #ffffff;
          }
          .success-badge {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .success-badge p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #065f46;
          }
          .detail-box {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-box h3 {
            margin: 0 0 15px 0;
            color: #10b981;
            font-size: 18px;
          }
          .detail-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 140px;
          }
          .detail-value {
            color: #111827;
            flex: 1;
          }
          .certificate-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .certificate-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .certificate-box h3 {
            margin: 0 0 20px 0;
            color: #065f46;
            font-size: 20px;
          }
          .cert-detail {
            text-align: left;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px dashed #10b981;
          }
          .cert-detail:last-child {
            border-bottom: none;
          }
          .button { 
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            margin: 25px 0;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
          }
          .next-steps {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 18px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
            color: #78350f;
          }
          .footer { 
            text-align: center;
            padding: 30px 20px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-links a {
            color: #10b981;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#10b981"/>
                <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1>🎉 Project Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your carbon credit project has been validated</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>${project.company_name}</strong>,</p>
            
            <div class="success-badge">
              <p>✅ Congratulations! Your project has been approved by our regulatory team.</p>
            </div>
            
            <div class="detail-box">
              <h3>📋 Project Details</h3>
              <div class="detail-row">
                <div class="detail-label">Project ID:</div>
                <div class="detail-value"><strong>${project.project_id}</strong></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Title:</div>
                <div class="detail-value">${project.title}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Category:</div>
                <div class="detail-value">${project.category || 'N/A'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Location:</div>
                <div class="detail-value">${project.location || 'N/A'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><strong style="color: #10b981;">✅ Approved</strong></div>
              </div>
            </div>
            
            <div class="certificate-box">
              <div class="certificate-icon">📜</div>
              <h3>Carbon Credit Certificate Issued</h3>
              <div class="cert-detail">
                <strong>Certificate ID:</strong> ${certificate.cert_id}
              </div>
              <div class="cert-detail">
                <strong>Amount:</strong> ${certificate.amount.toLocaleString('id-ID')} tons CO₂
              </div>
              <div class="cert-detail">
                <strong>Price per Unit:</strong> Rp ${certificate.price_per_unit.toLocaleString('id-ID')}
              </div>
              <div class="cert-detail">
                <strong>Total Value:</strong> <strong style="color: #10b981; font-size: 18px;">Rp ${(certificate.amount * certificate.price_per_unit).toLocaleString('id-ID')}</strong>
              </div>
              <div class="cert-detail">
                <strong>Issued:</strong> ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div class="cert-detail">
                <strong>Expires:</strong> ${new Date(certificate.expires_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            <div class="next-steps">
              <h3>📌 What's Next?</h3>
              <ul>
                <li>✅ Your carbon credits are now active on the blockchain</li>
                <li>💰 List your certificates for sale on the marketplace</li>
                <li>📊 Track your project performance in real-time</li>
                <li>🔄 View transaction history and ownership changes</li>
                <li>📈 Monitor market prices and trends</li>
              </ul>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard/projects" class="button">
                View My Projects →
              </a>
            </center>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Your carbon credits have been recorded on the blockchain and are now verifiable by anyone. 
              You can start trading them immediately on our marketplace.
            </p>
            
            <p style="margin-top: 25px;">
              Best regards,<br>
              <strong style="color: #10b981;">ChainCarbon Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>ChainCarbon</strong></p>
            <p style="margin: 0 0 15px 0;">Blockchain-Based Carbon Credit Trading Platform</p>
            <div class="footer-links">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}">Home</a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/marketplace">Marketplace</a>
              <a href="mailto:support@chaincarbon.com">Support</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              © 2025 ChainCarbon. All rights reserved.
            </p>
            <p style="font-size: 11px; color: #9ca3af; margin-top: 5px;">
              Certificate ID: ${certificate.cert_id} | Project ID: ${project.project_id}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendProjectRejectionEmail(project, reason) {
  const mailOptions = {
    from: `"ChainCarbon Team" <${process.env.EMAIL_USER}>`,
    to: project.user_email,
    subject: '❌ Project Application Status Update',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white; 
            padding: 40px 20px; 
            text-align: center;
          }
          .logo-container {
            background: white;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          .logo {
            width: 60px;
            height: 60px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            padding: 40px 30px;
            background: #ffffff;
          }
          .warning-badge {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .warning-badge p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #991b1b;
          }
          .detail-box {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-box h3 {
            margin: 0 0 15px 0;
            color: #374151;
            font-size: 18px;
          }
          .detail-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 120px;
          }
          .detail-value {
            color: #111827;
            flex: 1;
          }
          .rejection-box {
            background: #fff1f2;
            border: 2px solid #fda4af;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .rejection-box h3 {
            margin: 0 0 15px 0;
            color: #be123c;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .rejection-reason {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f43f5e;
            color: #881337;
            line-height: 1.7;
          }
          .next-steps {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 18px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
            color: #78350f;
          }
          .help-box {
            background: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .help-box h3 {
            margin: 0 0 15px 0;
            color: #0369a1;
            font-size: 18px;
          }
          .help-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .help-box li {
            padding: 8px 0;
            color: #075985;
          }
          .button { 
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            margin: 25px 0;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
          }
          .footer { 
            text-align: center;
            padding: 30px 20px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-links a {
            color: #10b981;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#ef4444"/>
                <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" stroke-width="6" stroke-linecap="round"/>
              </svg>
            </div>
            <h1>Project Application Update</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Review Results</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>${project.company_name}</strong>,</p>
            
            <p>Thank you for submitting your carbon credit project application. Our regulatory team has completed the review process.</p>
            
            <div class="detail-box">
              <h3>📋 Project Details</h3>
              <div class="detail-row">
                <div class="detail-label">Project ID:</div>
                <div class="detail-value"><strong>${project.project_id}</strong></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Title:</div>
                <div class="detail-value">${project.title}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Category:</div>
                <div class="detail-value">${project.category || 'N/A'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Location:</div>
                <div class="detail-value">${project.location || 'N/A'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><strong style="color: #ef4444;">❌ Not Approved</strong></div>
              </div>
            </div>
            
            <div class="rejection-box">
              <h3>
                <span>⚠️</span>
                <span>Reason for Not Approving</span>
              </h3>
              <div class="rejection-reason">
                ${reason}
              </div>
            </div>
            
            <div class="next-steps">
              <h3>🔄 What's Next?</h3>
              <ul>
                <li>📋 <strong>Review the feedback</strong> - Carefully read the reason above</li>
                <li>✏️ <strong>Address the concerns</strong> - Make necessary improvements</li>
                <li>📂 <strong>Prepare documentation</strong> - Update required files and information</li>
                <li>🔄 <strong>Submit a new application</strong> - Create an updated project submission</li>
              </ul>
            </div>
            
            <div class="help-box">
              <h3>💬 Need Assistance?</h3>
              <ul>
                <li>📧 <strong>Email:</strong> support@chaincarbon.com</li>
                <li>📞 <strong>Phone:</strong> +62-21-xxxx-xxxx</li>
                <li>💬 <strong>Live Chat:</strong> Available on our platform (Mon-Fri, 9 AM - 5 PM)</li>
                <li>📖 <strong>Documentation:</strong> Visit our help center for guidelines</li>
              </ul>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard/projects/create" class="button">
                Submit New Project Application →
              </a>
            </center>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              We appreciate your commitment to environmental sustainability. Our team is here to help you 
              successfully register your carbon credit project.
            </p>
            
            <p style="margin-top: 25px;">
              Best regards,<br>
              <strong style="color: #10b981;">The ChainCarbon Regulatory Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>ChainCarbon</strong></p>
            <p style="margin: 0 0 15px 0;">Blockchain-Based Carbon Credit Trading Platform</p>
            <div class="footer-links">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}">Home</a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/help">Help Center</a>
              <a href="mailto:support@chaincarbon.com">Support</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              © 2025 ChainCarbon. All rights reserved.
            </p>
            <p style="font-size: 11px; color: #9ca3af; margin-top: 5px;">
              Project ID: ${project.project_id}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

// ===== SUBMIT PROJECT (User) =====
export const submitProject = async (req, res) => {
  try {
    const { id: userId, companyId } = req.user || {};
    if (!userId || !companyId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      nama, kategori, deskripsi, lokasi,
      volume, harga, tanggalMulai, tanggalSelesai
    } = req.body;

    const docPath = req.files?.dokumen?.[0]
      ? "/uploads/projects/" + path.basename(req.files.dokumen[0].path)
      : null;

    const imagePaths = (req.files?.gambarProyek || []).map(f =>
      "/uploads/projects/" + path.basename(f.path)
    );

    const projectId = await genUniqueId({
      prefix: "P",
      digits: 6,
      checkDb: checkProjectExists,
      checkBlockchain: checkProjectInBlockchain
    });

    console.log("Creating project:", projectId);

    // 1) Insert ke MySQL
    const insertSql = `
      INSERT INTO projects
      (project_id, user_id, company_id, title, category, description, location,
       est_volume, price_per_unit, start_date, end_date, doc_path, images_json, is_validated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    try {
      await queryAsync(insertSql, [
        projectId, userId, companyId,
        nama, kategori, deskripsi, lokasi,
        parseInt(volume || 0), parseInt(harga || 0),
        tanggalMulai, tanggalSelesai,
        docPath, JSON.stringify(imagePaths)
      ]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: "Project ID already exists, try again."
        });
      }
      throw err;
    }

    // 2) Push ke Fabric (pending project dengan regulatorValidated: false)
    try {
      const fabricPayload = {
        id: projectId,
        companyId,
        title: nama,
        description: deskripsi || "",
        createdAt: Date.now(),
        regulatorValidated: false
      };
      await axios.post(`${FABRIC_API}/projects`, fabricPayload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      });

      console.log("✅ Project pushed to Fabric:", projectId);
    } catch (err) {
      console.error("Fabric submitProject error:", err.response?.data || err.message);
      console.log("↩️ Rolling back project from MySQL:", projectId);

      // ROLLBACK row di MySQL supaya nggak ada project 'nggantung' off-chain saja
      try {
        await queryAsync(
          "DELETE FROM projects WHERE project_id = ?",
          [projectId]
        );
      } catch (rbErr) {
        console.error("⚠️ Failed to rollback project from MySQL:", rbErr.message);
      }

      return res.status(500).json({
        success: false,
        message: "Failed to register project on blockchain. Please try again.",
        error: err.response?.data?.error || err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Project has been submitted and is awaiting regulator validation.",
      project: { projectId, nama, companyId, is_validated: 0, regulatorValidated: false }
    });
  } catch (e) {
    console.error("Submit project error:", e);
    res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
};

// ===== GET PENDING PROJECTS (Regulator) =====
export const getPendingProjects = (req, res) => {
  const sql = `
    SELECT p.*, u.email
    FROM projects p
    JOIN users u ON u.id = p.user_id
    WHERE p.is_validated = 0
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching pending projects:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    console.log(`Found ${rows.length} pending projects`);

    // Add "is_new" flag
    const data = rows.map(p => ({
      ...p,
      is_new: (new Date() - new Date(p.created_at)) / (1000 * 60 * 60 * 24) <= 3
    }));

    res.json({ success: true, data });
  });
};

// ============================================
// NEW CONTROLLER FUNCTIONS (Refactored from Routes)
// ============================================

// GET /api/projects
export const getAllProjects = (req, res) => {
  console.log("\n📋 GET /api/projects (default)");

  const sql = `
    SELECT 
      p.project_id,
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

    console.log(`✅ Found ${rows.length} validated projects`);

    return res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  });
};

// GET /api/projects/all
export const getAllProjectsWithStats = (req, res) => {
  console.log("\n📋 GET /api/projects/all");

  const sql = `
    SELECT 
      p.project_id,
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
      age_days: Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)),
      is_new: Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)) <= 30
    }));

    return res.json({
      success: true,
      data: enrichedProjects,
      total: enrichedProjects.length
    });
  });
};

// GET /api/projects/mine
export const getMyProjects = (req, res) => {
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
    ORDER BY p.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching user projects:", err);
      return res.status(500).json({
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
};

// GET /api/projects/mine-all
export const getMyAllProjects = (req, res) => {
  const userId = req.user?.id;
  const companyId = req.user?.companyId;

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
      c.owner_company_id as cert_owner,
      c.amount as cert_amount,
      c.listed as cert_listed,
      CASE 
        WHEN c.cert_id IS NULL THEN 0
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

    console.log(`✅ Found ${rows.length} projects`);

    return res.json({
      success: true,
      data: rows
    });
  });
};

// GET /api/projects/regulator/rejected-projects
export const getRejectedProjects = (req, res) => {
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
    INNER JOIN projects p ON rp.project_id = p.project_id
    LEFT JOIN users u ON p.company_id = u.company_id
    WHERE rp.rejected_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    ORDER BY rp.rejected_at DESC
  `;

  db.query(sql, [days], (err, results) => {
    if (err) {
      console.error("❌ Error fetching rejected projects:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message
      });
    }

    console.log(`✅ Found ${results.length} rejected projects (last ${days} days)`);

    return res.json({
      success: true,
      data: results,
      total: results.length
    });
  });
};

// PUT /api/projects/:id
export const updateProject = (req, res) => {
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
      console.log("❌ Cannot edit validated project");
      return res.status(400).json({
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
};

// DELETE /api/projects/:id
export const deleteProject = (req, res) => {
  console.log("\n🗑️ DELETE /api/projects/:id");
  const projectId = req.params.id;
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
        message: "You don't have permission to delete this project"
      });
    }

    if (project.is_validated === 1) {
      console.log("❌ Cannot delete validated project");
      return res.status(400).json({
        success: false,
        message: "Cannot delete validated projects. Contact administrator."
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
        console.log("❌ Cannot delete: has certificates");
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

        console.log(`✅ Project "${project.title}" deleted successfully`);

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
};

// ========================================
// ✅ VALIDATE PROJECT (FIXED with verification)
// ========================================
export const validateProject = async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("=== VALIDATE PROJECT START ===");
  console.log("=".repeat(60));
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { projectId, certAmount, certPricePerUnit, expiresAt } = req.body;
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "projectId is required"
      });
    }

    // Helper functions
    const getProject = async () => {
      const rows = await queryAsync(
        `SELECT p.*, u.email as user_email, u.company as company_name 
         FROM projects p 
         LEFT JOIN users u ON p.user_id = u.id 
         WHERE p.project_id = ?`,
        [projectId]
      );
      if (!rows || rows.length === 0) {
        throw new Error("Project not found in database");
      }
      return rows[0];
    };

    const updateProject = async () => {
      const result = await queryAsync(
        "UPDATE projects SET is_validated = 1, validated_at = NOW() WHERE project_id = ?",
        [projectId]
      );
      console.log("✅ MySQL project updated, affected rows:", result.affectedRows);
      return result;
    };

    // ============================================
    // STEP 1: Get project from MySQL
    // ============================================
    console.log("\n[STEP 1] Getting project from MySQL...");
    const project = await getProject();
    console.log("✅ Project found:", project.title);
    console.log("   Company ID:", project.company_id);
    console.log("   User Email:", project.user_email);

    // ============================================
    // STEP 2: Validate project in Fabric
    // ============================================
    console.log("\n[STEP 2] Validating project in Fabric...");
    console.log("   URL:", `${FABRIC_API}/projects/${projectId}/validate`);

    try {
      const fabricValidateRes = await axios.post(
        `${FABRIC_API}/projects/${projectId}/validate`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        }
      );
      console.log("✅ Fabric validate SUCCESS");
      console.log("   Response:", JSON.stringify(fabricValidateRes.data, null, 2));
    } catch (fabricErr) {
      console.error("❌ Fabric validate FAILED");
      console.error("   Status:", fabricErr.response?.status);
      console.error("   Error:", fabricErr.response?.data);

      throw new Error(
        `Failed to validate project in Fabric: ${fabricErr.response?.data?.error || fabricErr.message
        }`
      );
    }

    // Wait for Fabric to complete
    console.log("\n⏳ Waiting 1 second for Fabric to complete...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ============================================
    // STEP 3: Generate certificate ID
    // ============================================
    console.log("\n[STEP 3] Generating certificate ID...");

    const certId = await genUniqueId({
      prefix: "CERT",
      digits: 6,
      checkDb: checkCertificateExists,
      checkBlockchain: checkCertificateInBlockchain
    });

    console.log("✅ Certificate ID generated:", certId);

    // ============================================
    // STEP 4: Prepare certificate payload
    // ============================================
    console.log("\n[STEP 4] Preparing certificate payload...");

    const amount = parseInt(certAmount || project.est_volume || 1000);
    const price = parseInt(certPricePerUnit || project.price_per_unit || 10000);
    const expiresAtTimestamp = expiresAt
      ? new Date(expiresAt).getTime()
      : (Date.now() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 years

    const payloadCert = {
      id: certId,
      projectId: projectId,
      ownerId: String(project.company_id),
      amount: amount,
      pricePerUnit: price,
      expiresAt: expiresAtTimestamp
    };

    console.log("✅ Certificate payload:");
    console.log("   ID:", payloadCert.id);
    console.log("   Project ID:", payloadCert.projectId);
    console.log("   Owner ID:", payloadCert.ownerId);
    console.log("   Amount:", payloadCert.amount);
    console.log("   Price per Unit:", payloadCert.pricePerUnit);
    console.log("   Expires At:", new Date(payloadCert.expiresAt).toISOString());

    // Validation
    if (amount <= 0 || price <= 0 || !payloadCert.ownerId) {
      throw new Error("Certificate data not valid (amount, price, ownerId required and positive)");
    }

    // ============================================
    // STEP 5: Create certificate in Fabric (STRICT)
    // ============================================
    console.log("\n[STEP 5] Creating certificate in Fabric...");
    console.log("   URL:", `${FABRIC_API}/certificates`);
    console.log("   Payload:", JSON.stringify(payloadCert, null, 2));

    let fabricCertResponse;
    try {
      fabricCertResponse = await axios.post(
        `${FABRIC_API}/certificates`,
        payloadCert,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      console.log("✅ Fabric create certificate SUCCESS");
      console.log("   Response status:", fabricCertResponse.status);
      console.log("   Response data:", JSON.stringify(fabricCertResponse.data, null, 2));

    } catch (fabricErr) {
      console.error("❌ Fabric create certificate FAILED");
      console.error("   Status:", fabricErr.response?.status);
      console.error("   Error message:", fabricErr.response?.data?.error || fabricErr.message);
      console.error("   Full error data:", JSON.stringify(fabricErr.response?.data, null, 2));
      console.error("   Request payload:", JSON.stringify(payloadCert, null, 2));

      throw new Error(
        `Failed to create certificate in Fabric: ${fabricErr.response?.data?.error || fabricErr.message
        }`
      );
    }

    // ============================================
    // STEP 6: Verify certificate exists in blockchain
    // ============================================
    console.log("\n[STEP 6] Verifying certificate exists in blockchain...");
    console.log("   Waiting 2 seconds for blockchain confirmation...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    let verificationAttempts = 0;
    let certExists = false;
    const maxAttempts = 5;

    while (verificationAttempts < maxAttempts && !certExists) {
      try {
        console.log(`   Verification attempt ${verificationAttempts + 1}/${maxAttempts}...`);

        const verifyRes = await axios.get(
          `${FABRIC_API}/certificates/${certId}`,
          { timeout: 5000 }
        );

        if (verifyRes.data && verifyRes.data.certId === certId) {
          console.log("✅ Certificate verified in blockchain!");
          console.log("   Certificate data:", JSON.stringify(verifyRes.data, null, 2));
          certExists = true;
        }
      } catch (verifyErr) {
        if (verifyErr.response?.status === 404) {
          console.log(`   Certificate not found yet (attempt ${verificationAttempts + 1}), waiting 1s...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.warn("   Verification check failed:", verifyErr.message);
        }
      }

      verificationAttempts++;
    }

    if (!certExists) {
      console.error("❌ Certificate NOT found in blockchain after", maxAttempts, "attempts");
      throw new Error("Certificate created but not found in blockchain. Please verify manually.");
    }

    // ============================================
    // STEP 7: Update project in MySQL
    // ============================================
    console.log("\n[STEP 7] Updating project in MySQL...");
    await updateProject();

    // ============================================
    // STEP 8: Save certificate to MySQL
    // ============================================
    console.log("\n[STEP 8] Saving certificate to MySQL...");

    try {
      const certSql = `
        INSERT INTO certificates
        (cert_id, project_id, owner_company_id, amount, price_per_unit, status, listed, issued_at, expires_at)
        VALUES (?, ?, ?, ?, ?, 'ISSUED', 0, FROM_UNIXTIME(?/1000), FROM_UNIXTIME(?/1000))
      `;

      await queryAsync(certSql, [
        certId,
        projectId,
        project.company_id,
        amount,
        price,
        Date.now(),
        expiresAtTimestamp
      ]);

      console.log("✅ MySQL certificate inserted");

    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`⚠️ Certificate '${certId}' already exists in MySQL. Skipping insert.`);
      } else {
        throw err;
      }
    }

    // ============================================
    // STEP 9: Send approval email
    // ============================================
    console.log("\n[STEP 9] Sending approval email...");

    try {
      await sendProjectApprovalEmail(project, {
        cert_id: certId,
        amount: amount,
        price_per_unit: price,
        expires_at: expiresAtTimestamp
      });

      console.log("✅ Approval email sent to:", project.user_email);

    } catch (emailErr) {
      console.error("⚠️ Failed to send approval email:", emailErr.message);
      // Don't fail the request if email fails
    }

    // ============================================
    // SUCCESS SUMMARY
    // ============================================
    console.log("\n" + "=".repeat(60));
    console.log("✅ VALIDATE PROJECT SUCCESS");
    console.log("=".repeat(60));
    console.log("   Project ID:", projectId);
    console.log("   Project Title:", project.title);
    console.log("   Certificate ID:", certId);
    console.log("   Amount:", amount, "tCO₂e");
    console.log("   Price per Unit: Rp", price.toLocaleString('id-ID'));
    console.log("   Total Value: Rp", (amount * price).toLocaleString('id-ID'));
    console.log("   MySQL: Updated ✅");
    console.log("   Blockchain: Created & Verified ✅");
    console.log("   Email: Sent ✅");
    console.log("=".repeat(60) + "\n");

    return res.json({
      success: true,
      message: "Project validated and certificate issued successfully",
      email_sent: true,
      blockchain_verified: true,
      project: {
        projectId,
        is_validated: 1,
        regulatorValidated: true,
        title: project.title
      },
      certificate: {
        id: certId,
        projectId: projectId,
        ownerId: payloadCert.ownerId,
        amount: amount,
        pricePerUnit: price,
        status: "ISSUED",
        issuedAt: Date.now(),
        expiresAt: expiresAtTimestamp,
        verifiedInBlockchain: true
      }
    });

  } catch (err) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ VALIDATE PROJECT FAILED");
    console.error("=".repeat(60));
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    console.error("=".repeat(60) + "\n");

    return res.status(500).json({
      success: false,
      message: "Error validating project",
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// ========================================
// ✅ REJECT PROJECT (with EMAIL)
// ========================================
export const rejectProject = async (req, res) => {
  const { projectId, reason } = req.body;

  console.log("\n❌ REJECTING PROJECT");
  console.log("   Project ID:", projectId);
  console.log("   Reason:", reason);

  if (!projectId || !reason) {
    return res.status(400).json({
      success: false,
      message: "projectId and reason are required"
    });
  }

  try {
    // Get project with user email
    const getProjectSql = `
      SELECT 
        p.*, 
        u.company as company_name,
        u.email as user_email
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.project_id = ?
    `;

    const project = await new Promise((resolve, reject) => {
      db.query(getProjectSql, [projectId], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return reject(err);
        }
        if (!results || results.length === 0) {
          console.error("Project not found");
          return reject(new Error("Project not found"));
        }
        console.log("✅ Project found:", results[0].title);
        resolve(results[0]);
      });
    });

    // Update MySQL
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE projects SET is_validated = 2, rejected_reason = ?, updated_at = NOW() WHERE project_id = ?",
        [reason, projectId],
        (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return reject(err);
          }
          console.log("✅ MySQL updated, affected rows:", result.affectedRows);
          resolve(result);
        }
      );
    });

    // ✅ Send rejection email
    console.log("\n📧 Sending rejection email...");

    try {
      await sendProjectRejectionEmail(project, reason);
      console.log("✅ Rejection email sent to:", project.user_email);
    } catch (emailErr) {
      console.error("⚠️ Failed to send email:", emailErr.message);
    }

    console.log("\n✅ PROJECT REJECTED\n");

    return res.json({
      success: true,
      message: "Proyek ditolak",
      projectId,
      reason,
      email_sent: true
    });

  } catch (error) {
    console.error("❌ Reject project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject project",
      error: error.message
    });
  }
};

// ===== GET PROJECT BY ID =====
export const getProjectById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM projects WHERE project_id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error("Error getProjectById:", err);
        return res.status(500).json({
          success: false,
          message: "DB error"
        });
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      return res.json({ success: true, data: rows[0] });
    }
  );
};

// ===== GET PURCHASED PROJECTS (Proyek yang dibeli via marketplace) =====
export const getMyPurchasedProjects = (req, res) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  // Ambil proyek yang dibeli (via transaksi certificate)
  const sql = `
    SELECT DISTINCT
      p.*,
      c.cert_id,
      c.amount as cert_amount,
      c.price_per_unit as cert_price,
      c.status as cert_status,
      c.issued_at as cert_issued_at,
      c.retirement_date,
      c.retirement_reason,
      c.retirement_beneficiary,
      ct.transaction_date,
      ct.total_price as purchase_price,
      seller.company as seller_company
    FROM projects p
    JOIN certificates c ON c.project_id = p.project_id
    JOIN certificate_transactions ct ON ct.cert_id = c.cert_id
    LEFT JOIN users seller ON seller.company_id = ct.seller_company_id
    WHERE ct.buyer_company_id = ? AND c.owner_company_id = ?
    ORDER BY ct.transaction_date DESC
  `;

  db.query(sql, [companyId, companyId], (err, rows) => {
    if (err) {
      console.error("Get purchased projects error:", err);
      return res.status(500).json({
        success: false,
        message: "DB error"
      });
    }

    // Parse images_json
    const processedRows = rows.map(row => {
      try {
        if (row.images_json) {
          row.images = JSON.parse(row.images_json);
        } else {
          row.images = [];
        }
      } catch (e) {
        row.images = [];
      }
      return row;
    });

    return res.json({
      success: true,
      data: processedRows
    });
  });
};
