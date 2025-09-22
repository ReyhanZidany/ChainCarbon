import React, { useState } from "react";
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

/* =========================
   Dummy Data (sementara)
   Nanti bisa diganti fetch dari API/database
========================= */

const LandingPage = () => {
  // State modal sertifikat
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Handler modal sertifikat
  const closeCertificateModal = () => {
    setShowCertificateModal(false);
    setSelectedCertificate(null);
  };

  return (
    <div className="landing-container font-sans pt-16">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <header
        id="beranda"
        className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white text-center overflow-hidden"
      >
        {/* Background aksen lingkaran dengan animasi */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[900px] h-[900px] rounded-full border border-cyan-100 opacity-40 absolute"
            style={{
              animation: "spin 30s linear infinite",
            }}
          ></div>
          <div
            className="w-[600px] h-[600px] rounded-full border border-emerald-100 opacity-30 absolute"
            style={{
              animation: "spin 20s linear infinite reverse",
            }}
          ></div>
          <div className="w-[300px] h-[300px] rounded-full border border-cyan-200 opacity-20 absolute animate-pulse"></div>
        </div>

        {/* Chain-Link Inspired Floating Elements */}
        <div
          className="absolute top-24 left-1/4 w-12 h-6 border-4 border-emerald-300 rounded-full opacity-40"
          style={{
            animation: "chainFloat1 4s ease-in-out infinite",
            transform: "rotate(-45deg)",
          }}
        ></div>
        <div
          className="absolute top-32 left-1/4 w-12 h-6 border-4 border-cyan-300 rounded-full opacity-40"
          style={{
            animation: "chainFloat2 4s ease-in-out infinite 0.5s",
            transform: "rotate(-45deg) translateX(12px)",
          }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-10 h-5 border-3 border-emerald-400 rounded-full opacity-50"
          style={{
            animation: "chainFloat3 3.5s ease-in-out infinite 1s",
            transform: "rotate(45deg)",
          }}
        ></div>
        <div
          className="absolute bottom-24 right-1/4 w-10 h-5 border-3 border-cyan-400 rounded-full opacity-50"
          style={{
            animation: "chainFloat4 3.5s ease-in-out infinite 1.5s",
            transform: "rotate(45deg) translateX(-10px)",
          }}
        ></div>

        {/* Leaf-inspired Elements */}
        <div
          className="absolute top-1/3 right-20 w-8 h-4 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-60"
          style={{
            animation: "leafSway 6s ease-in-out infinite",
            clipPath: "ellipse(50% 50% at 20% 50%)",
            borderRadius: "0 100% 0 100%",
          }}
        ></div>
        <div
          className="absolute bottom-1/3 left-16 w-6 h-3 bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-60"
          style={{
            animation: "leafSway 5s ease-in-out infinite 2s",
            clipPath: "ellipse(50% 50% at 80% 50%)",
            borderRadius: "100% 0 100% 0",
          }}
        ></div>

        {/* Enhanced Particle System */}
        <span className="absolute top-20 left-24 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="absolute bottom-40 right-28 w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
        <span className="absolute top-1/4 right-1/4 w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></span>
        <span
          className="absolute top-1/3 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></span>
        <span
          className="absolute bottom-1/3 left-20 w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></span>
        <span
          className="absolute top-1/2 right-16 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"
          style={{ animationDelay: "0.7s" }}
        ></span>

        {/* Chain Link Network Animation */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <linearGradient
              id="chainGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            d="M100 200 Q300 100 500 200 T900 200"
            stroke="url(#chainGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,5"
            style={{
              animation: "dashMove 8s linear infinite",
            }}
          />
          <path
            d="M150 400 Q350 300 550 400 T950 400"
            stroke="url(#chainGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8,4"
            style={{
              animation: "dashMove 6s linear infinite reverse",
            }}
          />
          <path
            d="M50 600 Q250 500 450 600 T850 600"
            stroke="url(#chainGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="12,6"
            style={{
              animation: "dashMove 10s linear infinite",
            }}
          />
        </svg>

        {/* Enhanced Content with Staggered Animations */}
        <div
          className="relative z-10 max-w-5xl mx-auto px-6"
          style={{
            animation: "fadeInUp 1.2s ease-out forwards",
            opacity: 0,
          }}
        >
          {/* Logo dengan Enhanced Animation */}
          <div
            className="mb-8"
            style={{
              animation: "logoEntrance 1.5s ease-out forwards 0.5s",
              opacity: 0,
              transform: "translateY(30px) scale(0.8)",
            }}
          >
            <div className="relative">
              <img
                src={logo}
                alt="ChainCarbon"
                className="mx-auto h-20 md:h-24 drop-shadow-lg hover:scale-110 transition-transform duration-300 relative z-10"
              />
              {/* Glow Effect */}
              <div
                className="absolute inset-0 mx-auto h-20 md:h-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-30"
                style={{
                  animation: "logoGlow 3s ease-in-out infinite alternate",
                }}
              ></div>
              {/* Rotating Ring */}
              <div
                className="absolute inset-0 mx-auto w-32 h-32 border-2 border-dashed border-emerald-300 rounded-full opacity-20"
                style={{
                  animation: "spin 20s linear infinite",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>
          </div>

          {/* Enhanced Title with Sequential Animation */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 text-center">
              <span
                className="block mb-6"
                style={{
                  animation: "slideInLeft 1s ease-out forwards 0.8s",
                  opacity: 0,
                  transform: "translateX(-50px)",
                }}
              >
                Selamat Datang di{" "}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 relative"
                  style={{
                    animation: "textShine 3s ease-in-out infinite",
                  }}
                >
                  ChainCarbon
                  {/* Underline Animation */}
                  <span
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{
                      animation: "underlineExpand 1.5s ease-out forwards 1.5s",
                      width: "0%",
                    }}
                  ></span>
                </span>
              </span>
              <span
                className="block mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed py-2"
                style={{
                  animation: "slideInRight 1s ease-out forwards 1s",
                  opacity: 0,
                  transform: "translateX(50px)",
                }}
              >
                Marketplace Kredit Karbon
              </span>
              <span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed py-2 pb-4"
                style={{
                  animation: "slideInLeft 1s ease-out forwards 1.2s",
                  opacity: 0,
                  transform: "translateX(-50px)",
                }}
              >
                Berbasis Teknologi Blockchain
              </span>
            </h1>
          </div>

          {/* Enhanced Description */}
          <div
            className="mb-10"
            style={{
              animation: "fadeIn 1s ease-out forwards 1.4s",
              opacity: 0,
            }}
          >
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              ChainCarbon menghadirkan marketplace kredit karbon berbasis
              blockchain dengan transparansi penuh, dampak nyata, dan dukungan
              pada ekosistem hijau yang berkelanjutan.
            </p>
          </div>

          {/* Enhanced Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            style={{
              animation: "fadeInUp 1s ease-out forwards 1.6s",
              opacity: 0,
              transform: "translateY(30px)",
            }}
          >
            {/* Tombol ke Marketplace - menggunakan RouterLink */}
            <RouterLink
              to="/marketplace"
              className="group w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg transform hover:-translate-y-1 relative overflow-hidden"
            >
              <span className="relative z-10">Pergi ke Marketplace</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </RouterLink>

            {/* Tombol scroll ke section - menggunakan react-scroll Link */}
            <Link
              to="tentang-kami"
              smooth={true}
              duration={500}
              className="group w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300 text-lg transform hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">Pelajari Lebih Lanjut</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{
            animation: "fadeInBounce 1s ease-out forwards 2s",
            opacity: 0,
          }}
        >
          <div className="relative">
            <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center animate-bounce">
              <div
                className="w-1 h-3 bg-emerald-400 rounded-full mt-2"
                style={{
                  animation: "scrollDot 2s ease-in-out infinite",
                }}
              ></div>
            </div>
            {/* Scroll Text */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">
              Scroll down
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes chainFloat1 {
            0%,
            100% {
              transform: rotate(-45deg) translateY(0px);
            }
            50% {
              transform: rotate(-45deg) translateY(-15px);
            }
          }

          @keyframes chainFloat2 {
            0%,
            100% {
              transform: rotate(-45deg) translateX(12px) translateY(0px);
            }
            50% {
              transform: rotate(-45deg) translateX(12px) translateY(-10px);
            }
          }

          @keyframes chainFloat3 {
            0%,
            100% {
              transform: rotate(45deg) translateY(0px);
            }
            50% {
              transform: rotate(45deg) translateY(15px);
            }
          }

          @keyframes chainFloat4 {
            0%,
            100% {
              transform: rotate(45deg) translateX(-10px) translateY(0px);
            }
            50% {
              transform: rotate(45deg) translateX(-10px) translateY(10px);
            }
          }

          @keyframes leafSway {
            0%,
            100% {
              transform: rotate(0deg) scale(1);
            }
            25% {
              transform: rotate(5deg) scale(1.1);
            }
            75% {
              transform: rotate(-5deg) scale(0.9);
            }
          }

          @keyframes dashMove {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: 100;
            }
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes logoEntrance {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes logoGlow {
            0% {
              opacity: 0.2;
              transform: scale(0.95);
            }
            100% {
              opacity: 0.4;
              transform: scale(1.05);
            }
          }

          @keyframes slideInLeft {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }

          @keyframes textShine {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes underlineExpand {
            to {
              width: 100%;
            }
          }

          @keyframes fadeInBounce {
            to {
              opacity: 1;
            }
          }

          @keyframes scrollDot {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            50% {
              opacity: 0.3;
              transform: translateY(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </header>

      {/* Statistik */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-20 bg-emerald-400 rounded-full transform rotate-45 blur-xl"></div>
          <div className="absolute bottom-32 right-32 w-32 h-16 bg-cyan-400 rounded-full transform -rotate-12 blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg"></div>
        </div>

        {/* Chain Link Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <defs>
              <linearGradient
                id="chainGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Chain Link Shapes */}
            <ellipse
              cx="200"
              cy="150"
              rx="30"
              ry="15"
              fill="none"
              stroke="url(#chainGradient)"
              strokeWidth="4"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 200 150;360 200 150"
                dur="20s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse
              cx="400"
              cy="200"
              rx="25"
              ry="12"
              fill="none"
              stroke="url(#chainGradient)"
              strokeWidth="3"
              opacity="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="45 400 200;405 400 200"
                dur="25s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse
              cx="800"
              cy="120"
              rx="35"
              ry="18"
              fill="none"
              stroke="url(#chainGradient)"
              strokeWidth="4"
              opacity="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="90 800 120;450 800 120"
                dur="15s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse
              cx="1000"
              cy="300"
              rx="28"
              ry="14"
              fill="none"
              stroke="url(#chainGradient)"
              strokeWidth="3"
              opacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-45 1000 300;315 1000 300"
                dur="30s"
                repeatCount="indefinite"
              />
            </ellipse>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Statistik Marketplace
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Capaian platform kami dalam mendukung{" "}
              <span className="font-semibold text-emerald-700">
                ekosistem karbon berkelanjutan
              </span>{" "}
              hingga saat ini
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Volume */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700 mb-3">
                    1.2M
                  </h3>
                  <p className="text-slate-700 font-medium text-lg">
                    Total Volume
                  </p>
                  <p className="text-slate-500 text-sm mt-1">(tCO₂e)</p>
                  <div className="mt-4 flex items-center justify-center text-emerald-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      +15.2% bulan ini
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pengurangan Emisi */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-cyan-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700 mb-3">
                    850K
                  </h3>
                  <p className="text-slate-700 font-medium text-lg">
                    Pengurangan Emisi
                  </p>
                  <p className="text-slate-500 text-sm mt-1">(tCO₂e)</p>
                  <div className="mt-4 flex items-center justify-center text-cyan-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      +22.8% bulan ini
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proyek Aktif */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                </div>
                <div className="text-center">
                  <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 mb-3">
                    230
                  </h3>
                  <p className="text-slate-700 font-medium text-lg">
                    Proyek Aktif
                  </p>
                  <p className="text-slate-500 text-sm mt-1">Sedang Berjalan</p>
                  <div className="mt-4 flex items-center justify-center text-blue-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm font-medium">+12 proyek baru</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pengguna Terdaftar */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-3">
                    45K
                  </h3>
                  <p className="text-slate-700 font-medium text-lg">
                    Pengguna Terdaftar
                  </p>
                  <p className="text-slate-500 text-sm mt-1">Active Users</p>
                  <div className="mt-4 flex items-center justify-center text-emerald-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      +1.2K pengguna baru
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-cyan-50 px-8 py-4 rounded-full border border-emerald-200">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">
                Data diperbarui secara real-time
              </span>
              <div
                className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pasar Karbon */}
      <section className="relative py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-16 bg-emerald-400 rounded-full transform rotate-12 blur-lg"></div>
          <div className="absolute bottom-32 right-20 w-24 h-12 bg-cyan-400 rounded-full transform -rotate-12 blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-10 bg-blue-400 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Pasar Karbon Aktif
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Temukan kredit karbon berkualitas tinggi dari proyek-proyek
              verifikasi terpercaya
            </p>
          </div>

          {/* Market Filter */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-700">Filter:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-medium shadow-lg">
                    Semua Proyek
                  </button>
                  <button className="px-4 py-2 bg-white border border-emerald-300 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors">
                    Kehutanan
                  </button>
                  <button className="px-4 py-2 bg-white border border-cyan-300 text-cyan-700 rounded-full text-sm font-medium hover:bg-cyan-50 transition-colors">
                    Energi Terbarukan
                  </button>
                  <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                    Teknologi Bersih
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white">
                  <tr>
                    <th className="py-5 px-6 text-left font-bold text-lg">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
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
                        Proyek
                      </div>
                    </th>
                    <th className="py-5 px-6 text-center font-bold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Volume (tCO₂e)
                      </div>
                    </th>
                    <th className="py-5 px-6 text-center font-bold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Harga / tCO₂e
                      </div>
                    </th>
                    <th className="py-5 px-6 text-center font-bold text-lg">
                      Status
                    </th>
                    <th className="py-5 px-6 text-center font-bold text-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {/* Row 1 */}
                  <tr className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-cyan-50/50 transition-all duration-300">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
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
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-slate-800">
                            Proyek Hutan Kalimantan
                          </div>
                          <div className="text-sm text-slate-500">
                            Konservasi & Restorasi
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              VCS Verified
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Gold Standard
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-emerald-600">
                        10.000
                      </div>
                      <div className="text-sm text-slate-500">tersedia</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-cyan-600">
                        Rp 75.000
                      </div>
                      <div className="text-sm text-slate-500">per ton</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Aktif
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
                        Beli Sekarang
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-300">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
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
                        <div>
                          <div className="font-bold text-lg text-slate-800">
                            Solar Farm Jawa Tengah
                          </div>
                          <div className="text-sm text-slate-500">
                            Energi Terbarukan
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                              CDM Certified
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              UNFCCC
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-cyan-600">
                        25.000
                      </div>
                      <div className="text-sm text-slate-500">tersedia</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-blue-600">
                        Rp 85.000
                      </div>
                      <div className="text-sm text-slate-500">per ton</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        Aktif
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
                        Beli Sekarang
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-emerald-50/50 transition-all duration-300">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
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
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-slate-800">
                            Biogas Komunitas Bali
                          </div>
                          <div className="text-sm text-slate-500">
                            Teknologi Bersih
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              VER Standard
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Community Project
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-blue-600">
                        8.500
                      </div>
                      <div className="text-sm text-slate-500">tersedia</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-emerald-600">
                        Rp 65.000
                      </div>
                      <div className="text-sm text-slate-500">per ton</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Aktif
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button className="bg-gradient-to-r from-blue-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
                        Beli Sekarang
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-cyan-50/50 transition-all duration-300">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
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
                              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-slate-800">
                            Mangrove Restoration Sumatra
                          </div>
                          <div className="text-sm text-slate-500">
                            Blue Carbon
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              VCS + CCB
                            </span>
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                              Nature Based
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-emerald-600">
                        15.000
                      </div>
                      <div className="text-sm text-slate-500">tersedia</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="font-bold text-2xl text-cyan-600">
                        Rp 90.000
                      </div>
                      <div className="text-sm text-slate-500">per ton</div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Aktif
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
                        Beli Sekarang
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {/* Market Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8 border border-emerald-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Ringkasan Pasar
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Volume Tersedia:</span>
                  <span className="font-bold text-emerald-600 text-xl">
                    58.500 tCO₂e
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Rata-rata Harga:</span>
                  <span className="font-bold text-cyan-600 text-xl">
                    Rp 78.750
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Proyek Aktif:</span>
                  <span className="font-bold text-blue-600 text-xl">
                    4 Proyek
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Siap Memulai?</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Bergabunglah dengan marketplace kredit karbon terpercaya dan
                berkontribusi untuk masa depan yang berkelanjutan.
              </p>
              <div className="space-y-3">
                <Link
                  to="/marketplace"
                  className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Jelajahi Semua Kredit Karbon
                </Link>
                <Link
                  to="/register"
                  className="block w-full border-2 border-emerald-400 text-emerald-400 px-6 py-4 rounded-xl font-bold text-center hover:bg-emerald-400 hover:text-white transition-all duration-300"
                >
                  Daftar Sebagai Pengguna
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grafik */}
      <section className="relative py-20 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-20 bg-emerald-400 rounded-full transform rotate-12 blur-xl"></div>
          <div className="absolute bottom-32 left-16 w-32 h-16 bg-cyan-400 rounded-full transform -rotate-12 blur-lg"></div>
        </div>

        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-300"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Analitik & Tren Pasar
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Pantau performa marketplace dan analisis mendalam tren penjualan
              kredit karbon dari waktu ke waktu
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="text-emerald-600 text-sm font-medium">
                  +12.5%
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">325K</div>
              <div className="text-slate-600 text-sm">
                Volume Bulanan (tCO₂e)
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="text-cyan-600 text-sm font-medium">+8.3%</div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                Rp 82.5K
              </div>
              <div className="text-slate-600 text-sm">Harga Rata-rata</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div className="text-blue-600 text-sm font-medium">+15.7%</div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">1.2K</div>
              <div className="text-slate-600 text-sm">Transaksi Aktif</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-300/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div className="text-emerald-600 text-sm font-medium">
                  +22.1%
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">45</div>
              <div className="text-slate-600 text-sm">Proyek Baru</div>
            </div>
          </div>

          {/* Main Chart Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Container */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      Tren Penjualan Kredit Karbon
                    </h3>
                    <p className="text-slate-600">
                      Data volume transaksi 12 bulan terakhir
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium">
                      12 Bulan
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                      6 Bulan
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                      3 Bulan
                    </button>
                  </div>
                </div>

                {/* Chart Data Visualization */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        {
                          month: "Nov 2024",
                          volume: 200000,
                          price: 75000,
                          projects: 35,
                        },
                        {
                          month: "Des 2024",
                          volume: 200000,
                          price: 77500,
                          projects: 38,
                        },
                        {
                          month: "Jan 2025",
                          volume: 120000,
                          price: 76000,
                          projects: 40,
                        },
                        {
                          month: "Feb 2025",
                          volume: 180000,
                          price: 78500,
                          projects: 42,
                        },
                        {
                          month: "Mar 2025",
                          volume: 140000,
                          price: 80000,
                          projects: 41,
                        },
                        {
                          month: "Apr 2025",
                          volume: 220000,
                          price: 79500,
                          projects: 44,
                        },
                        {
                          month: "Mei 2025",
                          volume: 260000,
                          price: 81000,
                          projects: 46,
                        },
                        {
                          month: "Jun 2025",
                          volume: 210000,
                          price: 82000,
                          projects: 43,
                        },
                        {
                          month: "Jul 2025",
                          volume: 280000,
                          price: 83500,
                          projects: 47,
                        },
                      ]}
                    >
                      <defs>
                        <linearGradient
                          id="volumeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="priceGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06b6d4"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06b6d4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        unit=" K tCO₂e"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          fontSize: "14px",
                        }}
                        labelStyle={{ color: "#1e293b", fontWeight: "bold" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#volumeGradient)"
                        name="Volume (K tCO₂e)"
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                        name="Harga Rata-rata (K IDR)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Panel - Additional Analytics */}
            <div className="space-y-8">
              {/* Top Performing Projects */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-xl">
                <h4 className="text-xl font-bold text-slate-800 mb-6">
                  Proyek Terpopuler
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        Hutan Kalimantan
                      </div>
                      <div className="text-sm text-slate-600">
                        45.2K tCO₂e terjual
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        Solar Farm Jateng
                      </div>
                      <div className="text-sm text-slate-600">
                        38.7K tCO₂e terjual
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        Biogas Bali
                      </div>
                      <div className="text-sm text-slate-600">
                        29.1K tCO₂e terjual
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-6 border border-emerald-200/50">
                <h4 className="text-xl font-bold text-slate-800 mb-4">
                  Insight Pasar
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        Tren Naik 15%
                      </p>
                      <p className="text-xs text-slate-600">
                        Volume transaksi Q4 meningkat signifikan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        Harga Stabil
                      </p>
                      <p className="text-xs text-slate-600">
                        Fluktuasi harga dalam rentang normal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        Proyek Berkualitas
                      </p>
                      <p className="text-xs text-slate-600">
                        22 proyek baru dengan sertifikasi premium
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export/Download */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <h4 className="text-lg font-bold mb-4">Download Laporan</h4>
                <p className="text-slate-300 text-sm mb-6">
                  Dapatkan analisis lengkap dan laporan detailed marketplace
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200">
                    Download PDF Report
                  </button>
                  <button className="w-full border border-emerald-400 text-emerald-400 px-4 py-3 rounded-xl font-medium hover:bg-emerald-400 hover:text-white transition-colors duration-200">
                    Export Data CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proyek Unggulan */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-32 w-64 h-32 bg-emerald-400 rounded-full transform rotate-45 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-24 bg-cyan-400 rounded-full transform -rotate-45 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>

        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
            <defs>
              <pattern
                id="featured-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="2"
                  fill="currentColor"
                  className="text-emerald-300"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#featured-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-500 rounded-3xl flex items-center justify-center transform rotate-12 shadow-2xl">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Proyek Unggulan
              </span>
            </h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Temukan proyek-proyek kredit karbon berkualitas tinggi yang telah
              terverifikasi dan siap untuk investasi berkelanjutan
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center items-center gap-8 mt-12 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium">500+ Proyek Aktif</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-medium">95% Rating Kepuasan</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Sertifikasi Internasional</span>
              </div>
            </div>
          </div>

          {/* Filter/Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-slate-200/50 shadow-lg">
              <div className="flex gap-2">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-md transform transition-all hover:scale-105">
                  Semua Proyek
                </button>
                <button className="px-6 py-3 text-slate-600 hover:text-emerald-600 rounded-xl font-medium text-sm transition-colors">
                  Hutan & Lahan
                </button>
                <button className="px-6 py-3 text-slate-600 hover:text-emerald-600 rounded-xl font-medium text-sm transition-colors">
                  Energi Terbarukan
                </button>
                <button className="px-6 py-3 text-slate-600 hover:text-emerald-600 rounded-xl font-medium text-sm transition-colors">
                  Teknologi Bersih
                </button>
              </div>
            </div>
          </div>

          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Project 1 - Enhanced */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <div className="h-56 relative">
                  <img
                    src="https://cdn.betahita.id/7/2/0/4/7204.jpeg"
                    alt="Hutan Lindung Kalimantan"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
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
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-700">
                      Terverifikasi
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
                  Rp 125K / tCO₂e
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                      Hutan Lindung Kalimantan
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
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
                      <span className="font-medium">
                        Kalimantan Tengah, Indonesia
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    REDD+
                  </span>
                  <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                    Konservasi
                  </span>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  Proyek konservasi hutan seluas 50,000 hektare yang melindungi
                  keanekaragaman hayati dan menyerap 200K tCO₂e per tahun.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      200K
                    </div>
                    <div className="text-sm text-slate-600">tCO₂e/tahun</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">95%</div>
                    <div className="text-sm text-slate-600">Tersedia</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 group-hover:from-emerald-600 group-hover:to-cyan-700">
                  Lihat Detail Proyek
                </button>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <div className="h-56 relative">
                  <img
                    src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01hcm8yhhwj00h8n8awwkzre30.jpg"
                    alt="Solar Farm Jawa Tengah"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-700">
                      Terverifikasi
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
                  Rp 98K / tCO₂e
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">
                      Solar Farm Jawa Tengah
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
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
                      <span className="font-medium">Semarang, Jawa Tengah</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                    Solar Energy
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Clean Tech
                  </span>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  Pembangkit listrik tenaga surya 100 MW yang menggantikan
                  energi fosil dan mengurangi emisi hingga 150K tCO₂e per tahun.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">150K</div>
                    <div className="text-sm text-slate-600">tCO₂e/tahun</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                    <div className="text-sm text-slate-600">Tersedia</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 group-hover:from-cyan-600 group-hover:to-blue-700">
                  Lihat Detail Proyek
                </button>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <div className="h-56 relative">
                  <img
                    src="https://organicsbali.com/wp-content/uploads/2025/07/BMA-biogas-thumbnail-scaled.jpg"
                    alt="Biogas Bali Berkelanjutan"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
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
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-700">
                      Terverifikasi
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
                  Rp 89K / tCO₂e
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      Biogas Bali Berkelanjutan
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
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
                      <span className="font-medium">Denpasar, Bali</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Biogas
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    Waste Management
                  </span>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  Teknologi biogas dari limbah organik yang menghasilkan energi
                  bersih dan mengurangi emisi metana sebesar 80K tCO₂e per
                  tahun.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">80K</div>
                    <div className="text-sm text-slate-600">tCO₂e/tahun</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      92%
                    </div>
                    <div className="text-sm text-slate-600">Tersedia</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700">
                  Lihat Detail Proyek
                </button>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl p-1 inline-block shadow-2xl">
              <div className="bg-white rounded-3xl px-12 py-8">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 mb-4">
                  Jelajahi Lebih Banyak Proyek
                </h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Temukan ratusan proyek kredit karbon lainnya yang sesuai
                  dengan tujuan investasi berkelanjutan Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                    Lihat Semua Proyek
                  </button>
                  <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300">
                    Panduan Investasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Certificate */}
      <section
        id="explore-certificate"
        className="relative py-20 bg-gradient-to-br from-white via-slate-50 to-cyan-50/30 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-20 w-56 h-28 bg-emerald-400 rounded-full transform -rotate-12 blur-3xl"></div>
          <div className="absolute bottom-24 right-16 w-44 h-22 bg-cyan-400 rounded-full transform rotate-45 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-blue-400 rounded-full transform blur-3xl"></div>
        </div>

        {/* Floating Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <pattern
              id="cert-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="2"
                height="2"
                fill="currentColor"
                className="text-emerald-300"
                x="10"
                y="10"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cert-pattern)" />
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-bounce"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Explore Certificate
              </span>
            </h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Jelajahi sertifikat karbon yang tersedia secara publik dengan
              transparansi penuh dan verifikasi blockchain
            </p>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mt-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID atau nama proyek..."
                  className="w-80 px-6 py-4 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-4 rounded-2xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none bg-white">
                  <option>Semua Status</option>
                  <option>Aktif</option>
                  <option>Pending</option>
                  <option>Retired</option>
                </select>
                <select className="px-4 py-4 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white">
                  <option>Semua Kategori</option>
                  <option>Renewable Energy</option>
                  <option>Forest Conservation</option>
                  <option>Clean Technology</option>
                </select>
              </div>
            </div>
          </div>

          {/* Certificate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Certificate 1 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className="relative overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src="https://cdn.betahita.id/7/2/0/4/7204.jpeg"
                    alt="Sertifikat Hutan Kalimantan"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <svg
                      className="w-12 h-12 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                  AKTIF
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <div className="text-xs text-slate-600">ID Certificate</div>
                  <div className="font-bold text-slate-800">CC-001-2025</div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                    Konservasi Hutan Kalimantan
                  </h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Jumlah Karbon:
                    </span>
                    <span className="font-bold text-emerald-600 text-lg">
                      1,250 tCO₂e
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Lokasi:</span>
                    <span className="font-semibold text-slate-800">
                      Kalimantan Tengah
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Verifikator:</span>
                    <span className="font-semibold text-slate-800">
                      VCS Standard
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    REDD+
                  </span>
                  <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                    Verified
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-4">
                  <strong>Pemilik:</strong> PT. Hutan Lestari Indonesia
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                  Lihat Detail Lengkap
                </button>
              </div>
            </div>

            {/* Certificate 2 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className="relative overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01hcm8yhhwj00h8n8awwkzre30.jpg"
                    alt="Sertifikat Solar Energy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <svg
                      className="w-12 h-12 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  AKTIF
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <div className="text-xs text-slate-600">ID Certificate</div>
                  <div className="font-bold text-slate-800">CC-002-2025</div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-cyan-600 transition-colors mb-3">
                  Solar Farm Jawa Tengah
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Jumlah Karbon:
                    </span>
                    <span className="font-bold text-cyan-600 text-lg">
                      980 tCO₂e
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Lokasi:</span>
                    <span className="font-semibold text-slate-800">
                      Semarang, Jateng
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Verifikator:</span>
                    <span className="font-semibold text-slate-800">
                      Gold Standard
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                    Renewable Energy
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Solar
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-4">
                  <strong>Pemilik:</strong> PT. Energi Surya Nusantara
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                  Lihat Detail Lengkap
                </button>
              </div>
            </div>

            {/* Certificate 3 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className="relative overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src="https://organicsbali.com/wp-content/uploads/2025/07/BMA-biogas-thumbnail-scaled.jpg"
                    alt="Sertifikat Biogas Technology"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <svg
                      className="w-12 h-12 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  NONAKTIF
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <div className="text-xs text-slate-600">ID Certificate</div>
                  <div className="font-bold text-slate-800">CC-003-2025</div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-3">
                  Biogas Bali Berkelanjutan
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Jumlah Karbon:
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      750 tCO₂e
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Lokasi:</span>
                    <span className="font-semibold text-slate-800">
                      Denpasar, Bali
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Verifikator:</span>
                    <span className="font-semibold text-slate-800">
                      CAR Standard
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Biogas
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    Waste Management
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-4">
                  <strong>Pemilik:</strong> CV. Biogas Nusantara
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                  Lihat Detail Lengkap
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                2,847
              </div>
              <div className="text-slate-600 text-sm">Total Sertifikat</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200/50 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">850K</div>
              <div className="text-slate-600 text-sm">Total tCO₂e</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">145</div>
              <div className="text-slate-600 text-sm">Pemilik Aktif</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                Rp 95K
              </div>
              <div className="text-slate-600 text-sm">Rata-rata Harga</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl p-1 inline-block shadow-2xl">
              <div className="bg-white rounded-3xl px-12 py-8">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 mb-4">
                  Transparansi Blockchain Penuh
                </h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Setiap sertifikat dilacak dan diverifikasi menggunakan
                  teknologi blockchain untuk memastikan keaslian dan mencegah
                  double counting
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                    Lihat Semua Sertifikat
                  </button>
                  <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300">
                    API Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Enhanced Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 border-b px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                  Detail Sertifikat Carbon
                </h2>
                <p className="text-slate-600 mt-1">
                  Verifikasi Blockchain • Transparansi Penuh
                </p>
              </div>
              <button
                onClick={closeCertificateModal}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Enhanced Body */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="lg:w-1/3">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={
                        selectedCertificate.imageUrl ||
                        "https://example.com/default-certificate.jpg"
                      }
                      alt={selectedCertificate.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center"
                      style={{ display: "none" }}
                    >
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
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                          selectedCertificate.status === "Aktif"
                            ? "bg-emerald-500"
                            : selectedCertificate.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-slate-500"
                        }`}
                      >
                        {selectedCertificate.status}
                      </span>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  <div className="mt-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 border border-emerald-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      <h4 className="font-bold text-slate-800">
                        Blockchain Verified
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Block Height:</span>
                        <span className="font-mono text-slate-800">
                          #2,847,392
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Transaction Hash:
                        </span>
                        <span className="font-mono text-slate-800 truncate">
                          0xA2F...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Confirmations:</span>
                        <span className="font-semibold text-emerald-600">
                          12,847
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <h3 className="text-3xl font-bold text-slate-800 mb-6">
                    {selectedCertificate.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-emerald-600 text-sm font-medium">
                            ID Sertifikat
                          </p>
                          <p className="font-bold text-slate-800 text-lg">
                            {selectedCertificate.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-cyan-600 text-sm font-medium">
                            Jumlah Karbon
                          </p>
                          <p className="font-bold text-slate-800 text-xl">
                            {selectedCertificate.carbonAmount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
                        <div>
                          <p className="text-blue-600 text-sm font-medium">
                            Nama Proyek
                          </p>
                          <p className="font-bold text-slate-800">
                            {selectedCertificate.projectName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
                        </div>
                        <div>
                          <p className="text-indigo-600 text-sm font-medium">
                            Lokasi
                          </p>
                          <p className="font-bold text-slate-800">
                            {selectedCertificate.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Kategori</p>
                      <p className="font-semibold text-slate-800">
                        {selectedCertificate.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Tanggal Terbit</p>
                      <p className="font-semibold text-slate-800">
                        {selectedCertificate.issueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Tanggal Kadaluarsa</p>
                      <p className="font-semibold text-slate-800">
                        {selectedCertificate.expiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Verifikator</p>
                      <p className="font-semibold text-slate-800">
                        {selectedCertificate.verifier}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Pemilik Saat Ini</p>
                      <p className="font-semibold text-slate-800">
                        {selectedCertificate.currentOwner}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Vintage Year</p>
                      <p className="font-semibold text-slate-800">2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Ownership History */}
              {Array.isArray(selectedCertificate.ownershipHistory) &&
                selectedCertificate.ownershipHistory.length > 0 && (
                  <div className="border-t pt-8">
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">
                      Riwayat Kepemilikan & Transaksi
                    </h4>
                    <div className="space-y-4">
                      {selectedCertificate.ownershipHistory.map(
                        (history, idx) => (
                          <div
                            key={`${history.transactionId}-${idx}`}
                            className="bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                              <div className="flex items-center gap-4">
                                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
                                  Transfer #
                                  {selectedCertificate.ownershipHistory.length -
                                    idx}
                                </span>
                                <div className="flex items-center gap-2 text-slate-600">
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
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="font-medium">
                                    {history.date}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-lg border">
                                TX ID:{" "}
                                <span className="font-mono">
                                  {history.transactionId}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                              <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <p className="text-slate-500 mb-2 flex items-center gap-2">
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
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  Dari
                                </p>
                                <p className="font-semibold text-slate-800">
                                  {history.fromOwner}
                                </p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <p className="text-slate-500 mb-2 flex items-center gap-2">
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
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  Kepada
                                </p>
                                <p className="font-semibold text-slate-800">
                                  {history.toOwner}
                                </p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <p className="text-slate-500 mb-2 flex items-center gap-2">
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
                                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                    />
                                  </svg>
                                  Jumlah
                                </p>
                                <p className="font-semibold text-emerald-700">
                                  {history.amount}
                                </p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <p className="text-slate-500 mb-2 flex items-center gap-2">
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
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                  </svg>
                                  Nilai Transaksi
                                </p>
                                <p className="font-semibold text-slate-800">
                                  {history.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t">
                <button className="flex-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8"
                    />
                  </svg>
                  Beli Sertifikat Serupa
                </button>
                <button className="flex-1 border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Unduh Detail PDF
                </button>
                <button className="flex-1 border-2 border-emerald-500 text-emerald-700 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Bagikan Sertifikat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tentang Kami */}
      <section
        id="tentang-kami"
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
              Tentang Kami
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-8 rounded-full"></div>

            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-4xl mx-auto">
              <span className="font-semibold text-white">ChainCarbon</span>{" "}
              adalah platform{" "}
              <span className="font-semibold text-cyan-200">
                marketplace perdagangan kredit karbon
              </span>{" "}
              yang dirancang untuk menjawab tantangan global perubahan iklim
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
                  <h3 className="text-2xl font-bold text-white">
                    Komitmen Global
                  </h3>
                </div>
                <p className="text-emerald-100 leading-relaxed text-lg">
                  Mendukung komitmen Indonesia dalam{" "}
                  <span className="font-semibold text-cyan-200">
                    Perjanjian Paris
                  </span>{" "}
                  dan{" "}
                  <span className="font-semibold text-cyan-200">
                    NDC (Nationally Determined Contributions)
                  </span>
                  . Kami percaya keberlanjutan hanya dapat dicapai dengan{" "}
                  <span className="font-semibold text-white">
                    transparansi, akuntabilitas, dan kepercayaan penuh
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
                  <h3 className="text-2xl font-bold text-white">
                    Teknologi Blockchain
                  </h3>
                </div>
                <p className="text-emerald-100 leading-relaxed text-lg">
                  Mengintegrasikan{" "}
                  <span className="font-semibold text-cyan-200">
                    teknologi blockchain Hyperledger Fabric
                  </span>{" "}
                  untuk sistem perdagangan yang{" "}
                  <span className="font-semibold text-white">
                    aman, efisien, dan tidak dapat dimanipulasi
                  </span>
                  . Setiap sertifikat karbon dicatat melalui{" "}
                  <span className="font-semibold text-cyan-200">
                    smart contract
                  </span>{" "}
                  dengan verifikasi otomatis tanpa pihak ketiga.
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
                  Arsitektur Hibrid
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-emerald-100">
                      Penyimpanan On-Chain untuk transaksi penting
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <span className="text-emerald-100">
                      Database Off-Chain untuk data pengguna
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <span className="text-emerald-100">
                      Smart Contract untuk verifikasi otomatis
                    </span>
                  </div>
                </div>
              </div>

              {/* Stakeholders */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Pemangku Kepentingan
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
                    <p className="text-sm text-emerald-100">Pemilik Proyek</p>
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
                    <p className="text-sm text-emerald-100">Pembeli</p>
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
              Visi Kami
            </h3>
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-5xl mx-auto">
              <span className="font-semibold text-white">
                Menciptakan ekosistem hijau yang terhubung secara digital
              </span>
              , tempat setiap ton karbon yang dikurangi dapat dihargai dan
              ditransaksikan secara adil. Dengan ChainCarbon, perdagangan kredit
              karbon tidak lagi sekadar angka di atas kertas, tetapi bagian
              nyata dari upaya global menuju{" "}
              <span className="font-semibold text-cyan-200">
                bumi yang lebih bersih, sehat, dan berkelanjutan
              </span>
              .
            </p>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Nilai-Nilai Kami
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
                <h4 className="text-xl font-bold text-white mb-3">
                  Transparansi
                </h4>
                <p className="text-emerald-100">
                  Sistem terbuka dan dapat diverifikasi oleh semua pihak
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
                <h4 className="text-xl font-bold text-white mb-3">
                  Keberlanjutan
                </h4>
                <p className="text-emerald-100">
                  Komitmen jangka panjang untuk lingkungan
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
                  Inovasi Teknologi
                </h4>
                <p className="text-emerald-100">
                  Memanfaatkan teknologi terdepan untuk solusi terbaik
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
                <h4 className="text-xl font-bold text-white mb-3">
                  Kolaborasi Global
                </h4>
                <p className="text-emerald-100">
                  Membangun jaringan kemitraan yang kuat
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
              Temukan jawaban atas pertanyaan umum seputar ChainCarbon dan
              perdagangan kredit karbon berbasis blockchain
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
                    Apa itu ChainCarbon?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    ChainCarbon adalah marketplace perdagangan kredit karbon
                    berbasis blockchain yang transparan, aman, dan mudah
                    digunakan. Platform ini memungkinkan perdagangan kredit
                    karbon dengan teknologi blockchain untuk menjamin
                    transparansi dan keamanan setiap transaksi.
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
                    Bagaimana teknologi blockchain digunakan?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Setiap transaksi tercatat permanen di blockchain dan
                    diverifikasi otomatis dengan smart contract, sehingga tidak
                    bisa dimanipulasi. Teknologi ini memastikan transparansi
                    penuh dan mencegah double counting.
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
                    Apa manfaat membeli kredit karbon di ChainCarbon?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Anda bisa mengimbangi emisi karbon, mendukung proyek hijau,
                    dan berkontribusi pada target keberlanjutan global. Setiap
                    pembelian membantu mendanai proyek-proyek ramah lingkungan
                    yang terverifikasi.
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
                    Siapa yang bisa menggunakan ChainCarbon?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Semua pihak, mulai dari perusahaan besar, UMKM, organisasi,
                    hingga individu yang peduli lingkungan. Platform kami
                    dirancang untuk dapat diakses oleh semua kalangan dengan
                    berbagai kebutuhan.
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
                    Bagaimana cara membeli atau menjual kredit karbon?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Buat akun, verifikasi identitas, pilih sertifikat yang
                    tersedia, lalu transaksi diproses otomatis melalui sistem
                    blockchain. Prosesnya mudah dan aman dengan panduan langkah
                    demi langkah.
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
                    Apakah sertifikat karbon terjamin keasliannya?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Ya, semua sertifikat diverifikasi oleh standar internasional
                    (Verra, Gold Standard) dan diamankan dengan blockchain.
                    Setiap sertifikat memiliki jejak digital yang tidak dapat
                    dipalsukan.
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
                    Bagaimana peran regulator?
                  </h3>
                  <p className="text-slate-700 text-lg leading-relaxed max-w-4xl">
                    Regulator dapat memantau transaksi secara real-time,
                    melakukan audit, dan memastikan kepatuhan terhadap regulasi
                    lingkungan. Platform kami menyediakan dashboard khusus untuk
                    regulator dengan akses penuh ke data transaksi dan laporan
                    compliance yang transparan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Help Section */}
          <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5v6m0 7v6M2.5 12h6m7 0h6"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 mb-4">
                Masih Ada Pertanyaan?
              </h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                Tim support kami siap membantu Anda 24/7. Dapatkan jawaban
                langsung dari ahli kredit karbon dan blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Live Chat Support
                </button>
                <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Support
                </button>
                <button className="border-2 border-cyan-500 text-cyan-600 px-8 py-4 rounded-2xl font-semibold hover:bg-cyan-50 transition-colors flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Knowledge Base
                </button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-800">Telepon</div>
                  <div className="text-slate-600 text-sm">+62 21 2345 6789</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-cyan-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-800">Email</div>
                  <div className="text-slate-600 text-sm">
                    support@chaincarbon.id
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-800">
                    Jam Operasional
                  </div>
                  <div className="text-slate-600 text-sm">24/7 Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-gradient-to-r from-emerald-700 to-cyan-700 text-white py-12"
        id="kontak"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Kontak Kami</h2>
            <p className="text-lg">Silakan hubungi kami jika ada pertanyaan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p>support@chaincarbon.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Telepon</h3>
              <p>+62 21 2345 6789</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Alamat</h3>
              <p>Jl. Karbon No. 10, Semarang, Indonesia</p>
            </div>
          </div>

          <div className="text-center text-sm text-white/80 mt-12 border-t border-white/30 pt-6">
            © {new Date().getFullYear()} ChainCarbon. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
