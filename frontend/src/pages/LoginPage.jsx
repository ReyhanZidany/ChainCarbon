import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/chaincarbon_logo_transparent.png";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-6">
      <div className="flex max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Sisi Kiri: Brand & Info */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 p-10 text-white relative">
          {/* Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={logo}
              alt="ChainCarbon Logo"
              className="h-16 w-auto mb-6 drop-shadow-xl"
            />
            <h2 className="text-3xl font-bold mb-4 text-center">
              Selamat Datang di{" "}
              <span className="text-yellow-200">ChainCarbon</span>
            </h2>
            <p className="text-center text-sm leading-relaxed max-w-sm opacity-90">
              Bergabunglah untuk mengakses marketplace kredit karbon, dashboard
              proyek hijau, dan berbagai fitur inovatif berbasis blockchain.
            </p>
          </div>

          {/* Dekorasi Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82-16.5,168.22-17.73,250,0,55.15,11.82,105.75,31.66,160,41.86,86,15.65,175.87,14.14,261.6-6.07V120H0V94.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="rgba(255, 255, 255, 0.15)"
              ></path>
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82-16.5,168.22-17.73,250,0,55.15,11.82,105.75,31.66,160,41.86,86,15.65,175.87,14.14,261.6-6.07V120H0V94.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="rgba(255, 255, 255, 0.3)"
              ></path>
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82-16.5,168.22-17.73,250,0,55.15,11.82,105.75,31.66,160,41.86,86,15.65,175.87,14.14,261.6-6.07V120H0V94.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="rgba(255, 255, 255, 0.5)"
              ></path>
            </svg>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="w-full md:w-1/2 p-10 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-3">
            Masuk ke Akun Anda
          </h2>
          <p className="text-sm text-center text-slate-500 mb-8">
            Gunakan email dan password yang sudah terdaftar
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
          </form>

          {/* Pemisah */}
          <div className="flex items-center justify-center mt-8">
            <div className="border-t border-slate-300 w-1/3" />
            <span className="mx-3 text-slate-400 text-sm">atau</span>
            <div className="border-t border-slate-300 w-1/3" />
          </div>

          <p className="text-sm text-center mt-6 text-slate-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-emerald-600 cursor-pointer hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
