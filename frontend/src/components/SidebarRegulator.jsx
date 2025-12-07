// src/components/SidebarRegulator.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import useAuth
import logo from "../assets/chaincarbon_logo_transparent.png";

const SidebarRegulator = ({ onLogout }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Gunakan logout dari AuthContext

  const sidebarMenu = [
    { id: "dashboard", icon: "fas fa-th-large", text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: "fas fa-search", text: "Audit & Inspeksi", link: "/regulator/audit" },
    { id: "laporan", icon: "fas fa-chart-bar", text: "Laporan & Analisis", link: "/regulator/laporan" },
    { id: "notifikasi", icon: "fas fa-bell", text: "Notifikasi", link: "/regulator/notifikasi" },
    { id: "pengaturan", icon: "fas fa-cog", text: "Pengaturan", link: "/regulator/pengaturan" },
  ];

  const handleLogout = () => {
    // ✅ Clear authentication data menggunakan AuthContext
    logout();
    
    // ✅ Call parent onLogout if provided
    if (onLogout) {
      onLogout();
    }
    
    // ✅ Redirect ke LOGIN page (bukan landing page)
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isSidebarExpanded ? "w-64" : "w-20"
      } h-full shadow-sm`}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center px-5 py-6 border-b border-gray-200">
        <img src={logo} alt="ChainCarbon Logo" className="w-10 h-10" />
        {isSidebarExpanded && (
          <div className="ml-3">
            <h2 className="font-bold text-lg text-gray-800">ChainCarbon</h2>
            <p className="text-xs text-gray-500">Carbon Marketplace</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="mt-6">
        {sidebarMenu.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <Link to={item.link} key={item.id}>
              <div
                className={`flex items-center px-5 py-3 mx-2 rounded-lg transition duration-200 cursor-pointer group relative
                  ${isActive ? "bg-teal-50 border-l-4 border-teal-600" : "hover:bg-teal-50"}`}
              >
                <div className={`${isSidebarExpanded ? "w-6" : "w-full"} flex justify-center`}>
                  <i
                    className={`${item.icon} text-lg ${
                      isActive ? "text-teal-600" : "text-gray-600 group-hover:text-teal-600"
                    }`}
                  ></i>
                </div>
                <span
                  className={`ml-4 text-sm font-medium ${
                    isActive ? "text-teal-600 font-semibold" : "text-gray-700 group-hover:text-teal-600"
                  } ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                >
                  {item.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-5 py-3 mx-2 rounded-lg transition duration-200 cursor-pointer hover:bg-red-50 w-full text-left mt-4"
      >
        <div className={`${isSidebarExpanded ? "w-6" : "w-full"} flex justify-center`}>
          <i className="fas fa-sign-out-alt text-lg text-gray-600 hover:text-red-600"></i>
        </div>
        <span
          className={`ml-4 text-sm font-medium text-gray-700 hover:text-red-600 ${
            isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          Keluar
        </span>
      </button>
    </div>
  );
};

export default SidebarRegulator;