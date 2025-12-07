// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import useAuth

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Use AuthContext logout

  const handleLogout = () => {
    console.log('🚪 [DashboardLayout] Logging out...');
    
    // ✅ Use AuthContext logout (includes event dispatch)
    logout();
    
    // ✅ Navigate to login
    navigate("/login", { replace: true });
    
    console.log('✅ [DashboardLayout] Logout complete');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 p-6 lg:ml-64">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;