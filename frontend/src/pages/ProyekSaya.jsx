// frontend/src/pages/ProyekSaya.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios.js";
import {
  FiSearch, FiFilter, FiPlus, FiMapPin, FiCalendar,
  FiEye, FiGrid, FiActivity, FiCircle,
  FiPackage, FiAward, FiShoppingBag, FiShield, FiDollarSign,
  FiHome,
} from "react-icons/fi";

const categoryList = [
  "All",
  "Forestry and Land Use",
  "Renewable Energy",
  "Waste Management",
  "Sustainable Agriculture",
  "Low-Carbon Transport",
  "Industrial Carbon Technology",
  "Blue Carbon",
];

const statusColors = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Inactive: "bg-red-100 text-red-800 border-red-200",
  Review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Draft: "bg-gray-100 text-gray-800 border-gray-200",
  Sold: "bg-purple-100 text-purple-800 border-purple-200",
  Retired: "bg-gray-100 text-gray-800 border-gray-300",
};

const ProyekSaya = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [soldProjects, setSoldProjects] = useState([]);
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [retiredProjects, setRetiredProjects] = useState([]);
  const [certificates, setCertificates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // ✅ Fetch projects (mine-all)
        const resAll = await API.get("/projects/mine-all");
        const dataAll = resAll.data;
    
        // ✅ Fetch purchased projects
        const resPurchased = await API.get("/projects/purchased");
        const dataPurchased = resPurchased.data;
    
        if (dataAll.success) {
          const allProjects = dataAll.data.map(processProject);
    
          const activeProjects = [];
          const soldProjectsList = [];
          const retiredProjectsList = [];
    
          allProjects.forEach(p => {
            if (p.isSold) {
              soldProjectsList.push(p);
            } else if (p.isRetired) {
              retiredProjectsList.push(p);
            } else {
              activeProjects.push(p);
            }
          });
        
          setProjects(activeProjects);
          setSoldProjects(soldProjectsList);
          setRetiredProjects(retiredProjectsList);
        }
    
        if (dataPurchased.success) {
          const processedPurchased = dataPurchased.data.map(p => ({
            ...processProject(p),
            cert_id: p.cert_id,
            cert_amount: p.cert_amount,
            cert_price: p.cert_price,
            cert_status: p.cert_status,
            cert_issued_at: p.cert_issued_at,
            retirement_date: p.retirement_date,
            retirement_reason: p.retirement_reason,
            retirement_beneficiary: p.retirement_beneficiary,
            purchase_price: p.purchase_price,
            seller_company: p.seller_company,
            transaction_date: p.transaction_date,
            isPurchased: true,
          }));
          setPurchasedProjects(processedPurchased);
        }
      } catch (e) {
        console.error("❌ Failed to fetch projects:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalRetiredCount = React.useMemo(() => {
    const retiredFromCreated = retiredProjects.length;
    const retiredFromPurchased = purchasedProjects.filter(
      p => p.cert_status === 'RETIRED'
    ).length;
    return retiredFromCreated + retiredFromPurchased;
  }, [retiredProjects.length, purchasedProjects]);

  const processProject = (p) => {
    let projectImages = [];
    try {
      if (p.images_json) {
        const arr = JSON.parse(p.images_json);
        if (Array.isArray(arr) && arr.length > 0) {
          // Gambar di backend port 5000
          const backendOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;
          projectImages = arr.map(img => 
            img.startsWith('http') ? img : `${backendOrigin}${img.startsWith('/') ? img : '/' + img}`
          );
        }
      }
    } catch (e) {
      console.error("Error parsing images_json:", e);
    }
  
    let projectStatus = "Draft";
    if (p.is_validated === 1) {
      projectStatus = "Active";
    } else if (p.is_validated === 0) {
      projectStatus = "Review";
    } else if (p.is_validated === 2) {
      projectStatus = "Inactive";
    }
  
    const isRetired = p.cert_status === 'RETIRED';
  
    return {
      id: p.project_id,
      name: p.title,
      baseStatus: projectStatus,
      location: p.location,
      period: `${new Date(p.start_date).getFullYear()} - ${new Date(p.end_date).getFullYear()}`,
      price: `Rp ${p.price_per_unit.toLocaleString("id-ID")}`,
      image: projectImages.length > 0 ? projectImages[0] : "https://via.placeholder.com/400x200?text=Carbon+Project",
      category: p.category,
      carbonCredit: `${p.est_volume} tCO₂e`,
      estVolume: p.est_volume,
      pricePerUnit: p.price_per_unit,
      lastUpdate: new Date(p.updated_at).toLocaleDateString("en-US"),
      isValidated: p.is_validated,
      isSold: p.is_sold === 1,
      isRetired: isRetired,
      certStatus: p.cert_status,
      buyerCompany: p.buyer_company,
      soldDate: p.sold_date,
      soldPrice: p.sold_price,
      certAmount: p.cert_amount,
      retirement_date: p.retirement_date || null,
      retirement_reason: p.retirement_reason || null,
      retirement_beneficiary: p.retirement_beneficiary || null,
      retirementDate: p.retirement_date || null,
      retirementReason: p.retirement_reason || null,
      retirementBeneficiary: p.retirement_beneficiary || null,
    };
  };
  
  
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await API.get("/certificates/mine");
        const data = res.data;
        
        if (data.success) {
          const certMap = {};
          data.data.forEach(cert => {
            certMap[cert.project_id] = cert;
          });
          setCertificates(certMap);
          
          setProjects(prevProjects => {
            const updatedActive = [];
            const newRetired = [];
            
            prevProjects.forEach(project => {
              const cert = certMap[project.id];
              if (cert && cert.status === 'RETIRED') {
                console.log("🔄 Moving project to retired:", project.id);
                console.log("   Certificate retirement data:", {
                  retirement_date: cert.retirement_date,
                  retirement_reason: cert.retirement_reason,
                  retirement_beneficiary: cert.retirement_beneficiary
                });
                
                newRetired.push({
                  ...project,
                  isRetired: true,
                  certificate: cert,
                  
                  retirement_date: cert.retirement_date,
                  retirement_reason: cert.retirement_reason,
                  retirement_beneficiary: cert.retirement_beneficiary,
                  
                  retirementDate: cert.retirement_date,
                  retirementReason: cert.retirement_reason,
                  retirementBeneficiary: cert.retirement_beneficiary,
                });
              } else {
                updatedActive.push(project);
              }
            });
            
            if (newRetired.length > 0) {
              setRetiredProjects(prev => {
                console.log("📈 Adding retired projects:", newRetired.length);
                console.log("   Retirement data check:", newRetired.map(p => ({
                  id: p.id,
                  name: p.name,
                  hasRetirementDate: !!p.retirement_date,
                  hasRetirementReason: !!p.retirement_reason,
                  cert_retirement_date: p.certificate?.retirement_date
                })));
                return [...prev, ...newRetired];
              });
            }
            
            console.log("📊 After certificate check:");
            console.log("   Active remaining:", updatedActive.length);
            console.log("   Newly retired:", newRetired.length);
            
            return updatedActive;
          });
        }
      } catch (e) {
        console.error("❌ Failed to fetch certificates:", e);
      }
    };
    
    fetchCertificates();
    
    const interval = setInterval(fetchCertificates, 30000);
    
    return () => clearInterval(interval);
  }, []); 

const getDisplayProjects = () => {
  if (activeTab === "purchased") {
    return purchasedProjects;
  } else if (activeTab === "sold") {
    return soldProjects;
  } else if (activeTab === "retired") {
    const retiredCreated = retiredProjects.map(project => {
      const cert = certificates[project.id];
      return {
        ...project,
        certificate: cert || project.certificate,
        isRetired: true,
        source: 'created', 
      };
    });
    
    const retiredPurchased = purchasedProjects
      .filter(p => p.cert_status === 'RETIRED')
      .map(project => ({
        ...project,
        isRetired: true,
        source: 'purchased', 
      }));
    
    return [...retiredCreated, ...retiredPurchased];
  }
  
  return projects.map(project => {
    const cert = certificates[project.id];
    
    if (cert && cert.status === 'RETIRED') {
      return null;
    }
    
    if (cert) {
      return {
        ...project,
        carbonCredit: `${cert.amount} tCO₂e`,
        actualVolume: cert.amount,
        isCertified: true,
        certStatus: cert.status,
        certificate: cert,
      };
    }
    return {
      ...project,
      actualVolume: project.estVolume,
      isCertified: false,
      certStatus: null,
      certificate: null,
    };
  }).filter(Boolean);
};

  const displayProjects = getDisplayProjects();

  const filteredProjects = displayProjects.filter((project) => {
    const matchNameLocation =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      project.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchNameLocation && matchCategory;
  });

  const getTotalStats = () => {
    const allCreatedWithCert = projects.map(p => {
      const cert = certificates[p.id];
      return { 
        ...p, 
        certificate: cert, 
        certStatus: cert?.status,
      };
    });
    
    const allProjects = [...allCreatedWithCert, ...purchasedProjects];
    
    const activeCount = allProjects.filter((p) => {
      if (p.baseStatus !== "Active") return false;
      
      let isRetired = false;
      if (p.isPurchased && p.cert_status === 'RETIRED') {
        isRetired = true;
      }
      if (!p.isPurchased && p.certificate && p.certificate.status === 'RETIRED') {
        isRetired = true;
      }
      if (isRetired) return false;
      
      let isSold = false;
      if (!p.isPurchased && p.certificate && p.certificate.status === 'TRANSFERRED') {
        isSold = true;
      }
      if (isSold) return false;
      
      return true;
    }).length;
    
    const retiredFromCreated = retiredProjects.length;
    const retiredFromPurchased = purchasedProjects.filter(
      p => p.cert_status === 'RETIRED'
    ).length;
    const totalRetired = retiredFromCreated + retiredFromPurchased;
    
    const carbonCredit = displayProjects.reduce((total, project) => {
      return total + (project.actualVolume || project.estVolume || 0);
    }, 0);
    
    const totalProjects = projects.length + soldProjects.length + retiredProjects.length;
    
    console.log("📊 Stats Calculation:");
    console.log("   Created Projects:", projects.length);
    console.log("   Purchased Projects:", purchasedProjects.length);
    console.log("   Retired (Created):", retiredFromCreated);
    console.log("   Retired (Purchased):", retiredFromPurchased);
    console.log("   Total Retired:", totalRetired);
    console.log("   Total Projects:", totalProjects);
    
    return {
      total: totalProjects,
      active: activeCount,
      carbonCredit: Math.round(carbonCredit),
      sold: soldProjects.length,
      retired: totalRetired, 
    };
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* ✅ PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Link to="/" className="hover:text-emerald-600 transition-colors">
                <FiHome className="inline" /> Home
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">My Projects</span>
            </div>
          </div>
          <Link
            to="/dashboard/pengajuan"
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center gap-2"
          >
            <FiPlus className="text-lg" />
            Add New Project
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="py-8 px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard label="Total Projects" value={stats.total} icon={<FiGrid />} color="cyan" />
            <StatCard label="Active Projects" value={stats.active} icon={<FiActivity />} color="emerald" />
            <StatCard label="Projects Sold" value={stats.sold} icon={<FiDollarSign />} color="purple" />
            <StatCard label="Retired Projects" value={stats.retired} icon={<FiShield />} color="gray" />
            <StatCard label="Total Carbon Credits" value={`${Math.round(stats.carbonCredit).toLocaleString("en-US")} tCO₂e`} icon={<FiCircle />} color="blue" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
            {/* Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex px-6 overflow-x-auto">
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "created"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-emerald-600"
                  }`}
                  onClick={() => setActiveTab("created")}
                >
                  <FiAward className="w-4 h-4" />
                  Active Projects ({projects.length})
                </button>
                
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "sold"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("sold")}
                >
                  <FiDollarSign className="w-4 h-4" />
                  Sales History ({soldProjects.length})
                </button>

                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "retired"
                      ? "border-gray-500 text-gray-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("retired")}
                >
                  <FiShield className="w-4 h-4" />
                  Retired Projects ({totalRetiredCount})
                </button>
                
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "purchased"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-cyan-600"
                  }`}
                  onClick={() => setActiveTab("purchased")}
                >
                  <FiShoppingBag className="w-4 h-4" />
                  Purchased Projects ({purchasedProjects.length})
                </button>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search project name or location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white min-w-[250px]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryList.map((category, idx) => (
                    <option key={idx} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                isPurchased={activeTab === "purchased"}
                isSoldHistory={activeTab === "sold"}
                isRetiredTab={activeTab === "retired"}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <FiGrid className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "created"
                  ? projects.length === 0 
                    ? "You don't have any projects yet. Start by creating your first project!" 
                    : "Try changing your search keywords or category filter"
                  : activeTab === "sold"
                  ? "No projects have been sold yet"
                  : activeTab === "retired"
                  ? "No projects have been retired yet"
                  : "No projects purchased from marketplace yet"
                }
              </p>
              {activeTab === "created" ? (
                <Link 
                  to="/dashboard/pengajuan" 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center gap-2"
                >
                  <FiPlus /> {projects.length === 0 ? "Create First Project" : "Add New Project"}
                </Link>
              ) : activeTab === "purchased" ? (
                <Link 
                  to="/marketplace" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center gap-2"
                >
                  <FiShoppingBag /> Browse Marketplace
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex justify-between items-center hover:shadow-xl transition-all">
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600 text-xl`}>
      {icon}
    </div>
  </div>
);

const ProjectCard = ({ project, isPurchased, isSoldHistory, isRetiredTab }) => {
  // ✅ FIXED: Determine if retired
  let isRetired = false;
  
  if (isRetiredTab) {
    isRetired = true;
  } else if (isSoldHistory) {
    isRetired = false; // Sales history never shows as retired
  } else if (isPurchased) {
    isRetired = project.cert_status === 'RETIRED';
  } else {
    isRetired = project.certificate?.status === 'RETIRED' || project.isRetired;
  }
  
  // ✅ Check if sold (but NOT in sales history tab)
  const isSold = isSoldHistory || 
                 (!isPurchased && !isRetired && project.certificate?.status === 'TRANSFERRED');
  
  // ✅ Check if listed
  const isListed = !isPurchased && 
                   !isRetired && 
                   !isSold && 
                   project.certificate?.listed === 1;
  
  // ✅ FIXED: Display status logic
  let displayStatus;
  if (isSoldHistory) {
    displayStatus = "Sold";
  } else if (isRetired) {
    displayStatus = "Retired";
  } else if (isSold) {
    displayStatus = "Sold";
  } else {
    displayStatus = project.baseStatus;
  }

  // ✅ FIXED: Determine if this is a purchased project (for coloring)
  const isPurchasedProject = isPurchased || project.isPurchased;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Carbon+Project";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* ✅ Badge: Sales History = SOLD */}
        {isSoldHistory && (
          <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
            <FiPackage className="h-3 w-3" />
            SOLD
          </div>
        )}
        
        {/* ✅ Badge: Retired (GRAY) - NOT in sales history */}
        {!isSoldHistory && isRetired && (
          <div className="absolute top-4 right-4 bg-gray-800/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
            <FiShield className="h-3 w-3" />
            RETIRED
          </div>
        )}
        
        {/* ✅ Badge: Sold (non-sales-history) */}
        {!isSoldHistory && isSold && !isRetired && (
          <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
            <FiPackage className="h-3 w-3" />
            SOLD
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Status badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            statusColors[displayStatus] || statusColors.Draft
          }`}>
            {displayStatus === "Sold" && <FiPackage className="inline h-3 w-3 mr-1" />}
            {displayStatus === "Retired" && !isSoldHistory && <FiShield className="inline h-3 w-3 mr-1" />}
            {displayStatus}
          </span>
          
          {/* Sold date (sales history) */}
          {isSoldHistory && project.soldDate && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {new Date(project.soldDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
          )}
          
          {/* Certified badge */}
          {!isSold && !isRetired && !isSoldHistory && project.isCertified && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
              ✓ Certified
            </span>
          )}
          
          {/* On Marketplace badge */}
          {isListed && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              On Marketplace
            </span>
          )}

          {/* Purchased badge (only if NOT retired) */}
          {isPurchasedProject && !isRetired && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
              Purchased
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{project.category}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <FiMapPin className="flex-shrink-0" /> 
            <span className="truncate">{project.location}</span>
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar className="flex-shrink-0" /> 
            {project.period}
          </span>
        </div>

        {/* ✅ FIXED: Volume box colors */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`rounded-xl p-3 border ${
            isSoldHistory ? 'bg-gray-50 border-gray-200' : 
            isRetired ? 'bg-gray-50 border-gray-200' :
            isSold ? 'bg-gray-50 border-gray-200' : 
            'bg-gray-50 border-gray-200'
          }`}>
            <p className="text-xs text-gray-600 mb-1">
              {isSoldHistory ? "Volume Sold" :
               isPurchasedProject && project.cert_amount ? "Certificate Volume" : 
               project.isCertified ? "Certified Volume" : "Est. Carbon Credits"}
            </p>
            <p className={`font-bold ${
              isSoldHistory ? 'text-gray-600' :
              isRetired ? 'text-gray-600' :
              isSold ? 'text-gray-600' : 
              'text-gray-600'
            }`}>
              {isSoldHistory && project.certAmount
                ? `${project.certAmount} tCO₂e`
                : isPurchasedProject && project.cert_amount 
                ? `${project.cert_amount} tCO₂e`
                : project.carbonCredit
              }
            </p>
            {project.certificate && !isSoldHistory && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                ID: {project.certificate.cert_id}
              </p>
            )}
            {isPurchasedProject && project.cert_id && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                ID: {project.cert_id}
              </p>
            )}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">
              {(isSold || isSoldHistory) ? "Total Price" : "Price per Unit"}
            </p>
            <p className="font-bold text-gray-600">
              {isSoldHistory && project.soldPrice
                ? `Rp ${project.soldPrice.toLocaleString("id-ID")}`
                : project.price
              }
            </p>
          </div>
        </div>

        {/* Buyer info (sales history) */}
        {isSoldHistory && project.buyerCompany && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Purchased by</p>
            <p className="font-semibold text-gray-800 text-sm truncate">
              {project.buyerCompany}
            </p>
            {project.soldDate && (
              <p className="text-xs text-gray-600 mt-1">
                {new Date(project.soldDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            )}
          </div>
        )}

        {/* Seller info (purchased projects) */}
        {isPurchasedProject && project.seller_company && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Purchased from</p>
            <p className="font-semibold text-gray-800 text-sm truncate">{project.seller_company}</p>
            {project.purchase_price && (
              <p className="text-xs text-gray-600 mt-1">
                Rp {project.purchase_price.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        )}

        {/* ✅ Retirement info (NOT in sales history) */}
        {!isSoldHistory && isRetired && (
          project.retirement_date || 
          project.retirementDate ||
          project.certificate?.retirement_date
        ) && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <FiShield className="h-3 w-3" />
              Retired on
            </p>
            <p className="text-xs text-gray-700 font-medium mb-2">
              {new Date(
                project.retirement_date || 
                project.retirementDate ||
                project.certificate?.retirement_date
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
            {(
              project.retirement_reason || 
              project.retirementReason ||
              project.certificate?.retirement_reason
            ) && (
              <p className="text-xs text-gray-600 italic line-clamp-2">
                "{project.retirement_reason || project.retirementReason || project.certificate?.retirement_reason}"
              </p>
            )}
            {(
              project.retirement_beneficiary ||
              project.retirementBeneficiary ||
              project.certificate?.retirement_beneficiary
            ) && (
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Beneficiary:</span> {
                  project.retirement_beneficiary || 
                  project.retirementBeneficiary ||
                  project.certificate?.retirement_beneficiary
                }
              </p>
            )}
          </div>
        )}

        {/* ✅ FIXED: View Details button - Correct color for retired */}
        <Link 
          to={`/dashboard/project/${project.id}${isPurchasedProject ? '?purchased=true' : ''}`}
          className={`${
            isSoldHistory ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-purple-800' :
            isRetired ? 'bg-gradient-to-r from-gray-500 to-gray-700' :
            isSold ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-purple-800' : 
            'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-cyan-700'
          } text-white py-2.5 px-4 rounded-xl block text-center hover:shadow-lg transition-all duration-300 font-medium`}
        >
          <FiEye className="inline mr-2" /> View Details
        </Link>
      </div>
    </div>
  );
};

export default ProyekSaya;