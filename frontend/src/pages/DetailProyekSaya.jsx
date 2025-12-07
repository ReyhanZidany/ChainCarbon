import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft, Download, MapPin, Calendar,
  XCircle, TrendingUp, AlertCircle, CheckCircle, 
  ShoppingCart, Package, FileText, Clock, Shield
} from "lucide-react";
import { FiHome } from "react-icons/fi";
import API, { STATIC_BASE_URL } from "../api/axios";
import { toast } from "react-hot-toast";

const DetailProyekSaya = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const isPurchased = new URLSearchParams(location.search).get('purchased') === 'true';
  const [currentUser, setCurrentUser] = useState(null);
  const [proyek, setProyek] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tampilkanFormJual, setTampilkanFormJual] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [hargaJual, setHargaJual] = useState("");
  const [isListing, setIsListing] = useState(false);
  const [isRetiring, setIsRetiring] = useState(false);
  const [retireForm, setRetireForm] = useState({
    reason: "",
    beneficiary: ""
  });

  const [activeTab, setActiveTab] = useState("info");
  const [retirePdfUrl, setRetirePdfUrl] = useState(null);

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

  const isOwner = useCallback(() => {
    if (!certificate || !currentUser) return false;
    const currentOwnerCompanyId = certificate.owner_company_id || certificate.ownerId;
    const userCompanyId = currentUser.companyId || currentUser.company_id;
    return currentOwnerCompanyId === userCompanyId;
  }, [certificate, currentUser]);

  const normalizePdfUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http")
      ? url
      : `${STATIC_BASE_URL?.replace(/\/$/, "") || ""}${url}`;
  };

  const fetchProyek = useCallback(async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      const data = res.data;
      if (data.success) {
        setProyek(data.data);
        setHargaJual(data.data.price_per_unit || "");
      }
    } catch (err) {
      console.error("Failed to fetch project:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCertificate = useCallback(async () => {
    try {
      const res = await API.get(`/certificates/by-project/${id}`);
      const data = res.data;
      if (data.success && data.data) {
        setCertificate(data.data);
        const pdf = data.data.retirement_confirmation_pdf || data.data.retirement_confirmation_pdf_url || null;
        if (pdf) {
          const full = pdf.startsWith("http") ? pdf : `${STATIC_BASE_URL?.replace(/\/$/, "") || ""}${pdf}`;
          setRetirePdfUrl(full);
        }
      }
    } catch (err) {
      console.error("Failed to fetch certificate:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchProyek();
    fetchCertificate();
  }, [fetchProyek, fetchCertificate]); 

// ✅ RECOMMENDED CHANGE:
useEffect(() => {
  if (retirePdfUrl && isPurchased && certificate?.status === 'RETIRED') {
    setActiveTab("pdf");
  }
}, [retirePdfUrl, isPurchased, certificate]);

  const formJualRef = useRef(null);

  const handleMulaiJual = () => {
    if (!certificate) {
      alert("Certificate not yet available for this project");
      return;
    }
    
    if (certificate.listed === 1) {
      alert("Certificate is already listed on marketplace");
      return;
    }

    if (certificate.status === 'TRANSFERRED') {
      alert("Certificate has been sold and cannot be sold again");
      return;
    }

    if (certificate.status === 'RETIRED') {
      alert("Certificate has been retired and cannot be sold");
      return;
    }

    setTampilkanFormJual(true);

    setTimeout(() => {
      if (formJualRef.current) {
        formJualRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => window.scrollBy({ top: 1700, left: 0, behavior: "smooth" }));
      }
    }, 100);
  };

  const handleKonfirmasiJual = async () => {
    if (!hargaJual || parseInt(hargaJual) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsListing(true);

    try {
      const response = await API.post(
        `/certificates/${certificate.cert_id}/list`,
        { pricePerUnit: parseInt(hargaJual) }
      );
      const data = response.data;

      if ((response.status === 200 || response.status === 201) && data.success) {
        toast.success(
          <div className="font-sans px-1 py-2 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block">
                <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                  <circle cx="11" cy="11" r="11" fill="#10b981" />
                  <path d="M7 14l4-7 4 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="font-bold text-base text-emerald-800">Certificate listed!</div>
            </div>
            <div className="text-sm text-gray-800">
              <span className="font-semibold">ID:</span> {certificate.cert_id}<br />
              <span className="font-semibold">Volume:</span> {certificate.amount?.toLocaleString("id-ID")} tCO₂e<br />
              <span className="font-semibold">Price:</span> Rp {parseInt(hargaJual).toLocaleString("id-ID")}/tCO₂e
            </div>
          </div>,
          {
            duration: 5000,
            style: {
              minWidth: "380px",
              maxWidth: "470px",
              fontSize: "15px",
              background: "#f0fff4",
              color: "#065f46",
              border: "2px dashed #10b981",
              boxShadow: "0 8px 32px rgba(16,185,129,0.12)",
              padding: "18px 18px 14px 18px"
            },
            position: "top-center",
            icon: null
          }
        );
        await fetchCertificate();
        setTampilkanFormJual(false);
        setTimeout(() => navigate("/marketplace"), 800);
      } else {
        toast.error(`❌ Failed to list on marketplace: ${data.message || data.error}`, {
          position: "top-center",
          style: {
            fontSize: "15px",
            background: "#fff",
            color: "#dc2626",
            borderRadius: "10px",
            padding: "18px 15px",
            boxShadow: "0 2px 10px rgba(220,38,38,.15)",
            minWidth: "260px",
          }
        });
      }

    } catch (error) {
      console.error("Error listing certificate:", error);
      alert("❌ Failed to list on marketplace. Please try again.");
    } finally {
      setIsListing(false);
    }
  };

  const handleBatalkanJual = async () => {
    if (!certificate || certificate.listed !== 1) {
      alert("Certificate is not listed on marketplace");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel the sale on marketplace?")) {
      return;
    }

    try {
      const response = await API.post(
        `/certificates/${certificate.cert_id}/unlist`
      );
      const data = response.data;

      if (response.status === 200 && data.success) {
        alert("✅ Certificate successfully removed from marketplace");
        await fetchCertificate();
      } else {
        alert(`❌ Failed to cancel: ${data.message}`);
      }
    } catch (error) {
      console.error("Error unlisting certificate:", error);
      alert("❌ Failed to cancel sale");
    }
  };

  const handleRetire = async () => {
    if (!retireForm.reason.trim() || retireForm.reason.trim().length < 10) {
      alert("⚠️ Retirement reason must be at least 10 characters");
      return;
    }

    if (!retireForm.beneficiary || retireForm.beneficiary.trim().length === 0) {
      alert("⚠️ Retirement beneficiary is required by the backend. Please provide beneficiary.");
      return;
    }

    if (!window.confirm("⚠️ WARNING!\n\nRetiring a certificate is PERMANENT and CANNOT BE UNDONE.\n\nThe certificate will be removed from circulation and cannot be traded.\n\nAre you sure you want to continue?")) {
      return;
    }

    setIsRetiring(true);

    try {
      console.log("🔄 Retiring certificate:", certificate.cert_id);
      const response = await API.post(
        `/certificates/${certificate.cert_id}/retire`,
        {
          retirementReason: retireForm.reason,
          retirementBeneficiary: retireForm.beneficiary
        }
      );
      const data = response.data;
      console.log("📡 Retire response:", data);

      if (response.status === 200 && data.success) {
        setShowRetireModal(false);
        setRetireForm({ reason: "", beneficiary: "" });

        const returnedPdf =
        data.certificate?.retirement_confirmation_pdf ||
        data.retirement_confirmation_pdf;
        let fullPdfUrl = null;
        if (returnedPdf) {
          fullPdfUrl = returnedPdf.startsWith("http") ? returnedPdf : `${STATIC_BASE_URL?.replace(/\/$/, "") || ""}${returnedPdf}`;
          setRetirePdfUrl(fullPdfUrl);
          setCertificate(prev => prev ? { ...prev, retirement_confirmation_pdf: fullPdfUrl } : prev);
        }

        await fetchCertificate();

        if (fullPdfUrl) {
          setActiveTab("pdf");
          const win = window.open(fullPdfUrl, "_blank", "noopener,noreferrer");
          if (!win) {
            const a = document.createElement('a');
            a.href = fullPdfUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        } else {
          toast.success("Certificate retired successfully. No PDF was returned by the server.");
        }

        alert(`✅ Certificate successfully retired!\n\nCertificate ${certificate.cert_id} has been removed from circulation.\n\nVolume: ${certificate.amount} tCO₂e\nReason: ${retireForm.reason}`);
      } else {
        alert(`❌ Failed to retire certificate: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error retiring certificate:", error);
      alert("❌ An error occurred while retiring certificate");
    } finally {
      setIsRetiring(false);
    }
  };

  const handleDownloadPDF = () => {
    if (proyek?.doc_path) {
      window.open(
        `${STATIC_BASE_URL}${proyek.doc_path.startsWith("/") ? proyek.doc_path : "/" + proyek.doc_path}`,
        "_blank"
      );
    } else {
      alert("Document not available");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!proyek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you are looking for is not available or has been deleted</p>
          <Link 
            to="/dashboard/project" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to My Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusText =
    proyek.is_validated === 0
      ? "Under Review"
      : proyek.is_validated === 1
      ? "Active"
      : proyek.is_validated === 2
      ? "Inactive"
      : "Draft";

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
// ✅ COMPLETE FIX: Seller CANNOT retire, only buyer can
const getHeaderGradient = () => {
  const certRetired = certificate && certificate.status === 'RETIRED';
  const certTransferred = certificate && certificate.status === 'TRANSFERRED';
  const certListed = certificate && certificate.listed === 1;
  
  // ✅ PRIORITY 1: SELLER whose certificate was SOLD (purple)
  // Status TRANSFERRED OR status RETIRED (means buyer retired after purchase)
  const sellerSold = !isPurchased && (certTransferred || certRetired);
  if (sellerSold) {
    return "bg-gradient-to-r from-purple-500 to-purple-600";
  }
  
  // ✅ PRIORITY 2: BUYER who retired their purchased certificate (gray)
  if (certRetired && isPurchased) {
    return "bg-gradient-to-r from-gray-500 to-gray-700";
  }
  
  // ✅ PRIORITY 3: BUYER who purchased but NOT retired yet (cyan)
  if (isPurchased && !certRetired) {
    return "bg-gradient-to-r from-cyan-500 to-cyan-600";
  }
  
  // ✅ PRIORITY 4: SELLER with certificate listed on marketplace (green)
  if (certListed && statusText === "Active") {
    return "bg-gradient-to-r from-emerald-500 to-emerald-600";
  }
  
  // ✅ PRIORITY 5: SELLER with active certificate (green)
  if (statusText === "Active") {
    return "bg-gradient-to-r from-emerald-500 to-emerald-600";
  } 
  else if (statusText === "Under Review") {
    return "bg-gradient-to-r from-yellow-600 to-yellow-500";
  } 
  else if (statusText === "Inactive") {
    return "bg-gradient-to-r from-red-500 to-red-700";
  } 
  else {
    return "bg-gradient-to-r from-gray-500 to-slate-600";
  }
};

// ✅ Status detection variables
const isRetired = certificate?.status === 'RETIRED';
const isTransferred = certificate?.status === 'TRANSFERRED';

// ✅ SELLER perspective: certificate was SOLD
// If cert is RETIRED, it means buyer retired it (seller cannot retire)
const isSold = !isPurchased && (isTransferred || isRetired);

// ✅ Was transferred (same as isSold)
const wasTransferred = isSold;

// ✅ Can retire: ONLY buyers can retire, NOT sellers
const canRetire = 
  certificate && 
  !isRetired && 
  !isTransferred &&
  isPurchased; 
  
  let gambarProyek = [];
  try {
    if (proyek.images_json) {
      const arr = JSON.parse(proyek.images_json);
      if (Array.isArray(arr)) {
        gambarProyek = arr.map(img =>
          `${STATIC_BASE_URL}${img.startsWith("/") ? img : "/" + img}`
        );
      }
    }
  } catch (e) {
    console.warn("Failed to parse images_json:", e);
  }
  const gambarUtama = gambarProyek.length > 0
    ? gambarProyek[0]
    : "https://via.placeholder.com/400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gradient-to-r text-grey rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Details</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  <FiHome className="inline" /> Home
                </Link>
                <span>/</span>
                <Link 
                  to={isPurchased ? "/dashboard/purchased-projects" : "/dashboard/project"} 
                  className="hover:text-emerald-600 transition-colors"
                >
                  {isPurchased ? "Purchased Projects" : "My Projects"}
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Project Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className={`${getHeaderGradient()} p-6`}>
                <h2 className="text-3xl font-bold text-white mb-2">{proyek.title}</h2>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Project ID: <span className="font-mono font-semibold">{proyek.project_id}</span>
                </p>
              </div>

              {/* Description Box */}
              <div className="p-6 bg-gradient-to-br from-blue-10 to-cyan-10 border-b-2 border-blue-50">
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 mb-2">Project Description</h3>
                    {proyek.description ? (
                      <p className="text-gray-700 leading-relaxed text-base">
                        {proyek.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No description available for this project yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ FIXED: Status Badges - Seller cannot retire */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* ✅ SOLD badge - For seller whose cert was sold */}
                  {isSold && !isPurchased && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-sm font-medium flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Sold
                    </span>
                  )}
                  
                  {/* ✅ RETIRED badge - ONLY for buyer who retired */}
                  {isRetired && isPurchased && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-full text-sm font-medium flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Retired
                    </span>
                  )}
                  
                  {/* ✅ PURCHASED badge - For buyer who hasn't retired yet */}
                  {isPurchased && !isRetired && (
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-full text-sm font-medium flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Purchased
                    </span>
                  )}
                  
                  {/* On Marketplace */}
                  {certificate && certificate.listed === 1 && !isRetired && !isPurchased && !isTransferred && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      On Marketplace
                    </span>
                  )}
                  
                  {/* ✅ Active badge - ONLY if NOT retired, NOT sold, NOT purchased */}
                  {statusText === "Active" && !isRetired && !isSold && !isTransferred && !isPurchased && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(statusText)}`}>
                      {statusText}
                    </span>
                  )}
                  
                  {/* Under Review badge */}
                  {statusText === "Under Review" && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(statusText)}`}>
                      {statusText}
                    </span>
                  )}
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{proyek.location || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{proyek.category || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Volume</p>
                  <p className="font-semibold text-gray-900">{proyek.est_volume} tCO₂e</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per Unit</p>
                  <p className="font-semibold text-gray-900">
                    Rp {Number(proyek.price_per_unit).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Project Period</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(proyek.start_date).toLocaleDateString("en-US")} - {new Date(proyek.end_date).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {Math.round((new Date(proyek.end_date) - new Date(proyek.start_date)) / (1000 * 60 * 60 * 24 * 365))} years
                  </p>
                </div>
              </div>

              {/* Total Value */}
              <div className={`p-6 border-t ${getHeaderGradient()}`}>
                <p className="text-white/90 text-sm">Total Project Value</p>
                <p className="text-3xl font-bold text-white">
                  Rp {(proyek.est_volume * proyek.price_per_unit).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Certificate Info */}
            {certificate && (
              <div className={`bg-white p-6 rounded-2xl shadow-lg border ${
                (isRetired && isPurchased) ? 'border-gray-300' : 'border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {/* ✅ Only show "Retired" title for BUYERS who retired */}
                    {(isRetired && isPurchased) ? (
                      <>
                        <Shield className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Certificate Information (Retired)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-gray-800" />
                        Certificate Information
                      </>
                    )}
                  </h3>

                  <Link
                    to={`/dashboard/sertifikat/${certificate.cert_id}`}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-700 font-semibold text-sm group transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Full Details</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* ✅ CRITICAL FIX: PDF tab ONLY for buyers who retired */}
                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`px-3 py-1 text-sm ${activeTab === "info" ? "border-b-2 border-slate-600 font-semibold text-slate-700" : "text-gray-500"}`}
                  >
                    Info
                  </button>
                  {/* ✅ CRITICAL: Show PDF tab ONLY for buyers (isPurchased=true) who retired */}
                  {retirePdfUrl && isRetired && isPurchased && (
                    <button
                      onClick={() => setActiveTab("pdf")}
                      className={`px-3 py-1 text-sm ${activeTab === "pdf" ? "border-b-2 border-emerald-600 font-semibold text-emerald-700" : "text-gray-500"}`}
                    >
                      Retirement PDF
                    </button>
                  )}
                </div>

                {/* TAB CONTENT */}
                {activeTab === "info" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Certificate ID</p>
                        <p className="font-semibold font-mono">{certificate.cert_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">
                            {/* ✅ Show appropriate status text */}
                            {isRetired ? 'RETIRED' :
                            wasTransferred ? 'TRANSFERRED' :
                            certificate.status}
                          </p>
                          
                          {/* ✅ Badge: Retired (for anyone who has retired cert) */}
                          {isRetired && isPurchased && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Retired
                            </span>
                          )}
                          
                          {/* ✅ Badge: Sold (for sellers whose cert was transferred) */}
                          {wasTransferred && !isPurchased && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              Sold
                            </span>
                          )}
                          
                          {/* ✅ Badge: Purchased (for buyers who haven't retired) */}
                          {isPurchased && !isRetired && (
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                              Purchased
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Volume</p>
                        <p className="font-semibold">{certificate.amount} tCO₂e</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Price {(isSold && isOwner()) || isPurchased ? 'Sold' : 'per Unit'}
                        </p>
                        <p className="font-semibold">
                          Rp {Number(certificate.price_per_unit).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Issue Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expiration Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {certificate.expires_at
                            ? new Date(certificate.expires_at).toLocaleDateString("en-US", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                            : "No expiration"}
                        </p>
                      </div>

                      {/* ✅ CRITICAL: Retirement Info ONLY for BUYERS who retired */}
                      {isRetired && isPurchased && certificate.retirement_date && (
                        <>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-2">Retirement Date</p>
                            <p className="font-semibold flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-600" />
                              {new Date(certificate.retirement_date).toLocaleDateString("en-US", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {certificate.retirement_reason && (
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500 mb-2">Retirement Reason</p>
                              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <p className="text-sm text-gray-700 italic">
                                  "{certificate.retirement_reason}"
                                </p>
                              </div>
                            </div>
                          )}
                          {certificate.retirement_beneficiary && (
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500 mb-2">Beneficiary</p>
                              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <p className="text-sm text-gray-700 italic">
                                  {certificate.retirement_beneficiary}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Listing Status</p>
                        <p className="font-semibold text-gray-800">
                          {/* ✅ Show correct status based on role */}
                          {(isRetired & isPurchased)? "TRANSFERRED" :
                          isPurchased ? "PURCHASED" :
                          (wasTransferred) ? "TRANSFERRED" :
                          certificate.listed === 1 ? "Listed on Marketplace" : 
                          "Not Listed Yet"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Link
                        to={`/dashboard/sertifikat/${certificate.cert_id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold hover:from-slate-700 hover:to-slate-800"
                      >
                        <FileText className="h-5 w-5" />
                        <span>View Full Certificate</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </>
                ) : (
                  // ✅ PDF TAB - ONLY accessible by BUYERS who retired
                  <div className="mt-2">
                    {normalizePdfUrl(retirePdfUrl || certificate.retirement_confirmation_pdf) ? (
                      <>
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div className="text-sm text-gray-600">Retirement confirmation PDF</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const src = normalizePdfUrl(retirePdfUrl || certificate.retirement_confirmation_pdf);
                                const full = src.startsWith("http") ? src : `${STATIC_BASE_URL?.replace(/\/$/, "") || ""}${src}`;
                                window.open(full, "_blank", "noopener,noreferrer");
                              }}
                              className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm"
                            >
                              Open in new tab
                            </button>
                            <a
                              href={normalizePdfUrl(retirePdfUrl || certificate.retirement_confirmation_pdf)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm"
                              onClick={(e) => {
                                const src = normalizePdfUrl(retirePdfUrl || certificate.retirement_confirmation_pdf);
                                if (src && !src.startsWith("http")) {
                                  e.currentTarget.href = `${STATIC_BASE_URL?.replace(/\/$/, "") || ""}${src}`;
                                }
                              }}
                            >
                              Download
                            </a>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <iframe
                            title="Retirement confirmation"
                            src={normalizePdfUrl(retirePdfUrl || certificate.retirement_confirmation_pdf)}
                            className="w-full h-[60vh] border-0"
                            onError={() => toast.error('Failed to load PDF preview. Open in new tab to download.')}
                            onLoad={() => console.log("PDF loaded")}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="py-10 text-center text-gray-500">
                        No retirement PDF available yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Documents & Media */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Documents & Media
              </h3>
              
              {/* PDF Document */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Supporting Documents</h4>
                {proyek.doc_path ? (
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 border border-gray-100 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Download className="h-5 w-5" /> 
                    Download PDF Document
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded yet</p>
                )}
              </div>

              {/* Image Gallery */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  Project Photos ({gambarProyek.length})
                </h4>
                {gambarProyek.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gambarProyek.map((img, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={img}
                            alt={`Project ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300?text=Image+Not+Available";
                            }}
                          />
                        </div>
                        <button
                          onClick={() => window.open(img, '_blank')}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <div className="bg-white rounded-full p-2">
                            <Download className="h-5 w-5 text-gray-700" />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No photos uploaded yet</p>
                )}
              </div>
            </div>

            {/* Sell Form */}
            {tampilkanFormJual && !isSold && !isRetired && (
              <div
                ref={formJualRef}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg border-2 border-yellow-200"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Marketplace Listing Form
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Certificate ID:</p>
                    <p className="font-semibold">{certificate.cert_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume to be sold:</p>
                    <p className="font-semibold">{certificate.amount} tCO₂e</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per tCO₂e (Rp)
                    </label>
                    <input
                      type="number"
                      value={hargaJual}
                      onChange={(e) => setHargaJual(e.target.value)}
                      placeholder="Enter selling price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current price: Rp {Number(proyek.price_per_unit).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Estimated Total Value:</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      Rp {(certificate.amount * (parseInt(hargaJual) || 0)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleKonfirmasiJual}
                    disabled={isListing}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isListing ? "Processing..." : "Confirm & List"}
                  </button>
                  <button
                    onClick={() => setTampilkanFormJual(false)}
                    disabled={isListing}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-4 bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Important Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Certificate will appear on marketplace for buyers</li>
                      <li>You can cancel the listing anytime</li>
                      <li>Price can be adjusted according to market</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              <img
                src={gambarUtama}
                alt={proyek.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400?text=Image+Not+Available";
                }}
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="font-semibold mt-1">{proyek.location || "-"}</p>
              </div>
            </div>

              {/* ✅ COMPLETE FIXED: Seller CANNOT retire */}
              {statusText === "Active" && certificate && (
                <>
                  {/* ✅ PRIORITY 1: SELLER - Certificate SOLD (purple) */}
                  {isSold && !isPurchased ? (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="font-semibold mb-2">Certificate Status</h3>
                      <p className="text-sm mb-4 text-purple-100">
                        Your certificate has been sold to a buyer
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <div className="flex items-center gap-3">
                          <Package className="h-6 w-6" />
                          <div>
                            <p className="font-semibold">Status: Sold</p>
                            <p className="text-xs text-purple-100">
                              {isRetired 
                                ? 'Buyer has retired this certificate'
                                : 'Ownership transferred to buyer'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : 
                  
                  /* ✅ PRIORITY 2: BUYER - Retired purchased cert (gray) */
                  (isRetired && isPurchased) ? (
                    <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="font-semibold mb-2">Certificate Status</h3>
                      <p className="text-sm mb-4 text-gray-100">
                        Certificate has been retired
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <div className="flex items-center gap-3">
                          <Shield className="h-6 w-6" />
                          <div>
                            <p className="font-semibold">Status: Retired</p>
                            <p className="text-xs text-gray-100">
                              Successfully retired • Cannot be traded
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : 
                  
                  /* ✅ PRIORITY 3: BUYER - Purchased (not retired) - CAN retire */
                  (isPurchased && !isRetired) ? (
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="font-semibold mb-2">Project Actions</h3>
                      <p className="text-sm mb-4 text-cyan-100">
                        You own this certificate
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-3">
                        <div className="flex items-center gap-3">
                          <Package className="h-6 w-6" />
                          <div>
                            <p className="font-semibold">Status: Purchased</p>
                            <p className="text-xs text-cyan-100">
                              Ready to be retired for emission offsetting
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* ✅ Retire button - ONLY for buyers */}
                      {canRetire && (
                        <button
                          onClick={() => setShowRetireModal(true)}
                          className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                          <Shield className="h-5 w-5" />
                          Retire Certificate
                        </button>
                      )}
                    </div>
                  ) : 
                  
                  /* ✅ PRIORITY 4: SELLER - LISTED (green) */
                  certificate.listed === 1 ? (
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="font-semibold mb-2">Project Actions</h3>
                      <p className="text-sm mb-4 text-emerald-100">
                        Certificate is listed on marketplace
                      </p>
                      <div className="space-y-3">
                        <Link
                          to="/marketplace"
                          className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors block text-center"
                        >
                          View on Marketplace
                        </Link>
                        <button
                          onClick={handleBatalkanJual}
                          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                        >
                          Cancel Sale
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ✅ PRIORITY 5: SELLER - ACTIVE (green) */
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="font-semibold mb-2">Project Actions</h3>
                      <p className="text-sm mb-4 text-emerald-100">
                        Certificate is ready to be sold on marketplace
                      </p>
                      <button
                        onClick={handleMulaiJual}
                        className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <TrendingUp className="h-5 w-5" />
                        Start Selling
                      </button>
                    </div>
                  )}
                </>
              )}

            {/* Status Info - Under Review */}
            {statusText === "Under Review" && (
              <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Project Under Review
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Your project is being verified by the regulator. 
                      After approval, you can list the certificate on marketplace.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Info - No Certificate Yet */}
            {statusText === "Active" && !certificate && (
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Certificate Not Yet Available
                    </h3>
                    <p className="text-sm text-blue-700">
                      Certificate is being processed. You will be able to list on marketplace after certificate is issued.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retire Modal */}
      {showRetireModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Retire Certificate
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">⚠️ Important Warning:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Retiring certificate is <strong>PERMANENT</strong></li>
                      <li>Certificate cannot be sold or transferred again</li>
                      <li>This action <strong>CANNOT BE UNDONE</strong></li>
                      <li>Certificate will be removed from circulation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Project</p>
                <p className="font-bold text-lg">{proyek.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Certificate ID</p>
                <p className="font-mono font-bold text-lg bg-gray-50 p-3 rounded-xl">{certificate.cert_id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Volume to be retired</p>
                <p className="font-bold text-3xl text-emerald-600">
                  {certificate.amount?.toLocaleString("en-US")} <span className="text-xl">tCO₂e</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Retirement Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={retireForm.reason}
                  onChange={(e) => setRetireForm({ ...retireForm, reason: e.target.value })}
                  placeholder="Example: Used for company emissions offsetting for 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Beneficiary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={retireForm.beneficiary}
                  onChange={(e) => setRetireForm({ ...retireForm, beneficiary: e.target.value })}
                  placeholder="Name of beneficiary (required)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
              <button
                  onClick={handleRetire}
                  disabled={
                    isRetiring ||
                    !retireForm.reason.trim() ||
                    retireForm.reason.trim().length < 10 ||
                    !retireForm.beneficiary.trim()
                  }
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetiring ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Retirement"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRetireModal(false);
                    setRetireForm({ reason: "", beneficiary: "" });
                  }}
                  disabled={isRetiring}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProyekSaya;