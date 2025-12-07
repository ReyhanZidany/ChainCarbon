import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  FiArrowLeft,
  FiDownload,
  FiRefreshCw,
  FiShare2,
  FiShield,
  FiCalendar,
  FiHash,
  FiPackage,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiClock,
  FiUser,
  FiEye,
  FiTrash2,
  FiX,
  FiExternalLink,
  FiCopy,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import API from "../api/axios";

const CertificateDetail = () => {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [retireForm, setRetireForm] = useState({
    reason: "",
    beneficiary: "",
  });
  const [transferData, setTransferData] = useState({
    buyerEmail: "",
    amount: "",
    pricePerUnit: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not available";
      
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Not available";
    }
  };

  const fetchCertificateDetail = useCallback(async () => {
    try {
      const response = await API.get(`/certificates/${certId}/detail`);
      const data = response.data;
      if (data.success) {
        setCertificate(data.data);
      } else {
        setMessageType("error");
        setMessage(data.message || "Certificate not found");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      setMessageType("error");
      setMessage("Failed to load certificate data");
    } finally {
      setIsLoading(false);
    }
  }, [certId]);

  useEffect(() => {
    fetchCertificateDetail();
  }, [fetchCertificateDetail]);

  // ✅ ADD: Get current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  // ✅ ADD: Helper to check if current user is buyer
const isBuyer = () => {
  if (!certificate || !currentUser) return false;
  
  // Check if user accessed via ?purchased=true in URL
  const urlParams = new URLSearchParams(window.location.search);
  const isPurchasedParam = urlParams.get('purchased') === 'true';
  
  // User is buyer if:
  // 1. They came from "purchased projects" (URL param)
  // 2. OR certificate has been transferred/retired (not original seller)
  return isPurchasedParam || 
         certificate.status === 'TRANSFERRED' || 
         certificate.status === 'RETIRED';
};

// ✅ ADD: Helper to check if current user is owner/seller
const isOwner = () => {
  if (!certificate || !currentUser) return false;
  
  const ownerCompanyId = certificate.owner_company_id || certificate.ownerId;
  const userCompanyId = currentUser.companyId || currentUser.company_id;
  
  return ownerCompanyId === userCompanyId;
};

  // Download as PDF
  const handleDownloadPDF = async () => {
    try {
      setIsProcessing(true);
      
      // ✅ Hide all no-print elements before capture
      const noPrintElements = document.querySelectorAll('.no-print');
      noPrintElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // ✅ Show all print-only elements
      const printOnlyElements = document.querySelectorAll('.print-only');
      printOnlyElements.forEach(el => {
        el.style.display = 'block';
      });
      
      const element = document.getElementById("certificate-content");
  
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificate-${certificate.certificate_id}.pdf`);
  
      // ✅ Restore original display after capture
      noPrintElements.forEach(el => {
        el.style.display = '';
      });
      
      printOnlyElements.forEach(el => {
        el.style.display = '';
      });
  
      setMessageType("success");
      setMessage("Certificate downloaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setMessageType("error");
      setMessage("Failed to download certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferData.pricePerUnit) {
      setMessageType("error");
      setMessage("Price per unit is required!");
      return;
    }
    if (parseFloat(transferData.pricePerUnit) <= 0) {
      setMessageType("error");
      setMessage("Price must be greater than 0!");
      return;
    }
  
    setIsProcessing(true);
    setMessage("");
  
    try {
      const response = await API.post(
        `/certificates/${certId}/list`,
        { pricePerUnit: parseFloat(transferData.pricePerUnit) }
      );
      const data = response.data;
      if (data.success) {
        setMessageType("success");
        setMessage("Certificate successfully listed on marketplace!");
        setShowTransferModal(false);
        setTransferData({ buyerEmail: "", amount: "", pricePerUnit: "" });
        setTimeout(() => fetchCertificateDetail(), 1500);
      } else {
        setMessageType("error");
        setMessage(data.message || "Failed to list certificate");
      }
    } catch (error) {
      console.error("Error listing certificate:", error);
      setMessageType("error");
      setMessage("Failed to list certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetire = async () => {
    if (!retireForm.reason || retireForm.reason.trim().length < 10) {
      setMessageType("error");
      setMessage("Retirement reason must be at least 10 characters!");
      return;
    }
    if (!window.confirm("⚠️ WARNING!\n\nRetiring a certificate is PERMANENT and CANNOT BE UNDONE.\n\nAre you sure?")) {
      return;
    }
  
    setIsProcessing(true);
    setMessage("");
  
    try {
      const response = await API.post(
        `/certificates/${certId}/retire`,
        {
          retirementReason: retireForm.reason,
          retirementBeneficiary: retireForm.beneficiary
        }
      );
      const data = response.data;
      if (data.success) {
        setMessageType("success");
        setMessage("Certificate retired successfully!");
        setShowRetireModal(false);
        setRetireForm({ reason: "", beneficiary: "" });
        setTimeout(() => fetchCertificateDetail(), 1500);
      } else {
        setMessageType("error");
        setMessage(data.message || "Failed to retire certificate");
      }
    } catch (error) {
      console.error("Error retiring certificate:", error);
      setMessageType("error");
      setMessage("Failed to retire certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessageType("success");
    setMessage("Copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  // ✅ Generate verification URL dynamically
  const getVerificationUrl = () => {
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}${port}/verify/${certificate.certificate_id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Certificate Not Found
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <FiArrowLeft className="inline h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const verificationUrl = getVerificationUrl();
  const isRetired = certificate.status === 'RETIRED';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      {/* Add print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          * {
            box-shadow: none !important;
            transition: none !important;
          }
          
          .certificate-container {
            page-break-inside: avoid;
            margin: 0;
            padding: 20px;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4 no-print">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/dashboard/sertifikat");
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-semibold"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              <FiDownload className="h-4 w-4" />
              Download PDF
            </button>

            <Link
              to={`/verify/${certificate.certificate_id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              <FiExternalLink className="h-4 w-4" />
              Public Verification
            </Link>
            
            {/* ✅ CRITICAL FIX: Only show actions for NON-RETIRED certificates */}
            {!isRetired && certificate.status !== 'LISTED' && (
              <>
                {/* ✅ List to Marketplace - Only for sellers (owners) */}
                {isOwner() && !isBuyer() && (
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    <FiShare2 className="h-4 w-4" />
                    List to Marketplace
                  </button>
                )}
                
                {/* ✅ Retire - ONLY for buyers (NOT sellers) */}
                {isBuyer() && (
                  <button
                    onClick={() => setShowRetireModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Retire Certificate
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center gap-3 no-print ${
              messageType === "success"
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}
          >
            {messageType === "success" ? (
              <FiCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`font-medium ${
                messageType === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Certificate Content (for PDF export) */}
        <div id="certificate-content" className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 mb-6 certificate-container">
          {/* Certificate Header */}
          <div className="border-b-4 border-emerald-600 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-4xl font-bold text-gray-800">
                    Carbon Credit Certificate
                  </h1>
                  {isRetired && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      RETIRED
                    </span>
                  )}
                  {certificate.status === 'LISTED' && (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      ON MARKETPLACE
                    </span>
                  )}
                </div>
                <p className="text-xl text-gray-600 font-medium">
                  ID: {certificate.certificate_id}
                </p>
              </div>
              
              {/* QR Code - PDF Ready */}
              <div className="text-center flex-shrink-0">
                <div 
                  style={{ 
                    background: 'white', 
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    border: '3px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  id="qr-code-container"
                >
                  <QRCode
                    value={verificationUrl}
                    size={120} // ✅ Slightly bigger for better PDF quality
                    level="H" // ✅ High error correction
                    style={{ 
                      height: "auto", 
                      maxWidth: "100%", 
                      width: "100%",
                      display: "block" // ✅ Ensure it's displayed as block
                    }}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">Scan to verify</p>
              </div>
            </div>
          </div>

          {/* Certificate Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Name */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiPackage className="h-5 w-5" />
                  <span className="text-sm font-semibold">Project Name</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{certificate.project_name || "N/A"}</p>
              </div>

              {/* Amount */}
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <FiTrendingUp className="h-5 w-5" />
                  <span className="text-sm font-semibold">Carbon Credit Amount</span>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {certificate.amount?.toLocaleString("en-US")} tCO₂e
                </p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiMapPin className="h-5 w-5" />
                  <span className="text-sm font-semibold">Project Location</span>
                </div>
                <p className="text-lg font-medium text-gray-800">
                  {certificate.city || certificate.location || "N/A"}
                  {certificate.province && `, ${certificate.province}`}
                </p>
              </div>

              {/* Owner */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiUser className="h-5 w-5" />
                  <span className="text-sm font-semibold">Owner</span>
                </div>
                <p className="text-lg font-medium text-gray-800">{certificate.company || "N/A"}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Issued Date */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiCalendar className="h-5 w-5" />
                  <span className="text-sm font-semibold">Issue Date</span>
                </div>
                <p className="text-lg font-medium text-gray-800">
                  {formatDate(certificate.issued_date)}
                </p>
              </div>

              {/* Valid Until */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiClock className="h-5 w-5" />
                  <span className="text-sm font-semibold">Valid Until</span>
                </div>
                <p className="text-lg font-medium text-gray-800">
                  {formatDate(certificate.expires_at)}
                </p>
                {!certificate.expires_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    No expiration date
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiShield className="h-5 w-5" />
                  <span className="text-sm font-semibold">Status</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {certificate.is_validated === 1 ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FiCheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FiClock className="h-4 w-4" />
                      Pending Verification
                    </span>
                  )}
                  {isRetired && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      Retired
                    </span>
                  )}
                </div>
              </div>

              {/* Verification Section - Screen Version (Hidden in PDF) */}
              <div className="bg-blue-50 rounded-xl p-4 no-print">
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <FiEye className="h-5 w-5" />
                  <span className="text-sm font-semibold">Verification Link</span>
                </div>
                
                {/* Input dan Button - Semua no-print */}
                <div className="space-y-2 no-print">
                  <input
                    type="text"
                    value={verificationUrl}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-mono text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyToClipboard(verificationUrl)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FiCopy className="h-4 w-4" />
                    Copy Verification Link
                  </button>
                </div>
                
                <p className="text-xs text-blue-600 mt-2 no-print">
                  Share this link to verify the certificate authenticity
                </p>
              </div>

              {/* Verification Section - PDF Version (Show only in print) */}
              <div className="hidden print-only">
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="text-center space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Certificate Verification
                    </p>
                    <p className="text-xs text-gray-600">
                      Visit the URL below to verify this certificate:
                    </p>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mt-2">
                      <p className="text-sm font-mono text-gray-800 break-all">
                        {verificationUrl}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-2">
                      Verified and stored on ChainCarbon blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Hash - Enhanced */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <div className="flex items-center gap-2 text-purple-700 mb-3">
              <FiHash className="h-6 w-6" />
              <span className="text-lg font-bold">Blockchain Information</span>
            </div>
            
            {/* Main Hash */}
            <div className="bg-white rounded-lg p-4 mb-3">
              <p className="text-xs text-gray-500 mb-1">Certificate Hash</p>
              <code className="text-sm text-gray-700 font-mono break-all">
                {certificate.blockchain_hash || "Generating..."}
              </code>
            </div>
            
            {/* CouchDB Revision */}
            {certificate.blockchain_revision && (
              <div className="bg-white rounded-lg p-4 mb-3">
                <p className="text-xs text-gray-500 mb-1">CouchDB Revision</p>
                <code className="text-xs text-gray-600 font-mono break-all">
                  {certificate.blockchain_revision}
                </code>
              </div>
            )}
            
            {/* Fabric Version */}
            {certificate.blockchain_version && (
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Fabric Version (Base64)</p>
                <code className="text-xs text-gray-600 font-mono break-all">
                  {certificate.blockchain_version}
                </code>
              </div>
            )}
            
            {/* Blockchain Hash Info */}
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-purple-900 mb-1">
                    Blockchain Verification
                  </p>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    This hash ensures the authenticity and integrity of the certificate on the blockchain. 
                    Any modification will generate a new revision hash for complete traceability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                This certificate is verified and stored on the blockchain for complete transparency
              </p>
              <p className="text-base font-semibold text-gray-800">
                ChainCarbon Platform
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 no-print">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiFileText className="text-emerald-600" />
            Additional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Methodology</p>
              <p className="font-semibold text-gray-800">{certificate.methodology || "VCS/Gold Standard"}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Vintage Year</p>
              <p className="font-semibold text-gray-800">
                {certificate.issued_date ? new Date(certificate.issued_date).getFullYear() : "N/A"}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Project Type</p>
              <p className="font-semibold text-gray-800">{certificate.project_type || "Carbon Reduction"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal (List to Marketplace) */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">List to Marketplace</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Ton (IDR)
                </label>
                <input
                  type="number"
                  value={transferData.pricePerUnit}
                  onChange={(e) =>
                    setTransferData({ ...transferData, pricePerUnit: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  placeholder="100000"
                />
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm text-emerald-700 font-semibold">Volume:</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {certificate.amount} tCO₂e
                </p>
              </div>

              {transferData.pricePerUnit && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-semibold">Estimated Total Value:</p>
                  <p className="text-2xl font-bold text-blue-700">
                    Rp {(certificate.amount * parseFloat(transferData.pricePerUnit)).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={isProcessing || !transferData.pricePerUnit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="inline h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "List to Marketplace"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retire Modal */}
      {showRetireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Retire Certificate</h3>
              <button
                onClick={() => setShowRetireModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <FiAlertCircle className="h-6 w-6 text-red-600 mb-2" />
              <p className="text-red-800 font-semibold mb-2">Warning!</p>
              <p className="text-red-700 text-sm">
                Retiring a certificate will mark it as "used" and it can no longer be traded. 
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Certificate to be retired:</p>
              <p className="font-bold text-gray-800 text-lg">
                {certificate.amount} tCO₂e - {certificate.project_name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Retirement Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={retireForm.reason}
                  onChange={(e) => setRetireForm({ ...retireForm, reason: e.target.value })}
                  placeholder="e.g., Used for offsetting company emissions for 2025"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Beneficiary (Optional)
                </label>
                <input
                  type="text"
                  value={retireForm.beneficiary}
                  onChange={(e) => setRetireForm({ ...retireForm, beneficiary: e.target.value })}
                  placeholder="Beneficiary name (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRetireModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRetire}
                disabled={isProcessing || !retireForm.reason || retireForm.reason.trim().length < 10}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="inline h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Yes, Retire Certificate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDetail;