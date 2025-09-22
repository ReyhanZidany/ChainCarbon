import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NotifikasiRegulator = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  
  // Menu sidebar - sama dengan dashboard, audit, dan laporan
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
      link: '/regulator-dashboard/notifikasi',
      active: true
    },
    { 
      id: 'pengaturan', 
      icon: 'fas fa-cog', 
      text: 'Pengaturan', 
      link: '/regulator-dashboard/pengaturan' 
    }
  ];

  // Data notifikasi pendaftaran akun
  const notifikasiPendaftaranAkun = [
    {
      id: 1,
      tipe: 'pendaftaran-akun',
      nama: 'PT Green Energy Solution',
      jenis: 'Perusahaan Penjual',
      tanggal: '2025-04-22',
      status: 'menunggu',
      dokumen: [
        { nama: 'Formulir Pendaftaran', url: '#' },
        { nama: 'Akta Pendirian', url: '#' }
      ],
      detail: 'Pengajuan pendaftaran sebagai perusahaan penjual kredit karbon'
    },
    {
      id: 2,
      tipe: 'pendaftaran-akun',
      nama: 'PT Sustainable Manufacturing',
      jenis: 'Perusahaan Penjual',
      tanggal: '2025-04-20',
      status: 'menunggu',
      dokumen: [
        { nama: 'Formulir Pendaftaran', url: '#' },
        { nama: 'Akta Pendirian', url: '#' }
      ],
      detail: 'Pengajuan pendaftaran sebagai perusahaan penjual kredit karbon'
    },
    {
      id: 3,
      tipe: 'pendaftaran-akun',
      nama: 'PT Carbon Trade Indonesia',
      jenis: 'Perantara Perdagangan',
      tanggal: '2025-04-18',
      status: 'disetujui',
      dokumen: [
        { nama: 'Formulir Pendaftaran', url: '#' },
        { nama: 'Akta Pendirian', url: '#' }
      ],
      detail: 'Pengajuan pendaftaran sebagai perantara perdagangan kredit karbon'
    },
    {
      id: 4,
      tipe: 'pendaftaran-akun',
      nama: 'PT Urban Development',
      jenis: 'Perusahaan Pembeli',
      tanggal: '2025-04-15',
      status: 'ditolak',
      dokumen: [
        { nama: 'Formulir Pendaftaran', url: '#' },
      ],
      detail: 'Pengajuan pendaftaran sebagai perusahaan pembeli kredit karbon',
      alasanPenolakan: 'Dokumen tidak lengkap. Akta pendirian perusahaan tidak disertakan.'
    }
  ];

  // Data notifikasi proyek
  const notifikasiProyek = [
    {
      id: 5,
      tipe: 'proyek',
      nama: 'Rehabilitasi Mangrove Kepulauan Seribu',
      perusahaan: 'PT Green Energy Solution',
      lokasi: 'Kepulauan Seribu, DKI Jakarta',
      tipeProyek: 'Restorasi Ekosistem',
      tanggal: '2025-04-23',
      status: 'menunggu',
      estimasiKredit: 5000,
      dokumen: [
        { nama: 'Proposal Proyek', url: '#' },
        { nama: 'Studi Kelayakan', url: '#' },
        { nama: 'Izin Lingkungan', url: '#' }
      ],
      detail: 'Proyek rehabilitasi 200 hektar mangrove di Kepulauan Seribu'
    },
    {
      id: 6,
      tipe: 'proyek',
      nama: 'PLTS Atap Gedung Industri',
      perusahaan: 'PT Sustainable Manufacturing',
      lokasi: 'Karawang, Jawa Barat',
      tipeProyek: 'Energi Terbarukan',
      tanggal: '2025-04-19',
      status: 'disetujui',
      estimasiKredit: 3200,
      dokumen: [
        { nama: 'Proposal Proyek', url: '#' },
        { nama: 'Studi Kelayakan', url: '#' },
        { nama: 'Izin Lingkungan', url: '#' }
      ],
      detail: 'Pembangunan PLTS atap di 15 gedung industri dengan total kapasitas 5 MW'
    },
    {
      id: 7,
      tipe: 'proyek',
      nama: 'Konversi Boiler Batubara ke Biomassa',
      perusahaan: 'PT Sustainable Manufacturing',
      lokasi: 'Bekasi, Jawa Barat',
      tipeProyek: 'Efisiensi Energi',
      tanggal: '2025-04-17',
      status: 'ditolak',
      estimasiKredit: 2800,
      dokumen: [
        { nama: 'Proposal Proyek', url: '#' },
        { nama: 'Studi Kelayakan', url: '#' }
      ],
      detail: 'Konversi 8 boiler berbahan bakar batubara ke biomassa',
      alasanPenolakan: 'Data pengurangan emisi tidak didukung metodologi yang valid. Sumber biomassa tidak terverifikasi keberlanjutannya.'
    }
  ];

  // Data notifikasi retirement unit karbon
  const notifikasiRetirement = [
    {
      id: 8,
      tipe: 'retirement',
      nama: 'Retirement Unit Karbon - Program CSR',
      perusahaan: 'PT Indonesia Consumer Goods',
      tanggal: '2025-04-24',
      status: 'menunggu',
      jumlahUnit: 1200,
      proyekSumber: 'PLTS Atap Gedung Industri',
      dokumen: [
        { nama: 'Formulir Retirement', url: '#' },
        { nama: 'Bukti Kepemilikan Unit', url: '#' }
      ],
      detail: 'Retirement unit karbon untuk program CSR "Indonesia Hijau 2025"'
    },
    {
      id: 9,
      tipe: 'retirement',
      nama: 'Retirement Unit Karbon - Offset Emisi 2024',
      perusahaan: 'PT Tech Inovasi',
      tanggal: '2025-04-22',
      status: 'disetujui',
      jumlahUnit: 850,
      proyekSumber: 'Rehabilitasi Mangrove Kepulauan Seribu',
      dokumen: [
        { nama: 'Formulir Retirement', url: '#' },
        { nama: 'Bukti Kepemilikan Unit', url: '#' },
        { nama: 'Laporan Emisi 2024', url: '#' }
      ],
      detail: 'Retirement unit karbon untuk offset emisi operasional tahun 2024'
    },
    {
      id: 10,
      tipe: 'retirement',
      nama: 'Retirement Unit Karbon - Program Net Zero',
      perusahaan: 'PT Retail Indonesia',
      tanggal: '2025-04-20',
      status: 'ditolak',
      jumlahUnit: 2000,
      proyekSumber: 'Mixed',
      dokumen: [
        { nama: 'Formulir Retirement', url: '#' },
        { nama: 'Bukti Kepemilikan Unit', url: '#' }
      ],
      detail: 'Retirement unit karbon untuk program Net Zero 2030',
      alasanPenolakan: 'Bukti kepemilikan unit tidak mencukupi untuk jumlah yang diajukan. Mohon verifikasi ulang kepemilikan.'
    }
  ];

  // Menggabungkan semua notifikasi
  const semuaNotifikasi = [...notifikasiPendaftaranAkun, ...notifikasiProyek, ...notifikasiRetirement];

  // Filter notifikasi berdasarkan tab aktif dan status
  const filterNotifikasi = (notifikasi) => {
    // Filter berdasarkan tab aktif
    const filteredByTab = activeTab === 'semua' 
      ? notifikasi 
      : notifikasi.filter(item => item.tipe === activeTab);
    
    // Filter berdasarkan status
    return selectedStatus === 'semua' 
      ? filteredByTab 
      : filteredByTab.filter(item => item.status === selectedStatus);
  };

  // Hitung jumlah notifikasi per kategori
  const countNotifikasi = (type) => {
    if (type === 'semua') return semuaNotifikasi.length;
    return semuaNotifikasi.filter(item => item.tipe === type).length;
  };

  // Function untuk mengubah status notifikasi
  const handleStatusChange = (id, newStatus) => {
    // Implementasi sebenarnya akan mengirim request ke API
    // Untuk demo, kita akan melakukan log saja
    console.log(`Mengubah status notifikasi ${id} menjadi ${newStatus}`);
    alert(`Status notifikasi ${id} berhasil diubah menjadi ${newStatus}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - sama dengan dashboard, audit, dan laporan */}
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
                {item.active && item.id === 'notifikasi' && (
                  <div className={`ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {semuaNotifikasi.filter(n => n.status === 'menunggu').length}
                  </div>
                )}
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
              <h1 className="text-2xl font-bold text-[#1D3C34]">Notifikasi</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fas fa-bell text-gray-600 cursor-pointer hover:text-[#1D3C34] transition"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {semuaNotifikasi.filter(n => n.status === 'menunggu').length}
                </span>
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

        {/* Konten Notifikasi */}
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <ol className="flex text-sm">
              <li className="flex items-center">
                <Link to="/regulator-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              </li>
              <li className="text-gray-700">Notifikasi</li>
            </ol>
          </nav>

          {/* Judul Halaman dan Deskripsi */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Notifikasi & Verifikasi</h2>
            <p className="text-gray-600 mt-2">Kelola dan verifikasi permohonan pendaftaran, proyek, dan retirement unit karbon</p>
          </div>

          {/* Tab Navigasi dan Filter */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'semua' ? 'text-[#1D3C34] border-b-2 border-[#1D3C34]' : 'text-gray-500 hover:text-[#1D3C34]'}`}
                  onClick={() => setActiveTab('semua')}
                >
                  Semua
                  <span className="ml-2 bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {countNotifikasi('semua')}
                  </span>
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'pendaftaran-akun' ? 'text-[#1D3C34] border-b-2 border-[#1D3C34]' : 'text-gray-500 hover:text-[#1D3C34]'}`}
                  onClick={() => setActiveTab('pendaftaran-akun')}
                >
                  Pendaftaran Akun
                  <span className="ml-2 bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {countNotifikasi('pendaftaran-akun')}
                  </span>
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'proyek' ? 'text-[#1D3C34] border-b-2 border-[#1D3C34]' : 'text-gray-500 hover:text-[#1D3C34]'}`}
                  onClick={() => setActiveTab('proyek')}
                >
                  Proyek Karbon
                  <span className="ml-2 bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {countNotifikasi('proyek')}
                  </span>
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'retirement' ? 'text-[#1D3C34] border-b-2 border-[#1D3C34]' : 'text-gray-500 hover:text-[#1D3C34]'}`}
                  onClick={() => setActiveTab('retirement')}
                >
                  Retirement Unit
                  <span className="ml-2 bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {countNotifikasi('retirement')}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Filter status */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Filter Status:</span>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="semua">Semua Status</option>
                  <option value="menunggu">Menunggu Verifikasi</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
              <div className="flex items-center">
                <button className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200 transition mr-2">
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh
                </button>
                <button className="bg-[#1D3C34] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition">
                  <i className="fas fa-file-export mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Item Notifikasi */}
          <div className="space-y-4 mb-8">
            {filterNotifikasi(semuaNotifikasi).length > 0 ? (
              filterNotifikasi(semuaNotifikasi).map((notifikasi) => (
                <div key={notifikasi.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Header Notifikasi - Warna berbeda sesuai status */}
                  <div className={`px-6 py-4 flex items-center justify-between ${
                    notifikasi.status === 'menunggu' 
                      ? 'bg-yellow-50 border-l-4 border-yellow-400' 
                      : notifikasi.status === 'disetujui'
                        ? 'bg-green-50 border-l-4 border-green-400'
                        : 'bg-red-50 border-l-4 border-red-400'
                  }`}>
                    <div className="flex items-center">
                      {/* Icon sesuai tipe notifikasi */}
                      <div className={`rounded-full p-2 mr-4 ${
                        notifikasi.tipe === 'pendaftaran-akun' 
                          ? 'bg-blue-100 text-blue-600' 
                          : notifikasi.tipe === 'proyek'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-green-100 text-green-600'
                      }`}>
                        {notifikasi.tipe === 'pendaftaran-akun' && <i className="fas fa-user-plus text-lg"></i>}
                        {notifikasi.tipe === 'proyek' && <i className="fas fa-project-diagram text-lg"></i>}
                        {notifikasi.tipe === 'retirement' && <i className="fas fa-leaf text-lg"></i>}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{notifikasi.nama}</h3>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">
                            {notifikasi.tipe === 'pendaftaran-akun' && `${notifikasi.jenis}`}
                            {notifikasi.tipe === 'proyek' && `${notifikasi.perusahaan} • ${notifikasi.tipeProyek}`}
                            {notifikasi.tipe === 'retirement' && `${notifikasi.perusahaan} • ${notifikasi.jumlahUnit} Unit`}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{notifikasi.tanggal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notifikasi.status === 'menunggu' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : notifikasi.status === 'disetujui'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {notifikasi.status === 'menunggu' && 'Menunggu Verifikasi'}
                        {notifikasi.status === 'disetujui' && 'Disetujui'}
                        {notifikasi.status === 'ditolak' && 'Ditolak'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Konten Notifikasi */}
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Kolom Kiri - Detail */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Detail</h4>
                          <p className="text-gray-700">{notifikasi.detail}</p>
                        </div>
                        
                        {/* Tambahan detail sesuai tipe */}
                        {notifikasi.tipe === 'proyek' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Lokasi</h4>
                                <p className="text-gray-700">{notifikasi.lokasi}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Estimasi Kredit</h4>
                                <p className="text-gray-700">{notifikasi.estimasiKredit} Ton CO2e</p>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {notifikasi.tipe === 'retirement' && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Proyek Sumber</h4>
                            <p className="text-gray-700">{notifikasi.proyekSumber}</p>
                          </div>
                        )}
                        
                        {/* Alasan Penolakan jika ditolak */}
                        {notifikasi.status === 'ditolak' && (
                          <div className="bg-red-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-red-800 mb-1">Alasan Penolakan</h4>
                            <p className="text-red-700 text-sm">{notifikasi.alasanPenolakan}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Kolom Kanan - Dokumen dan Aksi */}
                      <div className="space-y-4">
                        {/* Dokumen */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Dokumen</h4>
                          <div className="space-y-2">
                            {notifikasi.dokumen.map((doc, index) => (
                              <a 
                                key={index}
                                href={doc.url}
                                className="flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                              >
                                <i className="fas fa-file-alt text-gray-500 mr-2"></i>
                                <span className="text-sm text-blue-600">{doc.nama}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                        
                        {/* Tombol Aksi */}
                        {notifikasi.status === 'menunggu' && (
                          <div className="flex flex-col space-y-2">
                            <button 
                              onClick={() => handleStatusChange(notifikasi.id, 'disetujui')}
                              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
                            >
                              <i className="fas fa-check mr-2"></i>
                              Setujui
                            </button>
                            <button 
                              onClick={() => handleStatusChange(notifikasi.id, 'ditolak')}
                              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition flex items-center justify-center"
                            >
                              <i className="fas fa-times mr-2"></i>
                              Tolak
                            </button>
                            <button 
                              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                            >
                              <i className="fas fa-info-circle mr-2"></i>
                              Minta Info
                            </button>
                          </div>
                        )}
                        
                        {/* Tombol Detail (untuk status selain menunggu) */}
                        {notifikasi.status !== 'menunggu' && (
                          <Link to={`/regulator-dashboard/notifikasi/${notifikasi.id}`} className="block w-full">
                            <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center justify-center">
                              <i className="fas fa-eye mr-2"></i>
                              Lihat Detail
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <i className="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak Ada Notifikasi</h3>
                  <p className="text-gray-500">
                    Tidak ada notifikasi yang sesuai dengan filter yang dipilih
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-4">
            <div className="text-sm text-gray-500">
              Menampilkan {filterNotifikasi(semuaNotifikasi).length} dari {filterNotifikasi(semuaNotifikasi).length} notifikasi
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-2 bg-[#1D3C34] text-white rounded-md">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50" disabled>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal untuk minta info tambahan - bisa ditambahkan di sini */}
      {/* Modal akan muncul ketika tombol "Minta Info" ditekan */}
      {/* 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Minta Informasi Tambahan</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Pesan</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Masukkan pesan untuk pemohon..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Batal
            </button>
            <button className="px-4 py-2 bg-[#1D3C34] text-white rounded-md hover:bg-green-700">
              Kirim Permintaan
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default NotifikasiRegulator;