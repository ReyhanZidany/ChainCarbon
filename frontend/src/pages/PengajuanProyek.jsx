import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiFileText,
  FiDollarSign,
  FiUpload,
  FiBriefcase,
  FiMapPin,
  FiInfo,
  FiImage,
  FiX,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiSave,
  FiLayers
} from "react-icons/fi";
import API from "../api/axios";

// ============================================
// CONFIGURATION
// ============================================
const CATEGORIES = [
  "Forestry and Land Use",
  "Renewable Energy",
  "Waste Management",
  "Sustainable Agriculture",
  "Low-Carbon Transport",
  "Industrial Carbon Technology",
  "Blue Carbon"
];

const PengajuanProyek = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    deskripsi: "",
    lokasi: "",
    volume: "",
    harga: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    dokumen: null,
    gambarProyek: [],
  });

  // Steps Configuration
  const steps = [
    { id: 1, title: "Project Info", icon: FiBriefcase, desc: "Basic details & scope" },
    { id: 2, title: "Valuation", icon: FiDollarSign, desc: "Volume & Pricing" },
    { id: 3, title: "Evidence", icon: FiUpload, desc: "Documents & Photos" },
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "dokumen" && files?.[0]) {
      setForm(prev => ({ ...prev, dokumen: files[0] }));
    } else if (name === "gambarProyek" && files) {
      if (form.gambarProyek.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      const newImages = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file), // Preview URL
        name: file.name
      }));
      setForm(prev => ({ ...prev, gambarProyek: [...prev.gambarProyek, ...newImages] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    const img = form.gambarProyek[index];
    if (img.url) URL.revokeObjectURL(img.url); // Cleanup memory
    setForm(prev => ({
      ...prev,
      gambarProyek: prev.gambarProyek.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!form.dokumen) {
      toast.error("Please upload the Project Design Document (PDF)");
      return;
    }
    if (form.gambarProyek.length === 0) {
      toast.error("Please upload at least one project image");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    // Append text fields
    Object.keys(form).forEach(key => {
      if (key !== 'dokumen' && key !== 'gambarProyek') {
        formData.append(key, form[key]);
      }
    });

    // Append files
    if (form.dokumen) formData.append("dokumen", form.dokumen);
    form.gambarProyek.forEach(img => formData.append("gambarProyek", img.file));

    const loadingToast = toast.loading("🚀 Submitting project to blockchain...");

    try {
      const res = await API.post("/projects/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000 // 60s timeout for large uploads
      });

      if (res.data.success) {
        toast.dismiss(loadingToast);

        // Success Animation/Toast
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FiCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Submission Successful!</p>
                  <p className="mt-1 text-sm text-gray-500">Your project has been recorded on the blockchain and sent for validation.</p>
                </div>
              </div>
            </div>
          </div>
        ));

        navigate("/dashboard/project");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit project");
      setIsSubmitting(false);
    }
  };

  // Render Helpers
  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-12 relative px-6">
      {/* Background Line */}
      <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 z-0 rounded-full"></div>

      {/* Active Line */}
      <div
        className="absolute top-6 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 z-0 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const Icon = step.icon;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-300 transform
                ${(isActive || isCompleted)
                  ? 'bg-white border-emerald-500 shadow-lg scale-110'
                  : 'bg-white border-gray-300 text-gray-400'}
              `}
            >
              {isCompleted ? <FiCheck className="text-emerald-600" size={20} /> : <Icon className={isActive ? "text-emerald-600" : ""} size={20} />}
            </div>
            <div className="text-center mt-3 absolute -bottom-10 w-32 left-1/2 -translate-x-1/2">
              <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-emerald-800' : 'text-gray-500'}`}>{step.title}</h4>
              <p className="text-[10px] text-gray-400 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30 pb-20 pt-8">
      {/* Header Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-cyan-700">
              New Carbon Project
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <FiLayers className="text-emerald-500" /> Register your asset on the blockchain
            </p>
          </div>
          <Link
            to="/dashboard/project"
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>

        {renderStepIndicator()}
      </div>

      {/* Main Form Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="relative">

          {/* STEP 1: OVERVIEW */}
          {currentStep === 1 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 animate-fade-in ring-1 ring-slate-900/5">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FiBriefcase className="text-emerald-600" /> Project Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50 transition-all font-medium text-lg"
                    placeholder="e.g. Sumatra Peatland Restoration"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      name="kategori"
                      value={form.kategori}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50 transition-all appearance-none"
                      required
                    >
                      <option value="">Select Category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <FiLayers />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="lokasi"
                      value={form.lokasi}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50 transition-all"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50 transition-all min-h-[120px] resize-y"
                    placeholder="Describe the methodology, carbon offsetting goals, and community impact..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                  <input type="date" name="tanggalMulai" value={form.tanggalMulai} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                  <input type="date" name="tanggalSelesai" value={form.tanggalSelesai} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50" required />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIALS */}
          {currentStep === 2 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 animate-fade-in ring-1 ring-slate-900/5">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FiDollarSign className="text-emerald-600" /> Financial Valuation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Volume Card */}
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <FiInfo className="text-emerald-600" /> Carbon Volume
                  </h3>
                  <label className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1 block">Total tCO2e to Offset</label>
                  <input
                    type="number"
                    name="volume"
                    value={form.volume}
                    onChange={handleChange}
                    className="w-full text-4xl font-black text-emerald-700 bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 focus:outline-none placeholder-emerald-200/50 transition-colors py-2"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>

                {/* Price Card */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-blue-600" /> Unit Price
                  </h3>
                  <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1 block">Price per tCO2e (IDR)</label>
                  <input
                    type="number"
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    className="w-full text-4xl font-black text-blue-700 bg-transparent border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none placeholder-blue-200/50 transition-colors py-2"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>

                {/* Revenue Preview */}
                <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Potential Total Revenue</span>
                    <h2 className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
                      IDR {(parseInt(form.volume || 0) * parseInt(form.harga || 0)).toLocaleString('id-ID')}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Calculated based on full volume sale.</p>
                  </div>
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <FiDollarSign size={28} className="text-emerald-300" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {currentStep === 3 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 animate-fade-in ring-1 ring-slate-900/5">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FiUpload className="text-emerald-600" /> Evidence & Documentation
              </h2>

              <div className="space-y-8">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Project Design Document (PDF)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      accept="application/pdf"
                      name="dokumen"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="doc-upload"
                      className={`
                        cursor-pointer block border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300
                        ${form.dokumen
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'}
                      `}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${form.dokumen ? 'bg-emerald-100' : 'bg-slate-100 group-hover:scale-110'}`}>
                        {form.dokumen ? <FiCheck size={40} className="text-emerald-600" /> : <FiFileText size={32} className="text-slate-500 group-hover:text-emerald-600" />}
                      </div>

                      {form.dokumen ? (
                        <div>
                          <p className="text-xl font-bold text-emerald-800">{form.dokumen.name}</p>
                          <p className="text-sm text-emerald-600 mt-1">{(form.dokumen.size / 1024 / 1024).toFixed(2)} MB • Ready for upload</p>
                          <p className="text-xs text-emerald-500 mt-4 font-semibold uppercase tracking-wider">Click to replace</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-bold text-slate-700">Drop your PDD file here</p>
                          <p className="text-slate-500 mt-1">or click to browse from computer</p>
                          <p className="text-xs text-slate-400 mt-4">PDF only, max 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="h-px bg-slate-200"></div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Project Images</label>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Upload Button */}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-emerald-500 transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-emerald-100 transition-colors">
                        <FiImage size={24} className="text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-600">Add Photo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        name="gambarProyek"
                        multiple
                        onChange={handleChange}
                      />
                    </label>

                    {/* Previews */}
                    {form.gambarProyek.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md hover:shadow-lg transition-all ring-1 ring-slate-900/5">
                        <img src={img.url} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white hover:scale-110 transition-all"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Upload up to 5 high-quality images of the project site.</p>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="mt-8 flex justify-between items-center pb-12">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(curr => curr - 1)}
                className="flex items-center gap-2 text-slate-600 font-bold hover:text-emerald-600 hover:bg-white/50 px-6 py-3 rounded-xl transition-all"
                disabled={isSubmitting}
              >
                <FiArrowLeft /> Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(curr => curr + 1)}
                className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Next Step
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/30
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/40'}
                  transition-all
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Project <FiSave size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PengajuanProyek;