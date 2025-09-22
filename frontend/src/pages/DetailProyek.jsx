import { useParams } from 'react-router-dom';
import { useState } from 'react';

const dummyProyek = [
  {
    id: '1',
    nama: 'Pertanian Cerdas Berbasis IoT',
    lokasi: 'Yogyakarta, Indonesia',
    kategori: 'Agrikultur',
    harga: 'Rp 850.000',
    status: 'Aktif',
    gambar: 'https://www.linknet.id/files/photos/shares/article/iot-dalam-pertanian.jpg',
    deskripsi: 'Proyek ini berfokus pada implementasi IoT dalam bidang pertanian untuk meningkatkan efisiensi dan hasil panen.',
    periode: '2025-2027',
    volume: '120 ton/ha/tahun'
  },
  {
    id: '2',
    nama: 'Optimalisasi Irigasi Tetes',
    lokasi: 'Bandung, Indonesia',
    kategori: 'Agrikultur',
    harga: 'Rp 920.000',
    status: 'Nonaktif',
    gambar: 'https://msmbindonesia.com/wp-content/uploads/2025/01/Tumbnail-Website-1-1568x882.jpg',
    deskripsi: 'Mengoptimalkan irigasi tetes untuk menghemat air dan meningkatkan hasil pertanian.',
    periode: '2024-2026',
    volume: '75 liter/ha/hari'
  },
  {
    id: '3',
    nama: 'Pengolahan Kompos Organik',
    lokasi: 'Lampung, Indonesia',
    kategori: 'Agrikultur',
    harga: 'Rp 780.000',
    status: 'Nonaktif',
    gambar: 'https://asset.kompas.com/crops/K5gHn6ygApMwA4QZh0fPzY4s5qw=/33x0:877x563/1200x800/data/photo/2022/05/05/6273e4117abf4.jpg',
    deskripsi: 'Mengolah limbah organik menjadi kompos untuk pertanian berkelanjutan.',
    periode: '2023-2025',
    volume: '150 ton/tahun'
  },
];

const DetailProyek = () => {
  const { id } = useParams();
  const proyek = dummyProyek.find((item) => item.id === id);
  const [showPayment, setShowPayment] = useState(false); // State baru untuk menampilkan form pembayaran

  if (!proyek) {
    return <div className="p-10 text-red-500 text-xl">Proyek tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Kiri: Gambar, Status, dan Peta */}
      <div className="space-y-6">
        <img src={proyek.gambar} alt={proyek.nama} className="w-full h-64 object-cover rounded-xl shadow-md" />
        <div className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold 
          ${proyek.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          Status: {proyek.status}
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Lokasi Proyek</h4>
          <iframe
            title="Peta Lokasi"
            src={`https://www.google.com/maps?q=${encodeURIComponent(proyek.lokasi)}&output=embed`}
            className="w-full h-52 rounded-lg shadow"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Kanan: Detail dan Pembayaran */}
      <div>
        <h2 className="text-3xl font-bold text-[#1D3C34] mb-4">{proyek.nama}</h2>
        <p className="text-gray-700 mb-6">{proyek.deskripsi}</p>

        <h4 className="text-lg font-semibold text-gray-800 mb-2">Detail Proyek</h4>
        <div className="bg-white shadow rounded-lg p-4 border">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">ID Proyek:</span>
              <p>{proyek.id}</p>
            </div>
            <div>
              <span className="font-semibold">Kategori:</span>
              <p>{proyek.kategori}</p>
            </div>
            <div>
              <span className="font-semibold">Periode:</span>
              <p>{proyek.periode}</p>
            </div>
            <div>
              <span className="font-semibold">Volume:</span>
              <p>{proyek.volume}</p>
            </div>
            <div>
              <span className="font-semibold">Harga:</span>
              <p className="text-green-700 font-bold">{proyek.harga}</p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            className="bg-[#1D3C34] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-800 transition duration-300"
            onClick={() => setShowPayment(true)}
          >
            Beli Proyek
          </button>
          <a
            href="/marketplace"
            className="border border-[#1D3C34] text-[#1D3C34] px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition duration-300 text-center"
          >
            Kembali
          </a>
        </div>

        {/* Form Pembayaran */}
        {showPayment && (
          <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-[#1D3C34] mb-4">Pembayaran</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Pembayaran diproses melalui escrow."); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input type="text" required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input type="email" required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Jumlah Pembayaran</label>
                  <input type="text" value={proyek.harga} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Metode Pembayaran</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Transfer Bank</option>
                    <option>E-Wallet</option>
                    <option>Kartu Kredit</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-6 bg-[#1D3C34] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-800 transition duration-300">
                Bayar Sekarang
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProyek;