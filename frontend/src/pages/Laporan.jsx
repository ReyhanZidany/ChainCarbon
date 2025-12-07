import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
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

const dummyData = [
  {
    kategori: "Proyek Agrikultur",
    penjualan: 128,
    pembelian: 100,
    harga: 150000,
    target: 150,
    growth: 12.5,
  },
  {
    kategori: "Proyek Efisiensi Energi",
    penjualan: 207,
    pembelian: 150,
    harga: 200000,
    target: 200,
    growth: 15.2,
  },
  {
    kategori: "Proyek Energi Terbarukan",
    penjualan: 82,
    pembelian: 50,
    harga: 120000,
    target: 100,
    growth: -8.3,
  },
  {
    kategori: "Proyek Industrial Process",
    penjualan: 35,
    pembelian: 30,
    harga: 100000,
    target: 50,
    growth: 5.7,
  },
  {
    kategori: "Proyek Reforestasi",
    penjualan: 90,
    pembelian: 70,
    harga: 140000,
    target: 120,
    growth: 18.9,
  },
  {
    kategori: "Proyek Waste Management",
    penjualan: 45,
    pembelian: 40,
    harga: 110000,
    target: 60,
    growth: -2.1,
  },
  {
    kategori: "Kategori Lainnya",
    penjualan: 56,
    pembelian: 45,
    harga: 130000,
    target: 80,
    growth: 8.4,
  },
];

const monthlyData = [
  { month: "Jan", penjualan: 45, pembelian: 38, revenue: 6750000 },
  { month: "Feb", penjualan: 52, pembelian: 41, revenue: 7800000 },
  { month: "Mar", penjualan: 48, pembelian: 45, revenue: 7200000 },
  { month: "Apr", penjualan: 61, pembelian: 52, revenue: 9150000 },
  { month: "May", penjualan: 58, pembelian: 48, revenue: 8700000 },
  { month: "Jun", penjualan: 67, pembelian: 55, revenue: 10050000 },
  { month: "Jul", penjualan: 71, pembelian: 58, revenue: 10650000 },
  { month: "Aug", penjualan: 64, pembelian: 61, revenue: 9600000 },
  { month: "Sep", penjualan: 69, pembelian: 59, revenue: 10350000 },
  { month: "Okt", penjualan: 73, pembelian: 62, revenue: 10950000 },
  { month: "Nov", penjualan: 78, pembelian: 65, revenue: 11700000 },
  { month: "Des", penjualan: 82, pembelian: 68, revenue: 12300000 },
];

// Color scheme sesuai ChainCarbon branding
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
  const [chartType, setChartType] = useState("bar");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate totals
  const totalPenjualan = dummyData.reduce(
    (sum, item) => sum + item.penjualan,
    0
  );
  const totalPembelian = dummyData.reduce(
    (sum, item) => sum + item.pembelian,
    0
  );
  const totalRevenue = dummyData.reduce(
    (sum, item) => sum + item.penjualan * item.harga,
    0
  );
  const avgGrowth =
    dummyData.reduce((sum, item) => sum + item.growth, 0) / dummyData.length;

  // Chart configurations
  const chartDataPenjualan = {
    labels: dummyData.map((data) => data.kategori.replace("Proyek ", "")),
    datasets: [
      {
        label: "Penjualan (tCO₂e)",
        data: dummyData.map((data) => data.penjualan),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Target",
        data: dummyData.map((data) => data.target),
        backgroundColor: "rgba(6, 182, 212, 0.6)",
        borderColor: "rgba(6, 182, 212, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartDataTrend = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Penjualan (tCO₂e)",
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
        label: "Pembelian (tCO₂e)",
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
    labels: dummyData.map((data) => data.kategori.replace("Proyek ", "")),
    datasets: [
      {
        data: dummyData.map((data) => data.penjualan),
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
      },
    },
  };

  return (
    <div className="py-8 px-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Laporan & Analitik
            </h1>
            <p className="text-gray-600">
              Dashboard komprehensif untuk analisis performa kredit karbon Anda
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
              >
                <option value="12months">12 Bulan Terakhir</option>
                <option value="6months">6 Bulan Terakhir</option>
                <option value="3months">3 Bulan Terakhir</option>
                <option value="1month">Bulan Ini</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
              <FiDownload size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Penjualan"
            value={`${totalPenjualan.toLocaleString()}`}
            subtitle="tCO₂e terjual"
            icon={FiTrendingUp}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            trend="up"
            trendValue="+12.5%"
          />
          <StatsCard
            title="Total Pembelian"
            value={`${totalPembelian.toLocaleString()}`}
            subtitle="tCO₂e dibeli"
            icon={FiTarget}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            trend="up"
            trendValue="+8.3%"
          />
          <StatsCard
            title="Total Revenue"
            value={`Rp ${(totalRevenue / 1000000).toFixed(1)}M`}
            subtitle="pendapatan kotor"
            icon={FiDollarSign}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="up"
            trendValue="+15.2%"
          />
          <StatsCard
            title="Rata-rata Growth"
            value={`${avgGrowth.toFixed(1)}%`}
            subtitle="pertumbuhan bulanan"
            icon={FiActivity}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={avgGrowth > 0 ? "up" : "down"}
            trendValue={`${Math.abs(avgGrowth).toFixed(1)}%`}
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100">
            <div className="flex px-6">
              {[
                { id: "overview", label: "Overview", icon: FiBarChart2 },
                { id: "trends", label: "Trends", icon: FiActivity },
                { id: "distribution", label: "Distribusi", icon: FiPieChart },
                { id: "performance", label: "Performance", icon: FiTarget },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
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
                      Penjualan vs Target
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartType("bar")}
                        className={`p-2 rounded-lg transition-colors ${
                          chartType === "bar"
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-gray-400 hover:text-emerald-600"
                        }`}
                      >
                        <FiBarChart2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    <Bar data={chartDataPenjualan} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Revenue Bulanan
                  </h3>
                  <div className="h-80">
                    <Bar data={revenueData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "trends" && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Trend Penjualan & Pembelian
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
                    Distribusi Penjualan
                  </h3>
                  <div className="h-80">
                    <Pie data={pieDataDistribusi} options={pieOptions} />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Performance Metrics
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dummyData.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.kategori.replace("Proyek ", "")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.penjualan} / {item.target} tCO₂e
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              item.growth > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.growth > 0 ? "+" : ""}
                            {item.growth.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">
                            {((item.penjualan / item.target) * 100).toFixed(0)}%
                            target
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
                  Detail Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Penjualan
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Target
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Achievement
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
                      {dummyData.map((item, index) => {
                        const achievement =
                          (item.penjualan / item.target) * 100;
                        const revenue = item.penjualan * item.harga;
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
                                Harga: Rp {(item.harga / 1000).toFixed(0)}k
                              </div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <div className="font-semibold text-gray-800 text-sm">
                                {item.penjualan}
                              </div>
                              <div className="text-xs text-gray-600">tCO₂e</div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <div className="text-gray-600 text-sm">
                                {item.target}
                              </div>
                              <div className="text-xs text-gray-600">tCO₂e</div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                                  achievement >= 100
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : achievement >= 80
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                                }`}
                              >
                                {achievement.toFixed(0)}%
                              </span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-medium ${
                                  item.growth > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {item.growth > 0 ? (
                                  <FiArrowUp size={10} />
                                ) : (
                                  <FiArrowDown size={10} />
                                )}
                                {Math.abs(item.growth).toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="font-semibold text-gray-800 text-sm">
                                Rp {(revenue / 1000000).toFixed(1)}M
                              </div>
                              <div className="text-xs text-gray-600">
                                {revenue.toLocaleString("id-ID")}
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
      </div>
    </div>
  );
};

export default Laporan;
