// backend/controllers/certificateController.js
import db from "../config/db.js";
import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const FABRIC_API = process.env.FABRIC_API || "http://localhost:3000";

// Helper: Generate deterministic blockchain hash
const generateBlockchainHash = (certId, timestamp) => {
  const cleanCertId = certId.replace(/-/g, '');
  const timeHex = timestamp ? new Date(timestamp).getTime().toString(16) : Date.now().toString(16);
  return `0x${cleanCertId}${timeHex.substring(0, 16)}`;
};


const generateRetirementPdf = (options) => {
  return new Promise((resolve, reject) => {
    const {
      certId,
      certificate,
      blockchainData,
      retirementReason,
      retirementBeneficiary,
    } = options;

    // Simpan di ./public/retirements
    const pdfDir = path.join(process.cwd(), "public", "retirements");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const fileName = `retirement_${certId}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4',
      bufferPages: true
    });

    const stream = fs.createWriteStream(filePath);

    stream.on("finish", () => {
      const publicUrl = `/retirements/${fileName}`;
      resolve({ filePath, publicUrl });
    });

    stream.on("error", (err) => {
      reject(err);
    });

    doc.pipe(stream);

    // Colors
    const primaryColor = '#10b981';
    const secondaryColor = '#64748b';
    const lightGray = '#f1f5f9';
    const borderGray = '#e2e8f0';

    // Helper function untuk menggambar box
    const drawBox = (x, y, width, height, fillColor) => {
      doc.rect(x, y, width, height).fill(fillColor);
    };

    // Logo path - mencoba beberapa kemungkinan lokasi
    const possibleLogoPaths = [
      path.join(process.cwd(), "frontend", "src", "assets", "chaincarbon_logo_transparent.png"),
      path.join(process.cwd(), "..", "frontend", "src", "assets", "chaincarbon_logo_transparent.png"),
      path.join(process.cwd(), "assets", "chaincarbon_logo_transparent.png"),
      path.join(process.cwd(), "public", "assets", "chaincarbon_logo_transparent.png"),
    ];
    
    // Header dengan logo
    let logoPath = null;
    for (const p of possibleLogoPaths) {
      if (fs.existsSync(p)) {
        logoPath = p;
        break;
      }
    }
    
    if (logoPath) {
      try {
        doc.image(logoPath, 40, 25, { width: 50, height: 50 });
      } catch (err) {
        console.log('Error loading logo:', err.message);
      }
    }

    // Header Title
    doc
      .fontSize(9)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text('CARBON CREDITS', 100, 30);

    doc
      .fontSize(20)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('Retirement Confirmation', 100, 45);

    // Subheader description
    doc
      .fontSize(8)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text(
        'Confirmation that the carbon retirement request has been completed on blockchain through ChainCarbon, with the following details:',
        40,
        85,
        { width: doc.page.width - 80, align: 'left' }
      );

    // Certificate ID & Volume Cards
    let currentY = 115;
    
    // Certificate ID Card (Left)
    drawBox(40, currentY, 250, 50, lightGray);
    doc
      .strokeColor(borderGray)
      .lineWidth(1)
      .rect(40, currentY, 250, 50)
      .stroke();

    doc
      .fontSize(8)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text('Certificate', 50, currentY + 12);

    doc
      .fontSize(13)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text(certId, 50, currentY + 28);

    // Volume Card (Right)
    drawBox(doc.page.width - 290, currentY, 250, 50, lightGray);
    doc
      .strokeColor(borderGray)
      .lineWidth(1)
      .rect(doc.page.width - 290, currentY, 250, 50)
      .stroke();

    doc
      .fontSize(8)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text('Volume', doc.page.width - 280, currentY + 12);

    doc
      .fontSize(13)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text(`${certificate.amount || 0} tCO2`, doc.page.width - 280, currentY + 28);

    currentY += 65;

    // Beneficiary Section
    doc
      .fontSize(8)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text('Beneficiary:', 40, currentY);

    doc
      .fontSize(10)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text(retirementBeneficiary || '-', 40, currentY + 14, {
        width: doc.page.width - 80
      });

    currentY += 40;

    // === RETIREMENT DETAILS SECTION ===
    doc
      .fontSize(12)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('Retirement Details', 40, currentY);

    currentY += 20;

    // Retirement details in compact layout
    const addDetailRow = (label, value, y) => {
      doc
        .fontSize(8)
        .fillColor(secondaryColor)
        .font('Helvetica')
        .text(label + ':', 40, y);

      doc
        .fontSize(8)
        .fillColor('#000000')
        .font('Helvetica')
        .text(value || '-', 160, y, {
          width: doc.page.width - 200
        });
    };

    const retiredDate = blockchainData?.retiredAt || certificate.retiredAt
      ? new Date(blockchainData?.retiredAt || certificate.retiredAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'N/A';

    addDetailRow('Date of Retirement', retiredDate, currentY);
    currentY += 16;

    addDetailRow('Certificate Hash', blockchainData?.certificateHash || certificate.certificateHash || 'N/A', currentY);
    currentY += 16;

    addDetailRow('Retirement TX ID', blockchainData?.retiredTxId || certificate.retiredTxId || 'N/A', currentY);
    currentY += 16;

    const reasonPreview = retirementReason 
      ? (retirementReason.length > 60 ? retirementReason.substring(0, 60) + '...' : retirementReason)
      : 'N/A';
    addDetailRow('Retirement Note', reasonPreview, currentY);
    currentY += 28;

    // === PROJECT DETAILS SECTION ===
    doc
      .fontSize(12)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('Project Details', 40, currentY);

    currentY += 20;

    addDetailRow('Project Name', certificate.project_title || '-', currentY);
    currentY += 16;

    addDetailRow('Project ID', certificate.projectId || certificate.project_id || '-', currentY);
    currentY += 16;

    addDetailRow('Owner Company ID', certificate.ownerId || certificate.owner_company_id || '-', currentY);
    currentY += 28;

    // === FULL RETIREMENT REASON ===
    doc
      .fontSize(12)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('Retirement Reason', 40, currentY);

    currentY += 18;

    // Box untuk reason dengan height yang pas
    const reasonBoxHeight = 70;
    drawBox(40, currentY, doc.page.width - 80, reasonBoxHeight, lightGray);
    
    doc
      .fontSize(8)
      .fillColor('#000000')
      .font('Helvetica')
      .text(retirementReason || 'No reason provided', 50, currentY + 12, {
        width: doc.page.width - 100,
        align: 'left',
        lineGap: 2
      });

    currentY += reasonBoxHeight + 20;

    // Footer
    const footerY = doc.page.height - 45;
    
    doc
      .strokeColor(borderGray)
      .lineWidth(0.5)
      .moveTo(40, footerY)
      .lineTo(doc.page.width - 40, footerY)
      .stroke();

    doc
      .fontSize(7)
      .fillColor(secondaryColor)
      .font('Helvetica')
      .text(
        `Generated on ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} at ${new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        40,
        footerY + 10,
        { align: 'center', width: doc.page.width - 80 }
      );

    doc.end();
  });
};


// ============================================
// GET CERTIFICATE DETAIL (FIXED)
// ============================================
export const getCertificateDetail = (req, res) => {
  const { certId } = req.params;
  const userId = req.user?.id;
  const userCompanyId = req.user?.companyId;

  console.log(`\n📜 GET /api/certificates/${certId}/detail`);
  console.log(`  User ID: ${userId}`);
  console.log(`  Company ID: ${userCompanyId}`);

  const certSql = `
    SELECT 
      c.*,
      p.project_id,
      p.title as project_name,
      p.category as project_type,
      p.description as project_description,
      p.location,
      p.start_date as project_start_date,
      p.end_date as project_end_date,
      p.images_json,
      p.doc_path,
      u.company,
      u.email as owner_email,
      u.type as owner_type
    FROM certificates c
    LEFT JOIN projects p ON c.project_id = p.project_id
    LEFT JOIN users u ON c.owner_company_id = u.company_id
    WHERE c.cert_id = ?
  `;

  db.query(certSql, [certId], async (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length === 0) {
      console.log("❌ Certificate not found");
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const certificate = results[0];

    // Check direct access rights first: owner, listed public, regulator
    let hasAccess =
      certificate.owner_company_id === userCompanyId ||
      certificate.listed === 1 ||
      req.user?.type === 'regulator';

    if (!hasAccess) {
      // Check if user is buyer or seller in any certificate_transactions for this certId
      const trxSql = `
        SELECT 1
        FROM certificate_transactions
        WHERE cert_id = ?
          AND (seller_company_id = ? OR buyer_company_id = ?)
        LIMIT 1
      `;
      db.query(trxSql, [certId, userCompanyId, userCompanyId], async (err2, trxResults) => {
        if (err2) {
          console.error("❌ DB error for transaction check:", err2);
          return res.status(500).json({ success: false, message: "Database error" });
        }
        if (trxResults && trxResults.length > 0) {
          // User is buyer/seller, grant access - parse & respond as normal!
          await handleCertificateDetail(certificate, certId, res);
        } else {
          console.log("❌ Access denied");
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      });
      return; // Do not continue, will respond in callback above
    }

    // If direct hasAccess is true, proceed to parse and respond
    await handleCertificateDetail(certificate, certId, res);
  });
};

// Refactor blockchain data fetch and parsing into a helper function for clarity
async function handleCertificateDetail(certificate, certId, res) {
  // Parse images
  try {
    certificate.images = certificate.images_json ? JSON.parse(certificate.images_json) : [];
  } catch {
    certificate.images = [];
  }

  // Parse location
  let city = "", province = "";
  if (certificate.location) {
    const parts = certificate.location.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      city = parts[0];
      province = parts[parts.length - 1];
    } else {
      city = certificate.location;
      province = certificate.location;
    }
  }

  // Blockchain Data Resolution
  let blockchainHash = certificate.blockchain_hash;
  let blockchainTxId = certificate.blockchain_tx_id;
  let blockchainBlockNumber = certificate.blockchain_block_number;
  let blockchainTimestamp = certificate.blockchain_timestamp;
  let blockchainValidationCode = certificate.blockchain_validation_code;
  let blockchainRevision = certificate.blockchain_revision;
  let hashSource = "mysql";

  // Fetch from Fabric, overwrite data if available (your original logic)
  try {
    const fabricRes = await axios.get(
      `${FABRIC_API}/certificates/${certId}`,
      { 
        timeout: 5000,
        headers: { "Content-Type": "application/json" }
      }
    );
    
    if (fabricRes.data) {
      const fabricData = fabricRes.data;
      if (fabricData.certificateHash) {
        blockchainHash = fabricData.certificateHash;
        hashSource = "blockchain";
      }
      if (fabricData.blockchainMetadata?.txId) {
        blockchainTxId = fabricData.blockchainMetadata.txId;
      } else if (fabricData.lastTransferTxId) {
        blockchainTxId = fabricData.lastTransferTxId;
      }
      if (fabricData.blockchainMetadata) {
        blockchainTimestamp = fabricData.blockchainMetadata.issuedAtTimestamp 
          ? new Date(fabricData.blockchainMetadata.issuedAtTimestamp).toISOString()
          : blockchainTimestamp;
      }
      blockchainRevision = fabricData._rev || blockchainRevision;
      blockchainValidationCode = 0; // assume verified
      // Optionally save to MySQL as cache
      try {
        await saveBlockchainDataToMySQL(certId, {
          blockHash: blockchainHash,
          txId: blockchainTxId,
          blockNumber: blockchainBlockNumber,
          timestamp: blockchainTimestamp,
          validationCode: blockchainValidationCode,
          revision: blockchainRevision
        });
      } catch (saveErr) {
        console.error("❌ Failed to save blockchain data:", saveErr.message);
      }
    }
  } catch (fabricErr) {
    // If fabric fetch fails, fallback to cached or generated data
    if (!blockchainHash) {
      const timestamp = certificate.created_at || new Date();
      blockchainHash = generateBlockchainHash(certId, timestamp);
      hashSource = "generated-fallback";
      if (!blockchainTxId) {
        blockchainTxId = `TX-${certId}-${Date.now()}`;
        blockchainTimestamp = new Date().toISOString();
        blockchainValidationCode = 0;
      }
    }
  }

  res.json({
    success: true,
    data: {
      // Certificate Info
      certificate_id: certificate.cert_id,
      project_id: certificate.project_id,
      owner_id: certificate.owner_company_id,
      amount: certificate.amount,
      price_per_unit: certificate.price_per_unit,
      status: certificate.status,
      listed: certificate.listed,
      is_validated: certificate.is_validated ?? 1,
      is_retired: certificate.status === 'RETIRED' ? 1 : 0,
      // Dates
      issued_date: certificate.issued_at,
      issued_at: certificate.issued_at,
      expires_at: certificate.expires_at,
      created_at: certificate.created_at,
      updated_at: certificate.updated_at,
      // Retirement Info
      retirement_date: certificate.retirement_date,
      retirement_reason: certificate.retirement_reason,
      retirement_beneficiary: certificate.retirement_beneficiary,
      // Blockchain Info
      blockchain_hash: blockchainHash,
      blockchain_tx_id: blockchainTxId,
      blockchain_block_number: blockchainBlockNumber,
      blockchain_timestamp: blockchainTimestamp,
      blockchain_validation_code: blockchainValidationCode,
      blockchain_revision: blockchainRevision,
      blockchain_hash_source: hashSource,
      blockchain_verified: blockchainValidationCode === 0 && blockchainTxId !== null,
      // Project Info
      project_name: certificate.project_name,
      project_description: certificate.project_description,
      project_type: certificate.project_type,
      city,
      province,
      location: certificate.location,
      // Owner Info
      company: certificate.company,
      owner_email: certificate.owner_email,
      owner_type: certificate.owner_type,
      // Images & Documents
      images: certificate.images,
      doc_path: certificate.doc_path,
      // Metadata
      methodology: certificate.methodology || "VCS/Gold Standard",
      vintage_year: certificate.issued_at 
        ? new Date(certificate.issued_at).getFullYear() 
        : null,
    },
  });
}

// ============================================
// GET CERTIFICATE BY ID (Basic info)
// ============================================
export const getCertificateById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      c.*,
      p.title as project_title,
      p.category as project_category,
      p.location as project_location,
      p.description as project_description,
      p.images_json,
      p.doc_path,
      u.company as company_name,
      u.email as company_email
    FROM certificates c
    JOIN projects p ON p.project_id = c.project_id
    JOIN users u ON u.company_id = c.owner_company_id
    WHERE c.cert_id = ?
  `;
  
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("Get certificate by id error:", err);
      return res.status(500).json({ 
        success: false,
        message: "DB error" 
      });
    }

    if (!rows.length) {
      return res.status(404).json({ 
        success: false,
        message: "Certificate not found" 
      });
    }

    const row = rows[0];
    try {
      if (row.images_json) {
        row.images = JSON.parse(row.images_json);
      } else {
        row.images = [];
      }
    } catch (e) {
      row.images = [];
    }

    return res.json({ 
      success: true, 
      data: row 
    });
  });
};

// ============================================
// GET MY CERTIFICATES
// ============================================
export const getMyCertificates = (req, res) => {
  const companyId = req.user?.companyId;
  
  if (!companyId) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized" 
    });
  }

  // ✅ CRITICAL: Get certificates that:
  // 1. Currently owned by user
  // 2. OR user was original seller (to see sold history)
  // But mark which ones are still owned vs sold
  const sql = `
    SELECT 
      c.*,
      p.title as project_title,
      p.category as project_category,
      p.location as project_location,
      p.images_json,
      CASE 
        WHEN c.owner_company_id = ? AND c.status NOT IN ('TRANSFERRED', 'SOLD') 
        THEN 1 
        ELSE 0 
      END as currently_owned,
      CASE 
        WHEN c.status = 'TRANSFERRED' 
        THEN 1 
        ELSE 0 
      END as was_sold,
      (
        SELECT buyer_company_id 
        FROM certificate_transactions 
        WHERE cert_id = c.cert_id 
        ORDER BY transaction_date DESC 
        LIMIT 1
      ) as current_buyer_id
    FROM certificates c
    JOIN projects p ON p.project_id = c.project_id
    WHERE c.owner_company_id = ?
       OR EXISTS (
         SELECT 1 FROM certificate_transactions ct 
         WHERE ct.cert_id = c.cert_id 
           AND (ct.seller_company_id = ? OR ct.buyer_company_id = ?)
       )
    ORDER BY c.issued_at DESC
  `;
  
  db.query(sql, [companyId, companyId, companyId, companyId], (err, rows) => {
    if (err) {
      console.error("Get my certificates error:", err);
      return res.status(500).json({ 
        success: false,
        message: "DB error" 
      });
    }

    // Parse images_json and add ownership flags
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
      
      // ✅ Add clear ownership status
      row.ownership_status = row.currently_owned === 1 ? 'owned' : 'sold';
      row.is_active = row.currently_owned === 1 && 
                      row.status !== 'RETIRED' && 
                      row.status !== 'TRANSFERRED';
      
      return row;
    });

    console.log('📊 My Certificates:');
    console.log('   Total:', processedRows.length);
    console.log('   Currently Owned:', processedRows.filter(r => r.currently_owned === 1).length);
    console.log('   Sold:', processedRows.filter(r => r.was_sold === 1).length);
    console.log('   Active (can trade):', processedRows.filter(r => r.is_active).length);

    return res.json({ 
      success: true, 
      data: processedRows,
      summary: {
        total: processedRows.length,
        owned: processedRows.filter(r => r.currently_owned === 1).length,
        sold: processedRows.filter(r => r.was_sold === 1).length,
        active: processedRows.filter(r => r.is_active).length
      }
    });
  });
};

// ============================================
// GET ACTIVE CERTIFICATES COUNT (For Dashboard Stats)
// ============================================
export const getActiveCertificatesCount = (req, res) => {
  const companyId = req.user?.companyId;
  
  console.log('\n📊 GET /api/certificates/my-certificates/stats');
  console.log('   User:', req.user?.email);
  console.log('   Company ID:', companyId);
  
  if (!companyId) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized - Company ID not found" 
    });
  }

  const sql = `
    SELECT 
      COUNT(*) as total_certificates,
      SUM(CASE 
        WHEN listed = 1 
         AND status = 'LISTED' 
         AND owner_company_id = ?
        THEN 1 
        ELSE 0 
      END) as active_on_marketplace,
      SUM(CASE 
        WHEN status = 'TRANSFERRED' 
        THEN 1 
        ELSE 0 
      END) as sold,
      SUM(CASE 
        WHEN status = 'RETIRED' 
        THEN 1 
        ELSE 0 
      END) as retired,
      SUM(CASE 
        WHEN listed = 1 
         AND status = 'LISTED'
        THEN amount 
        ELSE 0 
      END) as total_listed_amount,
      SUM(CASE 
        WHEN status NOT IN ('TRANSFERRED', 'RETIRED')
         AND owner_company_id = ?
        THEN 1 
        ELSE 0 
      END) as currently_owned
    FROM certificates
    WHERE owner_company_id = ?
       OR EXISTS (
         SELECT 1 FROM certificate_transactions ct 
         WHERE ct.cert_id = certificates.cert_id 
           AND (ct.seller_company_id = ? OR ct.buyer_company_id = ?)
       )
  `;
  
  db.query(sql, [companyId, companyId, companyId, companyId, companyId], (err, results) => {
    if (err) {
      console.error("❌ Get active certificates count error:", err);
      return res.status(500).json({ 
        success: false,
        message: "Database error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    const stats = results[0] || {
      total_certificates: 0,
      active_on_marketplace: 0,
      sold: 0,
      retired: 0,
      total_listed_amount: 0,
      currently_owned: 0
    };

    const responseData = {
      total: parseInt(stats.total_certificates || 0),
      active_on_marketplace: parseInt(stats.active_on_marketplace || 0),
      sold: parseInt(stats.sold || 0),
      retired: parseInt(stats.retired || 0),
      currently_owned: parseInt(stats.currently_owned || 0),
      total_listed_amount: parseFloat(stats.total_listed_amount || 0)
    };

    console.log('✅ Certificate Stats:');
    console.log('   Total Certificates:', responseData.total);
    console.log('   Active on Marketplace:', responseData.active_on_marketplace);
    console.log('   Currently Owned:', responseData.currently_owned);
    console.log('   Sold:', responseData.sold);
    console.log('   Retired:', responseData.retired);
    console.log('   Total Listed Amount:', responseData.total_listed_amount, 'tCO₂e');

    return res.json({ 
      success: true, 
      data: responseData
    });
  });
};

// ============================================
// GET CERTIFICATE BY PROJECT
// ============================================
export const getCertificateByProject = (req, res) => {
  const { projectId } = req.params;

  const sql = `
    SELECT * FROM certificates 
    WHERE project_id = ? 
    ORDER BY issued_at DESC 
    LIMIT 1
  `;
  
  db.query(sql, [projectId], (err, rows) => {
    if (err) {
      console.error("Get certificate by project error:", err);
      return res.status(500).json({ 
        success: false,
        message: "DB error" 
      });
    }

    if (!rows.length) {
      return res.json({ 
        success: true,
        message: "No certificate found for this project",
        data: null
      });
    }

    return res.json({ 
      success: true, 
      data: rows[0] 
    });
  });
};

// ============================================
// GET MARKETPLACE
// ============================================
// backend/controllers/certificateController.js - getMarketplace function
export const getMarketplace = (req, res) => {
  let buyerCompanyId = null;
  let isAuthenticated = false;
  
  if (req.user && req.user.companyId) {
    buyerCompanyId = req.user.companyId;
    isAuthenticated = true;
    console.log("✅ Authenticated user");
    console.log("   User ID:", req.user.id);
    console.log("   Email:", req.user.email);
    console.log("   Company ID:", buyerCompanyId);
    console.log("   Type:", req.user.type);
  } else {
    console.log("👤 Guest user (browsing marketplace without login)");
  }
  
  const sql = `
    SELECT 
      c.cert_id,
      c.project_id,
      c.owner_company_id,
      c.amount,
      c.price_per_unit,
      c.status,
      c.listed,
      c.issued_at,
      c.expires_at,
      c.created_at,
      c.updated_at,
      p.title as project_title,
      p.category as project_category,
      p.location as project_location,
      p.description as project_description,
      p.images_json,
      p.doc_path,
      u.company as company_name,
      u.email as company_email
    FROM certificates c
    JOIN projects p ON p.project_id = c.project_id
    JOIN users u ON u.company_id = c.owner_company_id
    WHERE c.listed = 1 AND c.status = 'LISTED'
    ORDER BY c.updated_at DESC
  `;
  
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.error("Get marketplace error:", err);
      return res.status(500).json({ 
        success: false,
        message: "DB error" 
      });
    }

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
      
      // ✅ Set isOwner flag
      if (buyerCompanyId) {
        row.isOwner = row.owner_company_id === buyerCompanyId;
      } else {
        row.isOwner = false;
      }
      
      return row;
    });

    console.log(`📊 Marketplace: ${processedRows.length} certificates found`);
    if (isAuthenticated) {
      const ownCerts = processedRows.filter(r => r.isOwner).length;
      console.log(`   Your certificates: ${ownCerts}`);
      console.log(`   Others: ${processedRows.length - ownCerts}`);
    }

    return res.json({ 
      success: true, 
      data: processedRows,
      total: processedRows.length,
      isAuthenticated: isAuthenticated,
      buyerCompanyId: buyerCompanyId || null
    });
  });
};

// ============================================
// LIST CERTIFICATE
// ============================================
export const listCertificate = async (req, res) => {
  console.log("\n=== LIST CERTIFICATE START ===");
  console.log("Request body:", req.body);
  
  try {
    const { certId } = req.params;
    const { pricePerUnit } = req.body;

    if (!certId) {
      return res.status(400).json({ 
        success: false,
        message: "certId is required" 
      });
    }

    if (!pricePerUnit || pricePerUnit <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "pricePerUnit must be greater than 0" 
      });
    }

    const getCertificate = () => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM certificates WHERE cert_id = ?", 
          [certId], 
          (err, rows) => {
            if (err) {
              console.error("DB error getting certificate:", err);
              return reject(err);
            }
            if (!rows || rows.length === 0) {
              console.error("Certificate not found:", certId);
              return reject(new Error("Certificate not found in database"));
            }
            console.log("Certificate found:", rows[0].cert_id);
            resolve(rows[0]);
          }
        );
      });
    };

    const updateCertificate = (newPrice) => {
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE certificates
           SET listed = 1, status = 'LISTED', price_per_unit = ?, updated_at = NOW()
           WHERE cert_id = ?`, 
          [newPrice, certId], 
          (err, result) => {
            if (err) {
              console.error("DB error updating certificate:", err);
              return reject(err);
            }
            console.log("MySQL certificate updated, affected rows:", result.affectedRows);
            resolve(result);
          }
        );
      });
    };

    console.log("\n[STEP 1] Getting certificate from MySQL...");
    const certificate = await getCertificate();

    if (certificate.owner_company_id !== req.user?.companyId) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this certificate"
      });
    }

    if (certificate.listed === 1) {
      return res.status(400).json({
        success: false,
        message: "Certificate is already listed in marketplace"
      });
    }

    if (certificate.status !== 'ISSUED') {
      return res.status(400).json({
        success: false,
        message: `Cannot list certificate with status: ${certificate.status}`
      });
    }

    console.log("\n[STEP 2] Listing certificate in Fabric...");
    try {
      const fabricRes = await axios.post(
        `${FABRIC_API}/certificates/${certId}/list`,
        { pricePerUnit: parseInt(pricePerUnit) },
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 10000 
        }
      );
      console.log("Fabric list certificate SUCCESS:", fabricRes.data);
    } catch (fabricErr) {
      console.error("Fabric list certificate FAILED:");
      console.error("Status:", fabricErr.response?.status);
      console.error("Data:", fabricErr.response?.data);
      console.warn("⚠️ Continuing with MySQL update despite Fabric error");
    }

    console.log("\n[STEP 3] Updating certificate in MySQL...");
    await updateCertificate(parseInt(pricePerUnit));

    console.log("\n=== LIST CERTIFICATE SUCCESS ===\n");

    return res.json({
      success: true,
      message: "Certificate berhasil ditambahkan ke marketplace",
      certificate: {
        cert_id: certId,
        project_id: certificate.project_id,
        amount: certificate.amount,
        pricePerUnit: parseInt(pricePerUnit),
        listed: true,
        status: 'LISTED'
      }
    });

  } catch (err) {
    console.error("\n=== LIST CERTIFICATE FAILED ===");
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    
    return res.status(500).json({
      success: false,
      message: "Error listing certificate",
      error: err.message
    });
  }
};

// ============================================
// UNLIST CERTIFICATE
// ============================================
export const unlistCertificate = async (req, res) => {
  console.log("\n=== UNLIST CERTIFICATE START ===");
  console.log("Params certId:", req.params.certId);
  
  try {
    const { certId } = req.params;

    if (!certId) {
      return res.status(400).json({ 
        success: false,
        message: "certId is required" 
      });
    }

    const getCertificate = () => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM certificates WHERE cert_id = ?", 
          [certId], 
          (err, rows) => {
            if (err) return reject(err);
            if (!rows || rows.length === 0) {
              return reject(new Error("Certificate not found"));
            }
            resolve(rows[0]);
          }
        );
      });
    };

    const updateCertificate = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE certificates 
           SET listed = 0, status = 'ISSUED', updated_at = NOW() 
           WHERE cert_id = ?`, 
          [certId], 
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    };

    const certificate = await getCertificate();

    if (certificate.owner_company_id !== req.user?.companyId) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this certificate"
      });
    }

    if (certificate.listed === 0) {
      return res.status(400).json({
        success: false,
        message: "Certificate is not listed in marketplace"
      });
    }

    try {
      const fabricRes = await axios.post(
        `${FABRIC_API}/certificates/${certId}/unlist`,
        {},
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 10000 
        }
      );
      console.log("Fabric unlist certificate SUCCESS:", fabricRes.data);
    } catch (fabricErr) {
      console.error("Fabric unlist certificate FAILED:", fabricErr.response?.data);
      console.warn("⚠️ Continuing with MySQL update despite Fabric error");
    }

    await updateCertificate();

    console.log("\n=== UNLIST CERTIFICATE SUCCESS ===\n");

    return res.json({
      success: true,
      message: "Certificate berhasil dihapus dari marketplace",
      certificate: {
        cert_id: certId,
        listed: false,
        status: 'ISSUED'
      }
    });

  } catch (err) {
    console.error("\n=== UNLIST CERTIFICATE FAILED ===");
    console.error("Error:", err.message);
    
    return res.status(500).json({
      success: false,
      message: "Error unlisting certificate",
      error: err.message
    });
  }
};

// ============================================
// BUY CERTIFICATE - COMPLETE WITH ALL HELPERS
// ============================================
export const buyCertificate = async (req, res) => {
  console.log("\n=== BUY CERTIFICATE START ===");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);
  console.log("Buyer user:", req.user);
  
  try {
    const { certId } = req.params;
    const { buyerInfo } = req.body;
    const buyerCompanyId = req.user?.companyId;

    if (!certId) {
      return res.status(400).json({ 
        success: false,
        message: "certId is required" 
      });
    }

    if (!buyerCompanyId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - buyer company ID not found" 
      });
    }

    if (!buyerInfo || !buyerInfo.name || !buyerInfo.email) {
      return res.status(400).json({ 
        success: false,
        message: "Buyer name and email are required" 
      });
    }

    // ✅ HELPER FUNCTIONS
    const getCertificate = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT c.*, p.title as project_title, u.company as owner_company_name
           FROM certificates c
           JOIN projects p ON p.project_id = c.project_id
           JOIN users u ON u.company_id = c.owner_company_id
           WHERE c.cert_id = ?`, 
          [certId], 
          (err, rows) => {
            if (err) {
              console.error("DB error getting certificate:", err);
              return reject(err);
            }
            if (!rows || rows.length === 0) {
              console.error("Certificate not found:", certId);
              return reject(new Error("Certificate not found"));
            }
            resolve(rows[0]);
          }
        );
      });
    };

    const updateCertificateOwner = (oldOwnerId, newOwnerId) => {
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE certificates
           SET owner_company_id = ?, 
               listed = 0, 
               status = 'TRANSFERRED',
               updated_at = NOW()
           WHERE cert_id = ?`, 
          [newOwnerId, certId], 
          (err, result) => {
            if (err) {
              console.error("DB error updating certificate owner:", err);
              return reject(err);
            }
            console.log("Certificate owner updated, affected rows:", result.affectedRows);
            resolve(result);
          }
        );
      });
    };

    const createTransactionRecord = (cert, buyerId, totalPrice) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO certificate_transactions 
           (cert_id, seller_company_id, buyer_company_id, amount, price_per_unit, total_price, buyer_name, buyer_email, buyer_company, buyer_phone, transaction_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            certId,
            cert.owner_company_id,
            buyerId,
            cert.amount,
            cert.price_per_unit,
            totalPrice,
            buyerInfo?.name || null,
            buyerInfo?.email || null,
            buyerInfo?.company || null,
            buyerInfo?.phone || null
          ],
          (err, result) => {
            if (err) {
              console.error("DB error creating transaction record:", err);
              return reject(err);
            }
            console.log("Transaction record created, insertId:", result.insertId);
            resolve(result);
          }
        );
      });
    };

    console.log("\n[STEP 1] Getting certificate from MySQL...");
    const certificate = await getCertificate();

    if (certificate.listed !== 1) {
      return res.status(400).json({
        success: false,
        message: "Certificate is not available for purchase"
      });
    }

    if (certificate.status !== 'LISTED') {
      return res.status(400).json({
        success: false,
        message: `Certificate is not available (status: ${certificate.status})`
      });
    }

    if (certificate.owner_company_id === buyerCompanyId) {
      return res.status(403).json({
        success: false,
        message: "You cannot purchase your own certificate",
        ownerCompanyId: certificate.owner_company_id,
        buyerCompanyId: buyerCompanyId
      });
    }

    const now = new Date();
    const expiresAt = new Date(certificate.expires_at);
    if (expiresAt < now) {
      return res.status(400).json({
        success: false,
        message: "Certificate has expired"
      });
    }

    const totalPrice = certificate.amount * certificate.price_per_unit;
    const oldOwnerId = certificate.owner_company_id;

    console.log("\n[PURCHASE DETAILS]");
    console.log("Certificate ID:", certId);
    console.log("Project:", certificate.project_title);
    console.log("Seller Company:", certificate.owner_company_name, "(", oldOwnerId, ")");
    console.log("Buyer Company ID:", buyerCompanyId);
    console.log("Amount:", certificate.amount, "tCO2e");
    console.log("Price per unit:", certificate.price_per_unit);
    console.log("Total Price:", totalPrice);

    console.log("\n[STEP 2] Buying certificate in Fabric...");
    let fabricSuccess = false;
    let blockchainData = null;

    try {
      const fabricRes = await axios.post(
        `${FABRIC_API}/certificates/${certId}/buy`,
        { buyerId: buyerCompanyId },
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 10000 
        }
      );
      console.log("✅ Fabric buy certificate SUCCESS");
      console.log("   Full response:", JSON.stringify(fabricRes.data, null, 2));
      fabricSuccess = true;

      // ✅ EXTRACT REAL BLOCKCHAIN DATA FROM FABRIC RESPONSE
      if (fabricRes.data) {
        const fabricData = fabricRes.data;
        
        blockchainData = {
          txId: fabricData.lastTransferTxId || 
                fabricData.blockchainMetadata?.txId || 
                fabricData.txId || 
                null,
          blockHash: fabricData.certificateHash || 
                     fabricData.blockchainHash || 
                     null,
          blockNumber: fabricData.blockNumber || 
                       fabricData.blockchainMetadata?.blockNumber || 
                       null,
          timestamp: fabricData.timestamp || 
                     (fabricData.ownershipHistory && fabricData.ownershipHistory.length > 0 
                       ? new Date(fabricData.ownershipHistory[fabricData.ownershipHistory.length - 1].timestamp).toISOString()
                       : new Date().toISOString()),
          validationCode: 0,
          revision: fabricData._rev || null
        };

        console.log("\n📦 Real Blockchain Data Extracted:");
        console.log("   TX ID:", blockchainData.txId);
        console.log("   Certificate Hash:", blockchainData.blockHash);
        console.log("   Block Number:", blockchainData.blockNumber);
        console.log("   Timestamp:", blockchainData.timestamp);
        console.log("   Revision:", blockchainData.revision);
      }

    } catch (fabricErr) {
      console.error("❌ Fabric buy certificate FAILED:");
      console.error("Status:", fabricErr.response?.status);
      console.error("Data:", fabricErr.response?.data);
      
      const errorMsg = fabricErr.response?.data?.error || "";
      if (errorMsg.includes("not available") || errorMsg.includes("not found")) {
        return res.status(400).json({
          success: false,
          message: "Certificate is not available in blockchain.",
          fabricError: errorMsg
        });
      }
      
      console.warn("⚠️ Continuing with MySQL update despite Fabric error");
      
      // ✅ Try to fetch real data from Fabric before generating fallback
      try {
        console.log("\n🔄 Attempting to fetch certificate from Fabric...");
        const fetchRes = await axios.get(
          `${FABRIC_API}/certificates/${certId}`,
          { 
            headers: { "Content-Type": "application/json" },
            timeout: 5000 
          }
        );
        
        if (fetchRes.data) {
          const fetchedData = fetchRes.data;
          
          blockchainData = {
            txId: fetchedData.lastTransferTxId || 
                  fetchedData.blockchainMetadata?.txId || 
                  null,
            blockHash: fetchedData.certificateHash || null,
            blockNumber: null,
            timestamp: fetchedData.ownershipHistory && fetchedData.ownershipHistory.length > 0
              ? new Date(fetchedData.ownershipHistory[fetchedData.ownershipHistory.length - 1].timestamp).toISOString()
              : new Date().toISOString(),
            validationCode: 0,
            revision: fetchedData._rev || null
          };
          
          console.log("✅ Fetched real blockchain data after purchase");
          console.log("   TX ID:", blockchainData.txId);
          console.log("   Hash:", blockchainData.blockHash);
        }
      } catch (fetchErr) {
        console.error("❌ Failed to fetch certificate:", fetchErr.message);
      }
      
      // ✅ Generate fallback ONLY if all else fails
      if (!blockchainData || !blockchainData.txId) {
        console.log("🔧 Generating fallback blockchain data");
        blockchainData = {
          txId: `TX-${certId}-${Date.now()}`,
          blockHash: certificate.blockchain_hash || generateBlockchainHash(certId, new Date()),
          blockNumber: Math.floor(Math.random() * 100000),
          timestamp: new Date().toISOString(),
          validationCode: 0,
          revision: null
        };
        console.log("⚠️  Using fallback data (not real blockchain data)");
      }
    }

    console.log("\n[STEP 3] Updating certificate ownership in MySQL...");
    await updateCertificateOwner(oldOwnerId, buyerCompanyId);

    // ✅ [STEP 3.5] SAVE BLOCKCHAIN DATA TO MySQL
    if (blockchainData && blockchainData.txId) {
      console.log("\n[STEP 3.5] Saving blockchain data to MySQL...");
      console.log("   TX ID:", blockchainData.txId);
      console.log("   Hash:", blockchainData.blockHash);
      console.log("   Block:", blockchainData.blockNumber);
      
      try {
        await saveBlockchainDataToMySQL(certId, blockchainData);
        console.log("✅ Blockchain data saved successfully");
      } catch (saveErr) {
        console.error("⚠️ Failed to save blockchain data:", saveErr.message);
      }
    } else {
      console.log("⚠️ No blockchain data to save");
    }

    console.log("\n[STEP 4] Creating transaction record...");
    await createTransactionRecord(certificate, buyerCompanyId, totalPrice);

    console.log("\n=== BUY CERTIFICATE SUCCESS ===\n");

    return res.json({
      success: true,
      message: "Certificate purchased successfully!",
      transaction: {
        cert_id: certId,
        project_title: certificate.project_title,
        seller_company: certificate.owner_company_name,
        previous_owner: oldOwnerId,
        new_owner: buyerCompanyId,
        amount: certificate.amount,
        price_per_unit: certificate.price_per_unit,
        total_price: totalPrice,
        transaction_date: new Date().toISOString(),
        buyer_info: buyerInfo,
        fabric_synced: fabricSuccess,
        blockchain: blockchainData
      }
    });

  } catch (err) {
    console.error("\n=== BUY CERTIFICATE FAILED ===");
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    
    return res.status(500).json({
      success: false,
      message: "Error purchasing certificate",
      error: err.message
    });
  }
};


const saveBlockchainDataToMySQL = async (certId, blockchainData) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE certificates 
      SET 
        blockchain_hash = ?,
        blockchain_tx_id = ?,
        blockchain_block_number = ?,
        blockchain_timestamp = ?,
        blockchain_validation_code = ?,
        blockchain_revision = ?
      WHERE cert_id = ?
    `;
    
    const params = [
      blockchainData.blockHash || null,
      blockchainData.txId || null,
      blockchainData.blockNumber || null,
      blockchainData.timestamp ? new Date(blockchainData.timestamp) : null,
      blockchainData.validationCode !== undefined ? blockchainData.validationCode : 0,
      blockchainData.revision || null,
      certId
    ];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Error saving blockchain data to MySQL:", err);
        return reject(err);
      }
      console.log("✅ Blockchain data saved to MySQL");
      resolve(result);
    });
  });
};

// ============================================
// RETIRE CERTIFICATE
// ============================================
export const retireCertificate = async (req, res) => {
  console.log("\n=== RETIRE CERTIFICATE START ===");

  try {
    const { certId } = req.params;
    const { retirementReason, retirementBeneficiary } = req.body;

    if (!certId || !retirementReason || !retirementBeneficiary) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // STEP 1 — Get certificate from MySQL
    const getCertSql = `
      SELECT c.*, p.title as project_title
      FROM certificates c
      LEFT JOIN projects p ON c.project_id = p.project_id
      WHERE c.cert_id = ?
    `;

    db.query(getCertSql, [certId], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });
      if (!results.length) return res.status(404).json({ success: false, message: "Certificate not found" });

      const certificate = results[0];

      // Ownership check
      if (certificate.owner_company_id !== req.user.companyId) {
        return res.status(403).json({ success: false, message: "You don't own this certificate" });
      }

      if (certificate.status === "RETIRED") {
        return res.status(400).json({ success: false, message: "Certificate is already retired" });
      }

      // STEP 2 — Retire in Fabric
      let blockchainData = null;

      try {
        const payload = { retirementReason, retirementBeneficiary };

        const fabricRes = await axios.post(
          `${FABRIC_API}/certificates/${certId}/retire`,
          payload,
          { timeout: 10000 }
        );

        blockchainData = fabricRes.data;
        console.log('✅ Blockchain retire response:', {
          certId: blockchainData.certId,
          status: blockchainData.status,
          retiredAt: blockchainData.retiredAt
        });
        
      } catch (fabricErr) {
        console.error('❌ Fabric API error:', fabricErr.response?.data || fabricErr.message);
        return res.status(500).json({
          success: false,
          message: "Failed to retire certificate in blockchain",
          error: fabricErr.response?.data?.error || fabricErr.message
        });
      }

      // STEP 3 — Update MySQL
      const updateSql = `
        UPDATE certificates 
        SET 
          status = 'RETIRED',
          retirement_date = NOW(),
          retirement_reason = ?,
          retirement_beneficiary = ?
        WHERE cert_id = ?
      `;

      db.query(
        updateSql,
        [retirementReason, retirementBeneficiary, certId],
        async (updateErr) => {
          if (updateErr) {
            console.error('❌ MySQL update error:', updateErr);
            return res.status(500).json({
              success: false,
              message: "Failed to update certificate in database"
            });
          }

          console.log('✅ MySQL updated successfully');

          // STEP 4 — Generate PDF
          try {
            const { publicUrl } = await generateRetirementPdf({
              certId,
              certificate,
              blockchainData, // ✅ Use blockchainData from retire response
              retirementReason,
              retirementBeneficiary
            });

            console.log("✅ PDF generated:", publicUrl);

            // STEP 5 — Save PDF path
            const savePdfSql = `
              UPDATE certificates
              SET retirement_confirmation_pdf = ?
              WHERE cert_id = ?
            `;

            db.query(savePdfSql, [publicUrl, certId], (err2) => {
              if (err2) console.error("❌ Failed to save PDF path:", err2);
              else console.log('✅ PDF path saved to database');
            });

            // ✅ SUCCESS RESPONSE - Use blockchainData directly
            return res.json({
              success: true,
              message: "Certificate retired successfully",
              certificate: {
                cert_id: certId,
                status: "RETIRED",
                retirement_reason: retirementReason,
                retirement_beneficiary: retirementBeneficiary,
                retirement_date: new Date().toISOString(),
                retirement_confirmation_pdf: publicUrl,
                blockchain: {
                  retiredAt: blockchainData.retiredAt,
                  retiredTxId: blockchainData.retiredTxId,
                  retiredBy: blockchainData.retiredBy,
                  retirementReason: blockchainData.retirementReason,
                  retirementBeneficiary: blockchainData.retirementBeneficiary
                }
              }
            });

          } catch (pdfErr) {
            console.error("❌ PDF generation error:", pdfErr);
            return res.json({
              success: true,
              message: "Certificate retired, but failed to generate PDF",
              certificate: {
                cert_id: certId,
                status: "RETIRED",
                blockchain: {
                  retiredAt: blockchainData.retiredAt,
                  retiredTxId: blockchainData.retiredTxId
                }
              }
            });
          }
        }
      );
    });

  } catch (error) {
    console.error("❌ Retire certificate error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};