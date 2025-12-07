// src/pages/DashboardUser.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FiHome,
  FiGrid,
  FiFolder,
  FiUpload,
  FiRepeat,
  FiBarChart2,
  FiLogOut,
  FiTrendingUp,
  FiDollarSign,
  FiCircle,
  FiAward,
  FiUsers,
  FiCalendar,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

// Sidebar Item
const SidebarItem = ({ icon: Icon, label, to, isExpanded, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg mx-2 mb-1 hover:bg-emerald-50 transition-all duration-300 ease-in-out ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg"
        : "text-gray-700 hover:text-emerald-600"
    }`}
  >
    <Icon className="text-xl flex-shrink-0" />
    {isExpanded && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

// Stats Card
const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
        <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
        <p className="text-gray-600 text-sm">{subtitle}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <FiTrendingUp className="text-green-500 mr-1" size={14} />
            <span className="text-green-500 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div
        className={`p-3 rounded-xl ${color
          .replace("text-", "bg-")
          .replace("-600", "-100")}`}
      >
        <Icon className={`${color} text-xl`} />
      </div>
    </div>
  </div>
);

const DashboardUser = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [company, setCompany] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [projectOverview, setProjectOverview] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard");
        setCompany(res.data.company);
        setRecentActivities(res.data.recentActivities);
        setProjectOverview(res.data.projectOverview);
        setUpcomingSchedule(res.data.upcomingSchedule);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const isMainDashboard = location.pathname === "/dashboard";

  if (!company) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl transition-all duration-300 ease-in-out border-r border-gray-200 relative ${
          isExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="ChainCarbon Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            {isExpanded && (
              <div>
                <h2 className="font-bold text-gray-800">ChainCarbon</h2>
                <p className="text-xs text-gray-500">Carbon Marketplace</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="py-6">
          <SidebarItem
            icon={FiHome}
            label="Beranda"
            to="/"
            isExpanded={isExpanded}
            isActive={location.pathname === "/"}
          />
          <SidebarItem
            icon={FiGrid}
            label="Dashboard"
            to="/dashboard"
            isExpanded={isExpanded}
            isActive={location.pathname === "/dashboard"}
          />
          <SidebarItem
            icon={FiFolder}
            label="Proyek Saya"
            to="/dashboard/proyek"
            isExpanded={isExpanded}
            isActive={location.pathname.startsWith("/dashboard/proyek")}
          />
          <SidebarItem
            icon={FiUpload}
            label="Pengajuan Proyek"
            to="/dashboard/pengajuan"
            isExpanded={isExpanded}
            isActive={location.pathname === "/dashboard/pengajuan"}
          />
          <SidebarItem
            icon={FiRepeat}
            label="Transaksi"
            to="/dashboard/transaksi"
            isExpanded={isExpanded}
            isActive={location.pathname === "/dashboard/transaksi"}
          />
          <SidebarItem
            icon={FiBarChart2}
            label="Laporan"
            to="/dashboard/laporan"
            isExpanded={isExpanded}
            isActive={location.pathname === "/dashboard/laporan"}
          />
          {/* ✅ Tambahan Profile */}
          <SidebarItem
            icon={FiUser}
            label="Profile"
            to="/dashboard/profile"
            isExpanded={isExpanded}
            isActive={location.pathname === "/dashboard/profile"}
          />
        </div>

        {/* User Info (klik ke profile) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 min-w-0 hover:opacity-80 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUsers className="text-white text-sm" />
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {company.company_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrator
                  </p>
                </div>
              )}
            </Link>
            <button
              className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
              onClick={handleLogout}
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isMainDashboard && (
          <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Selamat datang kembali, kelola proyek karbon Anda dengan mudah
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Terakhir login</p>
                  <p className="font-semibold text-gray-800">
                    Hari ini, 14:30:54
                  </p>
                </div>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  onClick={() => navigate("/marketplace")}
                >
                  Marketplace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className={isMainDashboard ? "p-8" : ""}>
          {isMainDashboard ? (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Proyek Aktif"
                  value={company.active_projects}
                  subtitle="proyek berjalan"
                  icon={FiFolder}
                  color="text-emerald-600"
                  trend="+2 bulan ini"
                />
                <StatsCard
                  title="Karbon Terjual"
                  value={company.total_carbon_sold.toLocaleString()}
                  subtitle="tCO₂e"
                  icon={FiTrendingUp}
                  color="text-blue-600"
                  trend="+15% bulan lalu"
                />
                <StatsCard
                  title="Karbon Dibeli"
                  value={company.total_carbon_bought.toLocaleString()}
                  subtitle="tCO₂e"
                  icon={FiRepeat}
                  color="text-cyan-600"
                  trend="+8% bulan lalu"
                />
                <StatsCard
                  title="Nilai Portfolio"
                  value={`Rp ${company.carbon_value.toLocaleString()}`}
                  subtitle="total nilai"
                  icon={FiDollarSign}
                  color="text-purple-600"
                  trend="+12% bulan lalu"
                />
              </div>

              {/* Recent Activity + Quick Actions */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Aktivitas Terbaru
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500">
                          <FiAward className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{a.title}</p>
                          <p className="text-gray-600 text-sm">
                            {a.description}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(a.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Aksi Cepat
                  </h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => navigate("/dashboard/pengajuan")}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl hover:from-emerald-100 hover:to-cyan-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FiUpload className="text-emerald-600 text-lg" />
                        <span className="font-medium text-gray-800">
                          Ajukan Proyek Baru
                        </span>
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Overview + Schedule */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Ringkasan Proyek
                  </h3>
                  <div className="space-y-4">
                    {projectOverview.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <FiCircle className="text-emerald-600" />
                          <span className="font-medium">{p.name}</span>
                        </div>
                        <span className="text-emerald-600 font-semibold">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Jadwal Mendatang
                  </h3>
                  <div className="space-y-4">
                    {upcomingSchedule.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                      >
                        <FiCalendar className="text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">{s.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(s.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
