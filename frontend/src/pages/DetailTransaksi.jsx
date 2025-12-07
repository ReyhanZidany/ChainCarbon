// src/pages/DetailTransaksi.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/axios";
import {
  FiArrowLeft,
  FiDownload,
  FiCheck,
  FiClock,
  FiX,
  FiPackage,
  FiDollarSign,
  FiUser,
  FiShield,
  FiLink,
  FiFileText,
  FiAlertCircle,
  FiCopy,
  FiCheckCircle,
  FiHash,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/chaincarbon_logo_transparent.png";

const DetailTransaksi = () => {
  const { txId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [transaction, setTransaction] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // ============================================
  // Copy to Clipboard
  // ============================================
  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ============================================
  // Fetch Transaction Detail
  // ============================================
  const fetchTransactionDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching transaction:", txId);

      // Fetch transaction
      const txRes = await API.get(`/transactions/${txId}`);
      const txData = txRes.data;

      console.log("📦 Transaction data:", txData);

      if (txData.success) {
        setTransaction(txData.data);

        // Fetch certificate details
        if (txData.data.cert_id) {
          try {
            const certRes = await API.get(`/certificates/${txData.data.cert_id}/detail`);
            const certData = certRes.data;

            console.log("📜 Certificate data:", certData);

            if (certData.success) {
              setCertificate(certData.data);
            } else if (certData.message) {
              setCertificate(null);
              setError(certData.message);
            }
          } catch (certErr) {
            console.error("❌ Error fetching certificate:", certErr);
            if (
              certErr.response &&
              certErr.response.data &&
              certErr.response.data.message
            ) {
              setError(certErr.response.data.message);
            } else {
              setError("Failed to load certificate details");
            }
            setCertificate(null);
          }
        }
      } else {
        setError(txData.message || "Transaction not found");
      }
    } catch (err) {
      console.error("❌ Error fetching transaction:", err);
      if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load transaction details");
      }
    } finally {
      setLoading(false);
    }
  }, [txId]);

  useEffect(() => {
    fetchTransactionDetail();
  }, [fetchTransactionDetail]);

  const downloadInvoice = () => {
    if (!transaction) return;
  
    const doc = new jsPDF();
  
    // Colors
    const primaryGreen = [16, 185, 129];
    const darkGray = [64, 64, 64];
    const lightGray = [128, 128, 128];
    const borderGray = [230, 230, 230];
  
    // === HEADER WITH LOGO ===
    // Logo
    try {
      doc.addImage(logo, "PNG", 20, 15, 30, 30);
    } catch (err) {
      console.log("Logo not loaded");
    }
  
    // Company Name & Tagline
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(22);
    doc.text("ChainCarbon", 60, 25);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text("Carbon Credit Marketplace", 60, 32);
  
    doc.setFontSize(8);
    doc.text("Blockchain-Verified Transactions", 60, 38);
  
    // Invoice Title & Details (Right side)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("INVOICE", 150, 25);
  
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...lightGray);
    doc.text(`Invoice No: ${transaction.cert_id}`, 150, 32);
    doc.text(
      `Date: ${new Date(transaction.transaction_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })}`,
      150,
      38
    );
  
    // Header border
    doc.setLineWidth(1);
    doc.setDrawColor(...primaryGreen);
    doc.line(20, 54, 190, 54);
  
    // === TRANSACTION OVERVIEW ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...darkGray);
    doc.text("Transaction Overview", 20, 64);
  
    autoTable(doc, {
      startY: 68,
      margin: { left: 20, right: 20 },
      body: [
        ["Certificate ID", transaction.cert_id || "-"],
        ["Transaction Date", new Date(transaction.transaction_date).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })],
        ["Status", (transaction.status || "COMPLETED").toUpperCase()],
        ["Seller", transaction.seller_company || transaction.seller_company_id || "-"],
        ["Buyer", transaction.buyer_company || transaction.buyer_company_id || "-"]
      ],
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        lineColor: [240, 240, 240],
        lineWidth: 0.1
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold", 
          cellWidth: 45,
          textColor: [100, 100, 100]
        }, 
        1: { 
          cellWidth: 125,
          textColor: [50, 50, 50]
        } 
      },
      theme: "grid",
      headStyles: { fillColor: [245, 245, 245] }
    });
  
    // === PAYMENT DETAILS ===
    let yPos = doc.lastAutoTable.finalY + 12;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...darkGray);
    doc.text("Payment Details", 20, yPos);
  
    yPos += 4;
  
    autoTable(doc, {
      startY: yPos,
      margin: { left: 20, right: 20 },
      body: [
        ["Volume", `${(transaction.amount || 0).toLocaleString("en-US")} tCO2`],
        ["Price per tonne", `Rp ${(transaction.price_per_unit || 0).toLocaleString("id-ID")}`],
      ],
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        lineColor: [240, 240, 240],
        lineWidth: 0.1
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold", 
          cellWidth: 45,
          textColor: [100, 100, 100]
        }, 
        1: { 
          cellWidth: 125,
          textColor: [50, 50, 50]
        } 
      },
      theme: "grid"
    });
  
    // === TOTAL SECTION ===
    yPos = doc.lastAutoTable.finalY + 10;
  
    // Total box with background
    doc.setFillColor(241, 245, 249); // Light gray background
    doc.roundedRect(20, yPos, 170, 18, 2, 2, "F");
  
    // "TOTAL" label
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.setFontSize(12);
    doc.text("TOTAL", 25, yPos + 11);
  
    // Total amount with green background
    const totalWidth = 75;
    doc.setFillColor(...primaryGreen);
    doc.roundedRect(190 - totalWidth - 5, yPos + 3, totalWidth, 12, 2, 2, "F");
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Rp ${(transaction.total_price || 0).toLocaleString("id-ID")}`,
      190 - totalWidth/2 - 5,
      yPos + 11,
      { align: "center" }
    );
  
    // === BLOCKCHAIN VERIFICATION BOX ===
    const blockchainTxId = transaction.blockchain?.txId || certificate?.blockchain_tx_id;
    if (blockchainTxId) {
      yPos += 28;
      
      // Background box
      doc.setFillColor(236, 253, 245); // Very light green
      doc.roundedRect(20, yPos, 170, 32, 3, 3, "F");
      
      // Border
      doc.setDrawColor(...primaryGreen);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, yPos, 170, 32, 3, 3, "S");
  
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...primaryGreen);
      doc.text("Blockchain Verification", 25, yPos + 9);
  
      // Transaction details
      doc.setFont("courier", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(60, 60, 60);
      
      const txIdShort = blockchainTxId.length > 55 
        ? blockchainTxId.substring(0, 55) + "..."
        : blockchainTxId;
      doc.text(`Transaction ID: ${txIdShort}`, 25, yPos + 16);
      
      const blockchainHash = transaction.blockchain?.blockHash || certificate?.blockchain_hash;
      if (blockchainHash) {
        const hashShort = blockchainHash.length > 55
          ? blockchainHash.substring(0, 55) + "..."
          : blockchainHash;
        doc.text(`Certificate Hash: ${hashShort}`, 25, yPos + 22);
      }
  
      // Verified badge
      const isVerified = blockchainTxId && blockchainTxId.length >= 46;
      if (isVerified) {
        doc.setFillColor(...primaryGreen);
        doc.roundedRect(158, yPos + 23, 28, 6, 1, 1, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("VERIFIED", 172, yPos + 27, { align: "center" });
      } else {
        doc.setTextColor(...lightGray);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Pending", 165, yPos + 27);
      }
    }
  
    // === FOOTER ===
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer separator line
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 30, 190, pageHeight - 30);
  
    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...lightGray);
    doc.text("This invoice is automatically generated by ChainCarbon blockchain system.", 20, pageHeight - 24);
    doc.text("Verify transaction authenticity using the blockchain hash on Hyperledger Fabric network.", 20, pageHeight - 19);
    
    doc.setFontSize(7);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })} by ${user?.company || user?.email || "ChainCarbon System"}`,
      20,
      pageHeight - 12
    );
  
    // Page number
    doc.setTextColor(...lightGray);
    doc.text("Page 1 of 1", 190, pageHeight - 12, { align: "right" });
  
    // === SAVE PDF ===
    const filename = `ChainCarbon-Invoice-${transaction.cert_id}-${Date.now()}.pdf`;
    doc.save(filename);
  
    console.log(`✅ Invoice downloaded: ${filename}`);
  };


  // ============================================
  // Get Status Config
  // ============================================
  const getStatusConfig = (status) => {
    const configs = {
      COMPLETED: {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: FiCheck,
        label: "Completed",
      },
      completed: {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: FiCheck,
        label: "Completed",
      },
      PENDING: {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: FiClock,
        label: "Pending",
      },
      FAILED: {
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: FiX,
        label: "Failed",
      },
    };

    return (
      configs[status] || {
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
        icon: FiAlertCircle,
        label: status || "Unknown",
      }
    );
  };

  // ============================================
  // Check User Role
  // ============================================
  const isSeller =
    transaction?.seller_company_id === user?.companyId ||
    transaction?.seller_company_id === user?.company_id;
  const isBuyer =
    transaction?.buyer_company_id === user?.companyId ||
    transaction?.buyer_company_id === user?.company_id;

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // Error State
  // ============================================
  if (error || !transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Transaction Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The transaction you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/dashboard/transaksi")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;

  // Extract blockchain data
  const blockchainTxId = transaction.blockchain?.txId || certificate?.blockchain_tx_id;
  const blockchainHash = transaction.blockchain?.blockHash || certificate?.blockchain_hash;
  const blockchainVerified = transaction.blockchain?.verified || (blockchainTxId && blockchainTxId.length === 64);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard/transaksi")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Transactions</span>
          </button>

          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <FiDownload className="h-4 w-4" />
            Download Invoice
          </button>
        </div>

        {/* Transaction Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Transaction Details
              </h1>
              <p className="text-gray-600">Certificate ID: {transaction.cert_id}</p>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusConfig.bg} ${statusConfig.border}`}
            >
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
              <span className={`font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Transaction Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificate Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FiPackage className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-800">Certificate</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate ID:</span>
                  <Link
                    to={`/dashboard/sertifikat/${transaction.cert_id}`}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {transaction.cert_id}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">
                    {transaction.amount?.toLocaleString("id-ID")} tCO₂e
                  </span>
                </div>
                {certificate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate" title={certificate.project_name}>
                      {certificate.project_name || "-"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiDollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800">Payment</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Unit:</span>
                  <span className="font-semibold text-gray-800">
                    Rp {transaction.price_per_unit?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-800">
                    Rp {transaction.total_price?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-emerald-600 text-xl">
                      Rp {transaction.total_price?.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ BLOCKCHAIN INFORMATION - WIDER DISPLAY */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-purple-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600 rounded-xl">
              <FiLink className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Blockchain Verification</h2>
              <p className="text-sm text-gray-600">
                Immutable proof of transaction on Hyperledger Fabric
              </p>
            </div>
            {blockchainVerified && (
              <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg border-2 border-green-300">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">Verified</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* ✅ Blockchain Transaction ID */}
            <div className="bg-white rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiHash className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-gray-800">Blockchain Transaction ID</span>
                </div>
                {blockchainTxId && (
                  <button
                    onClick={() => copyToClipboard(blockchainTxId, 'txId')}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    {copiedField === 'txId' ? (
                      <>
                        <FiCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {blockchainTxId ? (
                <code className="block text-sm font-mono bg-gray-50 text-gray-700 p-4 rounded-lg border border-gray-200 break-all">
                  {blockchainTxId}
                </code>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                  <FiClock className="h-5 w-5" />
                  <span className="text-sm font-medium">Pending blockchain confirmation...</span>
                </div>
              )}
            </div>

            {/* ✅ Certificate Hash */}
            <div className="bg-white rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiShield className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-gray-800">Certificate Hash (SHA256)</span>
                </div>
                {blockchainHash && (
                  <button
                    onClick={() => copyToClipboard(blockchainHash, 'hash')}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    {copiedField === 'hash' ? (
                      <>
                        <FiCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {blockchainHash ? (
                <code className="block text-sm font-mono bg-gray-50 text-gray-700 p-4 rounded-lg border border-gray-200 break-all">
                  {blockchainHash}
                </code>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                  <FiClock className="h-5 w-5" />
                  <span className="text-sm font-medium">Generating certificate hash...</span>
                </div>
              )}
            </div>

            {/* Blockchain Metadata */}
            {(transaction.blockchain?.blockNumber || transaction.blockchain?.timestamp || transaction.blockchain?.revision) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {transaction.blockchain?.blockNumber && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <span className="text-xs text-gray-600 block mb-1">Block Number</span>
                    <span className="font-bold text-gray-800">{transaction.blockchain.blockNumber.toLocaleString()}</span>
                  </div>
                )}
                {transaction.blockchain?.timestamp && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <span className="text-xs text-gray-600 block mb-1">Blockchain Timestamp</span>
                    <span className="font-bold text-gray-800">
                      {new Date(transaction.blockchain.timestamp).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {transaction.blockchain?.revision && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <span className="text-xs text-gray-600 block mb-1">Document Revision</span>
                    <span className="font-mono text-sm font-bold text-gray-800">{transaction.blockchain.revision}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Parties Involved */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Parties Involved
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seller */}
            <div
              className={`rounded-xl p-6 border-2 ${
                isSeller
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isSeller ? "bg-emerald-200" : "bg-gray-200"
                  }`}
                >
                  <FiUser
                    className={`h-5 w-5 ${
                      isSeller ? "text-emerald-700" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Seller</h3>
                  {isSeller && (
                    <span className="text-xs text-emerald-600 font-semibold">
                      (You)
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Company:</span>
                  <p className="font-semibold text-gray-800">
                    {transaction.seller_company || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Company ID:</span>
                  <p className="font-semibold text-gray-800">
                    {transaction.seller_company_id}
                  </p>
                </div>
                {transaction.seller_email && (
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-semibold text-gray-800">
                      {transaction.seller_email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer */}
            <div
              className={`rounded-xl p-6 border-2 ${
                isBuyer
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isBuyer ? "bg-blue-200" : "bg-gray-200"
                  }`}
                >
                  <FiShield
                    className={`h-5 w-5 ${
                      isBuyer ? "text-blue-700" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Buyer</h3>
                  {isBuyer && (
                    <span className="text-xs text-blue-600 font-semibold">
                      (You)
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Company:</span>
                  <p className="font-semibold text-gray-800">
                    {transaction.buyer_company || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Company ID:</span>
                  <p className="font-semibold text-gray-800">
                    {transaction.buyer_company_id}
                  </p>
                </div>
                {transaction.buyer_email && (
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-semibold text-gray-800">
                      {transaction.buyer_email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={downloadInvoice}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FiDownload className="h-5 w-5" />
              Download Invoice
            </button>

            {certificate && (
              <Link
                to={`/dashboard/sertifikat/${transaction.cert_id}`}
                className="flex items-center gap-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
              >
                <FiFileText className="h-5 w-5" />
                View Certificate
              </Link>
            )}

            <Link
              to="/dashboard/transaksi"
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Back to Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaksi;