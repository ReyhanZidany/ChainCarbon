import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import { mapValidationStatus, statusBadgeClass } from "../utils/validationStatus";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FiGrid,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiFilter,
  FiDownload,
  FiFileText,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiFeather,
  FiActivity,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

const LaporanAnalisis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeMenu] = useState("reports");
  const [selectedFilter, setSelectedFilter] = useState("thismonth");
  const [selectedSektor, setSelectedSektor] = useState("all");
  const [selectedJenisLaporan, setSelectedJenisLaporan] = useState(
    searchParams.get("tab") || "emissions"
  );
  const [isLoading, setIsLoading] = useState(true);
  
  // Real data states
  const [stats, setStats] = useState({
    totalEmisi: 0,
    totalKredit: 0,
    totalTransaksi: 0,
    nilaiTransaksi: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sektorDistribution, setSektorDistribution] = useState({});
  const [monthlyTrend, setMonthlyTrend] = useState({
    emissions: [],
    credits: [],
  });

  const sidebarMenu = [
    { id: "dashboard", icon: FiGrid, text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: FiSearch, text: "Audit & Inspection", link: "/regulator/audit" },
    { id: "reports", icon: FiBarChart2, text: "Reports & Analytics", link: "/regulator/laporan" },
    { id: "notifications", icon: FiBell, text: "Notifications", link: "/regulator/notifikasi" },
    { id: "settings", icon: FiSettings, text: "Settings", link: "/regulator/pengaturan" },
  ];

  const [pendingNotifications, setPendingNotifications] = useState({
    accounts: 0,
    projects: 0,
    retirements: 0
  });

  const translateSector = useCallback((sector) => {
    const sectorMap = {
      'seller': 'Seller',
      'buyer': 'Buyer',
      'company': 'Company',
      'perusahaan': 'Company',
      'energi-industri': 'Energy & Heavy Industry',
      'transportasi-logistik': 'Transportation & Logistics',
      'manufaktur': 'Manufacturing',
      'pertanian': 'Agriculture & Forestry',
      'teknologi': 'Technology',
      'industri': 'Industry',
      'korporasi': 'Corporate & Multinational',
      'energi-limbah': 'Renewable Energy & Waste',
      'energy & heavy industry': 'Energy & Heavy Industry',
      'transportation & logistics': 'Transportation & Logistics',
      'agriculture & forestry': 'Agriculture & Forestry',
      'renewable energy & waste': 'Renewable Energy & Waste',
      'corporate & multinational': 'Corporate & Multinational',
    };

    if (!sector) return 'Others';

    const lowerSector = sector?.toLowerCase() || 'others';
    return sectorMap[lowerSector] || sector || 'Others';
  }, []);

      const calculateMonthlyTrend = useCallback((txList = [], companiesList = []) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const emissionsPerMonth = Array(12).fill(0);
        const creditsPerMonth = Array(12).fill(0);
        
        companiesList.forEach(company => {
          const regDate = new Date(company.tanggalRegistrasi);
          if (regDate.getFullYear() === currentYear) {
            const month = regDate.getMonth();
            emissionsPerMonth[month] += company.totalProyek * 350;
          }
        });
        
        txList.forEach(tx => {
          const txDate = new Date(tx.tanggal);
          if (txDate.getFullYear() === currentYear) {
            const month = txDate.getMonth();
            creditsPerMonth[month] += tx.jumlah;
          }
        });
        
        for (let i = 1; i <= currentMonth; i++) {
          emissionsPerMonth[i] += emissionsPerMonth[i - 1];
          creditsPerMonth[i] += creditsPerMonth[i - 1];
        }
        
        return {
          labels: months.slice(0, currentMonth + 1),
          emissions: emissionsPerMonth.slice(0, currentMonth + 1),
          credits: creditsPerMonth.slice(0, currentMonth + 1),
        };
      }, []);

      const fetchRealData = useCallback(async () => {
        try {
          console.log("📊 Fetching data via axios...");
      
          const [companiesRes, transactionsRes, statsRes] = await Promise.all([
            API.get("/regulator/companies"),
            API.get("/regulator/transactions"),
            API.get("/regulator/stats")
          ]);
          
          const companiesData = companiesRes.data;
          const transactionsData = transactionsRes.data;
          const statsData = statsRes.data;
      
          console.log("📊 Fetched data:", { companiesData, transactionsData, statsData });
      
          let companiesList = [];
          let txList = [];
      
          if (companiesData.success) {
            companiesList = companiesData.data.map(c => ({
              id: c.id,
              nama: c.company,
              email: c.email,
              sektor: translateSector(c.type),
              totalProyek: c.total_projects || 0,
              kreditKarbon: parseFloat(c.total_carbon_credits) || 0,
              status: mapValidationStatus(c.is_validated),
              tanggalRegistrasi: c.created_at,
            }));
            setCompanies(companiesList);
            
            const sektorCount = {};
            companiesList.forEach(c => {
              const sektor = c.sektor || "Others";
              sektorCount[sektor] = (sektorCount[sektor] || 0) + c.kreditKarbon;
            });
            setSektorDistribution(sektorCount);
          }
      
          if (transactionsData.success) {
            txList = transactionsData.data.map(tx => ({
              id: tx.transaction_id,
              penjual: tx.seller_company || "Unknown",
              pembeli: tx.buyer_company || "Unknown",
              jumlah: parseFloat(tx.amount) || 0,
              harga: parseFloat(tx.price_per_unit) || 0,
              total: parseFloat(tx.total_price) || 0,
              tanggal: tx.transaction_date,
              status: "Completed",
            }));
            setTransactions(txList);
          }
      
          const monthlyData = calculateMonthlyTrend(txList, companiesList);
          setMonthlyTrend(monthlyData);
      
          if (statsData.success && companiesData.success) {
            const totalCarbonCredits = companiesData.data.reduce(
              (sum, c) => sum + (parseFloat(c.total_carbon_credits) || 0), 
              0
            );
      
            const totalProjects = companiesData.data.reduce(
              (sum, c) => sum + (c.total_projects || 0), 
              0
            );
            const estimatedEmissionsReduced = totalProjects * 350;
      
            const totalTransaksiValue = transactionsData.success 
              ? transactionsData.data.reduce((sum, tx) => sum + (parseFloat(tx.total_price) || 0), 0)
              : 0;
      
            setStats({
              totalEmisi: estimatedEmissionsReduced,
              totalKredit: totalCarbonCredits,
              totalTransaksi: statsData.data.totalTransactions || 0,
              nilaiTransaksi: totalTransaksiValue,
            });
          }
      
        } catch (error) {
          console.error("❌ Error fetching report data:", error);
        } finally {
          setIsLoading(false);
        }
      }, [translateSector, calculateMonthlyTrend]);
  
      useEffect(() => {
        fetchRealData();
      
        const fetchPendingNotifications = async () => {
          try {
            const [accountsRes, projectsRes] = await Promise.all([
              API.get("/regulator/pending-users"),
              API.get("/projects/regulator/pending-projects"),
            ]);
            const accountsData = accountsRes.data;
            const projectsData = projectsRes.data;
      
            setPendingNotifications({
              accounts: accountsData.success ? accountsData.data.length : 0,
              projects: projectsData.success ? projectsData.data.length : 0,
              retirements: 0
            });
          } catch (error) {
            console.error("Error fetching pending notifications (axios):", error);
          }
        };
      
        fetchPendingNotifications();
      }, [fetchRealData]);

  const totalNotifications = 
    pendingNotifications.accounts + 
    pendingNotifications.projects + 
    pendingNotifications.retirements;

  // ✅ Generate trend data from actual monthly data
  const generateTrendData = () => {
    return {
      labels: monthlyTrend.labels || ["Jan"],
      datasets: [
        {
          label: "Total Emissions Reduced (Est. Ton CO₂)",
          data: monthlyTrend.emissions || [0],
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
        },
        {
          label: "Registered Carbon Credits (Ton)",
          data: monthlyTrend.credits || [0],
          borderColor: "rgba(16, 185, 129, 1)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
        },
      ],
    };
  };

  // ✅ Generate sector distribution data
  const generateSektorData = () => {
    const sektorLabels = Object.keys(sektorDistribution);
    const sektorValues = Object.values(sektorDistribution);

    const colors = [
      "rgba(16, 185, 129, 0.8)",    // Emerald
      "rgba(59, 130, 246, 0.8)",    // Blue
      "rgba(251, 191, 36, 0.8)",    // Yellow
      "rgba(239, 68, 68, 0.8)",     // Red
      "rgba(139, 92, 246, 0.8)",    // Purple
      "rgba(6, 182, 212, 0.8)",     // Cyan
      "rgba(156, 163, 175, 0.8)",   // Gray
    ];

    return {
      labels: sektorLabels,
      datasets: [
        {
          label: "Total Carbon Credits (Ton CO₂)",
          data: sektorValues,
          backgroundColor: colors.slice(0, sektorLabels.length),
          borderColor: colors.slice(0, sektorLabels.length).map(c => c.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    };
  };

  const trendData = generateTrendData();
  const sektorData = generateSektorData();

  // Filter companies
  const filteredLaporan = companies.filter((company) => {
    return selectedSektor === "all" || company.sektor === selectedSektor;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(num);
  };
  
  const formatCompactNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)} B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} K`;
    }
    return formatNumber(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ChainCarbon" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">ChainCarbon</h1>
              <p className="text-xs text-gray-500">Regulator Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-500"}`} />
                <span className="text-sm">{item.text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Link to="/regulator" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <FiGrid className="inline" /> Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Reports & Analytics</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/regulator/notifikasi" className="relative">
                <FiBell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-emerald-600 transition" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {totalNotifications}
                  </span>
                )}
              </Link>
              <div className="w-px h-8 bg-gray-200" /> 
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full 
                              flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105">
                  <span className="font-bold text-base">AR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm transition-colors group-hover:text-emerald-600">
                    Admin Regulator
                  </p>
                  <p className="text-xs text-gray-400">System Supervisor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Filter Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400" />
                  <span className="text-gray-700 font-semibold text-sm">Period:</span>
                  <select
                    className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="thismonth">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="thisyear">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm">Sector:</span>
                  <select
                    className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                    value={selectedSektor}
                    onChange={(e) => setSelectedSektor(e.target.value)}
                  >
                    <option value="all">All Sectors</option>
                    {Object.keys(sektorDistribution).sort().map(sektor => (
                      <option key={sektor} value={sektor}>{sektor}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold text-sm">Report Type:</span>
                <select
                  className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                  value={selectedJenisLaporan}
                  onChange={(e) => setSelectedJenisLaporan(e.target.value)}
                >
                  <option value="emissions">Emissions Report</option>
                  <option value="transactions">Carbon Credit Transactions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CO₂ Reduction Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    CO₂ Reduced (Est.)
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {formatCompactNumber(stats.totalEmisi)}
                  </h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <FiTrendingDown className="h-3.5 w-3.5" />
                    Ton CO₂e from {companies.reduce((sum, c) => sum + c.totalProyek, 0)} projects
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl shadow-sm">
                  <FiTrendingDown className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Carbon Credits Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Registered Carbon Credits
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {formatCompactNumber(stats.totalKredit)}
                  </h3>
                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                    <FiFeather className="h-3.5 w-3.5" />
                    Ton CO₂e tradeable
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-4 rounded-xl shadow-sm">
                  <FiFeather className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Transactions
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {stats.totalTransaksi}
                  </h3>
                  <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                    <FiActivity className="h-3.5 w-3.5" />
                    Successful transactions
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-4 rounded-xl shadow-sm">
                  <FiActivity className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Transaction Value Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Transaction Value
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats.nilaiTransaksi >= 1000000000 
                      ? `Rp ${formatCompactNumber(stats.nilaiTransaksi)}`
                      : formatCurrency(stats.nilaiTransaksi)
                    }
                  </h3>
                  <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                    <FiDollarSign className="h-3.5 w-3.5" />
                    Trading volume
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-xl shadow-sm">
                  <FiDollarSign className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Trend Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" />
                  Emissions & Carbon Credits Trend
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-semibold">
                  <FiDownload className="h-4 w-4" />
                  Download
                </button>
              </div>
              <div className="h-72">
                {monthlyTrend.labels && monthlyTrend.labels.length > 0 ? (
                  <Line
                    data={trendData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            font: { size: 12, family: "'Inter', sans-serif" },
                            padding: 15,
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          borderRadius: 8,
                          callbacks: {
                            label: (context) => {
                              return `${context.dataset.label}: ${formatNumber(context.parsed.y)} Ton`;
                            }
                          }
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0, 0, 0, 0.05)" },
                          ticks: { 
                            font: { size: 11 },
                            callback: (value) => formatNumber(value)
                          },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { font: { size: 11 } },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FiTrendingUp className="h-12 w-12 mx-auto mb-3" />
                      <p>No trend data available yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sector Distribution Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <FiBarChart2 className="text-emerald-600" />
                  Distribution by Sector
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-semibold">
                  <FiDownload className="h-4 w-4" />
                  Download
                </button>
              </div>
              <div className="h-72 flex justify-center items-center">
                {Object.keys(sektorDistribution).length === 0 ? (
                  <div className="text-center text-gray-400">
                    <FiBarChart2 className="h-12 w-12 mx-auto mb-2" />
                    <p>No sector data yet</p>
                  </div>
                ) : (
                  <div className="w-10/12">
                    <Doughnut
                      data={sektorData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              font: { size: 11, family: "'Inter', sans-serif" },
                              padding: 12,
                              usePointStyle: true,
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            padding: 12,
                            borderRadius: 8,
                            callbacks: {
                              label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${formatNumber(context.parsed)} tCO₂e (${percentage}%)`;
                              }
                            }
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tables */}
          {selectedJenisLaporan === "emissions" ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <FiFileText className="text-emerald-600" />
                  Registered Companies Report
                </h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all shadow-lg font-semibold">
                    <FiDownload className="h-4 w-4" />
                    Export Data
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sector</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total Projects</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Carbon Credits</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registration Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLaporan.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center">
                          <FiSearch className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLaporan.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-700">{company.nama}</td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-black-700 rounded-lg text-xs font-medium">
                              {company.sektor}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-semibold text-gray-700 text-center">
                            {company.totalProyek}
                          </td>
                          <td className="px-4 py-4 font-semibold text-emerald-600">
                            {formatNumber(company.kreditKarbon)} tCO₂e
                          </td>
                          <td className="px-4 py-4 text-gray-600 text-sm">
                            {new Date(company.tanggalRegistrasi).toLocaleDateString("en-US")}
                          </td>
                          <td className="px-4 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass(company.status)}`}>
                            {company.status}
                          </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <FiActivity className="text-emerald-600" />
                  Carbon Credit Transactions
                </h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all shadow-lg font-semibold">
                    <FiDownload className="h-4 w-4" />
                    Export Data
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Buyer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price/Ton</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-12 text-center">
                          <FiActivity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-lg font-semibold">No Transactions Available</p>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-700">#{tx.id}</td>
                          <td className="px-4 py-4 text-gray-700">{tx.penjual}</td>
                          <td className="px-4 py-4 text-gray-700">{tx.pembeli}</td>
                          <td className="px-4 py-4 font-semibold text-gray-700">{formatNumber(tx.jumlah)} Ton</td>
                          <td className="px-4 py-4 text-gray-600">{formatCurrency(tx.harga)}</td>
                          <td className="px-4 py-4 font-bold text-emerald-600">{formatCurrency(tx.total)}</td>
                          <td className="px-4 py-4 text-gray-600 text-sm">
                            {new Date(tx.tanggal).toLocaleDateString("en-US")}
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FiCheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Active System</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {companies.length} registered companies with {formatNumber(stats.totalKredit)} tCO₂e carbon credits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Active
                </span>
                <span className="text-gray-500">Real-time Update</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiActivity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Transactions</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stats.totalTransaksi} transactions with total value {formatCurrency(stats.nilaiTransaksi)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  Active
                </span>
                <span className="text-gray-500">Real-time Update</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Monitoring</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {companies.filter(c => c.status === "Awaiting Verification").length} companies awaiting verification
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-4">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                  Attention
                </span>
                <span className="text-gray-500">Real-time Update</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaporanAnalisis;