// import { useParams } from 'react-router-dom';
import { useState } from "react";
import {
  MapPin,
  Calendar,
  Package,
  Tag,
  CheckCircle,
  XCircle,
  ArrowLeft,
  CreditCard,
  Shield,
  Leaf,
} from "lucide-react";

const dummyProyek = [
  {
    id: "1",
    nama: "Pertanian Cerdas Berbasis IoT",
    lokasi: "Yogyakarta, Indonesia",
    kategori: "Agrikultur",
    harga: "Rp 850.000",
    status: "Aktif",
    gambar:
      "https://www.linknet.id/files/photos/shares/article/iot-dalam-pertanian.jpg",
    deskripsi:
      "Proyek ini berfokus pada implementasi IoT dalam bidang pertanian untuk meningkatkan efisiensi dan hasil panen dengan teknologi sensor modern dan analitik data real-time.",
    periode: "2025-2027",
    volume: "120 ton/ha/tahun",
    roi: "15-20%",
    minInvestasi: "Rp 100.000",
    investor: 247,
    progress: 75,
  },
  {
    id: "2",
    nama: "Optimalisasi Irigasi Tetes",
    lokasi: "Bandung, Indonesia",
    kategori: "Agrikultur",
    harga: "Rp 920.000",
    status: "Nonaktif",
    gambar:
      "https://msmbindonesia.com/wp-content/uploads/2025/01/Tumbnail-Website-1-1568x882.jpg",
    deskripsi:
      "Mengoptimalkan irigasi tetes untuk menghemat air dan meningkatkan hasil pertanian.",
    periode: "2024-2026",
    volume: "75 liter/ha/hari",
    roi: "12-18%",
    minInvestasi: "Rp 150.000",
    investor: 189,
    progress: 45,
  },
  {
    id: "3",
    nama: "Pengolahan Kompos Organik",
    lokasi: "Lampung, Indonesia",
    kategori: "Agrikultur",
    harga: "Rp 780.000",
    status: "Nonaktif",
    gambar:
      "https://asset.kompas.com/crops/K5gHn6ygApMwA4QZh0fPzY4s5qw=/33x0:877x563/1200x800/data/photo/2022/05/05/6273e4117abf4.jpg",
    deskripsi:
      "Mengolah limbah organik menjadi kompos untuk pertanian berkelanjutan.",
    periode: "2023-2025",
    volume: "150 ton/tahun",
    roi: "10-15%",
    minInvestasi: "Rp 75.000",
    investor: 156,
    progress: 30,
  },
];

const DetailProyek = () => {
  // const { id } = useParams();
  const id = "1"; // Demo dengan ID 1
  const proyek = dummyProyek.find((item) => item.id === id);
  const [showPayment, setShowPayment] = useState(false);

  if (!proyek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Proyek Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Proyek yang Anda cari tidak tersedia.
          </p>
          <a
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header dengan breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a
              href="/marketplace"
              className="hover:text-green-600 transition-colors"
            >
              Marketplace
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{proyek.nama}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Gambar dan Info Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={proyek.gambar}
                alt={proyek.nama}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md
                  ${
                    proyek.status === "Aktif"
                      ? "bg-green-100/90 text-green-700 border border-green-200"
                      : "bg-red-100/90 text-red-600 border border-red-200"
                  }`}
                >
                  {proyek.status === "Aktif" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {proyek.status}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200">
                  <div className="flex items-center gap-1 text-green-700">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm font-semibold">Eco-Friendly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Judul dan Deskripsi */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent mb-4">
                {proyek.nama}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {proyek.deskripsi}
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress Funding
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {proyek.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${proyek.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-700">
                    {proyek.investor}
                  </div>
                  <div className="text-sm text-gray-600">Investor</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">
                    {proyek.roi}
                  </div>
                  <div className="text-sm text-gray-600">ROI Estimasi</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-700">
                    {proyek.minInvestasi}
                  </div>
                  <div className="text-sm text-gray-600">Min. Investasi</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">
                    {proyek.volume}
                  </div>
                  <div className="text-sm text-gray-600">Target Volume</div>
                </div>
              </div>
            </div>

            {/* Detail Proyek */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Detail Proyek
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      ID Proyek
                    </span>
                    <span className="text-gray-800 font-semibold">
                      #{proyek.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Kategori
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {proyek.kategori}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Periode
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {proyek.periode}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Lokasi
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {proyek.lokasi}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Lokasi Proyek
              </h3>
              <div className="rounded-xl overflow-hidden shadow-md">
                <iframe
                  title="Peta Lokasi"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    proyek.lokasi
                  )}&output=embed`}
                  className="w-full h-64"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Sidebar */}
          <div className="space-y-6">
            {/* Kartu Harga */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {proyek.harga}
                </div>
                <div className="text-sm text-gray-600">Total Nilai Proyek</div>
              </div>

              {/* Tombol Utama */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Investasi Sekarang
                </button>
                <a
                  href="/marketplace"
                  className="w-full border-2 border-green-600 text-green-600 py-4 rounded-xl font-semibold hover:bg-green-50 transition duration-300 text-center block flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Marketplace
                </a>
              </div>

              {/* Keamanan */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Investasi Aman dengan Escrow</span>
                </div>
              </div>
            </div>

            {/* Keuntungan Investasi */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
              <h4 className="font-bold text-gray-800 mb-4">
                Mengapa Investasi di Proyek Ini?
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>ROI kompetitif {proyek.roi} per tahun</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Teknologi modern dan berkelanjutan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dampak positif untuk lingkungan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Transparansi dan monitoring real-time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Pembayaran Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                    Investasi Proyek
                  </h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    "Investasi berhasil diproses! Dana akan diamankan melalui sistem escrow."
                  );
                  setShowPayment(false);
                }}
                className="p-6"
              >
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Detail Investasi
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Proyek:</strong> {proyek.nama}
                    </p>
                    <p>
                      <strong>Minimum Investasi:</strong> {proyek.minInvestasi}
                    </p>
                    <p>
                      <strong>Nilai Total:</strong> {proyek.harga}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Jumlah Investasi
                    </label>
                    <input
                      type="text"
                      placeholder={proyek.minInvestasi}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Metode Pembayaran
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors">
                      <option>Transfer Bank</option>
                      <option>E-Wallet (OVO, GoPay, Dana)</option>
                      <option>Kartu Kredit/Debit</option>
                      <option>Virtual Account</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Perlindungan Escrow</p>
                      <p>
                        Dana investasi Anda akan diamankan melalui sistem escrow
                        hingga milestone proyek tercapai.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        "Investasi berhasil diproses! Dana akan diamankan melalui sistem escrow."
                      );
                      setShowPayment(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                  >
                    Konfirmasi Investasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProyek;
