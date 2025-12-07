// 📁 frontend/src/pages/Register.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Building2, Globe, MapPin, Mail, Lock, Save } from "lucide-react";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios";
import { locations } from "../data/locations";

const STORAGE_KEY = "chaincarbon_register_draft"; 

const Register = () => {
  const navigate = useNavigate();
  
  // ✅ Load draft from localStorage on mount
  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        console.log("📋 Loaded registration draft:", parsed);
        return {
          name: parsed.name || "",
          email: parsed.email || "",
          password: parsed.password || "", 
          confirmPassword: parsed.confirmPassword || "", 
          company: parsed.company || "",
          website: parsed.website || "",
          type: parsed.type || "",
          province: parsed.province || "",
          city: parsed.city || "",
        };
      } catch (e) {
        console.error("Error loading draft:", e);
        return {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          company: "",
          website: "",
          type: "",
          province: "",
          city: "",
        };
      }
    }
    
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
      website: "",
      type: "",
      province: "",
      city: "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false); // ✅ Show "Draft Saved" indicator

  // ✅ Auto-save draft to localStorage whenever form changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        company: form.company,
        website: form.website,
        type: form.type,
        province: form.province,
        city: form.city,
        savedAt: new Date().toISOString(),
      };
      
      // Only save if there's actual data
      if (form.name || form.email || form.company || form.type) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
        setDraftSaved(true);
        console.log("💾 Draft auto-saved");
        
        // Hide "saved" indicator after 2 seconds
        setTimeout(() => setDraftSaved(false), 2000);
      }
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [form.name, form.email, form.company, form.password, form.confirmPassword, form.website, form.type, form.province, form.city]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      setForm((prev) => ({ ...prev, province: value, city: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validation
    if (form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        company: form.company,
        email: form.email,
        password: form.password,
        website: form.website,
        type: form.type,
        province: form.province,
        city: form.city,
      });

      setMessage({ 
        text: res.data.message || "Registration successful! Redirecting to login...", 
        type: "success" 
      });

      // ✅ Clear draft after successful registration
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ Draft cleared after successful registration");

      if (res.status === 201) {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      let errorMessage = "An error occurred during registration";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = "Email already registered";
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage = "Unable to connect to server";
      }

      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const companyTypes = [
    { value: "Energy & Heavy Industry", label: "Energy & Heavy Industry", icon: "🏭" },
    { value: "Transportation & Logistics", label: "Transportation & Logistics", icon: "🚚" },
    { value: "Agriculture & Forestry", label: "Agriculture & Forestry", icon: "🌾" },
    { value: "Renewable Energy & Waste", label: "Renewable Energy & Waste", icon: "⚡" },
    { value: "Corporate & Multinational", label: "Corporate & Multinational", icon: "🌐" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-white px-4 py-8">
      <div className="flex max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Brand & Info (no changes) */}
        <div className="hidden lg:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 text-white relative overflow-hidden">
          {/* ... same as before ... */}
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
              Join{" "}
              <span className="block mt-2 text-emerald-100">ChainCarbon</span>
            </h2>

            <p className="text-center text-base leading-relaxed opacity-90 mb-8">
              Register your company to join the carbon credit ecosystem and make
              a positive impact on the environment.
            </p>
          </div>

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

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 p-8 md:p-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="ChainCarbon Logo" className="h-12 w-auto" />
          </div>

          <div className="max-w-2xl mx-auto">
            {/* ✅ Header with Draft Indicator */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                  Create Account
                </h2>
                <p className="text-base text-slate-600 mt-2 mb-4">
                  Fill in your company details to get started
                </p>
              </div>
              
              {/* ✅ Draft Saved Indicator */}
              {draftSaved && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-200 animate-fadeIn">
                  <Save className="w-4 h-4" />
                  <span className="text-xs font-semibold">Draft Saved</span>
                </div>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* ... ALL YOUR EXISTING FORM FIELDS (no changes) ... */}
              
              {/* Email & Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
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

              {/* Company Name & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      placeholder="Your Company Ltd."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Company Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Type *
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleSelect}
                    required
                    className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl shadow-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-emerald-400"
                  >
                    <option value="">Select company type</option>
                    {companyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Location - Province & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Province */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Province *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
                    <select
                      name="province"
                      value={form.province}
                      onChange={handleSelect}
                      required
                      className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl shadow-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-emerald-400"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(locations).map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleSelect}
                      required
                      disabled={!form.province}
                      className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl shadow-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-emerald-400 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      <option value="">
                        {form.province ? "Select City" : "Select province first"}
                      </option>
                      {form.province &&
                        locations[form.province].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 bg-slate-20 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Message Alert (same as before) */}
            {message.text && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
                <div
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
                    message.type === "success"
                      ? "bg-white text-emerald-800 border-emerald-200"
                      : "bg-white text-red-800 border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  )}
                  <span className="font-medium">{message.text}</span>
                  <button
                    onClick={() => setMessage({ text: "", type: "" })}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
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

              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }

              .animate-slideDown {
                animation: slideDown 0.3s ease-out forwards;
              }

              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out forwards;
              }
            `}</style>

            {/* Divider */}
            <div className="flex items-center justify-center mt-8 mb-6">
              <div className="border-t border-slate-300 flex-1" />
              <span className="mx-4 text-slate-500 text-sm font-medium">OR</span>
              <div className="border-t border-slate-300 flex-1" />
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                >
                  Sign In
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

export default Register;