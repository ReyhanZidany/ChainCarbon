import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiFileText,
  FiArrowUpRight,
  FiArrowDownLeft,
} from "react-icons/fi";

const dummyTransaksiPembeli = [
  {
    id: "TX001",
    proyekId: "P001",
    namaProyek: "Pertanian Cerdas Berbasis IoT",
    volume: 100,
    totalHarga: 85000000,
    hargaPerTon: 850000,
    status: "Selesai",
    escrow: "Lunas",
    tanggal: "2025-04-01",
    penjual: "PT Agritech Indonesia",
    sertifikat: "CERT001",
  },
  {
    id: "TX002",
    proyekId: "P002",
    namaProyek: "Optimalisasi Irigasi Tetes",
    volume: 80,
    totalHarga: 76000000,
    hargaPerTon: 950000,
    status: "Menunggu Pembayaran",
    escrow: "Pending",
    tanggal: "2025-04-20",
    penjual: "Koperasi Tani Makmur",
    sertifikat: "-",
  },
];

const dummyTransaksiPenjual = [
  {
    id: "TX003",
    proyekId: "P003",
    namaProyek: "Pengelolaan Hutan Lestari",
    volume: 150,
    totalHarga: 120000000,
    hargaPerTon: 800000,
    status: "Selesai",
    escrow: "Lunas",
    tanggal: "2025-03-15",
    pembeli: "PT Green Energy Indonesia",
    sertifikat: "CERT003",
  },
  {
    id: "TX004",
    proyekId: "P004",
    namaProyek: "Konservasi Mangrove Pesisir",
    volume: 200,
    totalHarga: 175000000,
    hargaPerTon: 875000,
    status: "Dalam Proses",
    escrow: "Sebagian",
    tanggal: "2025-04-10",
    pembeli: "PT Sustainable Solutions",
    sertifikat: "-",
  },
];

const statusConfig = {
  Selesai: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: FiCheckCircle,
  },
  "Dalam Proses": {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FiClock,
  },
  "Menunggu Pembayaran": {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: FiAlertCircle,
  },
  Dibatalkan: { color: "bg-red-100 text-red-800 border-red-200", icon: FiX },
};

const RiwayatTransaksi = () => {
  const [filter, setFilter] = useState("terbaru");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [activeTab, setActiveTab] = useState("pembeli");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDetailClick = (tx) => {
    setSelectedTransaksi(tx);
  };

  const handleCloseModal = () => {
    setSelectedTransaksi(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Filtering dan sorting data
  const filterAndSortData = (data) => {
    let filteredData = data;

    // Search filter
    if (searchQuery) {
      filteredData = data.filter(
        (item) =>
          item.namaProyek.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.penjual &&
            item.penjual.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.pembeli &&
            item.pembeli.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort data
    return [...filteredData].sort((a, b) => {
      if (filter === "terbaru")
        return new Date(b.tanggal) - new Date(a.tanggal);
      if (filter === "terlama")
        return new Date(a.tanggal) - new Date(b.tanggal);
      if (filter === "harga") return b.totalHarga - a.totalHarga;
      if (filter === "status") return a.status.localeCompare(b.status);
      return 0;
    });
  };

  const transaksiPembeliTersortir = filterAndSortData(dummyTransaksiPembeli);
  const transaksiPenjualTersortir = filterAndSortData(dummyTransaksiPenjual);

  // Statistics
  const totalPembelian = dummyTransaksiPembeli.reduce(
    (sum, tx) => sum + tx.totalHarga,
    0
  );
  const totalPenjualan = dummyTransaksiPenjual.reduce(
    (sum, tx) => sum + tx.totalHarga,
    0
  );
  const totalVolumePembeli = dummyTransaksiPembeli.reduce(
    (sum, tx) => sum + tx.volume,
    0
  );
  const totalVolumePenjual = dummyTransaksiPenjual.reduce(
    (sum, tx) => sum + tx.volume,
    0
  );

  return (
    <div className="py-8 px-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Riwayat Transaksi
          </h1>
          <p className="text-gray-600">
            Kelola dan pantau semua transaksi kredit karbon Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Pembelian
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  Rp {(totalPembelian / 1000000).toFixed(1)}M
                </p>
                <p className="text-gray-600 text-sm">
                  {totalVolumePembeli} tCO₂e
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <FiArrowDownLeft className="text-emerald-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Penjualan
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  Rp {(totalPenjualan / 1000000).toFixed(1)}M
                </p>
                <p className="text-gray-600 text-sm">
                  {totalVolumePenjual} tCO₂e
                </p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-100">
                <FiArrowUpRight className="text-cyan-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Transaksi Selesai
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    [...dummyTransaksiPembeli, ...dummyTransaksiPenjual].filter(
                      (tx) => tx.status === "Selesai"
                    ).length
                  }
                </p>
                <p className="text-gray-600 text-sm">
                  dari{" "}
                  {dummyTransaksiPembeli.length + dummyTransaksiPenjual.length}{" "}
                  total
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Harga Rata-rata
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp{" "}
                  {Math.round(
                    (totalPembelian + totalPenjualan) /
                      (totalVolumePembeli + totalVolumePenjual) /
                      1000
                  )}
                  K
                </p>
                <p className="text-gray-600 text-sm">per tCO₂e</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FiDollarSign className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex px-6">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "pembeli"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-emerald-600"
                }`}
                onClick={() => handleTabChange("pembeli")}
              >
                <FiShoppingCart className="w-4 h-4" />
                Pembelian ({dummyTransaksiPembeli.length})
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "penjual"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-cyan-600"
                }`}
                onClick={() => handleTabChange("penjual")}
              >
                <FiShoppingBag className="w-4 h-4" />
                Penjualan ({dummyTransaksiPenjual.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi, proyek, atau partner..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="harga">Harga Tertinggi</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <FiDownload className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {activeTab === "pembeli" ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaksi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Proyek
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Penjual
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transaksiPembeliTersortir.map((tx) => {
                    const StatusIcon = statusConfig[tx.status]?.icon || FiClock;
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {tx.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tx.proyekId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 max-w-xs truncate">
                            {tx.namaProyek}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-700">
                            {tx.penjual}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {tx.volume}
                          </div>
                          <div className="text-sm text-gray-500">tCO₂e</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            Rp {(tx.totalHarga / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-500">
                            Rp {(tx.hargaPerTon / 1000).toFixed(0)}K/tCO₂e
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                              statusConfig[tx.status]?.color
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FiCalendar className="w-3 h-3" />
                            {tx.tanggal}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                            onClick={() =>
                              handleDetailClick({ ...tx, role: "pembeli" })
                            }
                          >
                            <FiEye className="w-4 h-4" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaksi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Proyek
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pembeli
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transaksiPenjualTersortir.map((tx) => {
                    const StatusIcon = statusConfig[tx.status]?.icon || FiClock;
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {tx.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tx.proyekId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 max-w-xs truncate">
                            {tx.namaProyek}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-700">
                            {tx.pembeli}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {tx.volume}
                          </div>
                          <div className="text-sm text-gray-500">tCO₂e</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            Rp {(tx.totalHarga / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-500">
                            Rp {(tx.hargaPerTon / 1000).toFixed(0)}K/tCO₂e
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                              statusConfig[tx.status]?.color
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FiCalendar className="w-3 h-3" />
                            {tx.tanggal}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                            onClick={() =>
                              handleDetailClick({ ...tx, role: "penjual" })
                            }
                          >
                            <FiEye className="w-4 h-4" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Empty State */}
            {(activeTab === "pembeli" &&
              transaksiPembeliTersortir.length === 0) ||
            (activeTab === "penjual" &&
              transaksiPenjualTersortir.length === 0) ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Belum ada transaksi
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "pembeli"
                    ? "Belum ada transaksi pembelian"
                    : "Belum ada transaksi penjualan"}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedTransaksi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Detail Transaksi{" "}
                    {selectedTransaksi.role === "pembeli"
                      ? "Pembelian"
                      : "Penjualan"}
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    {selectedTransaksi.id}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Project Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informasi Proyek
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nama Proyek</label>
                    <p className="font-medium text-gray-900">
                      {selectedTransaksi.namaProyek}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">ID Proyek</label>
                    <p className="font-medium text-gray-900">
                      {selectedTransaksi.proyekId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      {selectedTransaksi.role === "pembeli"
                        ? "Penjual"
                        : "Pembeli"}
                    </label>
                    <p className="font-medium text-gray-900">
                      {selectedTransaksi.role === "pembeli"
                        ? selectedTransaksi.penjual
                        : selectedTransaksi.pembeli}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      No. Sertifikat
                    </label>
                    <p className="font-medium text-gray-900">
                      {selectedTransaksi.sertifikat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3">
                    Volume & Harga
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-emerald-600">
                        Volume Kredit
                      </label>
                      <p className="font-bold text-emerald-800 text-lg">
                        {selectedTransaksi.volume} tCO₂e
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-emerald-600">
                        Harga per tCO₂e
                      </label>
                      <p className="font-medium text-emerald-700">
                        Rp {selectedTransaksi.hargaPerTon?.toLocaleString()}
                      </p>
                    </div>
                    <div className="border-t border-emerald-200 pt-2 mt-2">
                      <label className="text-sm text-emerald-600">
                        Total Harga
                      </label>
                      <p className="font-bold text-emerald-800 text-xl">
                        Rp {selectedTransaksi.totalHarga.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    Status Transaksi
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-blue-600">
                        Status Transaksi
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        {React.createElement(
                          statusConfig[selectedTransaksi.status]?.icon ||
                            FiClock,
                          { className: "w-4 h-4 text-blue-700" }
                        )}
                        <span className="font-medium text-blue-800">
                          {selectedTransaksi.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-blue-600">
                        Status Escrow
                      </label>
                      <p className="font-medium text-blue-800">
                        {selectedTransaksi.escrow}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-600">
                        Tanggal Transaksi
                      </label>
                      <div className="flex items-center gap-1 mt-1">
                        <FiCalendar className="w-4 h-4 text-blue-700" />
                        <span className="font-medium text-blue-800">
                          {selectedTransaksi.tanggal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100 pt-6">
                {selectedTransaksi.role === "pembeli" &&
                  selectedTransaksi.status === "Menunggu Pembayaran" && (
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                      <FiCreditCard className="w-4 h-4" />
                      Lakukan Pembayaran
                    </button>
                  )}
                {selectedTransaksi.role === "penjual" &&
                  selectedTransaksi.status === "Dalam Proses" && (
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">
                      <FiCheckCircle className="w-4 h-4" />
                      Konfirmasi Pengiriman
                    </button>
                  )}
                {selectedTransaksi.sertifikat !== "-" && (
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    <FiDownload className="w-4 h-4" />
                    Unduh Sertifikat
                  </button>
                )}
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  onClick={handleCloseModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatTransaksi;
