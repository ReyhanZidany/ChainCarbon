import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Sun,
  Factory,
  Recycle,
  Bus,
  Building2,
  Globe,
  Search,
  Filter,
  MapPin,
  Grid,
  List,
  CheckCircle,
  Zap,
  TreePine,
  Droplets,
  X,
  Heart,
  TrendingUp,
  Award,
  ChevronDown,
} from "lucide-react";
import toast from 'react-hot-toast';


// ✅ Helper function to get API base URL
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = 5000;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  return `http://${hostname}:${port}`;
};

const categories = [
  { id: "all", label: "All Projects", icon: Globe },
  { id: "offset", label: "Offset Projects", icon: Leaf },
  { id: "captrade", label: "Cap & Trade", icon: Building2 },
];

const subCategories = [
  { id: "forestry", label: "Forestry", icon: TreePine, color: "emerald" },
  { id: "renewable", label: "Renewable Energy", icon: Sun, color: "yellow" },
  { id: "efficiency", label: "Energy Efficiency", icon: Zap, color: "blue" },
  { id: "waste", label: "Waste Management", icon: Recycle, color: "green" },
  { id: "transport", label: "Transportation", icon: Bus, color: "indigo" },
  { id: "industry", label: "Industry", icon: Factory, color: "gray" },
  { id: "water", label: "Water Management", icon: Droplets, color: "cyan" },
  { id: "agriculture", label: "Agriculture", icon: Leaf, color: "lime" },
];

const Marketplace = () => {
  const navigate = useNavigate(); 
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [purchaseData, setPurchaseData] = useState({
    quantity: 1,
    buyerInfo: {
      name: "",
      email: "",
      company: "",
    },
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const mapCategoryToSub = (category) => {
    const mapping = {
      "Forestry and Land Use": "forestry",
      "Renewable Energy": "renewable",
      "Waste Management": "waste",
      "Sustainable Agriculture": "agriculture",
      "Low-Carbon Transport": "transport",
      "Industrial Carbon Technology": "industry",
      "Blue Carbon": "water",
      "Kehutanan dan Lahan": "forestry",
      "Energi Terbarukan": "renewable",
      "Pengelolaan Sampah dan Limbah": "waste",
      "Pertanian Berkelanjutan": "agriculture",
      "Transportasi Rendah Karbon": "transport",
      "Industri dan Teknologi Karbon": "industry",
      "Karbon Biru": "water"
    };
    return mapping[category] || "forestry";
  };

  const calculateDuration = (start, end) => {
    if (!end) return "25 years";
    const years = Math.floor((new Date(end) - new Date(start)) / (365 * 24 * 60 * 60 * 1000));
    return `${years} years`;
  };

  const fetchMarketplace = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = getApiBaseUrl();
      
      const headers = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_BASE_URL}/api/certificates/marketplace`, {
        headers
      });
      
      const data = await res.json();
      if (data.success) {
        const transformedData = data.data.map(cert => {
          let images = [];
          try {
            if (cert.images_json) {
              const arr = JSON.parse(cert.images_json);
              if (Array.isArray(arr)) {
                images = arr.map(img => 
                  img.startsWith('http') ? img : `${API_BASE_URL}${img}`
                );
              }
            }
          } catch (e) {
            console.error("Error parsing images_json:", e);
          }

          return {
            id: cert.cert_id,
            certId: cert.cert_id,
            projectId: cert.project_id,
            title: cert.project_title,
            category: "offset",
            subCategory: mapCategoryToSub(cert.project_category),
            location: cert.project_location,
            price: cert.price_per_unit,
            currency: "IDR",
            volume: cert.amount,
            availableVolume: cert.amount,
            company: cert.company_name || "Company",
            ownerCompanyId: cert.owner_company_id,
            verified: true,
            image: images.length > 0 
              ? images[0] 
              : "https://via.placeholder.com/400x240?text=Carbon+Project",
            images: images,
            description: cert.project_description || "No description available",
            projectType: cert.project_category,
            startDate: new Date(cert.issued_at).toISOString().split('T')[0],
            duration: calculateDuration(cert.issued_at, cert.expires_at),
            status: "active",
            listed: cert.listed === 1,
            issuedAt: cert.issued_at,
            expiresAt: cert.expires_at,
            isOwner: cert.isOwner || false
          };
        });
        setProjects(transformedData);
      }
    } catch (error) {
      console.error("Error fetching marketplace:", error);
    } finally {
      setLoading(false);
    }
  }, []); 

    // ✅ Persist wishlist to localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('chaincarbon_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('chaincarbon_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  // ✅ Prevent body scroll when modals are open
  useEffect(() => {
    if (showModal || showPurchaseModal || showWishlistModal || showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showPurchaseModal, showWishlistModal, showFilters]);

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
          <p className="text-gray-600 text-lg font-semibold mt-6">Loading marketplace...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const openProjectDetail = (project) => {
    navigate(`/marketplace/${project.certId}`);
  };  

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  const openPurchaseModal = (project) => {
    setSelectedProject(project);
    
    // ✅ Pre-fill buyer info dari user data
    const userData = user || JSON.parse(localStorage.getItem("user") || '{}');
    
    setPurchaseData({
      quantity: '',
      buyerInfo: {
        name: userData?.name || '',
        email: userData?.email || '',
        company: userData?.company || '',
        phone: userData?.phone || '',
      },
    });
    
    setShowPurchaseModal(true);
    setShowModal(false);
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
      setPurchaseData((prev) => ({ ...prev, quantity: parseInt(value) || 1 }));
    } else {
      setPurchaseData((prev) => ({
        ...prev,
        buyerInfo: { ...prev.buyerInfo, [field]: value },
      }));
    }
  };

  const processPurchase = async () => {
    const { quantity, buyerInfo } = purchaseData;
    
    if (!buyerInfo.name || !buyerInfo.email) {
      toast.error("⚠️ Name and Email are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("⚠️ You must login first!");
        return;
      }

      const API_BASE_URL = getApiBaseUrl();
  
      const response = await fetch(
        `${API_BASE_URL}/api/certificates/${selectedProject.certId}/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            buyerInfo: {
              name: buyerInfo.name,
              email: buyerInfo.email,
              company: buyerInfo.company,
            }
          })
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("You cannot purchase your own certificate.", { 
            icon: '🚫',
            duration: 4000 
          });
        } else {
          toast.error(`Purchase failed: ${result.message}`, {
            icon: '❌',
            duration: 4000
          });
        }
        return;
      }
  
      if (result.success) {
        const totalPrice = selectedProject.price * quantity;
        
        toast.success(
          <div>
            <p className="font-semibold mb-1">Purchase Successful!</p>
            <p className="text-sm">{selectedProject.title}</p>
            <p className="text-sm">Amount: {formatNumber(quantity)} tCO₂e</p>
            <p className="text-sm">Total: {formatCurrency(totalPrice)}</p>
            <p className="text-xs mt-2">Certificate will be sent to your email</p>
          </div>,
          {
            duration: 6000,
            style: {
              background: '#10b981',
              color: '#fff',
              minWidth: '300px',
            },
          }
        );
  
        closePurchaseModal();
        fetchMarketplace();
      }
  
    } catch (error) {
      console.error("Purchase error:", error);
      alert("❌ An error occurred while processing purchase. Please try again.");
    }
  };

  const isInWishlist = (projectId) => {
    return wishlist.some((item) => item.id === projectId);
  };

  const addToWishlist = (project) => {
    if (!isInWishlist(project.id)) {
      setWishlist((prev) => [...prev, { ...project, addedAt: new Date() }]);
      toast.success(`❤️ ${project.title} successfully added to wishlist!`);
    } else {
      toast.info("ℹ️ Project already in your wishlist.");
    }
  };

  const removeFromWishlist = (projectId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== projectId));
  };

  const openWishlistModal = () => {
    setShowWishlistModal(true);
  };

  const closeWishlistModal = () => {
    setShowWishlistModal(false);
  };

  const clearAllWishlist = () => {
    if (window.confirm("Are you sure you want to remove all items from wishlist?")) {
      setWishlist([]);
      toast.success("✅ All items successfully removed from wishlist.");
    }
  };

  const filteredProjects = projects
    .filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory)
        return false;
      if (
        selectedSubCategory !== "all" &&
        project.subCategory !== selectedSubCategory
      )
        return false;
      if (
        searchTerm &&
        !project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      if (project.price < priceRange[0] || project.price > priceRange[1])
        return false;
      return true;
    });

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

  const getSubCategoryColor = (subCategory) => {
    const sub = subCategories.find((s) => s.id === subCategory);
    return sub ? sub.color : "gray";
  };

  const getSubCategoryIcon = (subCategory) => {
    const sub = subCategories.find((s) => s.id === subCategory);
    return sub ? sub.icon : Factory;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      {/* Enhanced Hero Section - ORIGINAL DESIGN */}
      <div className="relative bg-gradient-to-r from-emerald-600/95 via-emerald-500/95 to-cyan-600/95 text-white py-20 px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/reforestation.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-emerald-800/75 to-cyan-900/80"></div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-bold mb-5 tracking-tight drop-shadow-lg">
              Carbon Marketplace
            </h1>
            <p className="text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Discover and invest in high-quality carbon projects to support a sustainable future
            </p>
          </div>

          {/* Enhanced Search Bar - ORIGINAL DESIGN */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search carbon projects or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-5 py-4 rounded-2xl w-full text-gray-800 text-lg shadow-2xl border-2 border-white/20 focus:border-white focus:outline-none transition-all backdrop-blur-sm bg-white/95"
                />
              </div>
              <button
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all shadow-2xl border-2 border-white/20 hover:border-white/40 font-semibold text-lg"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-6 w-6" /> 
                <span className="hidden sm:inline">Advanced Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
              <button
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-rose-500/90 hover:bg-rose-600 backdrop-blur-sm transition-all shadow-2xl border-2 border-rose-400/50 hover:border-rose-300 font-semibold text-lg relative"
                onClick={openWishlistModal}
              >
                <Heart className="h-6 w-6" />
                <span className="hidden sm:inline">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-rose-600 text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Stats Section - ORIGINAL DESIGN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl">
              <div className="text-4xl font-bold drop-shadow-lg">{projects.length}</div>
              <div className="text-base opacity-95 mt-1 drop-shadow-md">Available Projects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl">
              <div className="text-4xl font-bold drop-shadow-lg">{formatNumber(projects.reduce((sum, p) => sum + p.availableVolume, 0))}</div>
              <div className="text-base opacity-95 mt-1 drop-shadow-md">Total tCO₂e</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl">
              <div className="text-4xl font-bold drop-shadow-lg">100%</div>
              <div className="text-base opacity-95 mt-1 drop-shadow-md">Verified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl">
              <div className="text-4xl font-bold drop-shadow-lg">{wishlist.length}</div>
              <div className="text-base opacity-95 mt-1 drop-shadow-md">In Wishlist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar - ORIGINAL DESIGN */}
      <div className="bg-white shadow-md border-b sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          {/* ✅ Mobile Category Selector - ONLY FOR MOBILE */}
          <div className="block lg:hidden mb-5">
            <button
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
            >
              <span>Category: {categories.find(c => c.id === activeCategory)?.label}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showMobileCategories && (
              <div className="mt-2 bg-white border rounded-lg shadow-lg">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowMobileCategories(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold border-b last:border-b-0 ${
                      activeCategory === cat.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                    }`}
                  >
                    <cat.icon className="h-5 w-5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Tabs - ORIGINAL DESIGN FOR DESKTOP */}
          <div className="hidden lg:flex flex-wrap gap-4 items-center mb-5">
            <span className="text-base font-bold text-gray-700">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <cat.icon className="h-5 w-5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub-category Pills - ORIGINAL DESIGN */}
          <div className="flex items-start gap-4 flex-wrap mb-5">
            <span className="text-base font-bold text-gray-700 flex-shrink-0 mt-2 hidden sm:block">Sector:</span>
            <div className="flex flex-wrap gap-3 flex-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <button
                onClick={() => setSelectedSubCategory("all")}
                className={`px-6 py-2.5 rounded-full font-semibold text-base transition-all whitespace-nowrap ${
                  selectedSubCategory === "all"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Sectors
              </button>
              {subCategories.map((sub) => {
                const isActive = selectedSubCategory === sub.id;
                const colorClasses = {
                  emerald: isActive ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                  yellow: isActive ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                  blue: isActive ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100",
                  green: isActive ? "bg-green-500 text-white" : "bg-green-50 text-green-700 hover:bg-green-100",
                  indigo: isActive ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                  gray: isActive ? "bg-gray-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100",
                  cyan: isActive ? "bg-cyan-500 text-white" : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
                  lime: isActive ? "bg-lime-500 text-white" : "bg-lime-50 text-lime-700 hover:bg-lime-100",
                };
                
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-base transition-all whitespace-nowrap ${colorClasses[sub.color]} ${isActive ? 'shadow-lg' : ''}`}
                  >
                    <sub.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort and View Controls - ORIGINAL DESIGN */}
          <div className="flex items-center justify-between pt-5 border-t-2">
            <div className="text-base text-gray-600 font-medium">
              Showing <span className="font-bold text-emerald-600 text-lg">{filteredProjects.length}</span> projects
            </div>
            <div className="flex gap-4 items-center">
              <select
                className="border-2 border-gray-200 rounded-xl px-5 py-3 text-base font-semibold focus:border-emerald-500 focus:outline-none transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recent Project</option>
                <option value="featured">Most Popular</option>
                <option value="price_low">Lowest Price</option>
                <option value="price_high">Highest Price</option>
                <option value="volume">Highest Volume</option>
              </select>
              <div className="hidden sm:flex gap-2 bg-gray-100 rounded-xl p-1.5">
                <button
                  className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-emerald-600 shadow-md" : "text-gray-600 hover:text-gray-800"}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid className="h-6 w-6" />
                </button>
                <button
                  className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-emerald-600 shadow-md" : "text-gray-600 hover:text-gray-800"}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Enhanced Filter Modal - ORIGINAL DESIGN */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all animate-in">
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Filter className="h-6 w-6" />
                Advanced Filters
              </h2>
              <p className="text-sm opacity-90 mt-1">Customize your search</p>
            </div>
            
            <button 
              className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full p-1 transition-colors" 
              onClick={() => setShowFilters(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">Price Range (IDR)</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      min={0}
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-gray-400 font-semibold">—</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min={priceRange[0]}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Grid/List - ORIGINAL DESIGN */}
      <div className="max-w-[1800px] mx-auto px-8 py-12">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-2xl text-gray-600 font-semibold">No matching projects found</p>
            <p className="text-gray-400 mt-3 text-lg">Try adjusting your search filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredProjects.map((p) => {
              const SubIcon = getSubCategoryIcon(p.subCategory);
              const subCategoryLabel = subCategories.find(s => s.id === p.subCategory)?.label;
              const colorClass = getSubCategoryColor(p.subCategory);
              
              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => openProjectDetail(p)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x240?text=Carbon+Project";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                    
                    <button
                      className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all ${
                        isInWishlist(p.id) 
                          ? "bg-rose-500 text-white shadow-lg scale-110" 
                          : "bg-white/90 hover:bg-white text-gray-700"
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist(p);
                      }}
                      aria-label="Wishlist"
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(p.id) ? "fill-current" : ""}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-${colorClass}-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm`}>
                        <SubIcon className="h-4 w-4" /> 
                        {subCategoryLabel}
                      </span>
                      {p.verified && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                          <CheckCircle className="h-4 w-4" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[3.5rem]">
                      {p.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" /> 
                      <span className="line-clamp-1">{p.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{p.company}</span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-xs text-gray-400 block mb-1">Price per unit</span>
                          <span className="text-emerald-600 font-bold text-xl">
                            {formatCurrency(p.price)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/ tCO₂e</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 block mb-1">Available</span>
                          <span className="text-gray-700 font-semibold text-base">
                            {formatNumber(p.availableVolume)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">tCO₂e</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredProjects.map((p) => {
              const SubIcon = getSubCategoryIcon(p.subCategory);
              const subCategoryLabel = subCategories.find(s => s.id === p.subCategory)?.label;
              const colorClass = getSubCategoryColor(p.subCategory);
              
              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 cursor-pointer transition-all flex"
                  onClick={() => openProjectDetail(p)}
                >
                  <div className="relative w-80 flex-shrink-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x240?text=Carbon+Project";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                  </div>
                  
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-${colorClass}-100 text-${colorClass}-700 text-sm font-bold`}>
                        <SubIcon className="h-4 w-4" /> 
                        {subCategoryLabel}
                      </span>
                      {p.verified && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                          <CheckCircle className="h-4 w-4" /> Verified
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-2xl mb-3 group-hover:text-emerald-600 transition-colors">
                      {p.title}
                    </h3>
                    
                    <div className="flex items-center gap-6 text-gray-500 text-base mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> 
                        {p.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {p.company}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-base line-clamp-2 mb-5 flex-grow leading-relaxed">
                      {p.description}
                    </p>
                    
                    <div className="flex items-end justify-between mt-auto pt-5 border-t-2">
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Price per unit</span>
                        <span className="text-emerald-600 font-bold text-3xl">
                          {formatCurrency(p.price)}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">/ tCO₂e</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block mb-1">Available Volume</span>
                        <span className="text-gray-700 font-bold text-2xl">
                          {formatNumber(p.availableVolume)} <span className="text-base font-normal text-gray-500">tCO₂e</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className={`p-5 m-5 rounded-full self-start transition-all ${
                      isInWishlist(p.id) 
                        ? "bg-rose-100 text-rose-600" 
                        : "bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600"
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist(p);
                    }}
                    aria-label="Wishlist"
                  >
                    <Heart className={`h-7 w-7 ${isInWishlist(p.id) ? "fill-current" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

{/* ✅ Project Detail Modal - Mobile Responsive */}
{showModal && selectedProject && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
    <div className="bg-white w-full h-full sm:h-auto sm:max-w-5xl sm:rounded-2xl shadow-2xl overflow-y-auto sm:max-h-[95vh]">
      {/* Hero Section with Image */}
      <div className="relative">
        <img
          src={selectedProject.image}
          alt={selectedProject.title}
          className="h-48 sm:h-64 md:h-80 lg:h-96 w-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1200x400?text=Carbon+Project";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Title & Badges Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            {(() => {
              const SubIcon = getSubCategoryIcon(selectedProject.subCategory);
              const subCategoryLabel = subCategories.find(s => s.id === selectedProject.subCategory)?.label;
              const colorClass = getSubCategoryColor(selectedProject.subCategory);
              
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-${colorClass}-500 text-white text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm`}>
                  <SubIcon className="h-3 w-3 sm:h-4 sm:w-4" /> 
                  {subCategoryLabel}
                </span>
              );
            })()}
            {selectedProject.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> Verified
              </span>
            )}
            {selectedProject.isOwner && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" /> Your Certificate
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg line-clamp-2">{selectedProject.title}</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Location & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mt-1 flex-shrink-0" /> 
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Location</p>
              <p className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{selectedProject.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Company/Owner</p>
              <p className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{selectedProject.company}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Project Type</p>
              <p className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{selectedProject.projectType}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8">
          <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            Project Description
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedProject.description}</p>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-emerald-200">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Price/Unit</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 truncate">{formatCurrency(selectedProject.price)}</p>
            <p className="text-xs text-gray-500 mt-1">per tCO₂e</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-blue-200">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Volume</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{formatNumber(selectedProject.availableVolume)}</p>
            <p className="text-xs text-gray-500 mt-1">tCO₂e</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-purple-200">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Duration</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{selectedProject.duration}</p>
            <p className="text-xs text-gray-500 mt-1">lifetime</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Status</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 capitalize">{selectedProject.status}</p>
            <p className="text-xs text-gray-500 mt-1">current</p>
          </div>
        </div>

        {/* Certificate Information Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-emerald-200">
          <h3 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            Certificate Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">Certificate ID</p>
                <p className="text-sm sm:text-base font-mono bg-white px-3 py-2 rounded-lg text-gray-800 break-all">{selectedProject.certId}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">Issued Date</p>
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  {new Date(selectedProject.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">Verification</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-emerald-700 text-sm sm:text-base">Verified</span>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">Listed Status</p>
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  {selectedProject.listed ? '✅ Listed' : '❌ Not Listed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Gallery */}
        {selectedProject.images && selectedProject.images.length > 1 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="font-bold text-base sm:text-lg mb-4">📷 Project Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {selectedProject.images.map((img, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => window.open(img, '_blank')}
                >
                  <img
                    src={img}
                    alt={`${selectedProject.title} ${index + 1}`}
                    className="w-full h-20 sm:h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x120?text=Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm font-semibold">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Sticky on Mobile */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t-2 sticky bottom-0 bg-white -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 sm:pb-0">
          {selectedProject.isOwner ? (
            <>
              <div className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 px-4 sm:px-6 py-4 sm:py-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-amber-900 text-base sm:text-lg mb-1">
                      Your Certificate
                    </h4>
                    <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                      You cannot purchase your own certificate.
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="px-6 py-3 sm:py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
                Close
              </button>
            </>
          ) : (
            <>
              <button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={() => openPurchaseModal(selectedProject)}
              >
                <CheckCircle className="h-5 w-5" />
                Buy Now
              </button>
              <button
                className={`px-6 py-3 sm:py-4 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isInWishlist(selectedProject.id)
                    ? "bg-rose-50 border-rose-500 text-rose-600 hover:bg-rose-100"
                    : "bg-white border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50"
                }`}
                onClick={() => {
                  if (isInWishlist(selectedProject.id)) {
                    removeFromWishlist(selectedProject.id);
                  } else {
                    addToWishlist(selectedProject);
                  }
                }}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(selectedProject.id) ? "fill-current" : ""}`} />
                <span className="hidden xs:inline">{isInWishlist(selectedProject.id) ? "In Wishlist" : "Add"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}

{/* ✅ Enhanced Purchase Modal - Modern Design */}
{showPurchaseModal && selectedProject && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in">
      
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
              <p className="font-semibold text-gray-900 mb-1 line-clamp-2">{selectedProject.title}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{selectedProject.location}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Price per tCO₂e</p>
              <p className="font-bold text-emerald-600">{formatCurrency(selectedProject.price)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="font-bold text-gray-900">{formatNumber(selectedProject.availableVolume)} <span className="text-xs font-normal text-gray-500">tCO₂e</span></p>
            </div>
          </div>
        </div>

        {/* Quantity Input - Enhanced */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Quantity (tCO₂e) *
          </label>
          <input
            type="number"
            min={1}
            max={selectedProject.availableVolume}
            value={purchaseData.quantity === 1 ? '' : purchaseData.quantity}
            onChange={e => handlePurchaseInputChange("quantity", e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg font-bold text-center transition-all"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Enter the amount of carbon credits you want to purchase
          </p>
        </div>

        {/* Buyer Information - Compact Design */}
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
                Company *
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
          </div>
        </div>

        {/* Order Summary - Enhanced */}
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
              <span className="font-semibold">{formatCurrency(selectedProject.price)}</span>
            </div>
            <div className="border-t border-white/30 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold">
                  {purchaseData.quantity && purchaseData.quantity !== 1 
                    ? formatCurrency(selectedProject.price * purchaseData.quantity) 
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Sticky Buttons */}
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

{/* ✅ Wishlist Modal - Mobile Responsive */}
{showWishlistModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
    <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col sm:max-h-[80vh]">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 sm:p-6 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 sm:h-7 sm:w-7 fill-current" /> 
          My Wishlist
        </h2>
        <p className="text-xs sm:text-sm opacity-90 mt-1">
          {wishlist.length > 0 
            ? `${wishlist.length} project${wishlist.length > 1 ? 's' : ''} saved` 
            : "No projects yet"}
        </p>
      </div>
      
      <button
        onClick={closeWishlistModal}
        className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all z-10"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">Your wishlist is empty</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Start adding your favorite projects!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <button
                className="bg-rose-100 text-rose-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-rose-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                onClick={clearAllWishlist}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear All
              </button>
            </div>
            
            <div className="grid gap-3 sm:gap-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-24 sm:h-24 sm:w-32 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x120?text=Carbon+Project";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base lg:text-lg mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-emerald-600 font-bold text-base sm:text-lg truncate">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-xs text-gray-500">/ tCO₂e</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                      onClick={() => {
                        closeWishlistModal();
                        openProjectDetail(item);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Marketplace;