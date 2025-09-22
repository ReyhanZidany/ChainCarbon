// src/pages/DashboardUser.jsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
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

// Stats Card Component
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

// Recent Activity Component
const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
        >
          <div className={`p-2 rounded-lg ${activity.color}`}>
            <activity.icon className="text-white" size={16} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{activity.title}</p>
            <p className="text-gray-600 text-sm">{activity.description}</p>
            <p className="text-gray-500 text-xs mt-1">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = ({ navigate }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Aksi Cepat</h3>
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => navigate("/dashboard/pengajuan")}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl hover:from-emerald-100 hover:to-cyan-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <FiUpload className="text-emerald-600 text-lg" />
          <span className="font-medium text-gray-800">Ajukan Proyek Baru</span>
        </div>
        <FiChevronRight className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
      </button>

      <button
        onClick={() => navigate("/marketplace")}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl hover:from-cyan-100 hover:to-blue-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <FiGrid className="text-cyan-600 text-lg" />
          <span className="font-medium text-gray-800">
            Kunjungi Marketplace
          </span>
        </div>
        <FiChevronRight className="text-gray-400 group-hover:text-cyan-600 transition-colors" />
      </button>

      <button
        onClick={() => navigate("/dashboard/laporan")}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <FiBarChart2 className="text-blue-600 text-lg" />
          <span className="font-medium text-gray-800">Lihat Laporan</span>
        </div>
        <FiChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
      </button>
    </div>
  </div>
);

const DashboardUser = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const company = {
    name: "PT LEDGRON",
    activeProjects: 5,
    totalCarbonSold: 2000,
    totalCarbonBought: 1500,
    carbonValue: 1500000000,
  };

  // Sample recent activities
  const recentActivities = [
    {
      title: "Proyek Reforestasi Disetujui",
      description:
        "Proyek hutan Kalimantan telah mendapat persetujuan regulator",
      date: "2 jam yang lalu",
      icon: FiAward,
      color: "bg-green-500",
    },
    {
      title: "Transaksi Berhasil",
      description: "Penjualan 500 tCO₂e kepada PT Hijau Indonesia",
      date: "5 jam yang lalu",
      icon: FiDollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Sertifikat Diterbitkan",
      description:
        "Sertifikat kredit karbon untuk proyek biogas telah diterbitkan",
      date: "1 hari yang lalu",
      icon: FiCircle, // Changed from FiLeaf to FiCircle
      color: "bg-emerald-500",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  // Check if we're on the main dashboard page (exact match)
  const isMainDashboard = location.pathname === "/dashboard";

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
        {/* Logo Section */}
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
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUsers className="text-white text-sm" />
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrator
                  </p>
                </div>
              )}
            </div>
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
        {/* Header - Only show on main dashboard */}
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
                  <p className="font-semibold text-gray-800">Hari ini, 14:30</p>
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
                  value={company.activeProjects}
                  subtitle="proyek berjalan"
                  icon={FiFolder}
                  color="text-emerald-600"
                  trend="+2 bulan ini"
                />
                <StatsCard
                  title="Karbon Terjual"
                  value={`${company.totalCarbonSold.toLocaleString()}`}
                  subtitle="tCO₂e"
                  icon={FiTrendingUp}
                  color="text-blue-600"
                  trend="+15% bulan lalu"
                />
                <StatsCard
                  title="Karbon Dibeli"
                  value={`${company.totalCarbonBought.toLocaleString()}`}
                  subtitle="tCO₂e"
                  icon={FiRepeat}
                  color="text-cyan-600"
                  trend="+8% bulan lalu"
                />
                <StatsCard
                  title="Nilai Portfolio"
                  value="Rp 1,5M"
                  subtitle="total nilai"
                  icon={FiDollarSign}
                  color="text-purple-600"
                  trend="+12% bulan lalu"
                />
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivity activities={recentActivities} />
                </div>

                {/* Quick Actions */}
                <div>
                  <QuickActions navigate={navigate} />
                </div>
              </div>

              {/* Additional Dashboard Content */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Project Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Ringkasan Proyek
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FiCircle className="text-emerald-600" />
                        <span className="font-medium">
                          Reforestasi Kalimantan
                        </span>
                      </div>
                      <span className="text-emerald-600 font-semibold">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FiGrid className="text-blue-600" />
                        <span className="font-medium">Solar Farm Jateng</span>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        Review
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FiFolder className="text-gray-600" />
                        <span className="font-medium">Biogas Bali</span>
                      </div>
                      <span className="text-gray-600 font-semibold">Draft</span>
                    </div>
                  </div>
                </div>

                {/* Calendar/Schedule */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Jadwal Mendatang
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                      <FiCalendar className="text-yellow-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Audit Proyek Hutan
                        </p>
                        <p className="text-sm text-gray-600">
                          25 Desember 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <FiUsers className="text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Meeting Stakeholder
                        </p>
                        <p className="text-sm text-gray-600">
                          28 Desember 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <FiAward className="text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Sertifikasi VCS
                        </p>
                        <p className="text-sm text-gray-600">2 Januari 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Child Routes
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
