import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Setup Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const LaporanAnalisis = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('bulanini');
    const [selectedSektor, setSelectedSektor] = useState('semua');
    const [selectedJenisLaporan, setSelectedJenisLaporan] = useState('emisi');

    // Menu sidebar - sama dengan dashboard dan audit
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
            link: '/regulator-dashboard/laporan',
            active: true
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

    // Data untuk grafik tren emisi karbon (Line Chart)
    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Total Emisi (Ton CO2)',
                data: [2500, 2300, 2400, 2200, 2100, 1900, 1850, 1800, 1750, 1700, 1650, 1600],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Kredit Karbon Terdaftar (Ton)',
                data: [1200, 1300, 1400, 1450, 1500, 1550, 1600, 1620, 1680, 1700, 1750, 1800],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.3,
                fill: true
            }
        ]
    };

    // Data untuk grafik distribusi emisi per tipe perusahaan (Doughnut Chart)
    const tipePerusahaanData = {
        labels: [
            'Proyek Reforestasi',
            'Perusahaan Energi Terbarukan',
            'Industri Manufaktur Ramah Lingkungan',
            'Pengelola Limbah',
            'Perusahaan Teknologi Hijau',
            'Perusahaan Transportasi Rendah Emisi',
            'Perusahaan Offset Karbon',
            'Konsultan Lingkungan',
            'Perusahaan Agrikultur Berkelanjutan',
            'Proyek Konservasi Alam',
            'Pembangkit Listrik Non-Fosil',
            'Organisasi Non-Profit (Lingkungan)',
            'Perusahaan Konstruksi Hijau',
            'Pemerintah Daerah / Kota Hijau',
            'Developer Proyek Karbon Bersertifikat'
        ],
        datasets: [
            {
                label: 'Total Emisi (Ton CO2)',
                data: [300, 700, 450, 250, 400, 600, 500, 200, 350, 300, 650, 150, 400, 380, 550],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(255, 102, 255, 0.7)',
                    'rgba(102, 255, 178, 0.7)',
                    'rgba(255, 153, 153, 0.7)',
                    'rgba(153, 255, 204, 0.7)',
                    'rgba(255, 204, 102, 0.7)',
                    'rgba(102, 204, 255, 0.7)',
                    'rgba(204, 153, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 102, 255, 1)',
                    'rgba(102, 255, 178, 1)',
                    'rgba(255, 153, 153, 1)',
                    'rgba(153, 255, 204, 1)',
                    'rgba(255, 204, 102, 1)',
                    'rgba(102, 204, 255, 1)',
                    'rgba(204, 153, 255, 1)'
                ],
                borderWidth: 1
            }
        ]
    };


    // Data laporan emisi perusahaan
    const laporanEmisiPerusahaan = [
        {
            id: 1,
            nama: "Perusahaan A",
            sektor: "Energi",
            emisi: 1200,
            status: "Terverifikasi",
            tanggalLaporan: "2025-03-15",
            proyeksi: "Turun"
        },
        {
            id: 2,
            nama: "Perusahaan B",
            sektor: "Manufaktur",
            emisi: 850,
            status: "Terverifikasi",
            tanggalLaporan: "2025-04-02",
            proyeksi: "Stabil"
        },
        {
            id: 3,
            nama: "Perusahaan C",
            sektor: "Teknologi",
            emisi: 320,
            status: "Menunggu Verifikasi",
            tanggalLaporan: "2025-04-18",
            proyeksi: "Turun"
        },
        {
            id: 4,
            nama: "Perusahaan D",
            sektor: "Agrikultur",
            emisi: 760,
            status: "Terverifikasi",
            tanggalLaporan: "2025-03-20",
            proyeksi: "Naik"
        },
        {
            id: 5,
            nama: "Perusahaan E",
            sektor: "Energi",
            emisi: 950,
            status: "Ditolak",
            tanggalLaporan: "2025-03-28",
            proyeksi: "Stabil"
        }
    ];

    // Data transaksi kredit karbon
    const transaksiKreditKarbon = [
        {
            id: 1,
            penjual: "Perusahaan A",
            pembeli: "Pembeli X",
            jumlah: 120,
            harga: 25,
            total: 3000,
            tanggal: "2025-04-12",
            status: "Selesai"
        },
        {
            id: 2,
            penjual: "Perusahaan B",
            pembeli: "Pembeli Y",
            jumlah: 80,
            harga: 23,
            total: 1840,
            tanggal: "2025-04-15",
            status: "Selesai"
        },
        {
            id: 3,
            penjual: "Perusahaan D",
            pembeli: "Pembeli Z",
            jumlah: 150,
            harga: 24,
            total: 3600,
            tanggal: "2025-04-20",
            status: "Proses"
        },
        {
            id: 4,
            penjual: "Perusahaan A",
            pembeli: "Pembeli Y",
            jumlah: 90,
            harga: 26,
            total: 2340,
            tanggal: "2025-04-22",
            status: "Proses"
        }
    ];

    // Filter laporan berdasarkan sektor
    const filteredLaporan = laporanEmisiPerusahaan.filter(laporan => {
        return selectedSektor === 'semua' || laporan.sektor === selectedSektor;
    });

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - sama dengan dashboard dan audit */}
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
                            <h1 className="text-2xl font-bold text-[#1D3C34]">Laporan & Analisis</h1>
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

                {/* Konten Laporan */}
                <div className="p-6">
                    {/* Breadcrumb Navigation */}
                    <nav className="mb-6">
                        <ol className="flex text-sm">
                            <li className="flex items-center">
                                <Link to="/regulator-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                            </li>
                            <li className="text-gray-700">Laporan & Analisis</li>
                        </ol>
                    </nav>

                    {/* Judul Halaman dan Deskripsi */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Laporan & Analisis</h2>
                        <p className="text-gray-600 mt-2">Pantau dan analisis laporan emisi karbon dan transaksi kredit karbon</p>
                    </div>

                    {/* Filter dan Jenis Laporan */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-700 font-medium">Periode:</span>
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                    >
                                        <option value="bulanini">Bulan Ini</option>
                                        <option value="kuartal">Kuartal Ini</option>
                                        <option value="tahunini">Tahun Ini</option>
                                        <option value="semua">Semua</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-700 font-medium">Sektor:</span>
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={selectedSektor}
                                        onChange={(e) => setSelectedSektor(e.target.value)}
                                    >
                                        <option value="semua">Semua Sektor</option>
                                        <option value="Energi">Energi</option>
                                        <option value="Manufaktur">Manufaktur</option>
                                        <option value="Teknologi">Teknologi</option>
                                        <option value="Agrikultur">Agrikultur</option>
                                        <option value="Transportasi">Transportasi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 font-medium">Jenis Laporan:</span>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={selectedJenisLaporan}
                                    onChange={(e) => setSelectedJenisLaporan(e.target.value)}
                                >
                                    <option value="emisi">Laporan Emisi</option>
                                    <option value="transaksi">Transaksi Kredit Karbon</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <i className="fas fa-cloud text-blue-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm">Total Emisi</h3>
                                <p className="text-2xl font-bold">24,800 Ton</p>
                                <p className="text-sm text-green-600">
                                    <i className="fas fa-arrow-down"></i> 8.5% dari periode sebelumnya
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <i className="fas fa-leaf text-green-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm">Kredit Karbon Terdaftar</h3>
                                <p className="text-2xl font-bold">18,200 Ton</p>
                                <p className="text-sm text-green-600">
                                    <i className="fas fa-arrow-up"></i> 12.3% dari periode sebelumnya
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <i className="fas fa-exchange-alt text-purple-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm">Transaksi Selesai</h3>
                                <p className="text-2xl font-bold">42</p>
                                <p className="text-sm text-green-600">
                                    <i className="fas fa-arrow-up"></i> 5.2% dari periode sebelumnya
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <i className="fas fa-dollar-sign text-yellow-600 text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm">Nilai Transaksi</h3>
                                <p className="text-2xl font-bold">Rp 2.4 M</p>
                                <p className="text-sm text-green-600">
                                    <i className="fas fa-arrow-up"></i> 10.8% dari periode sebelumnya
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grafik dan Tabel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Tren Emisi Dan Kredit Karbon */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-xl text-gray-800">Tren Emisi & Kredit Karbon</h3>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-sm text-[#1D3C34] hover:bg-green-50 rounded">
                                        <i className="fas fa-download mr-1"></i> Unduh
                                    </button>
                                    <div className="text-gray-500 cursor-pointer hover:text-[#1D3C34]">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64">
                                <Line data={trendData} options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: false
                                        }
                                    }
                                }} />
                            </div>
                        </div>

                        {/* Distribusi Emisi Per Sektor */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-xl text-gray-800">Distribusi Emisi Per Sektor</h3>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-sm text-[#1D3C34] hover:bg-green-50 rounded">
                                        <i className="fas fa-download mr-1"></i> Unduh
                                    </button>
                                    <div className="text-gray-500 cursor-pointer hover:text-[#1D3C34]">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64 flex justify-center">
                                <div className="w-3/4">
                                    <Doughnut data={tipePerusahaanData} options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            }
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Laporan */}
                    {selectedJenisLaporan === 'emisi' ? (
                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-xl text-gray-800">Laporan Emisi Perusahaan</h3>
                                <div className="flex items-center space-x-3">
                                    <button className="flex items-center px-4 py-2 text-sm bg-[#1D3C34] text-white rounded-lg hover:bg-green-800 transition duration-300">
                                        <i className="fas fa-file-export mr-2"></i>
                                        Export Data
                                    </button>
                                    <Link to="/regulator-dashboard/laporan/emisi" className="text-[#1D3C34] hover:underline text-sm font-medium">
                                        Lihat Semua
                                    </Link>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sektor</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Emisi</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Laporan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyeksi</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredLaporan.map((laporan) => (
                                            <tr key={laporan.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap font-medium">{laporan.nama}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{laporan.sektor}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{laporan.emisi} Ton CO2</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{laporan.tanggalLaporan}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${laporan.status === 'Terverifikasi'
                                                            ? 'bg-green-100 text-green-800'
                                                            : laporan.status === 'Menunggu Verifikasi'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {laporan.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${laporan.proyeksi === 'Turun'
                                                            ? 'bg-green-100 text-green-800'
                                                            : laporan.proyeksi === 'Stabil'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {laporan.proyeksi === 'Turun' && <i className="fas fa-arrow-down mr-1"></i>}
                                                        {laporan.proyeksi === 'Stabil' && <i className="fas fa-minus mr-1"></i>}
                                                        {laporan.proyeksi === 'Naik' && <i className="fas fa-arrow-up mr-1"></i>}
                                                        {laporan.proyeksi}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <Link to={`/regulator-dashboard/laporan/emisi/${laporan.id}`} className="text-blue-500 hover:underline">
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredLaporan.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <i className="fas fa-search text-5xl"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600">Tidak Ada Data Laporan</h3>
                                    <p className="text-gray-500 mt-1">Tidak ada laporan emisi yang sesuai dengan kriteria filter.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-xl text-gray-800">Transaksi Kredit Karbon</h3>
                                <div className="flex items-center space-x-3">
                                    <button className="flex items-center px-4 py-2 text-sm bg-[#1D3C34] text-white rounded-lg hover:bg-green-800 transition duration-300">
                                        <i className="fas fa-file-export mr-2"></i>
                                        Export Data
                                    </button>
                                    <Link to="/regulator-dashboard/laporan/transaksi" className="text-[#1D3C34] hover:underline text-sm font-medium">
                                        Lihat Semua
                                    </Link>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transaksi</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembeli</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah (Ton)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga/Ton</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (Rp)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transaksiKreditKarbon.map((transaksi) => (
                                            <tr key={transaksi.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap">{transaksi.id}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{transaksi.penjual}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{transaksi.pembeli}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{transaksi.jumlah}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">Rp {transaksi.harga}K</td>
                                                <td className="px-4 py-4 whitespace-nowrap">Rp {transaksi.total}K</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{transaksi.tanggal}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${transaksi.status === 'Selesai'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {transaksi.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <Link to={`/regulator-dashboard/laporan/transaksi/${transaksi.id}`} className="text-blue-500 hover:underline">
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {transaksiKreditKarbon.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <i className="fas fa-exchange-alt text-5xl"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600">Tidak Ada Data Transaksi</h3>
                                    <p className="text-gray-500 mt-1">Tidak ada transaksi kredit karbon sesuai dengan kriteria filter.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analisis dan Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-xl text-gray-800 mb-3">Analisis Tren</h3>
                            <p className="text-gray-600 mb-4">Emisi karbon mengalami penurunan sebesar 8.5% dibandingkan periode sebelumnya, menunjukkan perbaikan signifikan dalam manajemen emisi.</p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Positif</span>
                                <span className="text-gray-500">Update terakhir: 23 Apr 2025</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-xl text-gray-800 mb-3">Proyeksi Kuartal</h3>
                            <p className="text-gray-600 mb-4">Proyeksi menunjukkan penurunan emisi sebesar 12% pada akhir kuartal, dengan peningkatan transaksi kredit karbon sebesar 15%.</p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Positif</span>
                                <span className="text-gray-500">Update terakhir: 20 Apr 2025</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-xl text-gray-800 mb-3">Perhatian Khusus</h3>
                            <p className="text-gray-600 mb-4">5 perusahaan belum melaporkan data emisi untuk bulan ini. 3 perusahaan menunjukkan peningkatan emisi lebih dari 10%.</p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Perlu Tindakan</span>
                                <span className="text-gray-500">Update terakhir: 22 Apr 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Rekomendasi */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                        <h3 className="font-semibold text-xl text-gray-800 mb-4">Rekomendasi</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <i className="fas fa-lightbulb text-blue-600"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">Verifikasi Laporan Tertunda</h4>
                                    <p className="text-gray-600">3 laporan emisi menunggu verifikasi lebih dari 7 hari. Disarankan untuk memprioritaskan proses verifikasi.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <i className="fas fa-lightbulb text-blue-600"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">Audit Sektor Energi</h4>
                                    <p className="text-gray-600">Sektor energi menunjukkan fluktuasi data. Disarankan untuk melakukan audit mendalam terhadap 2 perusahaan energi.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <i className="fas fa-lightbulb text-blue-600"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">Pantau Tren Harga Kredit Karbon</h4>
                                    <p className="text-gray-600">Harga kredit karbon mengalami kenaikan 5%. Disarankan untuk memantau tren dan memastikan transparansi pasar.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-gray-500 text-sm mt-12 pb-6">
                        <p>© 2025 PT LEDGRON. Semua hak dilindungi undang-undang.</p>
                        <div className="flex justify-center mt-2 space-x-4">
                            <a href="#bantuan" className="hover:text-[#1D3C34]">Bantuan</a>
                            <a href="#kebijakan-privasi" className="hover:text-[#1D3C34]">Kebijakan Privasi</a>
                            <a href="#syarat-ketentuan" className="hover:text-[#1D3C34]">Syarat & Ketentuan</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LaporanAnalisis;