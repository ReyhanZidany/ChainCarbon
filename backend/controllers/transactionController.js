// backend/controllers/transactionController.js
import db from "../config/db.js";

// ============================================
// Get My Transactions (Purchases + Sales)
// ============================================
export const getMyTransactions = (req, res) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  console.log("\n📊 GET /api/transactions/my-transactions");
  console.log(`  Company: ${companyId}`);

  // ✅ Purchases - WITH BLOCKCHAIN DATA
  const purchasesSql = `
    SELECT 
      ct.cert_id,
      ct.seller_company_id,
      ct.buyer_company_id,
      ct.amount,
      ct.price_per_unit,
      ct.total_price,
      ct.transaction_date,
      ct.buyer_name,
      ct.buyer_email,
      ct.buyer_company,
      ct.buyer_phone,
      CONCAT(ct.cert_id, '-', UNIX_TIMESTAMP(ct.transaction_date)) as transaction_id,
      p.title as project_title,
      p.location as project_location,
      p.category as project_category,
      seller.company as seller_company,
      seller.email as seller_email,
      c.blockchain_hash,
      c.blockchain_tx_id,
      c.blockchain_block_number,
      c.blockchain_timestamp,
      c.blockchain_validation_code,
      c.blockchain_revision,
      'completed' as status
    FROM certificate_transactions ct
    INNER JOIN certificates c ON ct.cert_id = c.cert_id
    INNER JOIN projects p ON c.project_id = p.project_id
    LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
    WHERE ct.buyer_company_id = ?
    ORDER BY ct.transaction_date DESC
  `;

  // ✅ Sales - WITH BLOCKCHAIN DATA
  const salesSql = `
    SELECT 
      ct.cert_id,
      ct.seller_company_id,
      ct.buyer_company_id,
      ct.amount,
      ct.price_per_unit,
      ct.total_price,
      ct.transaction_date,
      ct.buyer_name,
      ct.buyer_email,
      ct.buyer_company,
      ct.buyer_phone,
      CONCAT(ct.cert_id, '-', UNIX_TIMESTAMP(ct.transaction_date)) as transaction_id,
      p.title as project_title,
      p.location as project_location,
      p.category as project_category,
      COALESCE(buyer.company, ct.buyer_company) as buyer_company,
      COALESCE(buyer.email, ct.buyer_email) as buyer_email,
      c.blockchain_hash,
      c.blockchain_tx_id,
      c.blockchain_block_number,
      c.blockchain_timestamp,
      c.blockchain_validation_code,
      c.blockchain_revision,
      'completed' as status
    FROM certificate_transactions ct
    INNER JOIN certificates c ON ct.cert_id = c.cert_id
    INNER JOIN projects p ON c.project_id = p.project_id
    LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
    WHERE ct.seller_company_id = ?
    ORDER BY ct.transaction_date DESC
  `;

  db.query(purchasesSql, [companyId], (err1, purchases) => {
    if (err1) {
      console.error("❌ Purchases error:", err1);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err1.message,
      });
    }

    db.query(salesSql, [companyId], (err2, sales) => {
      if (err2) {
        console.error("❌ Sales error:", err2);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err2.message,
        });
      }

      // ✅ Count blockchain verified transactions
      const verifiedPurchases = purchases.filter(p => p.blockchain_tx_id).length;
      const verifiedSales = sales.filter(s => s.blockchain_tx_id).length;

      console.log(`  ✅ Purchases: ${purchases.length}, Sales: ${sales.length}`);
      console.log(`  🔗 Blockchain Verified: ${verifiedPurchases} purchases, ${verifiedSales} sales\n`);

      res.json({
        success: true,
        data: {
          purchases: purchases || [],
          sales: sales || [],
        },
      });
    });
  });
};

// ============================================
// Get Transaction Detail
// ============================================
export const getTransactionDetail = (req, res) => {
  const { txId } = req.params;
  const companyId = req.user?.companyId;

  console.log(`\n📋 GET /api/transactions/${txId}`);

  const parts = txId.split("-");
  if (parts.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid transaction ID format",
    });
  }

  const timestamp = parts[parts.length - 1];
  const certId = parts.slice(0, -1).join("-");

  console.log(`  Cert: ${certId}, Time: ${timestamp}`);

  // ✅ Query WITH BLOCKCHAIN DATA
  const sql = `
    SELECT 
      ct.*,
      CONCAT(ct.cert_id, '-', UNIX_TIMESTAMP(ct.transaction_date)) as transaction_id,
      seller.company as seller_company,
      seller.email as seller_email,
      seller.website as seller_website,
      seller.province as seller_province,
      seller.city as seller_city,
      COALESCE(buyer.company, ct.buyer_company) as buyer_company,
      COALESCE(buyer.email, ct.buyer_email) as buyer_email,
      buyer.website as buyer_website,
      buyer.province as buyer_province,
      buyer.city as buyer_city,
      c.cert_id,
      c.status as certificate_status,
      c.blockchain_hash,
      c.blockchain_tx_id,
      c.blockchain_block_number,
      c.blockchain_timestamp,
      c.blockchain_validation_code,
      c.blockchain_revision,
      p.project_id,
      p.title as project_name,
      p.description as project_description,
      p.location as project_location,
      p.category as project_category,
      p.images_json as project_images
    FROM certificate_transactions ct
    LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
    LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
    LEFT JOIN certificates c ON ct.cert_id = c.cert_id
    LEFT JOIN projects p ON c.project_id = p.project_id
    WHERE ct.cert_id = ?
      AND UNIX_TIMESTAMP(ct.transaction_date) = ?
      AND (ct.seller_company_id = ? OR ct.buyer_company_id = ?)
  `;

  db.query(sql, [certId, timestamp, companyId, companyId], (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const transaction = results[0];
    const userRole =
      transaction.seller_company_id === companyId ? "seller" : "buyer";

    // Parse project images
    let projectImages = [];
    if (transaction.project_images) {
      try {
        projectImages = JSON.parse(transaction.project_images);
      } catch (e) {
        console.error("Error parsing images:", e);
      }
    }

    console.log(`  ✅ Found (Role: ${userRole})`);
    console.log(`  🔗 Blockchain TX ID: ${transaction.blockchain_tx_id || 'N/A'}`);
    console.log(`  📦 Block Number: ${transaction.blockchain_block_number || 'N/A'}\n`);

    res.json({
      success: true,
      data: {
        ...transaction,
        project_images: projectImages,
        user_role: userRole,
        // ✅ Add blockchain info object
        blockchain: {
          txId: transaction.blockchain_tx_id,
          blockHash: transaction.blockchain_hash,
          blockNumber: transaction.blockchain_block_number,
          timestamp: transaction.blockchain_timestamp,
          validationCode: transaction.blockchain_validation_code,
          revision: transaction.blockchain_revision,
          verified: transaction.blockchain_validation_code === 0 && transaction.blockchain_tx_id !== null
        }
      },
    });
  });
};

// ============================================
// Get Statistics
// ============================================
export const getTransactionStats = (req, res) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  console.log("\n📈 GET /api/transactions/stats");

  const sql = `
    SELECT 
      SUM(CASE WHEN ct.buyer_company_id = ? THEN ct.total_price ELSE 0 END) as total_purchases,
      SUM(CASE WHEN ct.seller_company_id = ? THEN ct.total_price ELSE 0 END) as total_sales,
      SUM(CASE WHEN ct.buyer_company_id = ? THEN ct.amount ELSE 0 END) as volume_purchased,
      SUM(CASE WHEN ct.seller_company_id = ? THEN ct.amount ELSE 0 END) as volume_sold,
      COUNT(*) as total_transactions,
      COUNT(DISTINCT c.blockchain_tx_id) as blockchain_verified_count
    FROM certificate_transactions ct
    LEFT JOIN certificates c ON ct.cert_id = c.cert_id
    WHERE ct.buyer_company_id = ? OR ct.seller_company_id = ?
  `;

  db.query(sql, [companyId, companyId, companyId, companyId, companyId, companyId], (err, results) => {
    if (err) {
      console.error("❌ Stats error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const stats = results[0] || {};

    console.log(`  ✅ Total: ${stats.total_transactions}`);
    console.log(`  🔗 Blockchain Verified: ${stats.blockchain_verified_count}\n`);

    res.json({
      success: true,
      data: {
        total_purchases: parseFloat(stats.total_purchases || 0),
        total_sales: parseFloat(stats.total_sales || 0),
        volume_purchased: parseFloat(stats.volume_purchased || 0),
        volume_sold: parseFloat(stats.volume_sold || 0),
        total_transactions: parseInt(stats.total_transactions || 0),
        blockchain_verified: parseInt(stats.blockchain_verified_count || 0),
      },
    });
  });
};

// ============================================
// Get All Transactions
// ============================================
export const getAllTransactions = (req, res) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const sql = `
    SELECT 
      ct.*,
      CONCAT(ct.cert_id, '-', UNIX_TIMESTAMP(ct.transaction_date)) as transaction_id,
      p.title as project_title,
      p.location as project_location,
      c.blockchain_tx_id,
      c.blockchain_block_number,
      c.blockchain_hash,
      CASE 
        WHEN ct.seller_company_id = ? THEN 'sale'
        ELSE 'purchase'
      END as transaction_type
    FROM certificate_transactions ct
    INNER JOIN certificates c ON ct.cert_id = c.cert_id
    INNER JOIN projects p ON c.project_id = p.project_id
    WHERE ct.seller_company_id = ? OR ct.buyer_company_id = ?
    ORDER BY ct.transaction_date DESC
  `;

  db.query(sql, [companyId, companyId, companyId], (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, data: results || [] });
  });
};

// ============================================
// Export Transactions
// ============================================
export const exportTransactions = (req, res) => {
  const companyId = req.user?.companyId;
  const { type } = req.query;

  if (!companyId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let sql, params;

  if (type === "purchases") {
    sql = `
      SELECT 
        ct.cert_id as 'Certificate ID',
        c.blockchain_tx_id as 'Blockchain TX ID',
        c.blockchain_block_number as 'Block Number',
        DATE_FORMAT(ct.transaction_date, '%Y-%m-%d %H:%i:%s') as 'Date',
        p.title as 'Project',
        p.location as 'Location',
        ct.amount as 'Amount (tCO2e)',
        FORMAT(ct.price_per_unit, 0) as 'Price per Unit (IDR)',
        FORMAT(ct.total_price, 0) as 'Total Price (IDR)',
        seller.company as 'Seller'
      FROM certificate_transactions ct
      INNER JOIN certificates c ON ct.cert_id = c.cert_id
      INNER JOIN projects p ON c.project_id = p.project_id
      LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
      WHERE ct.buyer_company_id = ?
      ORDER BY ct.transaction_date DESC
    `;
    params = [companyId];
  } else if (type === "sales") {
    sql = `
      SELECT 
        ct.cert_id as 'Certificate ID',
        c.blockchain_tx_id as 'Blockchain TX ID',
        c.blockchain_block_number as 'Block Number',
        DATE_FORMAT(ct.transaction_date, '%Y-%m-%d %H:%i:%s') as 'Date',
        p.title as 'Project',
        p.location as 'Location',
        ct.amount as 'Amount (tCO2e)',
        FORMAT(ct.price_per_unit, 0) as 'Price per Unit (IDR)',
        FORMAT(ct.total_price, 0) as 'Total Price (IDR)',
        COALESCE(buyer.company, ct.buyer_company) as 'Buyer'
      FROM certificate_transactions ct
      INNER JOIN certificates c ON ct.cert_id = c.cert_id
      INNER JOIN projects p ON c.project_id = p.project_id
      LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
      WHERE ct.seller_company_id = ?
      ORDER BY ct.transaction_date DESC
    `;
    params = [companyId];
  } else {
    sql = `
      SELECT 
        ct.cert_id as 'Certificate ID',
        c.blockchain_tx_id as 'Blockchain TX ID',
        c.blockchain_block_number as 'Block Number',
        DATE_FORMAT(ct.transaction_date, '%Y-%m-%d %H:%i:%s') as 'Date',
        p.title as 'Project',
        p.location as 'Location',
        ct.amount as 'Amount (tCO2e)',
        FORMAT(ct.price_per_unit, 0) as 'Price per Unit (IDR)',
        FORMAT(ct.total_price, 0) as 'Total Price (IDR)',
        CASE 
          WHEN ct.seller_company_id = ? THEN 'Sale'
          ELSE 'Purchase'
        END as 'Type'
      FROM certificate_transactions ct
      INNER JOIN certificates c ON ct.cert_id = c.cert_id
      INNER JOIN projects p ON c.project_id = p.project_id
      WHERE ct.seller_company_id = ? OR ct.buyer_company_id = ?
      ORDER BY ct.transaction_date DESC
    `;
    params = [companyId, companyId, companyId];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Export error:", err);
      return res.status(500).json({ success: false, message: "Export failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No data" });
    }

    const headers = Object.keys(results[0]);
    const csv = [
      headers.join(","),
      ...results.map((row) =>
        headers.map((h) => `"${(row[h] || "").toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="chaincarbon-transactions-${type}-${Date.now()}.csv"`);

    res.send(csv);
  });
};

// ============================================
// Create Transaction
// ============================================
export const createTransaction = (req, res) => {
  const { certId, sellerCompanyId, buyerCompanyId, amount, pricePerUnit, totalPrice, buyerName, buyerEmail, buyerCompany, buyerPhone } = req.body;

  if (!certId || !sellerCompanyId || !buyerCompanyId || !amount || !pricePerUnit) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO certificate_transactions 
    (cert_id, seller_company_id, buyer_company_id, amount, price_per_unit, total_price, buyer_name, buyer_email, buyer_company, buyer_phone, transaction_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const total = totalPrice || amount * pricePerUnit;

  db.query(sql, [certId, sellerCompanyId, buyerCompanyId, amount, pricePerUnit, total, buyerName, buyerEmail, buyerCompany, buyerPhone], (err, result) => {
    if (err) {
      console.error("❌ Create error:", err);
      return res.status(500).json({ success: false, message: "Failed" });
    }

    console.log("✅ Transaction created:", result.insertId);

    res.json({ 
      success: true, 
      message: "Transaction created",
      transactionId: result.insertId
    });
  });
};

export const getRecentTransactionsPublic = (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

  const sql = `
    SELECT 
      CONCAT(ct.cert_id, '-', UNIX_TIMESTAMP(ct.transaction_date)) as transaction_id,
      ct.cert_id,
      ct.amount,
      ct.price_per_unit,
      ct.total_price,
      ct.transaction_date,
      p.title AS project_title,
      p.location AS project_location,
      p.category AS project_category,
      COALESCE(seller.company, '') AS seller_company,
      COALESCE(buyer.company, ct.buyer_company) AS buyer_company,
      c.blockchain_tx_id,
      c.blockchain_hash
    FROM certificate_transactions ct
    INNER JOIN certificates c ON ct.cert_id = c.cert_id
    LEFT JOIN projects p ON c.project_id = p.project_id
    LEFT JOIN users seller ON ct.seller_company_id = seller.company_id
    LEFT JOIN users buyer ON ct.buyer_company_id = buyer.company_id
    ORDER BY ct.transaction_date DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("❌ getRecentTransactionsPublic error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, data: results || [] });
  });
};