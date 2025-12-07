// frontend/src/pages/Laporan.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import API from "../api/axios.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  FiTrendingUp,
  FiDollarSign,
  FiDownload,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiTarget,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiLoader,
  FiHome,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Color scheme
const colors = {
  primary: "#10b981",
  secondary: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

// Stats Card Component
const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendValue,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} shadow-lg`}>
        <Icon className="text-white text-xl" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  </div>
);

const Laporan = () => {
  const [timeRange, setTimeRange] = useState("12months");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [transactions, setTransactions] = useState({ purchases: [], sales: [] });
  const [stats, setStats] = useState({
    totalPenjualan: 0,
    totalPembelian: 0,
    totalRevenue: 0,
    avgGrowth: 0,
  });
  
  // State for analytics
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // ✅ Calculate REAL month-over-month growth
  const calculateGrowth = (monthlyValues) => {
    if (monthlyValues.length < 2) return 0;
    
    // Get last 2 months with data
    const nonZeroMonths = monthlyValues.filter(v => v > 0);
    if (nonZeroMonths.length < 2) return 0;
    
    const currentMonth = nonZeroMonths[nonZeroMonths.length - 1];
    const previousMonth = nonZeroMonths[nonZeroMonths.length - 2];
    
    if (previousMonth === 0) return 0;
    
    const growth = ((currentMonth - previousMonth) / previousMonth) * 100;
    return growth;
  };

  // ✅ Wrap processAnalytics dengan useCallback
  const processAnalytics = useCallback((purchases, sales) => {
    // ✅ Calculate Stats
    const totalPenjualan = sales.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const totalPembelian = purchases.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const totalRevenue = sales.reduce((sum, tx) => sum + parseFloat(tx.total_price || 0), 0);
    
    // ✅ Calculate Monthly Data FIRST (needed for growth calculation)
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months
    months.forEach((month, idx) => {
      monthlyMap[month] = {
        month,
        monthIndex: idx,
        penjualan: 0,
        pembelian: 0,
        revenue: 0,
      };
    });
    
    // Process sales by month
    sales.forEach(tx => {
      try {
        const date = new Date(tx.transaction_date);
        if (isNaN(date.getTime())) return;
        
        const monthIdx = date.getMonth();
        const monthName = months[monthIdx];
        
        if (monthlyMap[monthName]) {
          monthlyMap[monthName].penjualan += parseFloat(tx.amount) || 0;
          monthlyMap[monthName].revenue += parseFloat(tx.total_price) || 0;
        }
      } catch (e) {
        console.warn("Error processing transaction date:", e);
      }
    });
    
    // Process purchases by month
    purchases.forEach(tx => {
      try {
        const date = new Date(tx.transaction_date);
        if (isNaN(date.getTime())) return;
        
        const monthIdx = date.getMonth();
        const monthName = months[monthIdx];
        
        if (monthlyMap[monthName]) {
          monthlyMap[monthName].pembelian += parseFloat(tx.amount) || 0;
        }
      } catch (e) {
        console.warn("Error processing transaction date:", e);
      }
    });
    
    const monthlyArray = Object.values(monthlyMap).sort((a, b) => a.monthIndex - b.monthIndex);
    setMonthlyData(monthlyArray);
    
    // ✅ Group by Category with REAL growth calculation
    const categoryMap = {};
    
    // Track monthly sales per category for growth calculation
    const categoryMonthlyMap = {};
    
    // Process sales
    sales.forEach(tx => {
      const category = tx.project_category || "Others";
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          kategori: category,
          penjualan: 0,
          pembelian: 0,
          revenue: 0,
          count: 0,
        };
        categoryMonthlyMap[category] = Array(12).fill(0);
      }
      
      categoryMap[category].penjualan += parseFloat(tx.amount) || 0;
      categoryMap[category].revenue += parseFloat(tx.total_price) || 0;
      categoryMap[category].count += 1;
      
      // Track monthly sales for this category
      try {
        const date = new Date(tx.transaction_date);
        if (!isNaN(date.getTime())) {
          const monthIdx = date.getMonth();
          categoryMonthlyMap[category][monthIdx] += parseFloat(tx.amount) || 0;
        }
      } catch (e) {
        // Silent fail
      }
    });
    
    // Process purchases
    purchases.forEach(tx => {
      const category = tx.project_category || "Others";
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          kategori: category,
          penjualan: 0,
          pembelian: 0,
          revenue: 0,
          count: 0,
        };
        categoryMonthlyMap[category] = Array(12).fill(0);
      }
      
      categoryMap[category].pembelian += parseFloat(tx.amount) || 0;
    });
    
    // Convert to array with REAL growth calculation
    const categoryArray = Object.values(categoryMap).map(cat => {
      const category = cat.kategori;
      const monthlyValues = categoryMonthlyMap[category] || [];
      
      // ✅ Calculate REAL month-over-month growth
      const growth = calculateGrowth(monthlyValues);
      
      return {
        ...cat,
        growth: parseFloat(growth.toFixed(1)),
      };
    });
    
    setCategoryData(categoryArray);
    
    // ✅ Calculate Average Growth from REAL data
    const avgGrowth = categoryArray.length > 0
      ? categoryArray.reduce((sum, cat) => sum + cat.growth, 0) / categoryArray.length
      : 0;
    
    // ✅ Calculate overall month-over-month growth
    const monthlySales = monthlyArray.map(m => m.penjualan);
    const overallGrowth = calculateGrowth(monthlySales);
    
    // ✅ Set Final Stats
    setStats({
      totalPenjualan: parseFloat(totalPenjualan) || 0,
      totalPembelian: parseFloat(totalPembelian) || 0,
      totalRevenue: parseFloat(totalRevenue) || 0,
      avgGrowth: parseFloat(avgGrowth) || 0,
      overallGrowth: parseFloat(overallGrowth) || 0,
    });
    
  }, []); // ✅ Empty deps karena tidak bergantung pada props/state

  // ✅ Wrap fetchAllData dengan useCallback dan include processAnalytics
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true); // Pastikan loading benar ditrigger di awal
  
      // ✅ Fetch transactions (purchases + sales) pakai axios instance
      const txRes = await API.get('/transactions/my-transactions');
      const txData = txRes.data;
  
      if (txData.success) {
        const purchases = txData.data.purchases || [];
        const sales = txData.data.sales || [];
  
        setTransactions({ purchases, sales });
  
        // Process analytics
        processAnalytics(purchases, sales);
      } else {
        console.error("Failed to fetch transactions:", txData.message);
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load report data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [processAnalytics]);
  

  // ✅ Now useEffect has correct dependency
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================
  // Chart Configurations
  // ============================================
  const chartDataPenjualan = {
    labels: categoryData.map((data) => data.kategori),
    datasets: [
      {
        label: "Sales (tCO₂e)",
        data: categoryData.map((data) => data.penjualan),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartDataTrend = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Sales (tCO₂e)",
        data: monthlyData.map((item) => item.penjualan),
        borderColor: colors.primary,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Purchases (tCO₂e)",
        data: monthlyData.map((item) => item.pembelian),
        borderColor: colors.secondary,
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.secondary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const pieDataDistribusi = {
    labels: categoryData.map((data) => data.kategori),
    datasets: [
      {
        data: categoryData.map((data) => data.penjualan),
        backgroundColor: [
          "#10b981",
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#f59e0b",
          "#ef4444",
          "#6b7280",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const revenueData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue (IDR)",
        data: monthlyData.map((item) => item.revenue),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Revenue')) {
                label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
              } else {
                label += context.parsed.y.toLocaleString('en-US') + ' tCO₂e';
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
            weight: "500",
          },
          callback: function(value) {
            if (this.chart.canvas.parentNode.querySelector('canvas')?.id === 'revenue-chart') {
              return 'Rp ' + (value / 1000000).toFixed(0) + 'M';
            }
            return value.toLocaleString('en-US');
          }
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value.toLocaleString('en-US')} tCO₂e (${percentage}%)`;
          }
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <FiLoader className="animate-spin text-emerald-600 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading report data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">
                <FiHome className="inline" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">Reports</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
              >
                <option value="12months">Last 12 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="3months">Last 3 Months</option>
                <option value="1month">This Month</option>
              </select>
            </div>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <FiDownload size={16} />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="py-8 px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Sales"
              value={`${Math.round(stats.totalPenjualan).toLocaleString('en-US')}`}
              subtitle="tCO₂e sold"
              icon={FiTrendingUp}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              trend={stats.totalPenjualan > 0 ? "up" : null}
              trendValue={stats.totalPenjualan > 0 ? `${transactions.sales.length} transactions` : null}
            />
            <StatsCard
              title="Total Purchases"
              value={`${Math.round(stats.totalPembelian).toLocaleString('en-US')}`}
              subtitle="tCO₂e purchased"
              icon={FiTarget}
              color="bg-gradient-to-br from-cyan-500 to-cyan-600"
              trend={stats.totalPembelian > 0 ? "up" : null}
              trendValue={stats.totalPembelian > 0 ? `${transactions.purchases.length} transactions` : null}
            />
            <StatsCard
              title="Total Revenue"
              value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
              subtitle="gross revenue"
              icon={FiDollarSign}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              trend={stats.totalRevenue > 0 ? "up" : null}
              trendValue={stats.totalRevenue > 0 ? "from sales" : null}
            />
            <StatsCard
              title="Average Growth"
              value={`${stats.avgGrowth.toFixed(1)}%`}
              subtitle="category average"
              icon={FiActivity}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              trend={stats.avgGrowth > 0 ? "up" : stats.avgGrowth < 0 ? "down" : null}
              trendValue={stats.avgGrowth !== 0 ? `${Math.abs(stats.avgGrowth).toFixed(1)}%` : null}
            />
          </div>

          {/* Empty State */}
          {categoryData.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-6">
                You don't have any transactions yet. Start by creating projects or purchasing certificates.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/dashboard/pengajuan"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Create Project
                </Link>
                <Link
                  to="/marketplace"
                  className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                >
                  Buy Certificates
                </Link>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          {categoryData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-100">
                <div className="flex px-6 overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview", icon: FiBarChart2 },
                    { id: "trends", label: "Trends", icon: FiActivity },
                    { id: "distribution", label: "Distribution", icon: FiPieChart },
                    { id: "performance", label: "Performance", icon: FiTarget },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                          : "border-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                          Sales by Category
                        </h3>
                      </div>
                      <div className="h-80">
                        <Bar data={chartDataPenjualan} options={chartOptions} />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Monthly Revenue
                      </h3>
                      <div className="h-80">
                        <Bar data={revenueData} options={chartOptions} id="revenue-chart" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "trends" && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Sales & Purchases Trend
                    </h3>
                    <div className="h-96">
                      <Line data={chartDataTrend} options={chartOptions} />
                    </div>
                  </div>
                )}

                {activeTab === "distribution" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Sales Distribution
                      </h3>
                      <div className="h-80">
                        <Pie data={pieDataDistribusi} options={pieOptions} />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Top Performance
                      </h3>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {categoryData
                          .sort((a, b) => b.penjualan - a.penjualan)
                          .slice(0, 5)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.kategori}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {Math.round(item.penjualan).toLocaleString()} tCO₂e sold
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-bold text-lg ${
                                    item.growth > 0
                                      ? "text-green-600"
                                      : item.growth < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {item.growth > 0 ? "+" : ""}
                                  {item.growth.toFixed(1)}%
                                </p>
                                <p className="text-sm text-gray-600">
                                  Rp {(item.revenue / 1000000).toFixed(1)}M
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Performance Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Sales
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Purchases
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Transactions
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Growth
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {categoryData.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className="hover:bg-white transition-colors"
                              >
                                <td className="px-4 py-4">
                                  <div className="font-medium text-gray-800 text-sm">
                                    {item.kategori}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {item.count} transactions
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <div className="font-semibold text-gray-800 text-sm">
                                    {Math.round(item.penjualan).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-600">tCO₂e</div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <div className="text-gray-600 text-sm">
                                    {Math.round(item.pembelian).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-600">tCO₂e</div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                    {item.count}
                                  </span>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                                      item.growth > 0
                                        ? "text-green-600"
                                        : item.growth < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {item.growth > 0 && <FiArrowUp size={10} />}
                                    {item.growth < 0 && <FiArrowDown size={10} />}
                                    {Math.abs(item.growth).toFixed(1)}%
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <div className="font-semibold text-gray-800 text-sm">
                                    Rp {(item.revenue / 1000000).toFixed(1)}M
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {item.revenue.toLocaleString("id-ID")}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laporan;