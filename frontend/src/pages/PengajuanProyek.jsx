import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiUpload,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiFileText,
  FiSave,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiImage,
  FiX,
  FiEye,
  FiHome,
} from "react-icons/fi";
import API from "../api/axios";

const PengajuanProyek = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    deskripsi: "",
    lokasi: "",
    volume: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    harga: "",
    dokumen: null,
    gambarProyek: [],
  });

  const steps = [
    { id: 1, name: "Basic Information", icon: FiFileText },
    { id: 2, name: "Financial Details", icon: FiDollarSign },
    { id: 3, name: "Documents & Media", icon: FiUpload },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "dokumen" && files) {
      setForm({
        ...form,
        dokumen: files[0],
      });
    } else if (name === "gambarProyek" && files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setForm({
        ...form,
        gambarProyek: [...form.gambarProyek, ...newImages],
      });
    } else {
      setForm({
        ...form,
        [name]: files ? files[0] : value,
      });
    }
  };

  const removeImage = (index) => {
    const toRemove = form.gambarProyek[index];
    if (toRemove?.url) URL.revokeObjectURL(toRemove.url);
    const updatedImages = form.gambarProyek.filter((_, i) => i !== index);
    setForm({
      ...form,
      gambarProyek: updatedImages,
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // ✅ Prepare FormData
    const formData = new FormData();
    formData. append("nama", form.nama);
    formData.append("kategori", form.kategori);
    formData.append("deskripsi", form.deskripsi);
    formData.append("lokasi", form.lokasi);
    formData.append("volume", form.volume);
    formData.append("harga", form.harga);
    formData.append("tanggalMulai", form.tanggalMulai);
    formData.append("tanggalSelesai", form.tanggalSelesai);
  
    if (form.dokumen) {
      formData.append("dokumen", form.dokumen);
    }
    form.gambarProyek. forEach((img) => {
      formData.append("gambarProyek", img.file);
    });
  
    // ✅ Show loading toast
    const loadingToastId = toast.loading(
      <div>
        <p className="font-semibold">📤 Uploading project...</p>
        <p className="text-xs mt-1">This may take a moment due to file uploads</p>
      </div>
    );
  
    try {
      console.log("📤 Submitting project...");
      const startTime = Date.now();
  
      // ✅ Send request with longer timeout
      const res = await API.post(
        "/projects/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage. getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // ✅ 60 seconds (for large files + slow connection)
          onUploadProgress: (progressEvent) => {
            // ✅ Show upload progress
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
            
            // Update toast with progress
            toast.loading(
              <div>
                <p className="font-semibold">📤 Uploading...  {percentCompleted}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentCompleted}%` }}
                  />
                </div>
              </div>,
              { id: loadingToastId }
            );
          },
        }
      );
  
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ Response received after ${elapsedTime}s`);
  
      // ✅ Dismiss loading toast
      toast.dismiss(loadingToastId);
  
      const data = res.data;
  
      // ✅ Check success
      if ((res.status === 201 || res.status === 200) && data.success) {
        console.log("✅ Project submitted successfully");
  
        // ✅ Show success toast
        toast.success(
          <div>
            <p className="font-semibold">✅ Project submitted successfully!</p>
            <p className="text-sm mt-1">
              Your project has been saved and is now pending regulator validation. 
            </p>
            <p className="text-xs mt-1 text-emerald-700">
              Redirecting to My Projects...
            </p>
          </div>,
          { duration: 3000 }
        );
  
        // ✅ Clean up blob URLs
        form.gambarProyek.forEach((img) => {
          if (img.url) URL.revokeObjectURL(img.url);
        });
  
        // ✅ Navigate after delay
        setTimeout(() => {
          navigate("/dashboard/project");
        }, 1500);
  
      } else {
        throw new Error(data.message || "Submission failed");
      }
  
    } catch (error) {
      // ✅ Dismiss loading toast
      toast.dismiss(loadingToastId);
  
      console.error("❌ Submit error:", error);
  
      // ✅ Detailed error handling
      let errorTitle = "Submission Failed";
      let errorMessage = "";
      let canRetry = false;
  
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        // ⏱️ Timeout error
        errorTitle = "⏱️ Request Timeout";
        errorMessage = "Upload took too long. This might be due to slow internet or large files.";
        canRetry = true;
  
      } else if (! error.response) {
        // 📡 Network error
        errorTitle = "📡 Connection Error";
        errorMessage = "Cannot reach server. Please check your internet connection. ";
        canRetry = true;
  
      } else if (error.response.status === 413) {
        // 📦 File too large
        errorTitle = "📦 File Too Large";
        errorMessage = "One or more files are too large. Please reduce file sizes and try again.";
  
      } else if (error.response.status === 401) {
        // 🔐 Unauthorized
        errorTitle = "🔐 Session Expired";
        errorMessage = "Please login again. ";
        setTimeout(() => navigate("/login"), 2000);
  
      } else if (error.response.status >= 500) {
        // 🔥 Server error
        errorTitle = "🔥 Server Error";
        errorMessage = "Server is experiencing issues. Please try again later.";
        canRetry = true;
  
      } else {
        // ❌ Other error
        errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
      }
  
      // ✅ Show error toast
      toast.error(
        <div>
          <p className="font-semibold">{errorTitle}</p>
          <p className="text-sm mt-1">{errorMessage}</p>
          {canRetry && (
            <p className="text-xs mt-2 text-gray-600">
              💡 Tip: Try again or check your connection
            </p>
          )}
        </div>,
        { duration: 6000 }
      );
  
      // ✅ Show retry dialog for network errors
      if (canRetry) {
        const shouldRetry = window.confirm(
          `${errorTitle}\n\n${errorMessage}\n\nWould you like to try again?`
        );
  
        if (shouldRetry) {
          console.log("🔄 User chose to retry");
          setIsSubmitting(false);
          // User can click submit again
          return;
        }
      }
  
      setIsSubmitting(false);
  
    } finally {
      // Safety: ensure loading state is reset
      setTimeout(() => {
        setIsSubmitting(false);
      }, 100);
    }
  };

  const handleSaveDraft = () => {
    alert("📄 Draft saved in PDF format!");
  };

  const getStepIcon = (step, isActive, isCompleted) => {
    const IconComponent = step.icon;
    if (isCompleted) return <FiCheckCircle className="w-5 h-5" />;
    if (isActive) return <IconComponent className="w-5 h-5" />;
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* ✅ PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Project Submission
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  <FiHome className="inline" /> Home
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Project Submission</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <FiClock className="w-4 h-4" />
                <span className="hidden sm:inline">Step {currentStep} of {steps.length}</span>
                <span className="sm:hidden">{currentStep}/{steps.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-6">
                Submission Progress
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div key={step.id} className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        {getStepIcon(step, isActive, isCompleted)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-emerald-600"
                              : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </p>
                        {index < steps.length - 1 && (
                          <div
                            className={`w-px h-6 ml-4 mt-2 ${
                              isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Estimated Time */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiClock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Est. Time: 15-20 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FiFileText className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Basic Project Information
                      </h2>
                      <p className="text-gray-600">
                        Provide general details about your carbon project
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        placeholder="Example: Sustainable Reforestation Kalimantan Forest"
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Project Category
                        </label>
                        <select
                          name="kategori"
                          value={form.kategori}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                        >
                          <option value="">Select project category</option>
                          <option value="Forestry and Land Use">
                            🌳 Forestry & Land Use
                          </option>
                          <option value="Renewable Energy">
                            🔋 Renewable Energy
                          </option>
                          <option value="Waste Management">
                            ♻️ Waste Management
                          </option>
                          <option value="Sustainable Agriculture">
                            🌱 Sustainable Agriculture
                          </option>
                          <option value="Low-Carbon Transport">
                            🚌 Low-Carbon Transport
                          </option>
                          <option value="Industrial Carbon Technology">
                            🏭 Industrial Carbon Technology
                          </option>
                          <option value="Blue Carbon">
                            🌊 Blue Carbon
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Project Location
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="lokasi"
                            value={form.lokasi}
                            onChange={handleChange}
                            placeholder="City, Province, Indonesia"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Project Description
                      </label>
                      <textarea
                        name="deskripsi"
                        value={form.deskripsi}
                        onChange={handleChange}
                        placeholder="Explain project details, methodology to be used, implementation timeline, and expected environmental impact..."
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none text-base"
                        rows={8}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum 200 characters for comprehensive description
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Financial Details */}
              {currentStep === 2 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <FiDollarSign className="text-cyan-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Emission & Financial Details
                      </h2>
                      <p className="text-gray-600">
                        Determine carbon volume and project pricing structure
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Estimated Carbon Credit Volume
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="volume"
                            value={form.volume}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all pr-20 text-base"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            tCO₂e
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Based on methodology to be used
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Price per tCO₂e
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            Rp
                          </span>
                          <input
                            type="number"
                            name="harga"
                            value={form.harga}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Competitive price based on market research
                        </p>
                      </div>
                    </div>

                    {/* Revenue Projection */}
                    {form.volume && form.harga && (
                      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-8 border border-emerald-100">
                        <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                          Revenue Projection
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                              Rp{" "}
                              {(
                                parseInt(form.volume || 0) *
                                parseInt(form.harga || 0)
                              ).toLocaleString("id-ID")}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Estimate
                            </div>
                          </div>
                          <div className="text-center bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-cyan-600 mb-2">
                              {form.volume || 0}
                            </div>
                            <div className="text-sm text-gray-600">tCO₂e</div>
                          </div>
                          <div className="text-center bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              Rp{" "}
                              {parseInt(form.harga || 0).toLocaleString(
                                "id-ID"
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              per tCO₂e
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Project Start Date
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="tanggalMulai"
                            value={form.tanggalMulai}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Target Completion Date
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="tanggalSelesai"
                            value={form.tanggalSelesai}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Media */}
              {currentStep === 3 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiUpload className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Upload Documents & Media
                      </h2>
                      <p className="text-gray-600">
                        Upload supporting documents and project photos
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Document Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Supporting Documents (PDF)
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors bg-gray-50">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FiFileText className="text-blue-600 text-2xl" />
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="application/pdf"
                              name="dokumen"
                              onChange={handleChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium inline-flex items-center gap-2"
                            >
                              <FiUpload />
                              Choose PDF File
                            </label>
                          </div>
                          <div className="text-sm text-gray-500 max-w-md">
                            <p className="font-medium mb-2">
                              Required documents:
                            </p>
                            <ul className="text-left list-disc list-inside space-y-1">
                              <li>Project Design Document (PDD)</li>
                              <li>Environmental Impact Assessment</li>
                              <li>Methodology used</li>
                              <li>Baseline documentation</li>
                            </ul>
                            <p className="mt-3 text-xs">
                              Format: PDF, maximum 10 MB
                            </p>
                          </div>
                          {form.dokumen && (
                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                              <FiFileText />
                              <span className="text-sm font-medium">
                                {form.dokumen.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Project Photos
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors bg-gray-50">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <FiImage className="text-emerald-600 text-2xl" />
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              name="gambarProyek"
                              onChange={handleChange}
                              multiple
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium inline-flex items-center gap-2"
                            >
                              <FiImage />
                              Upload Project Photos
                            </label>
                          </div>
                          <div className="text-sm text-gray-500 max-w-md">
                            <p className="font-medium mb-2">
                              Recommended photos:
                            </p>
                            <ul className="text-left list-disc list-inside space-y-1">
                              <li>Current site conditions</li>
                              <li>Area to be worked on</li>
                              <li>Surrounding environment documentation</li>
                              <li>Supporting infrastructure</li>
                            </ul>
                            <p className="mt-3 text-xs">
                              Format: JPG, PNG, WebP | Max 5MB per file | Max 10 photos
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Image Preview Grid */}
                      {form.gambarProyek.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-700 mb-4">
                            Uploaded Photos ({form.gambarProyek.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {form.gambarProyek.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                  <img
                                    src={image.url}
                                    alt={`Project ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                    <button
                                      onClick={() =>
                                        window.open(image.url, "_blank")
                                      }
                                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                      title="View image"
                                    >
                                      <FiEye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                      title="Remove image"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 truncate">
                                  {image.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                        Submission Summary
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Project Name
                          </div>
                          <div className="font-medium">{form.nama || "-"}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Category
                          </div>
                          <div className="font-medium">
                            {form.kategori || "-"}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Location
                          </div>
                          <div className="font-medium">
                            {form.lokasi || "-"}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Volume Estimate
                          </div>
                          <div className="font-medium">
                            {form.volume || "-"} tCO₂e
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Price per tCO₂e
                          </div>
                          <div className="font-medium">
                            Rp{" "}
                            {parseInt(form.harga || 0).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Total Estimate
                          </div>
                          <div className="font-medium text-emerald-600">
                            Rp{" "}
                            {(
                              parseInt(form.volume || 0) *
                              parseInt(form.harga || 0)
                            ).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl md:col-span-2">
                          <div className="text-sm text-gray-600 mb-1">
                            Period
                          </div>
                          <div className="font-medium">
                            {form.tanggalMulai || "-"} to{" "}
                            {form.tanggalSelesai || "-"}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">
                            Media
                          </div>
                          <div className="font-medium">
                            {form.dokumen ? "✓ Document" : "✗ Document"} |{" "}
                            {form.gambarProyek.length} Photos
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-3">
                      <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">
                          Before Submitting
                        </h3>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>
                            • Ensure all information has been filled correctly
                          </li>
                          <li>
                            • Supporting documents are complete and meet standards
                          </li>
                          <li>
                            • Project photos show actual site conditions
                          </li>
                          <li>• Review process takes 7-14 business days</li>
                          <li>• You will receive notifications via email</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="border-t border-gray-100 px-6 md:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrev}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave className="w-4 h-4" />
                      <span className="hidden sm:inline">Save Draft</span>
                      <span className="sm:hidden">Draft</span>
                    </button>

                    {currentStep < 3 ? (
                      <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="hidden sm:inline">Continue</span>
                        <span className="sm:hidden">Next</span>
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Submitting...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <FiSend className="w-4 h-4" />
                            <span className="hidden sm:inline">Submit Project</span>
                            <span className="sm:hidden">Submit</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengajuanProyek;