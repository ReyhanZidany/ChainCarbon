import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AuditPerusahaan = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Data perusahaan yang tersedia untuk diaudit
  const [perusahaan, setPerusahaan] = useState([
    { 
      id: 1, 
      nama: "Perusahaan A", 
      sektor: "Energi", 
      status: "Aktif",
      tanggalRegistrasi: "2024-01-12",
      jumlahProyek: 8,
      kreditKarbon: 500,
      lastAudit: "2024-03-15",
      risiko: "Rendah"
    },
    { 
      id: 2, 
      nama: "Perusahaan B", 
      sektor: "Manufaktur", 
      status: "Aktif",
      tanggalRegistrasi: "2023-09-24",
      jumlahProyek: 12,
      kreditKarbon: 750,
      lastAudit: "2024-02-20",
      risiko: "Sedang"
    },
    { 
      id: 3, 
      nama: "Perusahaan C", 
      sektor: "Teknologi", 
      status: "Non-Aktif",
      tanggalRegistrasi: "2023-11-03",
      jumlahProyek: 3,
      kreditKarbon: 120,
      lastAudit: "2023-12-10",
      risiko: "Tinggi"
    },
    { 
      id: 4, 
      nama: "Perusahaan D", 
      sektor: "Agrikultur", 
      status: "Aktif",
      tanggalRegistrasi: "2023-08-15",
      jumlahProyek: 15,
      kreditKarbon: 1200,
      lastAudit: "2024-01-08",
      risiko: "Rendah"
    },
    { 
      id: 5, 
      nama: "Perusahaan E", 
      sektor: "Energi", 
      status: "Aktif",
      tanggalRegistrasi: "2024-02-28",
      jumlahProyek: 5,
      kreditKarbon: 320,
      lastAudit: "Belum Diaudit",
      risiko: "Sedang"
    }
  ]);

  // Menu sidebar - sama dengan dashboard
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
      link: '/regulator-dashboard/audit',
      active: true
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

  // Filter perusahaan berdasarkan status dan query pencarian
  const filteredPerusahaan = perusahaan.filter(p => {
    const matchStatus = selectedFilter === 'semua' || 
                      (selectedFilter === 'aktif' && p.status === 'Aktif') ||
                      (selectedFilter === 'nonaktif' && p.status === 'Non-Aktif') ||
                      (selectedFilter === 'belumdiaudit' && p.lastAudit === 'Belum Diaudit');
    
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.sektor.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchStatus && matchSearch;
  });

  // Fungsi untuk memulai audit pada perusahaan yang dipilih
  const handleStartAudit = (id) => {
    navigate(`/regulator-dashboard/audit/${id}/detail`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - sama dengan dashboard */}
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
              <div className={`flex items-center px-6 py-4 hover:bg-green-800 transition duration-200 cursor-pointer ${item.active ? 'bg-green-800' : ''}`}>
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
            <div className="flex items-center">
              <Link to="/regulator-dashboard" className="text-gray-500 hover:text-[#1D3C34] mr-2">
                <i className="fas fa-arrow-left"></i>
              </Link>
              <h1 className="text-2xl font-bold text-[#1D3C34]">Audit Perusahaan</h1>
            </div>
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

        {/* Konten Audit */}
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <ol className="flex text-sm">
              <li className="flex items-center">
                <Link to="/regulator-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              </li>
              <li className="text-gray-700">Audit Perusahaan</li>
            </ol>
          </nav>

          {/* Judul Halaman dan Deskripsi */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Audit Perusahaan</h2>
            <p className="text-gray-600 mt-2">Lakukan audit dan inspeksi terhadap perusahaan penjual dan pembeli kredit karbon</p>
          </div>

          {/* Filter dan Pencarian */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Filter:</span>
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="semua">Semua</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-Aktif</option>
                    <option value="belumdiaudit">Belum Diaudit</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Periode:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="semua">Semua</option>
                    <option value="tahunini">Tahun Ini</option>
                    <option value="bulanlalu">Bulan Lalu</option>
                    <option value="6bulanlalu">6 Bulan Terakhir</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari perusahaan..."
                  className="border border-gray-300 rounded-md px-4 py-2 pl-10 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Daftar Perusahaan untuk Audit */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Perusahaan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sektor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Proyek</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kredit Karbon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Terakhir</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Risiko</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPerusahaan.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap font-medium">{p.nama}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{p.sektor}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          p.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{p.jumlahProyek}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{p.kreditKarbon} Ton</td>
                      <td className="px-4 py-4 whitespace-nowrap">{p.lastAudit}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          p.risiko === 'Rendah' 
                            ? 'bg-green-100 text-green-800' 
                            : p.risiko === 'Sedang'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {p.risiko}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleStartAudit(p.id)}
                          className="bg-[#1D3C34] text-white px-3 py-1 rounded hover:bg-green-800 transition duration-200"
                        >
                          Mulai Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPerusahaan.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <i className="fas fa-search text-5xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-600">Tidak Ada Data Perusahaan</h3>
                <p className="text-gray-500 mt-1">Tidak ada perusahaan yang sesuai dengan kriteria pencarian.</p>
              </div>
            )}
          </div>

          {/* Ringkasan Statistik Audit */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Ringkasan Audit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-clipboard-check text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-500 text-sm">Total Audit Bulan Ini</h4>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-500 text-sm">Audit Selesai</h4>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fas fa-clock text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-500 text-sm">Audit Tertunda</h4>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jadwal Audit Mendatang */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl text-gray-800">Jadwal Audit Mendatang</h3>
              <Link to="/regulator-dashboard/audit/jadwal" className="text-[#1D3C34] hover:underline text-sm font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap font-medium">Perusahaan D</td>
                    <td className="px-4 py-4 whitespace-nowrap">28 April 2025</td>
                    <td className="px-4 py-4 whitespace-nowrap">Ahmad Rizki</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap font-medium">Perusahaan E</td>
                    <td className="px-4 py-4 whitespace-nowrap">5 Mei 2025</td>
                    <td className="px-4 py-4 whitespace-nowrap">Siti Nurhayati</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Persiapan</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap font-medium">Perusahaan A</td>
                    <td className="px-4 py-4 whitespace-nowrap">15 Mei 2025</td>
                    <td className="px-4 py-4 whitespace-nowrap">Budi Santoso</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPerusahaan;