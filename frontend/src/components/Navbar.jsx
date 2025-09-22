// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  User,
  ShoppingBag,
  Home,
  Users,
  Award,
  HelpCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/chaincarbon_logo_transparent.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "explore-certificate", label: "Explore Certificate", icon: Award },
    { id: "tentang-kami", label: "Tentang Kami", icon: Users },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "kontak", label: "Kontak", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo + Text */}
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

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="relative flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-slate-700 hover:text-emerald-600 transition-all duration-300 group rounded-lg hover:bg-emerald-50/50"
                  >
                    <IconComponent size={18} />
                    <span>{link.label}</span>
                    <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </a>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl transition-all duration-300 text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
              >
                <Search size={20} />
              </button>

              {/* Login Button */}
              <Link
                to="/login"
                className="hidden md:flex items-center justify-center space-x-2 px-4 lg:px-5 h-10 lg:h-11 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold text-sm lg:text-base shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <User size={18} />
                  <span className="hidden lg:block">Login</span>
                </span>
              </Link>

              {/* Marketplace Button → langsung ke /marketplace */}
              <Link
                to="/marketplace"
                className="hidden md:flex items-center justify-center space-x-2 px-4 lg:px-5 h-10 lg:h-11 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold text-sm lg:text-base relative overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span className="hidden lg:block">Marketplace</span>
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div
            className={`hidden md:block overflow-hidden transition-all duration-500 ${
              isSearchOpen ? "max-h-24 pb-4" : "max-h-0"
            }`}
          >
            <div className="flex items-center space-x-3 bg-slate-100 rounded-xl p-3">
              <Search size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Cari kredit karbon, sertifikat, atau proyek..."
                className="flex-1 bg-transparent text-slate-800 placeholder-slate-500 focus:outline-none text-base"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Sparkles size={14} />
                Cari
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

            {/* Mobile Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <IconComponent size={18} />
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg"
              >
                <User size={18} />
                Login / Register
              </Link>
              <Link
                to="/marketplace"
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300"
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
