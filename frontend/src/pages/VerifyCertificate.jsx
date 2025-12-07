import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiShield,
  FiHash,
  FiCalendar,
  FiPackage,
  FiMapPin,
  FiUser,
  FiTrendingUp,
  FiClock,
  FiRefreshCw,
  FiFileText,
  FiCopy,
  FiCheck,
  FiPrinter,
} from "react-icons/fi";
import API from "../api/axios";

const VerifyCertificate = () => {
  const { certId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // ✅ Universal copy function (works on all devices/browsers)
  const copyToClipboard = (text, fieldName) => {
    // Method 1: Try modern Clipboard API (HTTPS only)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedField(fieldName);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          // Fallback to Method 2
          fallbackCopy(text, fieldName);
        });
    } else {
      // Method 2: Fallback for HTTP and older browsers
      fallbackCopy(text, fieldName);
    }
  };

  // ✅ Fallback copy method (works everywhere)
  const fallbackCopy = (text, fieldName) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible and out of viewport
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      } else {
        alert('Copy failed. Please copy manually:\n\n' + text);
      }
    } catch (err) {
      alert('Copy failed. Please copy manually:\n\n' + text);
    }
    
    document.body.removeChild(textArea);
  };

  const verifyCertificate = useCallback(async () => {
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
  
      // Public verify endpoint (no token)
      const verifyResponse = await API.get(`/public/verify/${certId}`);
      const verifyData = verifyResponse.data;
  
      if (verifyData.success) {
        setVerificationResult(verifyData.verification);
        setCertificate(verifyData.certificate);
        setBlockchainData(verifyData.blockchain);
  
        // If authenticated, get more detail info
        if (token) {
          try {
            const detailResponse = await API.get(
              `/certificates/${certId}/detail`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            const detailData = detailResponse.data;
            if (detailData.success && detailData.data) {
              setBlockchainData(prevData => ({
                ...prevData,
                blockchain_hash: detailData.data.blockchain_hash || prevData?.blockchain_hash,
                blockchain_tx_id: detailData.data.blockchain_tx_id || prevData?.blockchain_tx_id,
                blockchain_block_number: detailData.data.blockchain_block_number || prevData?.blockchain_block_number,
                blockchain_timestamp: detailData.data.blockchain_timestamp || prevData?.blockchain_timestamp,
                _id: detailData.data._id || prevData?._id,
                _rev: detailData.data._rev || prevData?._rev,
              }));
            }
          } catch (detailError) {
            // Silent fail
          }
        }
      } else {
        setVerificationResult({
          isValid: false,
          message: verifyData.message || "Certificate not found",
          checks: verifyData.verification?.checks || [],
        });
        setBlockchainData(null);
      }
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: "Failed to verify certificate: " + (error?.message || "Unknown error"),
        checks: [],
      });
      setBlockchainData(null);
    } finally {
      setIsLoading(false);
    }
  }, [certId]);

  useEffect(() => {
    verifyCertificate();
  }, [verifyCertificate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  const isValid = verificationResult?.isValid;
  const checks = verificationResult?.checks || [];

  return (
    <>
      {/* ✅ PRINT STYLES */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          #print-area,
          #print-area * {
            visibility: visible;
          }
          
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .no-print {
            display: none !important;
          }
          
          .bg-gradient-to-br,
          .bg-gradient-to-r {
            background: white !important;
          }
          
          .border-green-300,
          .border-red-300,
          .border-purple-200 {
            border-color: #000 !important;
          }
          
          .shadow-lg {
            box-shadow: none !important;
          }
          
          code {
            word-break: break-all;
            font-size: 9px !important;
            line-height: 1.3 !important;
          }
          
          @page {
            margin: 1.5cm;
            size: A4;
          }
          
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto" id="print-area">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Certificate Verification
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Verify the authenticity of carbon credit certificate
            </p>
          </div>

          {/* Certificate ID Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 page-break-avoid">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Certificate ID</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 font-mono break-all">
                  {certId}
                </p>
              </div>
              <div className="flex gap-2 no-print">
                <button
                  onClick={verifyCertificate}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors whitespace-nowrap"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  <span className="text-sm font-semibold">Verify Again</span>
                </button>
                {isValid && (
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors whitespace-nowrap"
                  >
                    <FiPrinter className="h-4 w-4" />
                    <span className="text-sm font-semibold">Print</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div
            className={`rounded-xl sm:rounded-2xl shadow-lg border-4 p-6 sm:p-8 mb-4 sm:mb-6 page-break-avoid ${
              isValid
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                : "bg-gradient-to-br from-red-50 to-pink-50 border-red-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex justify-center sm:justify-start">
                {isValid ? (
                  <div className="bg-green-500 rounded-full p-3 sm:p-4">
                    <FiCheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-3 sm:p-4">
                    <FiXCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                  {isValid ? "Certificate Valid" : "Certificate Invalid"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {verificationResult?.message || "Verification completed"}
                </p>
              </div>
            </div>

            {/* Verification Checks */}
            {checks.length > 0 && (
              <div className="bg-white bg-opacity-80 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <FiShield className="h-5 w-5" />
                  Verification Checks
                </h3>
                <div className="space-y-3">
                  {checks.map((check, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg"
                    >
                      {check.passed ? (
                        <FiCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {check.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {check.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certificate Details */}
          {isValid && certificate && (
            <>
              {/* Basic Info */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 page-break-avoid">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiFileText className="text-emerald-600" />
                  Certificate Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiPackage className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Project Name</span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-800 break-words">
                      {certificate.project_name || "N/A"}
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <FiTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Carbon Credits</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-700">
                      {certificate.amount?.toLocaleString("en-US")} tCO₂e
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiUser className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Owner</span>
                    </div>
                    <p className="text-sm sm:text-lg font-medium text-gray-800 break-words">
                      {certificate.company || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiMapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Location</span>
                    </div>
                    <p className="text-sm sm:text-lg font-medium text-gray-800 break-words">
                      {certificate.city}, {certificate.province}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiCalendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Issued Date</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-gray-800">
                      {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiShield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold">Status</span>
                    </div>
                    <span
                      className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        certificate.status === "RETIRED"
                          ? "bg-gray-100 text-gray-700"
                          : certificate.status === "LISTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {certificate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blockchain Data */}
{/* Blockchain Data - ALWAYS SHOW if certificate is valid */}
{isValid && blockchainData && (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-lg border-2 border-purple-200 p-4 sm:p-6 page-break-avoid">
    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <FiRefreshCw className="text-purple-600 flex-shrink-0" />
      <span>Blockchain Data</span>
    </h3>

    <div className="space-y-4">
      {/* Certificate Hash - ALWAYS SHOW */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-purple-700">
            <FiHash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              Certificate Hash {blockchainData.hash_type === 'real' ? '(SHA256)' : blockchainData.blockchain_hash ? '(Generated)' : ''}
            </span>
          </div>
          {blockchainData.blockchain_hash && (
            <button
              onClick={() => copyToClipboard(blockchainData.blockchain_hash, 'hash')}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors no-print"
              title="Copy to clipboard"
            >
              {copiedField === 'hash' ? (
                <FiCheck className="h-4 w-4 text-green-600" />
              ) : (
                <FiCopy className="h-4 w-4 text-purple-600" />
              )}
            </button>
          )}
        </div>
        
        {blockchainData.blockchain_hash ? (
          <>
            <code className="block text-xs sm:text-sm text-gray-700 font-mono break-all bg-gray-50 p-3 rounded-lg leading-relaxed">
              {blockchainData.blockchain_hash}
            </code>
            {blockchainData.hash_type === 'generated' && (
              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <FiAlertCircle className="h-3 w-3 flex-shrink-0" />
                Temporary hash - Original blockchain hash pending
              </p>
            )}
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-yellow-700">
              <p className="font-semibold">Hash is being generated</p>
              <p className="text-xs text-yellow-600 mt-1">
                The blockchain hash will be available shortly. Please refresh the page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Transaction ID */}
      {blockchainData.blockchain_tx_id && (
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-purple-700">
              <FiHash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Transaction ID</span>
            </div>
            <button
              onClick={() => copyToClipboard(blockchainData.blockchain_tx_id, 'txid')}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors no-print"
              title="Copy to clipboard"
            >
              {copiedField === 'txid' ? (
                <FiCheck className="h-4 w-4 text-green-600" />
              ) : (
                <FiCopy className="h-4 w-4 text-purple-600" />
              )}
            </button>
          </div>
          <code className="block text-xs sm:text-sm text-gray-700 font-mono break-all bg-gray-50 p-3 rounded-lg leading-relaxed">
            {blockchainData.blockchain_tx_id}
          </code>
        </div>
      )}

      {/* Block Number */}
      {blockchainData.blockchain_block_number && (
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <FiPackage className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">Block Number</span>
          </div>
          <p className="text-sm sm:text-base text-gray-700 font-semibold">
            {blockchainData.blockchain_block_number.toLocaleString()}
          </p>
        </div>
      )}

      {/* Blockchain Status */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-700 mb-2">
          <FiShield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">Status</span>
        </div>
        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
          blockchainData.status === 'LISTED' 
            ? 'bg-blue-100 text-blue-700' 
            : blockchainData.status === 'TRANSFERRED'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {blockchainData.status}
        </span>
      </div>

      {/* Verification Time */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-700 mb-2">
          <FiClock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">Verified At</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 break-words">
          {verificationResult?.verifiedAt ? 
            new Date(verificationResult.verifiedAt).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "long",
            })
          : new Date().toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "long",
            })}
        </p>
      </div>
    </div>
  </div>
)}
            </>
          )}

          {/* Footer Actions */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 no-print">
            <Link
              to="/"
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-center"
            >
              Back to Home
            </Link>
            {isValid && (
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
              >
                <FiPrinter className="h-5 w-5" />
                Print Verification
              </button>
            )}
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-300">
            <div className="text-center text-xs text-gray-600">
              <p className="font-semibold mb-1">ChainCarbon - Certificate Verification</p>
              <p>Generated: {new Date().toLocaleString("en-US")}</p>
              <p className="mt-2">Verify at: {window.location.origin}/verify/{certId}</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 sm:mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 no-print">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-800">
                <p className="font-semibold mb-2">How Verification Works:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Certificate data is checked in our database</li>
                  <li>Blockchain hash is verified from Hyperledger Fabric</li>
                  <li>Data integrity is validated across systems</li>
                  <li>Works from any device via IP or localhost</li>
                  <li>Tap copy button to copy hash to clipboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyCertificate;