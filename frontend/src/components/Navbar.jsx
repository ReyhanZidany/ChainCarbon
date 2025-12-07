// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  Menu, X, User, ShoppingBag, Home, Users, Award,
  HelpCircle, Mail, LogOut, LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // ✅ Import react-scroll
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/chaincarbon_logo_transparent.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Navigation links dengan scroll support
  const navLinks = [
    { id: "home", label: "Home", icon: Home, scrollTo: "home", isScroll: true },
    { id: "featured-projects", label: "Explore Projects", icon: Award, scrollTo: "featured-projects", isScroll: true },
    { id: "about-us", label: "About Us", icon: Users, scrollTo: "about-us", isScroll: true },
    { id: "faq", label: "FAQ", icon: HelpCircle, scrollTo: "faq", isScroll: true },
    { id: "contact", label: "Contact", icon: Mail, scrollTo: "contact", isScroll: true },
  ];

  // ✅ Handle navigation ke homepage dengan scroll
  const handleScrollNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      // Jika tidak di homepage, navigate dulu
      navigate("/");
      // Tunggu sebentar untuk page load, lalu scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  };

  return (
    <>
      {/* Navbar Utama */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="w-full px-6 lg:px-14">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-3 group cursor-pointer"
            >
              <img
                src={logo}
                alt="ChainCarbon Logo"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="hidden sm:block font-extrabold text-xl lg:text-2xl">
                <span className="text-gray-900">Chain</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                  Carbon
                </span>
              </span>
            </Link>

            {/* Links Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                
                // ✅ Jika di homepage, gunakan ScrollLink
                if (location.pathname === "/" && link.isScroll) {
                  return (
                    <ScrollLink
                      key={link.id}
                      to={link.scrollTo}
                      spy={true}
                      smooth={true}
                      offset={-50}
                      duration={700}
                      className="relative flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-slate-700 hover:text-emerald-600 transition-all duration-300 group rounded-lg hover:bg-emerald-50/50 cursor-pointer"
                      activeClass="text-emerald-600 bg-emerald-50/50"
                    >
                      <IconComponent size={18} />
                      <span>{link.label}</span>
                      <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </ScrollLink>
                  );
                }
                
                // ✅ Jika bukan di homepage, navigate ke homepage dulu
                return (
                  <button
                    key={link.id}
                    onClick={() => handleScrollNavigation(link.scrollTo)}
                    className="relative flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-slate-700 hover:text-emerald-600 transition-all duration-300 group rounded-lg hover:bg-emerald-50/50 cursor-pointer"
                  >
                    <IconComponent size={18} />
                    <span>{link.label}</span>
                    <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Auth Status Display */}
              {loading ? (
                <div className="hidden md:flex items-center gap-2 px-4 h-10 bg-gray-100 rounded-xl animate-pulse">
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                </div>
              ) : isAuthenticated() ? (
                <>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center justify-center gap-2 px-4 lg:px-5 h-10 lg:h-10 bg-red-500 text-white rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:bg-red-600 transition-all duration-300"
                  >
                    <LogOut size={18} />
                    <span className="hidden lg:block">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="hidden md:flex items-center justify-center gap-2 px-4 lg:px-5 h-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <User size={18} />
                    <span className="hidden lg:block">Login</span>
                  </Link>
                </>
              )}

              {/* Marketplace */}
              <Link
                to="/marketplace"
                className="hidden md:flex items-center justify-center gap-2 px-4 lg:px-5 h-10 lg:h-10 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold text-sm lg:text-base hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag size={18} />
                <span className="hidden lg:block">Marketplace</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-all duration-300"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "bg-black/50 backdrop-blur-sm"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src={logo} alt="ChainCarbon" className="h-8 w-auto" />
                <div className="font-bold text-lg">
                  <span className="text-gray-900">Chain</span>
                  <span className="text-emerald-600">Carbon</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile (Mobile) */}
            {isAuthenticated() && user && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    {user?.company?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.company || user?.email}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-emerald-600 font-medium">
                      {user?.type === 'regulator' ? 'Regulator' : 'Company'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                
                // ✅ Mobile scroll navigation
                if (location.pathname === "/" && link.isScroll) {
                  return (
                    <ScrollLink
                      key={link.id}
                      to={link.scrollTo}
                      spy={true}
                      smooth={true}
                      offset={-80}
                      duration={500}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center gap-4 px-6 py-4 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
                      activeClass="text-emerald-600 bg-emerald-50"
                    >
                      <IconComponent size={18} />
                      {link.label}
                    </ScrollLink>
                  );
                }
                
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleScrollNavigation(link.scrollTo);
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 text-left"
                  >
                    <IconComponent size={18} />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              {isAuthenticated() ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  <User size={18} />
                  Login / Register
                </Link>
              )}

              <Link
                to="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                <ShoppingBag size={18} />
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;