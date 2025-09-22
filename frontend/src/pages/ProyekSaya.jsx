import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiGrid,
  FiActivity,
  FiCircle,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";

const dummyProyekSaya = [
  {
    id: "1",
    nama: "Pertanian Cerdas Berbasis IoT",
    status: "Aktif",
    lokasi: "Yogyakarta",
    periode: "2025-2027",
    harga: "Rp 850.000",
    gambar:
      "https://www.linknet.id/files/photos/shares/article/iot-dalam-pertanian.jpg",
    kategori: "Agrikultur",
    carbonCredit: "250 tCO₂e",
    progress: 75,
    lastUpdate: "2 hari yang lalu",
  },
  {
    id: "2",
    nama: "Optimalisasi Irigasi Tetes",
    status: "Nonaktif",
    lokasi: "Bandung",
    periode: "2024-2026",
    harga: "Rp 950.000",
    gambar:
      "https://msmbindonesia.com/wp-content/uploads/2025/01/Tumbnail-Website-1-1568x882.jpg",
    kategori: "Agrikultur",
    carbonCredit: "180 tCO₂e",
    progress: 45,
    lastUpdate: "1 minggu yang lalu",
  },
  {
    id: "3",
    nama: "Reforestasi Hutan Kalimantan",
    status: "Aktif",
    lokasi: "Kalimantan Timur",
    periode: "2024-2029",
    harga: "Rp 1.200.000",
    gambar:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    kategori: "Reforestasi",
    carbonCredit: "500 tCO₂e",
    progress: 90,
    lastUpdate: "1 hari yang lalu",
  },
  {
    id: "4",
    nama: "Solar Farm Jawa Tengah",
    status: "Review",
    lokasi: "Semarang",
    periode: "2025-2030",
    harga: "Rp 2.500.000",
    gambar:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    kategori: "Energi Terbarukan",
    carbonCredit: "800 tCO₂e",
    progress: 25,
    lastUpdate: "3 hari yang lalu",
  },
];

const kategoriList = [
  "Semua",
  "Agrikultur",
  "Efisiensi Energi",
  "Energi Terbarukan",
  "Industrial Process Improvement",
  "Reforestasi",
  "Waste Management",
  "Kategori Lainnya",
];

const statusColors = {
  Aktif: "bg-green-100 text-green-800 border-green-200",
  Nonaktif: "bg-red-100 text-red-800 border-red-200",
  Review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Draft: "bg-gray-100 text-gray-800 border-gray-200",
};

const ProyekSaya = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  const filteredProyek = dummyProyekSaya.filter((proyek) => {
    const cocokNamaLokasi =
      proyek.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyek.lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    const cocokKategori =
      selectedKategori === "Semua" ||
      proyek.kategori.toLowerCase() === selectedKategori.toLowerCase();

    return cocokNamaLokasi && cocokKategori;
  });

  const totalProyek = dummyProyekSaya.length;
  const proyekAktif = dummyProyekSaya.filter(
    (p) => p.status === "Aktif"
  ).length;
  const totalCarbonCredit = dummyProyekSaya.reduce((total, proyek) => {
    const credit = parseInt(proyek.carbonCredit.replace(/[^\d]/g, ""));
    return total + credit;
  }, 0);

  return (
    <div className="py-8 px-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Proyek Saya
              </h1>
              <p className="text-gray-600">
                Kelola dan pantau semua proyek karbon Anda
              </p>
            </div>
            <Link
              to="/dashboard/pengajuan"
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center gap-2"
            >
              <FiPlus className="text-lg" />
              Tambah Proyek Baru
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Proyek
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {totalProyek}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <FiGrid className="text-emerald-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Proyek Aktif
                  </p>
                  <p className="text-3xl font-bold text-cyan-600">
                    {proyekAktif}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-100">
                  <FiActivity className="text-cyan-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Kredit Karbon
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalCarbonCredit.toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm">tCO₂e</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <FiCircle className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama proyek atau lokasi..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                {kategoriList.map((kategori, idx) => (
                  <option key={idx} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProyek.map((proyek) => (
            <div
              key={proyek.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={proyek.gambar}
                  alt={proyek.nama}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[proyek.status]
                    }`}
                  >
                    {proyek.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <FiMoreVertical className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {proyek.nama}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {proyek.kategori}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-gray-400" />
                      <span>{proyek.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      <span>{proyek.periode}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {proyek.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${proyek.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiCircle className="text-emerald-600 text-sm" />
                      <span className="text-xs text-gray-600">
                        Kredit Karbon
                      </span>
                    </div>
                    <p className="font-bold text-emerald-600">
                      {proyek.carbonCredit}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiDollarSign className="text-blue-600 text-sm" />
                      <span className="text-xs text-gray-600">Harga</span>
                    </div>
                    <p className="font-bold text-blue-600">{proyek.harga}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Terakhir diperbarui: {proyek.lastUpdate}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/proyek/${proyek.id}`}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
                  >
                    <FiEye className="text-sm" />
                    Detail
                  </Link>
                  <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <FiEdit className="text-gray-600" />
                  </button>
                  <button className="px-3 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProyek.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGrid className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
            <Link
              to="/dashboard/pengajuan"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <FiPlus />
              Tambah Proyek Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyekSaya;
