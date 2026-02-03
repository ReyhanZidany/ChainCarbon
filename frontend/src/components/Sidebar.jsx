// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/chaincarbon_logo_transparent.png";
import {
    FiGrid,
    FiFolder,
    FiUpload,
    FiRepeat,
    FiBarChart2,
    FiUser,
    FiShoppingBag,
    FiLogOut,
    FiX,
    FiLogIn,
    FiUsers
} from "react-icons/fi";

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, to, isExpanded, isActive, requireAuth, onClick }) => {
    const { isAuthenticated } = useAuth();

    // If auth required but not logged in, show nothing or handle redirect elsewhere
    // In DashboardUser logic, we might still show it but redirect on click.
    // For UI consistency, we'll render it but maybe dim it? 
    // Actually dashboard logic was: render all, redirect if clicked.

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg mx-2 mb-1 transition-all duration-300 ease-in-out ${isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
        >
            <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
            <span
                className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden md:opacity-100 md:w-auto" // Handle mobile vs desktop expansion logic outside
                    }`}
                style={{ display: isExpanded ? 'block' : 'none' }} // Hard hide purely for animation logic
            >
                {label}
            </span>
            {/* Mobile only text (if needed overrides) */}
            <span className="md:hidden ml-4 font-medium">{label}</span>
        </Link>
    );
};

const Sidebar = ({
    isExpanded,
    setIsExpanded,
    isMobileMenuOpen,
    closeMobileMenu,
    handleLogout
}) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // Menus Configuration
    const menus = [
        { label: "Dashboard", to: "/dashboard", icon: FiGrid, requireAuth: true },
        { label: "Marketplace", to: "/marketplace", icon: FiShoppingBag, requireAuth: false },
        { label: "My Projects", to: "/dashboard/project", icon: FiFolder, requireAuth: true },
        { label: "Submit Project", to: "/dashboard/pengajuan", icon: FiUpload, requireAuth: true },
        { label: "Transactions", to: "/dashboard/transaksi", icon: FiRepeat, requireAuth: true },
        { label: "Reports", to: "/dashboard/laporan", icon: FiBarChart2, requireAuth: true },
        { label: "Profile", to: "/dashboard/profile", icon: FiUser, requireAuth: true },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
          fixed top-0 left-0 h-full bg-white shadow-2xl border-r border-slate-100 z-40
          transition-all duration-300 ease-in-out font-sans
          ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${!isMobileMenuOpen && (isExpanded ? 'md:w-64' : 'md:w-20')}
        `}
                onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
                onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
            >

                {/* LOGO AREA */}
                <div className="h-20 flex items-center px-6 border-b border-slate-50">
                    <Link to="/" className="flex items-center gap-3 w-full" onClick={closeMobileMenu}>
                        <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
                        <div className={`transition-opacity duration-200 ${isExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">ChainCarbon</h1>
                            <p className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase">Marketplace</p>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button onClick={closeMobileMenu} className="md:hidden ml-auto text-slate-400 hover:text-slate-600">
                        <FiX size={24} />
                    </button>
                </div>

                {/* NAVIGATION */}
                <div className="py-6 overflow-y-auto h-[calc(100vh-160px)] scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="space-y-1">
                        {menus.map((menu) => (
                            <SidebarItem
                                key={menu.to}
                                {...menu}
                                isExpanded={isExpanded || isMobileMenuOpen}
                                isActive={menu.to === "/dashboard"
                                    ? location.pathname === "/dashboard"
                                    : location.pathname.startsWith(menu.to)}
                                onClick={closeMobileMenu}
                            />
                        ))}
                    </div>
                </div>

                {/* USER FOOTER */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
                    {isAuthenticated() && user ? (
                        <div className={`flex items-center gap-3 ${!isExpanded && !isMobileMenuOpen ? 'justify-center' : ''}`}>
                            {/* Avatar */}
                            <Link to="/dashboard/profile" className="relative group">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-bold text-sm">
                                    {user.company?.[0]?.toUpperCase() || <FiUser />}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </Link>

                            {/* Info & Logout */}
                            {(isExpanded || isMobileMenuOpen) && (
                                <div className="flex-1 min-w-0 animate-fade-in">
                                    <p className="text-sm font-bold text-slate-700 truncate">
                                        {user.company || user.email}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 mt-0.5"
                                    >
                                        <FiLogOut size={12} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-lg shadow-slate-200
                ${!isExpanded && !isMobileMenuOpen ? 'px-0' : 'px-4'}
              `}
                        >
                            <FiLogIn size={18} />
                            {(isExpanded || isMobileMenuOpen) && <span className="font-semibold text-sm">Sign In</span>}
                        </Link>
                    )}
                </div>

            </div>
        </>
    );
};

export default Sidebar;