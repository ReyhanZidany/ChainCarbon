// src/pages/RiwayatTransaksi.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiMapPin,
  FiPackage,
  FiHome,
} from "react-icons/fi";
import API from "../api/axios.js";

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: FiCheckCircle,
  },
  pending: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FiClock,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: FiX,
  },
  transferred: {
    label: "Transfer Complete",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: FiPackage,
  },
};

const RiwayatTransaksi = () => {
  const [filter, setFilter] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("purchases");
  const [transaksiPembeli, setTransaksiPembeli] = useState([]);
  const [transaksiPenjual, setTransaksiPenjual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchTransaksi();
  }, []);

  // ============================================
  // Fetch Transactions
  // ============================================
  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await API.get('/transactions/my-transactions');
      const data = response.data;
  
      console.log("📦 Data received:", data);
  
      if (data.success) {
        const purchases = data.data.purchases || [];
        const sales = data.data.sales || [];
  
        console.log("✅ Purchases:", purchases.length);
        console.log("✅ Sales:", sales.length);
  
        setTransaksiPembeli(purchases);
        setTransaksiPenjual(sales);
        setError(null);
      } else {
        setError(data.message || "Failed to load transaction data");
        console.error("❌ API Error:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      if (
        error.response?.status === 401
      ) {
        setError("Token not found or expired. Please login again.");
      } else {
        setError(`Failed to load transactions: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // Export Transactions
  // ============================================
  const handleExport = async () => {
    try {
      setExporting(true);
      const type = activeTab === "purchases" ? "purchases" : "sales";
      const response = await API.get(
        `/transactions/export?type=${type}`,
        { responseType: "blob" }
      );
      const blob = response.data; 
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${type}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ Export successful");
    } catch (error) {
      console.error("❌ Export error:", error);
      alert("Failed to export transaction data");
    } finally {
      setExporting(false);
    }
  };

  // ============================================
  // Filter and Sort Data
  // ============================================
  const filterAndSortData = (data) => {
    let filteredData = data;

    if (searchQuery) {
      filteredData = data.filter(
        (item) =>
          item.project_title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.transaction_id?.toString().includes(searchQuery.toLowerCase()) ||
          item.cert_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.seller_company
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.buyer_company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return [...filteredData].sort((a, b) => {
      if (filter === "newest")
        return new Date(b.transaction_date) - new Date(a.transaction_date);
      if (filter === "oldest")
        return new Date(a.transaction_date) - new Date(b.transaction_date);
      if (filter === "price")
        return (b.total_price || 0) - (a.total_price || 0);
      if (filter === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });
  };

  const transaksiPembeliTersortir = filterAndSortData(transaksiPembeli);
  const transaksiPenjualTersortir = filterAndSortData(transaksiPenjual);

  // ============================================
  // Calculate Statistics
  // ============================================
  const totalPembelian = transaksiPembeli.reduce((sum, tx) => {
    const price = parseFloat(tx.total_price) || 0;
    return sum + price;
  }, 0);

  const totalPenjualan = transaksiPenjual.reduce((sum, tx) => {
    const price = parseFloat(tx.total_price) || 0;
    return sum + price;
  }, 0);

  const totalVolumePembeli = transaksiPembeli.reduce((sum, tx) => {
    const amount = parseFloat(tx.amount) || 0;
    return sum + amount;
  }, 0);

  const totalVolumePenjual = transaksiPenjual.reduce((sum, tx) => {
    const amount = parseFloat(tx.amount) || 0;
    return sum + amount;
  }, 0);

  const transaksiSelesai = [
    ...transaksiPembeli,
    ...transaksiPenjual,
  ].filter(
    (tx) => tx.status === "completed" || tx.status === "transferred"
  ).length;

  const totalTransaksi = transaksiPembeli.length + transaksiPenjual.length;

  const totalVolumeAll = totalVolumePembeli + totalVolumePenjual;
  const totalPriceAll = totalPembelian + totalPenjualan;
  const hargaRataRata =
    totalVolumeAll > 0 ? totalPriceAll / totalVolumeAll : 0;

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading transaction history...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Error State
  // ============================================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            An Error Occurred
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTransaksi}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* ✅ PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Link to="/" className="hover:text-emerald-600 transition-colors">
                <FiHome className="inline" /> Home
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">Transactions</span>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiDownload className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {exporting ? "Exporting..." : "Export Data"}
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="py-8 px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Purchases */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Purchases
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalPembelian > 0
                      ? `Rp ${(totalPembelian / 1000000).toFixed(1)}M`
                      : "Rp 0"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {totalVolumePembeli > 0
                      ? `${totalVolumePembeli.toLocaleString("id-ID")} tCO₂e`
                      : "0 tCO₂e"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <FiArrowDownLeft className="text-emerald-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {totalPenjualan > 0
                      ? `Rp ${(totalPenjualan / 1000000).toFixed(1)}M`
                      : "Rp 0"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {totalVolumePenjual > 0
                      ? `${totalVolumePenjual.toLocaleString("id-ID")} tCO₂e`
                      : "0 tCO₂e"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-100">
                  <FiArrowUpRight className="text-cyan-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Completed Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Completed Transactions
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {transaksiSelesai}
                  </p>
                  <p className="text-gray-600 text-sm">
                    of {totalTransaksi} total
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Average Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Average Price
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {hargaRataRata > 0
                      ? `Rp ${Math.round(hargaRataRata / 1000).toLocaleString(
                          "id-ID"
                        )}K`
                      : "Rp 0"}
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
                    activeTab === "purchases"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-emerald-600"
                  }`}
                  onClick={() => setActiveTab("purchases")}
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Purchases ({transaksiPembeli.length})
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "sales"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-cyan-600"
                  }`}
                  onClick={() => setActiveTab("sales")}
                >
                  <FiShoppingBag className="w-4 h-4" />
                  Sales ({transaksiPenjual.length})
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
                    placeholder="Search transactions, projects, or partners..."
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
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="price">Highest Price</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          {/* Transaction Table - PURCHASES */}
          <div className="overflow-x-auto">
              {activeTab === "purchases" ? (
                transaksiPembeliTersortir.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Blockchain TX ID {/* ✅ NEW COLUMN */}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Seller
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Volume
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transaksiPembeliTersortir.map((tx) => {
                        const statusInfo = statusConfig[tx.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;

                        return (
                          <tr
                            key={tx.transaction_id || tx.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* ✅ CERTIFICATE ID COLUMN */}
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {tx.cert_id}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(tx.transaction_date).toLocaleDateString("en-US")}
                                </div>
                              </div>
                            </td>

                            {/* ✅ REAL BLOCKCHAIN TX ID COLUMN */}
                            <td className="px-6 py-4">
                              {tx.blockchain_tx_id ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                                      {tx.blockchain_tx_id.substring(0, 8)}...{tx.blockchain_tx_id.substring(56)}
                                    </code>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(tx.blockchain_tx_id);
                                        alert('Blockchain TX ID copied!');
                                      }}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title="Copy full TX ID"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <FiCheckCircle className="w-3 h-3" />
                                    <span>On-Chain Verified</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-yellow-600">
                                  <FiClock className="w-3 h-3" />
                                  <span>Pending verification</span>
                                </div>
                              )}
                            </td>

                            {/* PROJECT COLUMN */}
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 max-w-xs">
                                <div className="truncate">{tx.project_title}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <FiMapPin className="h-3 w-3" />
                                  {tx.project_location}
                                </div>
                              </div>
                            </td>

                            {/* ... (keep other columns as is) ... */}

                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-700">
                                  {tx.seller_company || tx.seller_name}
                                </div>
                                {tx.seller_company_id && (
                                  <div className="text-xs text-gray-500">
                                    {tx.seller_company_id}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">
                                {parseFloat(tx.amount || 0).toLocaleString("id-ID")}
                              </div>
                              <div className="text-sm text-gray-500">tCO₂e</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">
                                Rp {(parseFloat(tx.total_price || 0) / 1000000).toFixed(2)}M
                              </div>
                              <div className="text-sm text-gray-500">
                                Rp {(parseFloat(tx.price_per_unit || 0) / 1000).toFixed(0)}K/tCO₂e
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FiCalendar className="w-3 h-3" />
                                {new Date(tx.transaction_date).toLocaleDateString("en-US")}
                              </div>
                            </td>
                            <td className="px-3 py-4">
                              <Link
                                to={`/dashboard/transaksi/${tx.transaction_id || tx.id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                              >
                                <FiEye className="w-4 h-4" />
                                Detail
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShoppingCart className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No purchase transactions yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start buying carbon credits in the marketplace!
                    </p>
                    <Link
                      to="/marketplace"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Go to Marketplace
                    </Link>
                  </div>
                )
              ) :   transaksiPenjualTersortir.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Blockchain TX ID {/* ✅ NEW COLUMN */}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transaksiPenjualTersortir.map((tx) => {
                      const statusInfo = statusConfig[tx.status] || statusConfig.pending;
                      const StatusIcon = statusInfo.icon;
        
                      return (
                        <tr
                          key={tx.transaction_id || tx.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* CERTIFICATE ID */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {tx.cert_id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(tx.transaction_date).toLocaleDateString("en-US")}
                              </div>
                            </div>
                          </td>
        
                          {/* ✅ REAL BLOCKCHAIN TX ID */}
                          <td className="px-6 py-4">
                            {tx.blockchain_tx_id ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <code className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                                    {tx.blockchain_tx_id.substring(0, 8)}...{tx.blockchain_tx_id.substring(56)}
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(tx.blockchain_tx_id);
                                      alert('Blockchain TX ID copied!');
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    title="Copy full TX ID"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <FiCheckCircle className="w-3 h-3" />
                                  <span>On-Chain Verified</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-yellow-600">
                                <FiClock className="w-3 h-3" />
                                <span>Pending verification</span>
                              </div>
                            )}
                          </td>
        
                          {/* ... (keep other columns as is) ... */}
        
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 max-w-xs">
                              <div className="truncate">{tx.project_title}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <FiMapPin className="h-3 w-3" />
                                {tx.project_location}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-700">
                                {tx.buyer_company || tx.buyer_name}
                              </div>
                              {tx.buyer_company_id && tx.buyer_company_id && (
                                <div className="text-xs text-gray-500">
                                  {tx.buyer_company_id}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">
                              {parseFloat(tx.amount || 0).toLocaleString("id-ID")}
                            </div>
                            <div className="text-sm text-gray-500">tCO₂e</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">
                              Rp {(parseFloat(tx.total_price || 0) / 1000000).toFixed(2)}M
                            </div>
                            <div className="text-sm text-gray-500">
                              Rp {(parseFloat(tx.price_per_unit || 0) / 1000).toFixed(0)}K/tCO₂e
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <FiCalendar className="w-3 h-3" />
                              {new Date(tx.transaction_date).toLocaleDateString("en-US")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/dashboard/transaksi/${tx.transaction_id || tx.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                            >
                              <FiEye className="w-4 h-4" />
                              Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingBag className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No sales transactions yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    List your certificates on the marketplace!
                  </p>
                  <Link
                    to="/dashboard/sertifikat"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    Manage Certificates
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatTransaksi;