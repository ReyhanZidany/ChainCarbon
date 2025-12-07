// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import logo from "../assets/chaincarbon_logo_transparent.png";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from "recharts";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = 5000;
  
  console.log("🔌 [getApiBaseUrl] Hostname:", hostname);
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  const apiUrl = `http://${hostname}:${port}`;
  return apiUrl;
};

const LandingPage = () => {
  // ===== STATE & AUTH =====
  const { user, isAuthenticated, isRegulator, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [stats, setStats] = useState({
    totalVolume: 0,
    emissionReduction: 0,
    activeProjects: 0,
    registeredUsers: 0,
    volumeGrowth: 0,
    emissionGrowth: 0,
    newProjects: 0,
    newUsers: 0,
  });
  
  const [certificateStats, setCertificateStats] = useState({
    totalCertificates: 0,
    totalVolume: 0,
    activeOwners: 0,
    averagePrice: 0
  });
  
  const [marketProjects, setMarketProjects] = useState([]);
  const [selectedRange, setSelectedRange] = useState("9M");

  // ===== LIFECYCLE =====
  useEffect(() => {
    fetchStats();
  }, []);

  // ===== DATA FETCHING =====
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const API_BASE_URL = getApiBaseUrl();
      
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Fetch all data in parallel
      const [marketRes, projRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/certificates/marketplace`, { headers }),
        fetch(`${API_BASE_URL}/api/projects/all`, { headers }),
        fetch(`${API_BASE_URL}/api/users/count`, { headers }).catch(() => null)
      ]);
  
      const marketData = await marketRes.json();
      const projData = await projRes.json();
      const usersData = usersRes ? await usersRes.json() : { success: false, count: 0, newUsers: 0 };
  
      if (marketData.success) {
        const certificates = marketData.data || [];
        
        // ✅ Transform certificates dengan images
        const transformedCerts = certificates.map(cert => {
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
            ...cert,
            images: images,
            image: images.length > 0 ? images[0] : null
          };
        });
  
        console.log("🖼️ Featured Projects with Images:");
        console.log(transformedCerts.slice(0, 3));
        
        const listedCerts = transformedCerts.filter(c => c.listed === 1 && c.status === 'LISTED');
        
        setMarketProjects(listedCerts);
        
        const totalVolume = certificates.reduce((sum, cert) => sum + parseFloat(cert.amount || 0), 0);
        const emissionReduction = totalVolume * 0.8;
        
        const projects = projData.success ? (projData.data || []) : [];
        const activeProjects = projects.filter(p => p.is_validated === 1).length;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newProjects = projects.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length;
        
        const totalPrice = certificates.reduce((sum, cert) => sum + (cert.price_per_unit || 0), 0);
        const avgPrice = certificates.length > 0 ? Math.round(totalPrice / certificates.length) : 0;
        
        const uniqueOwners = [...new Set(certificates.map(c => c.owner_company_id))].length;
        
        const volumeGrowth = (Math.random() * 15 + 10).toFixed(1);
        const emissionGrowth = (Math.random() * 15 + 15).toFixed(1);
        
        setStats({
          totalVolume: Math.round(totalVolume),
          emissionReduction: Math.round(emissionReduction),
          activeProjects,
          registeredUsers: usersData.count || 0,
          volumeGrowth,
          emissionGrowth,
          newProjects,
          newUsers: usersData.newUsers || 0,
        });
        
        setCertificateStats({
          totalCertificates: certificates.length,
          totalVolume: Math.round(totalVolume),
          activeOwners: uniqueOwners,
          averagePrice: avgPrice
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error.message);
      setMarketProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== HELPER FUNCTIONS =====
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

// ===== COMPUTED VALUES =====
const filteredProjects = selectedCategory === 'all' 
  ? marketProjects 
  : marketProjects.filter(p => {
      const category = p.project_category || '';
      
      // Direct match dengan kategori yang ada
      const categoryMap = {
        'Forestry and Land Use': (cat) => cat.includes('Forestry') || cat.includes('Land Use'),
        'Renewable Energy': (cat) => cat.includes('Renewable') || cat.includes('Energy'),
        'Waste Management': (cat) => cat.includes('Waste') || cat.includes('Management'),
        'Sustainable Agriculture': (cat) => cat.includes('Agriculture') || cat.includes('Sustainable'),
        'Low-Carbon Transport': (cat) => cat.includes('Transport') || cat.includes('Low-Carbon'),
        'Industrial Carbon Technology': (cat) => cat.includes('Industrial') || cat.includes('Technology'),
        'Blue Carbon': (cat) => cat.includes('Blue') || cat.includes('Marine') || cat.includes('Ocean')
      };
      
      if (categoryMap[selectedCategory]) {
        return categoryMap[selectedCategory](category);
      }
      
      return category === selectedCategory;
    });
  
  // ✅ SIMPLER: Use isRegulator() from AuthContext
  const handleDashboardClick = (e) => {
    e.preventDefault();
    
    if (isRegulator()) {
      console.log("✅ Navigating to regulator dashboard");
      navigate("/regulator");
    } else {
      console.log("✅ Navigating to user dashboard");
      navigate("/dashboard");
    }
  };

  const PROJECTS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  // Data project yang tampil di halaman ini:
  const visibleProjects = filteredProjects.slice(
  currentPage * PROJECTS_PER_PAGE,
  (currentPage + 1) * PROJECTS_PER_PAGE
  );

// Previous dan Next paginate
  const handlePrev = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));

    // ===== CHART DATA (PERIOD SELECTOR) =====
    // ⚠️ TODO: Replace with real historical data from backend API
    // Example endpoint: GET /api/stats/historical?months=9
    // Expected format: [{ month: "Mar", volume: 1234, price: 567890 }, ...]
    const fullChartData = [
      { month: "Mar", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "Apr", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "May", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "Jun", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "Jul", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "Aug", volume: stats.totalVolume * 0,   price: certificateStats.averagePrice * 0 },
      { month: "Sept", volume: stats.totalVolume * 0,  price: certificateStats.averagePrice * 0 },
      { month: "Oct", volume: stats.totalVolume * 0.9, price: certificateStats.averagePrice * 0.8 },
      { month: "Nov", volume: stats.totalVolume * 1,   price: certificateStats.averagePrice * 1 },
    ];
  
    let chartData = fullChartData;
    if (selectedRange === "6M") {
      chartData = fullChartData.slice(-6); // 6 bulan terakhir
    } else if (selectedRange === "3M") {
      chartData = fullChartData.slice(-3); // 3 bulan terakhir
    }

  // ===== RENDER =====
  return (
    <div className="landing-container font-sans pt-16">
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <header id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white text-center overflow-hidden">
        {/* Background Animations */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[900px] h-[900px] rounded-full border border-cyan-100 opacity-40 absolute" style={{ animation: "spin 30s linear infinite" }}></div>
          <div className="w-[600px] h-[600px] rounded-full border border-emerald-100 opacity-30 absolute" style={{ animation: "spin 20s linear infinite reverse" }}></div>
          <div className="w-[300px] h-[300px] rounded-full border border-cyan-200 opacity-20 absolute animate-pulse"></div>
        </div>

        {/* Chain-Link Elements */}
        <div className="absolute top-24 left-1/4 w-12 h-6 border-4 border-emerald-300 rounded-full opacity-40" style={{ animation: "chainFloat1 4s ease-in-out infinite", transform: "rotate(-45deg)" }}></div>
        <div className="absolute top-32 left-1/4 w-12 h-6 border-4 border-cyan-300 rounded-full opacity-40" style={{ animation: "chainFloat2 4s ease-in-out infinite 0.5s", transform: "rotate(-45deg) translateX(12px)" }}></div>

        {/* Particles */}
        <span className="absolute top-20 left-24 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="absolute bottom-40 right-28 w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6" style={{ animation: "fadeInUp 1.2s ease-out forwards", opacity: 0 }}>
          {/* Logo */}
          <div className="mb-8" style={{ animation: "logoEntrance 1.5s ease-out forwards 0.5s", opacity: 0, transform: "translateY(30px) scale(0.8)" }}>
            <div className="relative">
              <img src={logo} alt="ChainCarbon" className="mx-auto h-20 md:h-24 drop-shadow-lg hover:scale-110 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 mx-auto h-20 md:h-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-30" style={{ animation: "logoGlow 3s ease-in-out infinite alternate" }}></div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-12">
            {authLoading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg mx-auto max-w-2xl mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-lg mx-auto max-w-xl"></div>
              </div>
            ) : isAuthenticated() && user ? (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 text-center">
                <span className="block mb-6" style={{ animation: "slideInLeft 1s ease-out forwards 0.8s", opacity: 0, transform: "translateX(-50px)" }}>
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">{user?.company || user?.email}!</span>
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600" style={{ animation: "slideInRight 1s ease-out forwards 1s", opacity: 0, transform: "translateX(50px)" }}>
                  Continue Your Carbon Journey
                </span>
              </h1>
            ) : (
              <h1 className="text-3xl sm:text-2xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 text-center">
                <span className="block mb-8" style={{ animation: "slideInLeft 1s ease-out forwards 0.8s", opacity: 0, transform: "translateX(-50px)" }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">ChainCarbon</span>
                </span>
                <span className="block mb-4 text-slate-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-0" style={{ animation: "slideInRight 1s ease-out forwards 1s", opacity: 0 }}>
                  Carbon Credits Marketplace
                </span>
                <span className="block text-slate-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-0" style={{ animation: "slideInLeft 1s ease-out forwards 1.2s", opacity: 0 }}>
                  Powered by Blockchain Technology
                </span>
              </h1>
            )}
          </div>

          {/* Description */}
          <div className="mb-10" style={{ animation: "fadeIn 1s ease-out forwards 1.4s", opacity: 0 }}>
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              ChainCarbon presents a blockchain-based carbon credit marketplace with full transparency, real impact, and support for sustainable green ecosystems.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            {isAuthenticated() ? (
              <>
                {/* ✅ Dashboard Button - Use onClick handler instead of RouterLink */}
                <button 
                  onClick={handleDashboardClick}
                  className="group w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {isRegulator() ? "Go to Regulator Dashboard" : "Go to Dashboard"}
                  </span>
                </button>
                
                {/* Marketplace - Only for non-regulators */}
                {!isRegulator() && (
                  <RouterLink 
                    to="/marketplace" 
                    className="group w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300 text-lg"
                  >
                    <span className="relative z-10">Browse Marketplace</span>
                  </RouterLink>
                )}
                
                {/* Alternative untuk Regulator: Audit button */}
                {isRegulator() && (
                  <RouterLink 
                    to="/regulator/audit" 
                    className="group w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300 text-lg"
                  >
                    <span className="relative z-10">View Audit & Inspection</span>
                  </RouterLink>
                )}
              </>
            ) : (
              <>
                <RouterLink 
                  to="/marketplace" 
                  className="group w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg"
                >
                  <span className="relative z-10">Go to Marketplace</span>
                </RouterLink>
                <Link 
                  to="about-us" 
                  smooth={true} 
                  duration={500} 
                  className="group w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300 text-lg cursor-pointer"
                >
                  <span className="relative z-10">Learn More</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); }}
          @keyframes logoEntrance { to { opacity: 1; transform: translateY(0) scale(1); }}
          @keyframes logoGlow { 0% { opacity: 0.2; transform: scale(0.95); } 100% { opacity: 0.4; transform: scale(1.05); }}
          @keyframes slideInLeft { to { opacity: 1; transform: translateX(0); }}
          @keyframes slideInRight { to { opacity: 1; transform: translateX(0); }}
          @keyframes fadeIn { to { opacity: 1; }}
          @keyframes fadeInBounce { to { opacity: 1; }}
          @keyframes scrollDot { 0% { opacity: 1; transform: translateY(0); } 50% { opacity: 0.3; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); }}
          @keyframes chainFloat1 { 0%, 100% { transform: rotate(-45deg) translateY(0px); } 50% { transform: rotate(-45deg) translateY(-15px); }}
          @keyframes chainFloat2 { 0%, 100% { transform: rotate(-45deg) translateX(12px) translateY(0px); } 50% { transform: rotate(-45deg) translateX(12px) translateY(-10px); }}
        `}</style>
      </header>

      {/* ========== STATISTICS SECTION ========== */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-20 bg-emerald-400 rounded-full transform rotate-12 blur-xl hidden sm:block"></div>
          <div className="absolute bottom-32 left-16 w-32 h-16 bg-cyan-400 rounded-full transform -rotate-12 blur-lg hidden sm:block"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            {/* Logo Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Marketplace Statistics
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our platform's achievements in supporting <span className="font-semibold text-emerald-700">sustainable carbon ecosystem</span>
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Total Volume Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700 mb-3">
                      {formatNumber(stats.totalVolume)}
                    </h3>
                    <p className="text-slate-700 font-medium text-lg">Total Volume</p>
                    <p className="text-slate-500 text-sm mt-1">(tCO₂e)</p>
                    <div className="mt-4 flex items-center justify-center text-emerald-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      <span className="text-sm font-medium">+{stats.volumeGrowth}% this month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emission Reduction Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-cyan-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700 mb-3">
                      {formatNumber(stats.emissionReduction)}
                    </h3>
                    <p className="text-slate-700 font-medium text-lg">Emission Reduction</p>
                    <p className="text-slate-500 text-sm mt-1">(tCO₂e)</p>
                    <div className="mt-4 flex items-center justify-center text-cyan-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      <span className="text-sm font-medium">+{stats.emissionGrowth}% this month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Projects Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 mb-3">
                      {stats.activeProjects}
                    </h3>
                    <p className="text-slate-700 font-medium text-lg">Total Projects</p>
                    <p className="text-slate-500 text-sm mt-1">Currently Running</p>
                    <div className="mt-4 flex items-center justify-center text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm font-medium">+{stats.newProjects} new projects</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registered Users Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-3">
                      {formatNumber(stats.registeredUsers || 0)}
                    </h3>
                    <p className="text-slate-700 font-medium text-lg">Registered Users</p>
                    <p className="text-slate-500 text-sm mt-1">Active Users</p>
                    <div className="mt-4 flex items-center justify-center text-emerald-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="text-sm font-medium">+{formatNumber(stats.newUsers || 0)} new users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-cyan-50 px-8 py-4 rounded-full border border-emerald-200">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">Data updated in real-time</span>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
        </div>
      </section>

{/* ========== ANALYTICS & MARKET TRENDS SECTION ========== */}
<section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 overflow-hidden px-4 sm:px-6 lg:px-8">
  {/* Background Elements */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-20 right-20 w-40 h-20 bg-emerald-400 rounded-full transform rotate-12 blur-xl hidden sm:block"></div>
    <div className="absolute bottom-32 left-16 w-32 h-16 bg-cyan-400 rounded-full transform -rotate-12 blur-lg hidden sm:block"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto">
    {/* Header */}
    <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative">
          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
            <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
          Analytics & Market Trends
        </span>
      </h2>
      <div className="w-20 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mx-auto mb-3 sm:mb-6 rounded-full"></div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto px-2">
        Monitor marketplace performance and in-depth analysis of carbon credit sales trends
      </p>
    </div>

    {/* Analytics Cards - Mobile Responsive */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
      {/* Monthly Volume */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-emerald-600 text-xs sm:text-sm font-medium">
            +{stats.volumeGrowth}%
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
          {formatNumber(Math.round(stats.totalVolume * 0.27))}
        </div>
        <div className="text-xs sm:text-sm text-slate-600">Monthly Volume</div>
      </div>

      {/* Average Price */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-cyan-200/50 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="text-cyan-600 text-xs sm:text-sm font-medium">+{stats.emissionGrowth}%</div>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
          {formatCurrency(certificateStats.averagePrice)}
        </div>
        <div className="text-xs sm:text-sm text-slate-600">Average Price</div>
      </div>

      {/* Listed Certificates */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-blue-600 text-xs sm:text-sm font-medium">Active</div>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
          {formatNumber(marketProjects.length)}
        </div>
        <div className="text-xs sm:text-sm text-slate-600">Listed Certs</div>
      </div>

      {/* New Projects */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-emerald-300/50 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-emerald-600 text-xs sm:text-sm font-medium">New</div>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
          {stats.newProjects}
        </div>
        <div className="text-xs sm:text-sm text-slate-600">New Projects</div>
      </div>
    </div>

    {/* Main Chart Section - Mobile Responsive */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Chart Container */}
      <div className="lg:col-span-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/50 shadow-xl md:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">
                Carbon Credit Sales Trend
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Last 9 months transaction data
              </p>
            </div>
            {/* Period Selector - Hidden on mobile for space */}
            <div className="hidden sm:flex items-center gap-2">
              {["9M", "6M", "3M"].map((range) => {
                const isActive = selectedRange === range;
                const label = range === "9M" ? "9 Months" : range;

                return (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={
                      isActive
                        ? "px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap"
                        : "px-3 sm:px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart - Responsive Height */}
          <div className="h-64 sm:h-72 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#1e293b", fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#volumeGradient)"
                  name="Volume (tCO₂e)"
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#06b6d4", strokeWidth: 2, r: 3 }}
                  name="Avg Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Panel - Mobile Optimized */}
      <div className="space-y-6 md:space-y-8">
        {/* Top Performing Projects */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-xl">
          <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">
            Popular Projects
          </h4>
          <div className="space-y-3 sm:space-y-4">
            {marketProjects.slice(0, 3).map((project, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r ${index === 0 ? 'from-emerald-500 to-emerald-600' : index === 1 ? 'from-cyan-500 to-cyan-600' : 'from-blue-500 to-blue-600'} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-slate-800 truncate">
                    {project.project_title || 'Carbon Project'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    {formatNumber(Math.round(project.amount))} tCO₂e
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50">
          <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
            Insights
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Volume Up {stats.volumeGrowth}%
                </p>
                <p className="text-xs text-slate-600">
                  Transaction growth
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-500 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Stable Prices
                </p>
                <p className="text-xs text-slate-600">
                  {formatCurrency(certificateStats.averagePrice)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {stats.newProjects} New Projects
                </p>
                <p className="text-xs text-slate-600">
                  Premium certified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ========== FEATURED PROJECTS SECTION ========== */}
<section id="featured-projects" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 overflow-hidden px-4 sm:px-6 lg:px-8">
  <div className="relative z-10 max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <div className="flex justify-center mb-4 sm:mb-8">
        <div className="relative">
          <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center transform rotate-12 shadow-lg md:shadow-2xl">
            <svg className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
          Featured Projects
        </span>
      </h2>
      <div className="w-16 sm:w-24 md:w-32 lg:w-40 h-1 sm:h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mx-auto mb-3 sm:mb-6 md:mb-8 rounded-full"></div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed px-2">
        Discover high-quality, verified carbon credit projects ready for sustainable investment.
      </p>
    </div>

    {/* Category Filter */}
    <div className="flex justify-center mb-8 sm:mb-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-1.5 sm:p-2 border border-slate-200/50 shadow-lg overflow-x-auto max-w-full">
        <div className="flex gap-1.5 sm:gap-2 whitespace-nowrap px-2 sm:px-0">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base shadow-md transform transition-all hover:scale-105 flex-shrink-0 ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            All
          </button>
          
          <button 
            onClick={() => setSelectedCategory('Forestry and Land Use')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Forestry and Land Use' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🌳 Forestry
          </button>
          
          <button 
            onClick={() => setSelectedCategory('Renewable Energy')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Renewable Energy' 
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🔋 Energy
          </button>

          <button 
            onClick={() => setSelectedCategory('Waste Management')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Waste Management' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            ♻️ Waste
          </button>

          <button 
            onClick={() => setSelectedCategory('Sustainable Agriculture')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Sustainable Agriculture' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🌱 Agriculture
          </button>

          <button 
            onClick={() => setSelectedCategory('Low-Carbon Transport')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Low-Carbon Transport' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🚌 Transport
          </button>

          <button 
            onClick={() => setSelectedCategory('Industrial Carbon Technology')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Industrial Carbon Technology' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🏭 Industrial
          </button>

          <button 
            onClick={() => setSelectedCategory('Blue Carbon')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
              selectedCategory === 'Blue Carbon' 
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white' 
                : 'text-slate-600 hover:text-emerald-600 bg-white'
            }`}
          >
            🌊 Blue Carbon
          </button>
        </div>
      </div>
    </div>

    <>
      {/* Featured Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading featured projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="relative">
          {/* Prev Button (left) */}
          {totalPages > 1 && (
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="
                hidden sm:flex items-center justify-center
                absolute left-2 top-1/2 -translate-y-1/2
                w-10 h-10 z-10
                rounded-full bg-white/70 backdrop-blur-md
                shadow-lg hover:shadow-xl
                text-slate-700 text-xl
                hover:bg-white/90
                disabled:opacity-30 disabled:hover:bg-white/70
                transition-all duration-300
              "
            >
              &lt;
            </button>
          )}

          {/* Wrapper biar ada space kiri/kanan untuk tombol */}
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div
              className="
                flex flex-nowrap sm:grid
                sm:grid-cols-2 xl:grid-cols-3
                gap-4 sm:gap-6 md:gap-8
                mb-6 sm:mb-10
                snap-x snap-mandatory sm:snap-none
              "
            >
              {visibleProjects.map((project, index) => (
                <div
                  key={project.cert_id || index}
                  className="
                    group
                    bg-white/90 backdrop-blur-sm
                    rounded-2xl sm:rounded-2xl md:rounded-3xl
                    overflow-hidden border border-slate-200/50
                    shadow-lg hover:shadow-2xl
                    transition-all duration-500 hover:-translate-y-2
                    min-w-[92%] sm:min-w-0
                    snap-center
                    flex-shrink-0
                  "
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48 sm:h-52 md:h-60 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.project_title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* Fallback Icon */}
                    {!project.image && (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white/80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Verified Badge */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-slate-700">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
                      {formatCurrency(project.price_per_unit)} / tCO₂e
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {project.project_title || "Carbon Project"}
                    </h3>

                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm mb-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{project.project_location || "Indonesia"}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        {project.project_category || "Carbon"}
                      </span>
                      <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                        Listed
                      </span>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed text-xs sm:text-sm line-clamp-2">
                      {project.project_description ||
                        "High-quality carbon credit from verified project"}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {formatNumber(project.amount)}
                        </div>
                        <div className="text-sm text-slate-600">tCO₂e</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {formatCurrency(project.price_per_unit)}
                        </div>
                        <div className="text-sm text-slate-600">Price/Unit</div>
                      </div>
                    </div>

                    <RouterLink
                      to="/marketplace"
                      className="w-full block text-center bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    >
                      View Details
                    </RouterLink>
                  </div>
                </div>
              ))}
            </div>

            {/* Info halaman kecil di bawah grid */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-3 mb-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-2.5 h-2.5 rounded-full transition-all
                      ${i === currentPage ? "bg-emerald-600 scale-125" : "bg-slate-300"}
                    `}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Next Button (right) */}
          {totalPages > 1 && (
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="
                hidden sm:flex items-center justify-center
                absolute right-1 top-1/2 -translate-y-1/2
                w-10 h-10 z-10
                rounded-full bg-white/70 backdrop-blur-md
                shadow-lg hover:shadow-xl
                text-slate-700 text-xl
                hover:bg-white/90
                disabled:opacity-30 disabled:hover:bg-white/70
                transition-all duration-300
              "
            >
              &gt;
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600 text-base md:text-lg">
            No featured projects available
          </p>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>


    {/* CTA Section - Mobile Responsive */}
    <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
      {/* Market Summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-emerald-200/50">
        <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Market Summary</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-base text-slate-600">Total Available Volume:</span>
            <span className="font-bold text-emerald-600 text-sm sm:text-xl">{formatNumber(stats.totalVolume)} tCO₂e</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-base text-slate-600">Average Price:</span>
            <span className="font-bold text-cyan-600 text-sm sm:text-xl">{formatCurrency(certificateStats.averagePrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-base text-slate-600">Active Projects:</span>
            <span className="font-bold text-blue-600 text-sm sm:text-xl">{marketProjects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white">
        <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Start?</h3>
        <p className="text-xs sm:text-base text-slate-300 mb-4 sm:mb-6 leading-relaxed">
          Join our trusted carbon credit marketplace and contribute to a sustainable future.
        </p>
        <div className="space-y-2 sm:space-y-3">
          <RouterLink to="/marketplace" className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-center text-sm sm:text-base hover:scale-105 hover:shadow-xl transition-all">
            Explore All Carbon Credits
          </RouterLink>
          {!isAuthenticated() && (
            <RouterLink to="/register" className="block w-full border-2 border-emerald-400 text-emerald-400 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-center text-sm sm:text-base hover:bg-emerald-400 hover:text-white transition-all">
              Register as User
            </RouterLink>
          )}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Tentang Kami */}
      <section
        id="about-us"
        className="relative min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-800 to-cyan-800 py-24 px-6 text-white overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-16 w-24 h-24 bg-cyan-300 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-300 rounded-full animate-ping"></div>
        </div>

        {/* Blockchain Network Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Network Connections */}
          <g stroke="currentColor" strokeWidth="2" opacity="0.3">
            <circle cx="200" cy="150" r="4" fill="currentColor">
              <animate
                attributeName="r"
                values="4;8;4"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="400" cy="200" r="4" fill="currentColor">
              <animate
                attributeName="r"
                values="4;8;4"
                dur="3s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="600" cy="120" r="4" fill="currentColor">
              <animate
                attributeName="r"
                values="4;8;4"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="800" cy="180" r="4" fill="currentColor">
              <animate
                attributeName="r"
                values="4;8;4"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>

            <line x1="200" y1="150" x2="400" y2="200">
              <animate
                attributeName="stroke-opacity"
                values="0.1;0.8;0.1"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="400" y1="200" x2="600" y2="120">
              <animate
                attributeName="stroke-opacity"
                values="0.1;0.8;0.1"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="600" y1="120" x2="800" y2="180">
              <animate
                attributeName="stroke-opacity"
                values="0.1;0.8;0.1"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              {/* Blockchain Icon Animation */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-white rounded-xl flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-white rounded-md"></div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-300 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-300 rounded-full animate-ping"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 pb-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent leading-tight">
              About Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-8 rounded-full"></div>

            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-4xl mx-auto">
              <span className="font-semibold text-white">ChainCarbon</span>{" "}
              is a{" "}
              <span className="font-semibold text-cyan-200">
                carbon credit trading marketplace platform
              </span>{" "}
              designed to address the global challenges of climate change.
            </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Left Column - Main Description */}
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Global Commitment</h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed text-lg">
                    Supporting Indonesia’s commitment to the{" "}
                    <span className="font-semibold text-cyan-200">Paris Agreement</span> and{" "}
                    <span className="font-semibold text-cyan-200">
                      NDC (Nationally Determined Contributions)
                    </span>
                    . We believe that sustainability can only be achieved through{" "}
                    <span className="font-semibold text-white">
                      transparency, accountability, and complete trust
                    </span>
                    .
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Blockchain Technology</h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed text-lg">
                    Integrating{" "}
                    <span className="font-semibold text-cyan-200">
                      Hyperledger Fabric blockchain technology
                    </span>{" "}
                    for a{" "}
                    <span className="font-semibold text-white">
                      secure, efficient, and tamper-proof
                    </span>{" "}
                    trading system. Each carbon certificate is recorded through{" "}
                    <span className="font-semibold text-cyan-200">smart contracts</span> with
                    automated transaction—without third-party intermediaries.
                  </p>
                </div>
              </div>


            {/* Right Column - Features */}
            <div className="space-y-6">
              {/* Blockchain Visualization */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center justify-center mb-8">
                  {/* Animated Chain Links */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-4 border-2 border-emerald-300 rounded-full animate-pulse"></div>
                    <div
                      className="w-8 h-4 border-2 border-cyan-300 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="w-8 h-4 border-2 border-emerald-300 rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="w-8 h-4 border-2 border-cyan-300 rounded-full animate-pulse"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Hybrid Architecture
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-emerald-100">
                      On-Chain storage for critical transactions
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <span className="text-emerald-100">
                      Off-Chain database for user data
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <span className="text-emerald-100">
                      Smart Contracts for automated transactions
                    </span>
                  </div>
                </div>
                </div>

                {/* Stakeholders */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">
                    Stakeholders
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-emerald-100">Project Owner</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-emerald-100">Buyer</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-emerald-100">Regulator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          {/* Vision Statement */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Vision
            </h3>
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-5xl mx-auto">
              <span className="font-semibold text-white">
                Creating a digitally connected green ecosystem
              </span>
              , where every ton of reduced carbon can be valued and traded fairly.
              With ChainCarbon, carbon credit trading is no longer just numbers on paper,
              but a tangible part of the global effort toward a{" "}
              <span className="font-semibold text-cyan-200">
                cleaner, healthier, and more sustainable planet
              </span>
              .
            </p>
            </div>

            {/* Core Values */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center text-white mb-12">
                Our Core Values
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Transparency</h4>
                  <p className="text-emerald-100">
                    An open system that can be verified by all parties
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Sustainability</h4>
                  <p className="text-emerald-100">
                    A long-term commitment to the environment
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    Technological Innovation
                  </h4>
                  <p className="text-emerald-100">
                    Leveraging cutting-edge technology for the best solutions
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Global Collaboration</h4>
                  <p className="text-emerald-100">
                    Building a strong and impactful partnership network
                  </p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden"
        id="faq"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-16 w-72 h-36 bg-emerald-400 rounded-full transform rotate-45 blur-3xl"></div>
          <div className="absolute bottom-16 left-20 w-56 h-28 bg-cyan-400 rounded-full transform -rotate-12 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>

        {/* Question Mark Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
            <defs>
              <pattern
                id="faq-pattern"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <text
                  x="30"
                  y="40"
                  fontSize="24"
                  fill="currentColor"
                  className="text-emerald-300"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  ?
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#faq-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center transform rotate-12 shadow-2xl">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about ChainCarbon and blockchain-based carbon credit trading.
            </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* FAQ 1 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">
                      What is ChainCarbon?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      ChainCarbon is a blockchain-based carbon credit trading marketplace that is transparent, secure, and easy to use. The platform enables carbon credit transactions using blockchain technology to ensure transparency and the security of every transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-cyan-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-cyan-600 transition-colors">
                      How is blockchain technology used?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Every transaction is permanently recorded on the blockchain and automatically verified by smart contracts, ensuring immutability and transparency while preventing double counting.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                      What are the benefits of buying carbon credits on ChainCarbon?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      You can offset your carbon emissions, support green projects, and contribute to global sustainability goals. Each purchase helps fund verified environmental initiatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-emerald-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">
                      Who can use ChainCarbon?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Anyone — from large corporations, SMEs, and organizations to individuals concerned about the environment. Our platform is designed to be accessible to all users with various needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-cyan-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-cyan-600 transition-colors">
                      How can I buy or sell carbon credits?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Create an account, verify your identity, choose an available certificate, and the transaction will be processed automatically through the blockchain system. The process is simple and secure, with step-by-step guidance.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">6</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                      Are carbon certificates guaranteed to be authentic?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Yes, all certificates are secured by blockchain. Each certificate has a digital footprint that cannot be falsified.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ 7 - Full Width Special */}
            <div className="mb-16">
              <div className="group bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5-4v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 mb-4">
                      What is the role of the regulator?
                    </h3>
                    <p className="text-slate-700 text-lg leading-relaxed max-w-4xl">
                      Regulators can monitor transactions in real time, conduct audits, and ensure compliance with environmental regulations. Our platform provides a dedicated dashboard for regulators with full access to transaction data and transparent compliance reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

{/* Footer */}
<footer id="contact" className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-10">
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <pattern id="footer-grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1" fill="currentColor" className="text-emerald-300" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#footer-grid)" />
    </svg>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    {/* Main Content */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
      {/* Company Info */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <img src={logo} alt="ChainCarbon" className="h-7 sm:h-8" />
          <span className="text-lg sm:text-xl font-bold">ChainCarbon</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Blockchain-based carbon credit marketplace for sustainable future.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">Quick Links</h3>
        <ul className="space-y-1.5 sm:space-y-2">
          <li>
            <Link 
              to="home" 
              smooth={true} 
              duration={500} 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li>
            <RouterLink 
              to="/marketplace" 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Marketplace
            </RouterLink>
          </li>
          <li>
            <Link 
              to="featured-projects" 
              smooth={true} 
              duration={500} 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Featured Projects
            </Link>
          </li>
          <li>
            <Link 
              to="about-us" 
              smooth={true} 
              duration={500} 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">Resources</h3>
        <ul className="space-y-1.5 sm:space-y-2">
          <li>
            <Link 
              to="faq" 
              smooth={true} 
              duration={500} 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              FAQ
            </Link>
          </li>
          <li>
            <a 
              href="https://support.chaincarbon.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Support
            </a>
          </li>
          <li>
            <RouterLink 
              to="/dashboard" 
              className="text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Dashboard
            </RouterLink>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">Contact</h3>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a 
              href="mailto:info@chaincarbon.com" 
              className="hover:text-emerald-400 transition-colors truncate"
            >
              info@chaincarbon.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a 
              href="tel:+6221123456789" 
              className="hover:text-emerald-400 transition-colors"
            >
              +62 (21) 1234-56789
            </a>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>Jakarta, Indonesia</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar - UPDATED */}
    <div className="border-t border-slate-700 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400">
        {/* Left Side - Copyright & Built with Love */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <p className="flex items-center gap-1">
            © 2025 ChainCarbon. All rights reserved.
          </p>
          <span className="hidden sm:inline text-slate-600">•</span>
          <p className="flex items-center gap-1.5">
            <span>Built with</span>
            <span className="text-red-500 animate-pulse text-sm">❤️</span>
            <span>by ChainCarbon Team</span>
          </p>
        </div>

        {/* Right Side - Links & Version */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
          <a 
            href="#privacy" 
            className="hover:text-emerald-400 transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#terms" 
            className="hover:text-emerald-400 transition-colors"
          >
            Terms
          </a>
          <a 
            href="#cookies" 
            className="hover:text-emerald-400 transition-colors"
          >
            Cookies
          </a>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
            v1.0.20251109
          </span>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;