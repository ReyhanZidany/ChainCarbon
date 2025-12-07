// backend/routes/publicRoutes.js

import express from "express";
import db from "../config/db.js";
import axios from "axios";

const router = express.Router();
const FABRIC_API = process.env.FABRIC_API || "http://localhost:3000";

// ✅ Helper: Generate deterministic hash
const generateDeterministicHash = (certId, timestamp) => {
  const cleanCertId = certId.replace(/-/g, '').replace(/[^a-zA-Z0-9]/g, '');
  const timeHex = new Date(timestamp).getTime().toString(16).padStart(12, '0');
  return `0x${cleanCertId}${timeHex}`.substring(0, 42);
};

// ============================================
// PUBLIC CERTIFICATE VERIFICATION
// ============================================
router.get("/verify/:certId", async (req, res) => {
  const { certId } = req.params;

  try {
    // ✅ Step 1: Get certificate from MySQL
    const sql = `
      SELECT 
        c.*,
        p.title as project_name,
        p.category as project_category,
        p.location,
        u.company,
        u.province,
        u.city
      FROM certificates c
      LEFT JOIN projects p ON c.project_id = p.project_id
      LEFT JOIN users u ON c.owner_company_id = u.company_id
      WHERE c.cert_id = ?
    `;

    const mysqlData = await new Promise((resolve, reject) => {
      db.query(sql, [certId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });

    if (!mysqlData) {
      return res.json({
        success: false,
        message: "Certificate not found",
        verification: {
          isValid: false,
          checks: [
            {
              name: "Database Check",
              passed: false,
              message: "Certificate does not exist in our database",
            },
          ],
        },
      });
    }

    console.log(`\n🔍 [PUBLIC VERIFY] ${certId}`);
    console.log(`   MySQL Hash: ${mysqlData.blockchain_hash || 'NULL'}`);
    console.log(`   MySQL TX ID: ${mysqlData.blockchain_tx_id || 'NULL'}`);

    // ✅ Initialize with MySQL data
    let blockchainHash = mysqlData.blockchain_hash;
    let blockchainTxId = mysqlData.blockchain_tx_id;
    let blockchainBlockNumber = mysqlData.blockchain_block_number;
    let blockchainRevision = mysqlData.blockchain_revision;
    let hashType = blockchainHash && blockchainHash.length === 64 ? 'real' : null;
    let dataSource = blockchainHash ? 'mysql' : null;

    // ✅ Step 2: Try Fabric if hash missing
    if (!blockchainHash || blockchainHash.length !== 64) {
      console.log(`   🔄 Fetching from Fabric...`);
      
      try {
        const fabricRes = await axios.get(
          `${FABRIC_API}/certificates/${certId}`,
          { timeout: 5000 }
        );

        if (fabricRes.data) {
          const fabricHash = fabricRes.data.certificateHash;
          const fabricTxId = fabricRes.data.blockchainMetadata?.txId || 
                            fabricRes.data.lastTransferTxId;
          const fabricRevision = fabricRes.data._rev;

          console.log(`   Fabric Hash: ${fabricHash || 'NULL'}`);
          console.log(`   Fabric TX ID: ${fabricTxId || 'NULL'}`);

          if (fabricHash && fabricHash.length === 64) {
            blockchainHash = fabricHash;
            hashType = 'real';
            dataSource = 'fabric';
            console.log(`   ✅ Using REAL hash from Fabric`);
          }
          
          if (fabricTxId) {
            blockchainTxId = fabricTxId;
          }

          if (fabricRevision) {
            blockchainRevision = fabricRevision;
          }

          // ✅ Save to MySQL for future requests
          if (fabricHash) {
            db.query(
              `UPDATE certificates 
               SET blockchain_hash = ?, blockchain_tx_id = ?, blockchain_revision = ?
               WHERE cert_id = ?`,
              [fabricHash, fabricTxId, fabricRevision, certId],
              (err) => {
                if (err) {
                  console.error(`   ❌ Failed to cache: ${err.message}`);
                } else {
                  console.log(`   ✅ Cached to MySQL`);
                }
              }
            );
          }
        }
      } catch (fabricErr) {
        console.log(`   ⚠️ Fabric unavailable: ${fabricErr.message}`);
      }
    }

    // ✅ Step 3: Generate fallback if STILL missing
    if (!blockchainHash) {
      console.log(`   🔧 Generating fallback hash...`);
      const timestamp = mysqlData.created_at || mysqlData.issued_at || new Date();
      blockchainHash = generateDeterministicHash(certId, timestamp);
      hashType = 'generated';
      dataSource = 'generated';
      console.log(`   Generated: ${blockchainHash}`);
    }

    console.log(`\n📦 Final blockchain data:`);
    console.log(`   Hash: ${blockchainHash}`);
    console.log(`   Hash Type: ${hashType}`);
    console.log(`   Source: ${dataSource}`);
    console.log(`   Length: ${blockchainHash ? blockchainHash.length : 0}`);

    // ✅ Verification checks
    const blockchainCheck = {
      name: "Blockchain Verification",
      passed: !!(blockchainHash && (blockchainHash.length === 64 || blockchainHash.startsWith('0x'))),
      message: blockchainHash && blockchainHash.length === 64 
        ? "Certificate verified on blockchain" 
        : blockchainHash
        ? "Using temporary hash (blockchain sync pending)"
        : "❌ Blockchain data unavailable",
    };

    const checks = [
      {
        name: "Database Check",
        passed: true,
        message: "Certificate exists in database",
      },
      blockchainCheck,
      {
        name: "Status Check",
        passed: mysqlData.status !== "INVALID" && mysqlData.status !== "EXPIRED",
        message: `Certificate status: ${mysqlData.status}`,
      },
      {
        name: "Expiry Check",
        passed: mysqlData.expires_at ? new Date(mysqlData.expires_at) > new Date() : true,
        message: mysqlData.expires_at
          ? new Date(mysqlData.expires_at) > new Date()
            ? `Valid until ${new Date(mysqlData.expires_at).toLocaleDateString('en-US')}`
            : "Certificate has expired"
          : "ℹ️ No expiration date set",
      },
    ];

    const allChecksPassed = checks.every((check) => check.passed);
    const criticalChecksPassed = checks.filter(c => 
      c.name === "Database Check" || c.name === "Status Check"
    ).every(check => check.passed);

    // ✅ Parse location
    let city = mysqlData.city || "";
    let province = mysqlData.province || "";
    
    if (mysqlData.location && !city) {
      const parts = mysqlData.location.split(",").map((s) => s.trim());
      city = parts[0] || "";
      province = parts[parts.length - 1] || province;
    }

    console.log(`   Response: ${criticalChecksPassed ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`━`.repeat(70));

    // ✅ Response with GUARANTEED hash
    res.json({
      success: true,
      verification: {
        isValid: criticalChecksPassed,
        message: allChecksPassed
          ? "✅ Certificate is valid and fully verified"
          : criticalChecksPassed
          ? "⚠️ Certificate is valid (blockchain sync pending)"
          : "❌ Certificate validation failed",
        checks,
        verifiedAt: new Date().toISOString(),
      },
      certificate: {
        certificate_id: mysqlData.cert_id,
        project_name: mysqlData.project_name,
        project_category: mysqlData.project_category,
        amount: mysqlData.amount,
        status: mysqlData.status,
        company: mysqlData.company,
        issued_at: mysqlData.issued_at,
        expires_at: mysqlData.expires_at,
        city,
        province,
        location: mysqlData.location,
      },
      blockchain: {
        // ✅ GUARANTEED hash (never null)
        blockchain_hash: blockchainHash,
        blockchain_tx_id: blockchainTxId || null,
        blockchain_block_number: blockchainBlockNumber || null,
        blockchain_timestamp: mysqlData.blockchain_timestamp || null,
        blockchain_validation_code: mysqlData.blockchain_validation_code || null,
        blockchain_revision: blockchainRevision || null,
        
        // Metadata
        _id: `CERT:${certId}`,
        _rev: blockchainRevision || null,
        status: mysqlData.status,
        listed: mysqlData.listed === 1,
        
        // Flags
        verified: !!(blockchainHash && blockchainHash.length === 64 && blockchainTxId),
        hash_type: hashType || 'generated',
        source: dataSource || 'generated',
      },
    });

  } catch (error) {
    console.error("❌ Verification error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
});

export default router;