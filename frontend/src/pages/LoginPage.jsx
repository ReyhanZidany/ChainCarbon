// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  // ✅ Get the page user was trying to access before login
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // ✅ NEW: Track redirect state

  // ✅ Only redirect if ALREADY logged in when component mounts
  useEffect(() => {
    if (authLoading) {
      console.log('⏳ [LoginPage] Auth loading...');
      return;
    }

    // ✅ If already logged in when page loads, redirect to appropriate page
    if (isAuthenticated() && user && !loading && !isRedirecting) {
      console.log('✅ [LoginPage] Already logged in, redirecting...');
      console.log('   From:', from);
      console.log('   User type:', user.type);
      
      // ✅ Respect the 'from' parameter for regulators too
      if (from && from !== '/login') {
        console.log('   → Redirecting to requested page:', from);
        navigate(from, { replace: true });
      } else if (user.type === 'regulator') {
        console.log('   → Redirecting to regulator dashboard');
        navigate('/regulator', { replace: true });
      } else {
        console.log('   → Redirecting to user dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, from, navigate, loading, isRedirecting]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setMessage({ text: "", type: "" });
  
    if (!form.email || !form.password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      setLoading(false);
      return;
    }
  
    try {
      console.log("🔐 Attempting login...");
      console.log("   Email:", form.email);
      console.log("   Redirect after login to:", from || "default dashboard");
      
      const res = await API.post("/auth/login", form);
  
      console.log("✅ Login successful!");
      console.log("   User:", res.data.user.email);
      console.log("   Type:", res.data.user.type);
  
      // ✅ Use AuthContext login to save user data
      login(res.data.user, res.data.token);
  
      // ✅ Show success message
      setMessage({ 
        text: "Logged in successfully! Redirecting to dashboard...", 
        type: "success" 
      });
      
      // ✅ Set redirecting state
      setIsRedirecting(true);
  
      // ✅ Wait 2 seconds to show success message
      setTimeout(() => {
        setLoading(false); // Stop loading spinner
        
        // ✅ Priority 1: If user was trying to access a specific page, go there
        if (from && from !== '/login') {
          console.log("   → Redirecting to requested page:", from);
          navigate(from, { replace: true });
        } 
        // ✅ Priority 2: Redirect based on user type
        else if (res.data.user.type === "regulator") {
          console.log("   → Redirecting to regulator dashboard");
          navigate("/regulator", { replace: true });
        } 
        else {
          console.log("   → Redirecting to user dashboard");
          navigate("/dashboard", { replace: true });
        }
      }, 2000); // ✅ 2 seconds delay
      
    } catch (err) {
      console.error("❌ Login error:", err);
  
      let errorMessage = "An error occurred. Please try again.";
  
      if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.status === 403) {
        errorMessage = "⚠️ " + (err.response.data.message || "Account not validated yet");
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later";
      } else if (err.code === "NETWORK_ERROR" || err.message.includes("Network Error")) {
        errorMessage = "Unable to connect to server";
      } else if (err.response?.data?.message) {
        errorMessage = "" + err.response.data.message;
      }
  
      setMessage({ text: errorMessage, type: "error" });
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  // ✅ Show loading while checking auth on mount
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Show "Already logged in" if authenticated (NOT during login redirect)
  if (isAuthenticated() && user && !loading && !isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Already logged in. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-white px-4 py-8">
      <div className="flex max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md">
            <div className="mb-8 transform hover:scale-110 transition-transform duration-300">
              <img
                src={logo}
                alt="ChainCarbon Logo"
                className="h-20 w-auto drop-shadow-2xl"
              />
            </div>

            <h2 className="text-4xl font-extrabold mb-4 text-center leading-tight">
              Welcome to{" "}
              <span className="block mt-2 text-emerald-100">ChainCarbon</span>
            </h2>

            <p className="text-center text-base leading-relaxed opacity-90 mb-8">
              Access the carbon credit marketplace, manage green projects, and
              explore innovative blockchain-powered solutions for a sustainable
              future.
            </p>
          </div>

          {/* Wave Decoration */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82-16.5,168.22-17.73,250,0,55.15,11.82,105.75,31.66,160,41.86,86,15.65,175.87,14.14,261.6-6.07V120H0V94.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="rgba(255, 255, 255, 0.1)"
              />
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82-16.5,168.22-17.73,250,0,55.15,11.82,105.75,31.66,160,41.86,86,15.65,175.87,14.14,261.6-6.07V120H0V94.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="rgba(255, 255, 255, 0.2)"
              />
            </svg>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src={logo}
              alt="ChainCarbon Logo"
              className="h-12 w-auto"
            />
          </div>

          <div className="max-w-md mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Sign In
            </h2>
            <p className="text-base text-slate-600 mb-8">
              Enter your credentials to access your account
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@chaincarbon.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading || isRedirecting}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading || isRedirecting}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isRedirecting}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || isRedirecting}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading || isRedirecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{isRedirecting ? "Redirecting..." : "Signing in..."}</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Message Alert - Toast Style Top Center */}
            {message.text && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
                <div
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border min-w-[320px] ${
                    message.type === "success"
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-300"
                      : "bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-300"
                  }`}
                >
                  {message.type === "success" ? (
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                  <span className="font-semibold flex-1">{message.text}</span>
                  {!isRedirecting && (
                    <button
                      onClick={() => setMessage({ text: "", type: "" })}
                      className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Add animation */}
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translate(-50%, -20px);
                }
                to {
                  opacity: 1;
                  transform: translate(-50%, 0);
                }
              }

              .animate-slideDown {
                animation: slideDown 0.3s ease-out forwards;
              }
            `}</style>

            {/* Divider */}
            <div className="flex items-center justify-center mt-8 mb-6">
              <div className="border-t border-slate-300 flex-1" />
              <span className="mx-4 text-slate-500 text-sm font-medium">OR</span>
              <div className="border-t border-slate-300 flex-1" />
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 mt-6 text-sm font-medium group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;