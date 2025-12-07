import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { calculateDuration } from "../utils/dateUtils";
import {
  Leaf,
  MapPin,
  Building2,
  CheckCircle,
  Award,
  X,
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  FileText,  
  Package,   
  LogIn,
} from "lucide-react";
import API, { STATIC_BASE_URL } from "../api/axios";

const ProjectDetail = () => {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [certificate, setCertificate] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [purchaseData, setPurchaseData] = useState({
    quantity: "",
    buyerInfo: {
      name: "",
      email: "",
      company: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const res = await API.get("/certificates/marketplace");
        const data = res.data;
        if (data.success) {
          const foundProject = data.data.find(cert => cert.cert_id === certId);
  
          if (foundProject) {
            let images = [];
            try {
              if (foundProject.images_json) {
                const arr = JSON.parse(foundProject.images_json);
                if (Array.isArray(arr)) {
                  images = arr.map(img =>
                    img.startsWith("http")
                      ? img
                      : `${STATIC_BASE_URL}${img.startsWith("/") ? img : "/" + img}`
                  );
                }
              }
            } catch (e) {
              console.error("Error parsing images_json:", e);
            }

            const transformedProject = {
              id: foundProject.cert_id,
              certId: foundProject.cert_id,
              projectId: foundProject.project_id,
              title: foundProject.project_title,
              location: foundProject.project_location,
              price: foundProject.price_per_unit,
              availableVolume: foundProject.amount,
              company: foundProject.company_name || "Company",
              verified: true,
              image: images.length > 0 ? images[0] : "https://via.placeholder.com/1200x600?text=Carbon+Project",
              images: images,
              description: foundProject.project_description || "No description available",
              projectType: foundProject.project_category,
              status: foundProject.status || "active",
              issuedAt: foundProject.issued_at,
              expiresAt: foundProject.expires_at,
              isOwner: foundProject.isOwner || false
            };

            setCertificate({
              cert_id: foundProject.cert_id,
              project_id: foundProject.project_id,
              amount: foundProject.amount,
              price_per_unit: foundProject.price_per_unit,
              status: foundProject.status || 'ISSUED',
              issued_at: foundProject.issued_at,
              expires_at: foundProject.expires_at,
              listed: foundProject.listed || false,
              owner_company_id: foundProject.owner_company_id,
              retirement_date: foundProject.retirement_date,
              retirement_reason: foundProject.retirement_reason,
              retirement_beneficiary: foundProject.retirement_beneficiary
            });

            setProject(transformedProject);
          } else {
            navigate('/marketplace');
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [certId, navigate]);


  const openPurchaseModal = () => {
    // ✅ Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      const confirmed = window.confirm(
        "🔐 Login Required\n\n" +
        "You need to login first to purchase carbon credits.\n\n" +
        "Click OK to go to login page, or Cancel to stay here."
      );
      
      if (confirmed) {
        navigate('/login', { 
          state: { 
            from: window.location.pathname,
            returnTo: `/marketplace/${certId}`,
            message: 'Please login to purchase this carbon credit certificate'
          } 
        });
      }
      return;
    }
    
    // ✅ User is logged in - proceed with modal
    try {
      const parsedUser = JSON.parse(userData);
      
      setPurchaseData({
        quantity: '',
        buyerInfo: {
          name: parsedUser?.name || '',
          email: parsedUser?.email || '',
          company: parsedUser?.company || '',
        },
      });
      
      setShowPurchaseModal(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
      
      // Session corrupted - clear and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      alert("⚠️ Session error. Please login again.");
      navigate('/login');
    }
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setPurchaseData({
      quantity: 1,
      buyerInfo: {
        name: "",
        email: "",
        company: "",
      },
    });
  };

  const handlePurchaseInputChange = (field, value) => {
    if (field === "quantity") {
      // Accept only digits. Allow empty string so user can clear input.
      const str = String(value);
      const digitsOnly = str.replace(/\D/g, "");
  
      setPurchaseData((prev) => ({
        ...prev,
        quantity: digitsOnly === "" ? "" : parseInt(digitsOnly, 10),
      }));
    } else {
      // Buyer fields accept any characters (letters, numbers, symbols)
      setPurchaseData((prev) => ({
        ...prev,
        buyerInfo: { ...prev.buyerInfo, [field]: value },
      }));
    }
  };

  const processPurchase = async () => {
    const { quantity, buyerInfo } = purchaseData;
  
    if (!quantity || quantity === 1 || quantity <= 0) {
      alert("⚠️ Please enter a valid quantity!");
      return;
    }
  
    const userData = user || JSON.parse(localStorage.getItem("user") || "{}");
  
    const finalBuyerInfo = {
      name: buyerInfo.name?.trim() || userData?.name || "",
      email: buyerInfo.email?.trim() || userData?.email || "",
      company: buyerInfo.company?.trim() || userData?.company || "",
    };
  
    if (!finalBuyerInfo.name || !finalBuyerInfo.email) {
      alert("⚠️ Name and Email are required! Please fill in your contact information.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ You must login first!");
        return;
      }
  
      const response = await API.post(
        `/certificates/${project.certId}/buy`,
        {
          buyerInfo: finalBuyerInfo,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const result = response.data;
  
      // Handle forbidden, failed, success
      if (response.status !== 200 || !result.success) {
        if (response.status === 403) {
          alert(`🚫 ${result.message}\n\nYou cannot purchase your own certificate.`);
        } else {
          alert(`❌ Purchase Failed!\n\n${result.message || "An error occurred"}`);
        }
        return;
      }
  
      if (result.success) {
        const totalPrice = project.price * quantity;
        toast.success(
          <div style={{fontFamily:"Inter, monospace"}}>
            <div className="font-bold text-[17px] mb-1 flex items-center gap-2">
              <span></span> Purchase Receipt
            </div>
            <div className="border-b border-dashed border-emerald-400 my-2" />
            <div className="grid grid-cols-2 gap-x-2 text-sm mb-2">
              <div className="font-semibold text-slate-700">Project</div>
              <div>{project.title}</div>
              <div className="font-semibold text-slate-700">Amount</div>
              <div>{formatNumber(quantity)} tCO₂e</div>
              <div className="font-semibold text-slate-700">Unit Price</div>
              <div>{formatCurrency(project.price)}</div>
              <div className="font-semibold text-slate-700">Total Price</div>
              <div className="font-bold text-emerald-700">{formatCurrency(totalPrice)}</div>
            </div>
            <div className="border-b border-dotted border-gray-300 my-2" />
            <div className="grid grid-cols-2 gap-x-2 text-sm mb-2">
              <div className="font-semibold text-slate-700">Buyer</div>
              <div>{finalBuyerInfo.name}</div>
              <div className="font-semibold text-slate-700">Email</div>
              <div>{finalBuyerInfo.email}</div>
            </div>
            <div className="border-b border-dotted border-gray-300 my-2" />
            <div className="mt-1 text-emerald-700 text-xs">
              🧾<b>E-Rertificate</b> will be sent to your email.<br />
              🌱 <span className="font-semibold">Thank you for supporting the environment!</span>
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
            icon: "🧾"
          }
        );
        closePurchaseModal();
        navigate("/dashboard/project");
      }
  
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("❌ An error occurred while processing purchase. Please try again.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const durationText = calculateDuration(project?.issuedAt, project?.expiresAt) ?? "lifetime";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-semibold mt-6">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Marketplace
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative h-96 overflow-hidden rounded-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1200x600?text=Carbon+Project";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Title & Badges Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.verified && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-lg backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4" /> Verified
                </span>
              )}
              {project.isOwner && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold shadow-lg backdrop-blur-sm">
                  <Building2 className="h-4 w-4" /> Your Certificate
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold shadow-lg backdrop-blur-sm">
                <Shield className="h-4 w-4" /> {project.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-2">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {project.location}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {project.company}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-emerald-600" />
                Project Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <p className="text-sm text-gray-600 font-semibold mb-2">Price/Unit</p>
                <p className="text-2xl font-bold text-gray-800 truncate">{formatCurrency(project.price)}</p>
                <p className="text-xs text-gray-500 mt-1">per tCO₂e</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <p className="text-sm text-gray-600 font-semibold mb-2">Volume</p>
                <p className="text-2xl font-bold text-gray-600">{formatNumber(project.availableVolume)}</p>
                <p className="text-xs text-gray-500 mt-1">tCO₂e</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <p className="text-sm text-gray-600 font-semibold mb-2">Duration</p>
                <p className="text-2xl font-bold text-gray-600">{durationText}</p>
                <p className="text-xs text-gray-500 mt-1">lifetime</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <p className="text-sm text-gray-600 font-semibold mb-2">Status</p>
                <p className="text-2xl font-bold text-gray-600 capitalize">{project.status}</p>
                <p className="text-xs text-gray-500 mt-1">current</p>
              </div>
            </div>

          {/* Certificate Information - ENHANCED VERSION */}
          {certificate && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-2xl shadow-lg p-6 border-2 border-emerald-100">
              
              {/* Header with Link */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="h-6 w-6 text-emerald-600" />
                  Certificate Information
                </h2>
                
                <Link
                  to={`/dashboard/sertifikat/${certificate.cert_id}`}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-sm group transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Full Details</span>
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

              {/* Certificate Status Badge */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-150 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900">
                      Certificate Status: Active
                    </p>
                    <p className="text-sm text-emerald-700 mt-1">
                      This certificate is valid and tradeable
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Certificate ID */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificate ID
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="font-mono text-sm text-gray-800 break-all">
                      {certificate.cert_id}
                    </p>
                  </div>
                </div>

                {/* Project ID */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Project ID
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="font-mono text-sm text-gray-800 break-all">
                      {certificate.project_id}
                    </p>
                  </div>
                </div>
                
                {/* Issued Date */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Issued Date
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-800">
                      {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Expiry Date
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-800">
                      {certificate.expires_at 
                        ? new Date(certificate.expires_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No expiry'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Certificate Amount
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-800">
                      {formatNumber(certificate.amount)} <span className="text-sm font-normal text-gray-500">tCO₂e</span>
                    </p>
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Verification
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-emerald-700">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <Link
                  to={`/dashboard/sertifikat/${certificate.cert_id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Full Certificate Details</span>
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
            </div>
          )}

            {/* Project Gallery */}
            {project.images && project.images.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">📷 Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-xl overflow-hidden aspect-video"
                      onClick={() => window.open(img, '_blank')}
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x240?text=Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                          View Full Size
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Purchase Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-200">
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm font-semibold mb-2">Price per tCO₂e</p>
                  <p className="text-4xl font-bold text-emerald-600 mb-1">
                    {formatCurrency(project.price)}
                  </p>
                  <p className="text-gray-500 text-sm">per unit</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Available Volume</span>
                    <span className="font-bold text-lg">{formatNumber(project.availableVolume)} tCO₂e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Value</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(project.price * project.availableVolume)}
                    </span>
                  </div>
                </div>

                {project.isOwner ? (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900 mb-1">Your Certificate</h4>
                        <p className="text-amber-700 text-sm">
                          You cannot purchase your own certificate.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                  {/* ✅ UPDATED: Show different button based on login status */}
                  {!isLoggedIn ? (
                    <button
                      onClick={openPurchaseModal}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <LogIn className="h-5 w-5" />
                      Login to Purchase
                    </button>
                  ) : (
                    <button
                      onClick={openPurchaseModal}
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Purchase Now
                    </button>
                  )}
  
                  {/* ✅ Login hint for non-logged users */}
                  {!isLoggedIn && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Please login to purchase carbon credits
                    </p>
                  )}
                </>
                )}
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Why Choose This Project?
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Verified by international standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Immediate certificate issuance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Transparent impact tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Permanent carbon retirement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal (sama seperti sebelumnya) */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl rounded-3xl shadow-2xl overflow-hidden animate-in">
            
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Purchase Carbon Credits
                </h3>
                <p className="text-emerald-50 text-sm">Complete your transaction</p>
              </div>
              <button
                onClick={closePurchaseModal}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
              
              {/* Project Info Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-1 line-clamp-2">{project.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price per tCO₂e</p>
                    <p className="font-bold text-emerald-600">{formatCurrency(project.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Available</p>
                    <p className="font-bold text-gray-900">{formatNumber(project.availableVolume)} <span className="text-xs font-normal text-gray-500">tCO₂e</span></p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Quantity (tCO₂e) *
                </label>
                <input
                  type="text"                     
                  inputMode="numeric"       
                  pattern="\d*"                   
                  min={1}
                  max={project.availableVolume}
                  value={purchaseData.quantity ?? ""}
                  onChange={(e) => handlePurchaseInputChange("quantity", e.target.value)}
                  onKeyDown={(e) => {
                    // Allow navigation keys, backspace, delete; prevent non-digits
                    const allowed = [
                      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"
                    ];
                    if (allowed.includes(e.key)) return;
                    // If Ctrl/Cmd combinations (copy/paste), allow
                    if (e.ctrlKey || e.metaKey) return;
                    // Block anything that's not a digit
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                  }}
                  onPaste={(e) => {
                    // Prevent pasting non-digit content
                    const paste = (e.clipboardData || window.clipboardData).getData("text");
                    if (!/^\d*$/.test(paste)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg font-bold text-center transition-all"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the amount of carbon credits you want to purchase
                </p>
              </div>

              {/* Buyer Information */}
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    Buyer Information
                  </h4>
                  {(user?.name || user?.email) && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Auto-filled
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={purchaseData.buyerInfo.name || user?.name || ''}
                      onChange={e => handlePurchaseInputChange("name", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm bg-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={purchaseData.buyerInfo.email || user?.email || ''}
                      onChange={e => handlePurchaseInputChange("email", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm bg-white"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Company <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={purchaseData.buyerInfo.company || user?.company || ''}
                      onChange={e => handlePurchaseInputChange("company", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm bg-white"
                      placeholder="Company Inc."
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Order Summary</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-50">Quantity</span>
                    <span className="font-semibold">
                      {(purchaseData.quantity && purchaseData.quantity !== 1) ? purchaseData.quantity : 0} tCO₂e
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-50">Price per unit</span>
                    <span className="font-semibold">{formatCurrency(project.price)}</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-2xl font-bold">
                        {purchaseData.quantity && purchaseData.quantity !== 1 
                          ? formatCurrency(project.price * purchaseData.quantity) 
                          : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 space-y-3">
              <button
                onClick={processPurchase}
                disabled={!purchaseData.quantity || purchaseData.quantity === 1}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                <CheckCircle className="w-5 h-5" />
                Proceed to Payment
              </button>
              <button
                onClick={closePurchaseModal}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;