import React, { useState } from "react";
import {
  FiUpload,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiFileText,
  FiSave,
  FiSend,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";

const PengajuanProyek = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  });

  const steps = [
    { id: 1, name: "Informasi Dasar", icon: FiFileText },
    { id: 2, name: "Detail Finansial", icon: FiDollarSign },
    { id: 3, name: "Dokumen & Review", icon: FiUpload },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
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

  const handleSubmit = () => {
    alert("Proyek berhasil diajukan!");
  };

  const handleSaveDraft = () => {
    alert("Draft disimpan dalam format PDF!");
  };

  const getStepIcon = (step, isActive, isCompleted) => {
    const IconComponent = step.icon;
    if (isCompleted) return <FiCheckCircle className="w-5 h-5" />;
    if (isActive) return <IconComponent className="w-5 h-5" />;
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pengajuan Proyek Karbon
              </h1>
              <p className="text-gray-600 mt-1">
                Langkah {currentStep} dari {steps.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiClock className="w-4 h-4" />
                <span>Estimasi: 10-15 menit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-6">
                Progress Pengajuan
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

              {/* Help Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">
                      Butuh Bantuan?
                    </h4>
                    <p className="text-blue-700 text-xs mt-1">
                      Tim support kami siap membantu Anda melalui proses
                      pengajuan.
                    </p>
                    <button className="text-blue-600 text-xs font-medium mt-2 hover:underline">
                      Hubungi Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Step 1: Informasi Dasar */}
              {currentStep === 1 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FiFileText className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Informasi Dasar Proyek
                      </h2>
                      <p className="text-gray-600">
                        Berikan detail umum tentang proyek karbon Anda
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nama Proyek
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        placeholder="Contoh: Reforestasi Berkelanjutan Hutan Kalimantan"
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Kategori Proyek
                        </label>
                        <select
                          name="kategori"
                          value={form.kategori}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        >
                          <option value="">Pilih kategori proyek</option>
                          <option value="Agrikultur">🌱 Agrikultur</option>
                          <option value="Efisiensi Energi">
                            ⚡ Efisiensi Energi
                          </option>
                          <option value="Energi Terbarukan">
                            🔋 Energi Terbarukan
                          </option>
                          <option value="Industrial Process Improvement">
                            🏭 Industrial Process Improvement
                          </option>
                          <option value="Reforestasi">🌳 Reforestasi</option>
                          <option value="Waste Management">
                            ♻️ Waste Management
                          </option>
                          <option value="Lainnya">📋 Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Lokasi Proyek
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="lokasi"
                            value={form.lokasi}
                            onChange={handleChange}
                            placeholder="Kota, Provinsi, Indonesia"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Deskripsi Proyek
                      </label>
                      <textarea
                        name="deskripsi"
                        value={form.deskripsi}
                        onChange={handleChange}
                        placeholder="Jelaskan detail proyek, metodologi yang akan digunakan, timeline pelaksanaan, dan dampak lingkungan yang diharapkan..."
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum 200 karakter untuk deskripsi yang komprehensif
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Detail Finansial */}
              {currentStep === 2 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <FiDollarSign className="text-cyan-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Detail Emisi & Finansial
                      </h2>
                      <p className="text-gray-600">
                        Tentukan volume karbon dan struktur harga proyek
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Estimasi Volume Kredit Karbon
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="volume"
                            value={form.volume}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all pr-20"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            tCO₂e
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Berdasarkan metodologi yang akan digunakan
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Harga per tCO₂e
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
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Harga kompetitif berdasarkan riset pasar
                        </p>
                      </div>
                    </div>

                    {/* Estimated Revenue Display */}
                    {form.volume && form.harga && (
                      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Proyeksi Pendapatan
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              Rp{" "}
                              {(
                                parseInt(form.volume || 0) *
                                parseInt(form.harga || 0)
                              ).toLocaleString("id-ID")}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Estimasi
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-600">
                              {form.volume || 0}
                            </div>
                            <div className="text-sm text-gray-600">tCO₂e</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Tanggal Mulai Proyek
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="tanggalMulai"
                            value={form.tanggalMulai}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Tanggal Target Selesai
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="tanggalSelesai"
                            value={form.tanggalSelesai}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dokumen & Review */}
              {currentStep === 3 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiUpload className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Upload Dokumen & Review
                      </h2>
                      <p className="text-gray-600">
                        Upload dokumen pendukung dan review pengajuan Anda
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Dokumen Pendukung
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors bg-gray-50">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FiUpload className="text-blue-600 text-2xl" />
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
                              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium inline-flex items-center gap-2"
                            >
                              <FiUpload />
                              Pilih File PDF
                            </label>
                          </div>
                          <div className="text-sm text-gray-500 max-w-md">
                            <p className="font-medium mb-2">
                              Dokumen yang diperlukan:
                            </p>
                            <ul className="text-left list-disc list-inside space-y-1">
                              <li>Project Design Document (PDD)</li>
                              <li>Environmental Impact Assessment</li>
                              <li>Metodologi yang digunakan</li>
                              <li>Dokumentasi baseline</li>
                            </ul>
                            <p className="mt-3 text-xs">
                              Format: PDF, maksimal 10 MB
                            </p>
                          </div>
                          {form.dokumen && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                              <FiFileText />
                              <span className="text-sm font-medium">
                                {form.dokumen.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Ringkasan Pengajuan
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">
                            Nama Proyek
                          </div>
                          <div className="font-medium">{form.nama || "-"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Kategori</div>
                          <div className="font-medium">
                            {form.kategori || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lokasi</div>
                          <div className="font-medium">
                            {form.lokasi || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Volume Estimasi
                          </div>
                          <div className="font-medium">
                            {form.volume || "-"} tCO₂e
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Harga per tCO₂e
                          </div>
                          <div className="font-medium">
                            Rp{" "}
                            {parseInt(form.harga || 0).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Periode</div>
                          <div className="font-medium">
                            {form.tanggalMulai || "-"} s/d{" "}
                            {form.tanggalSelesai || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                      <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-1">
                          Perhatian Sebelum Submit
                        </h3>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>
                            • Pastikan semua informasi telah diisi dengan benar
                          </li>
                          <li>
                            • Dokumen pendukung sudah lengkap dan sesuai standar
                          </li>
                          <li>• Proses review memakan waktu 7-14 hari kerja</li>
                          <li>• Anda akan menerima notifikasi melalui email</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="border-t border-gray-100 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrev}
                        className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Sebelumnya
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      <FiSave className="w-4 h-4" />
                      Simpan Draft
                    </button>

                    {currentStep < 3 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        Lanjutkan
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        <FiSend className="w-4 h-4" />
                        Ajukan Proyek
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
