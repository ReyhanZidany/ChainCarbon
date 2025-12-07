// frontend/src/pages/RegulatorDashboard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import API from "../api/axios"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FiGrid,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RegulatorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalBuyers: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingProjects: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState({
    accounts: 0,
    projects: 0,
    retirements: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Axios instance handles auth, no more token manual
        console.log("📊 Fetching regulator dashboard data...");

        // Fetch stats
        const statsRes = await API.get("/regulator/stats");
        console.log("📊 Stats response:", statsRes.data);

        // Fetch companies
        const companiesRes = await API.get("/regulator/companies");
        console.log("🏢 Companies response:", companiesRes.data);

        // Fetch transactions
        const transactionsRes = await API.get("/regulator/transactions?limit=5");
        console.log("💰 Transactions response:", transactionsRes.data);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        if (companiesRes.data.success) {
          setCompanies(companiesRes.data.data.slice(0, 5));
        }

        if (transactionsRes.data.success) {
          setTransactions(transactionsRes.data.data);
        }

        // Fetch pending notifications
        await fetchPendingNotifications();

      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPendingNotifications = async () => {
      try {
        const accountsRes = await API.get("/regulator/pending-users");
        const projectsRes = await API.get("/projects/regulator/pending-projects");

        setPendingNotifications({
          accounts: accountsRes.data.success ? accountsRes.data.data.length : 0,
          projects: projectsRes.data.success ? projectsRes.data.data.length : 0,
          retirements: 0
        });

        console.log("🔔 Pending notifications:", {
          accounts: accountsRes.data.success ? accountsRes.data.data.length : 0,
          projects: projectsRes.data.success ? projectsRes.data.data.length : 0,
        });
      } catch (error) {
        console.error("❌ Error fetching pending notifications:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const totalNotifications = 
    pendingNotifications.accounts + 
    pendingNotifications.projects + 
    pendingNotifications.retirements;

  const chartData = {
    labels: ["Companies", "Buyers", "Active Projects", "Transactions"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.totalCompanies,
          stats.totalBuyers,
          stats.activeProjects,
          stats.totalTransactions,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(6, 182, 212)",
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { 
          font: { size: 12 },
          callback: function(value) {
            return value.toLocaleString();
          }
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const sidebarMenu = [
    { id: "dashboard", icon: FiGrid, text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: FiSearch, text: "Audit & Inspection", link: "/regulator/audit" },
    { id: "report", icon: FiBarChart2, text: "Reports & Analytics", link: "/regulator/laporan" },
    { id: "notifications", icon: FiBell, text: "Notifications", link: "/regulator/notifikasi" },
    { id: "settings", icon: FiSettings, text: "Settings", link: "/regulator/pengaturan" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
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
                onClick={() => setActiveMenu(item.id)}
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
        <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor and manage carbon credit system</p>
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Companies</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalCompanies}</h3>
                  <p className="text-xs text-emerald-600 mt-2 flex items-center">
                    <FiUsers className="mr-1" />
                    registered
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-4 rounded-xl shadow-sm">
                  <FiBriefcase className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Buyers</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalBuyers}</h3>
                  <p className="text-xs text-cyan-600 mt-2 flex items-center">
                    <FiTrendingUp className="mr-1" />
                    active traders
                  </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-4 rounded-xl shadow-sm">
                  <FiShoppingBag className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Active Projects</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.activeProjects}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <FiCheckCircle className="mr-1" />
                    {stats.pendingProjects} pending
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-xl shadow-sm">
                  <FiCheckCircle className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Transactions</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalTransactions}</h3>
                  <p className="text-xs text-blue-600 mt-2 flex items-center">
                    <FiClock className="mr-1" />
                    {stats.todayTransactions} today
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-4 rounded-xl shadow-sm">
                  <FiTrendingUp className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6">System Statistics</h3>
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800">Latest Transactions</h3>
                <Link
                  to="/regulator/laporan"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition-colors flex items-center gap-1 group"
                >
                  <span>View All</span>
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
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.transaction_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {tx.seller_company || "Unknown"} → {tx.buyer_company || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {parseFloat(tx.amount || 0).toLocaleString()} tCO₂e • 
                          Rp {parseFloat(tx.total_price || 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 ml-4 whitespace-nowrap">
                        {tx.status || 'Completed'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Companies Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">Registered Companies</h3>
              <Link
                to="/regulator/audit"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition-colors flex items-center gap-1 group"
              >
                <span>View All</span>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Company Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Projects
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Carbon Credits
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No registered companies yet
                      </td>
                    </tr>
                  ) : (
                    companies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 font-medium text-gray-700">
                          {company.company || company.name}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">{company.email}</td>
                        <td className="px-4 py-4 text-center font-semibold text-gray-700">
                          {company.total_projects || 0}
                        </td>
                        <td className="px-4 py-4 text-center text-emerald-600 font-semibold">
                          {parseFloat(company.total_carbon_credits || 0).toLocaleString()} tCO₂e
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link
                            to={`/regulator/audit/${company.id}`}
                            state={{ company }}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                          >
                            Audit
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegulatorDashboard;