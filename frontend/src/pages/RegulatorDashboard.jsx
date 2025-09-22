import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Setup Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RegulatorDashboard = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  // Contoh data untuk Perusahaan Emiten, Pembeli, dan Transaksi
  const perusahaanEmiten = [
    { id: 1, nama: "Perusahaan A", sektor: "Energi", status: "Aktif" },
    { id: 2, nama: "Perusahaan B", sektor: "Manufaktur", status: "Aktif" },
    { id: 3, nama: "Perusahaan C", sektor: "Teknologi", status: "Non-Aktif" }
  ];

  const perusahaanPembeli = [
    { id: 1, nama: "Pembeli X", sektor: "Konstruksi", status: "Aktif" },
    { id: 2, nama: "Pembeli Y", sektor: "Agrikultur", status: "Aktif" }
  ];

  const transaksiRealTime = [
    { id: 1, perusahaan: "Perusahaan A", jumlah: 100, status: "Berhasil" },
    { id: 2, perusahaan: "Perusahaan B", jumlah: 50, status: "Menunggu" }
  ];

  // Statistik Laporan
  const statistikLaporan = {
    totalPerusahaanEmiten: perusahaanEmiten.length,
    totalPerusahaanPembeli: perusahaanPembeli.length,
    totalTransaksiBerhasil: transaksiRealTime.filter(t => t.status === 'Berhasil').length,
    totalTransaksiMenunggu: transaksiRealTime.filter(t => t.status === 'Menunggu').length
  };

  // Data untuk grafik statistik laporan
  const chartData = {
    labels: ['Perusahaan Penjual', 'Perusahaan Pembeli', 'Transaksi Berhasil', 'Transaksi Menunggu'],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          statistikLaporan.totalPerusahaanEmiten,
          statistikLaporan.totalPerusahaanPembeli,
          statistikLaporan.totalTransaksiBerhasil,
          statistikLaporan.totalTransaksiMenunggu
        ],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(46, 204, 113, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(241, 196, 15, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Menu sidebar
  const sidebarMenu = [
    { 
      id: 'dashboard', 
      icon: 'fas fa-tachometer-alt', 
      text: 'Dashboard', 
      link: '/regulator-dashboard' 
    },
    { 
      id: 'audit', 
      icon: 'fas fa-search', 
      text: 'Audit & Inspeksi', 
      link: '/regulator-dashboard/audit' 
    },
    { 
      id: 'laporan', 
      icon: 'fas fa-chart-line', 
      text: 'Laporan & Analisis', 
      link: '/regulator-dashboard/laporan' 
    },
    { 
      id: 'notifikasi', 
      icon: 'fas fa-bell', 
      text: 'Notifikasi', 
      link: '/regulator-dashboard/notifikasi' 
    },
    { 
      id: 'pengaturan', 
      icon: 'fas fa-cog', 
      text: 'Pengaturan', 
      link: '/regulator-dashboard/pengaturan' 
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-[#1D3C34] text-white transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-20'} h-full`} 
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo dan Judul */}
        <div className="flex items-center justify-center py-6 border-b border-green-700">
          <i className="fas fa-leaf text-2xl text-green-400"></i>
          <h2 className={`ml-3 font-bold text-xl transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            PT LEDGRON
          </h2>
        </div>

        {/* Menu Items */}
        <div className="mt-8">
          {sidebarMenu.map((item) => (
            <Link to={item.link} key={item.id}>
              <div className="flex items-center px-6 py-4 hover:bg-green-800 transition duration-200 cursor-pointer">
                <div className={`flex items-center justify-center ${isSidebarExpanded ? 'w-8' : 'w-full'}`}>
                  <i className={`${item.icon} text-xl text-green-300`}></i>
                </div>
                <span className={`ml-4 transition-opacity duration-300 whitespace-nowrap ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.text}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout at bottom */}
        <div className="absolute bottom-0 w-full border-t border-green-700">
          <Link to="/logout">
            <div className="flex items-center px-6 py-4 hover:bg-green-800 transition duration-200 cursor-pointer">
              <div className={`flex items-center justify-center ${isSidebarExpanded ? 'w-8' : 'w-full'}`}>
                <i className="fas fa-sign-out-alt text-xl text-green-300"></i>
              </div>
              <span className={`ml-4 transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Keluar
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1D3C34]">Dashboard Regulator</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fas fa-bell text-gray-600 cursor-pointer hover:text-[#1D3C34] transition"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#1D3C34] rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user"></i>
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <i className="fas fa-building text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Perusahaan Penjual</h3>
                <p className="text-2xl font-bold">{statistikLaporan.totalPerusahaanEmiten}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <i className="fas fa-store text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Perusahaan Pembeli</h3>
                <p className="text-2xl font-bold">{statistikLaporan.totalPerusahaanPembeli}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <i className="fas fa-check-circle text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Transaksi Berhasil</h3>
                <p className="text-2xl font-bold">{statistikLaporan.totalTransaksiBerhasil}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Transaksi Menunggu</h3>
                <p className="text-2xl font-bold">{statistikLaporan.totalTransaksiMenunggu}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Grafik Statistik Laporan */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-800">Statistik Laporan</h3>
                <div className="text-gray-500 cursor-pointer hover:text-[#1D3C34]">
                  <i className="fas fa-ellipsis-v"></i>
                </div>
              </div>
              <div className="h-64">
                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Transaksi Real-time */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-800">Transaksi Real-time</h3>
                <Link to="/regulator-dashboard/transaksi" className="text-[#1D3C34] hover:underline text-sm font-medium">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transaksiRealTime.map((transaksi) => (
                      <tr key={transaksi.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">{transaksi.perusahaan}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{transaksi.jumlah} Ton</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaksi.status === 'Berhasil' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaksi.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link to={`/regulator-dashboard/transaksi/${transaksi.id}`} className="text-blue-500 hover:underline">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Daftar Perusahaan */}
          <div className="grid grid-cols-1 gap-6">
            {/* Daftar Perusahaan Emiten */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-800">Daftar Perusahaan Penjual</h3>
                <Link to="/regulator-dashboard/perusahaan" className="text-[#1D3C34] hover:underline text-sm font-medium">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sektor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {perusahaanEmiten.map((perusahaan) => (
                      <tr key={perusahaan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">{perusahaan.nama}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{perusahaan.sektor}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            perusahaan.status === 'Aktif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {perusahaan.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link to={`/regulator-dashboard/audit/${perusahaan.id}`} className="text-blue-500 hover:underline">
                            Audit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Cepat */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/regulator-dashboard/audit"
              className="bg-[#1D3C34] text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition duration-300 flex items-center"
            >
              <i className="fas fa-search mr-2"></i>
              Audit Perusahaan
            </Link>
            <Link
              to="/regulator-dashboard/laporan"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300 flex items-center"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Lihat Laporan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;