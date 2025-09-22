import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const dummyProyekSaya = [
    {
        id: '1',
        nama: 'Pertanian Cerdas Berbasis IoT',
        status: 'Aktif',
        lokasi: 'Yogyakarta',
        periode: '2025-2027',
        harga: '850000',
        volume: '100',
        deskripsi: 'Proyek ini bertujuan untuk meningkatkan efisiensi pertanian dengan teknologi IoT.',
        gambar: 'https://www.linknet.id/files/photos/shares/article/iot-dalam-pertanian.jpg',
        kategori: 'Agrikultur',
        userId: 'USR123456',
        sertifikatOffsetId: 'SERTIF98765',
        dokumenId: 'DOC456789',
        createdAt: '2025-01-01',
        proofOfOwnership: 'https://example.com/sertifikat-ownership.pdf',
        ownershipHash: 'OWNHASH1234567890ABCDEF',
    },
    {
        id: '2',
        nama: 'Optimalisasi Irigasi Tetes',
        status: 'Nonaktif',
        lokasi: 'Bandung',
        periode: '2024-2026',
        harga: '950000',
        volume: '80',
        deskripsi: 'Mengoptimalkan penggunaan air dengan irigasi tetes.',
        gambar: 'https://msmbindonesia.com/wp-content/uploads/2025/01/Tumbnail-Website-1-1568x882.jpg',
        kategori: 'Agrikultur',
        userId: 'USR123457',
        sertifikatOffsetId: 'SERTIF12345',
        dokumenId: 'DOC987654',
        createdAt: '2025-02-15',
        proofOfOwnership: 'https://example.com/sertifikat-ownership.pdf',
        ownershipHash: 'OWNHASH1234567890ABCDEF',
    },
];

const DetailProyekSaya = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const proyekAwal = dummyProyekSaya.find((p) => p.id === id);
    const [proyek, setProyek] = useState(proyekAwal);
    const [tampilkanFormJual, setTampilkanFormJual] = useState(false);
    const [penjualanDetail, setPenjualanDetail] = useState(null);
    const [isSold, setIsSold] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('SERTIFIKAT KEPEMILIKAN PROYEK', 20, 20);

        doc.setFontSize(12);
        doc.text(`Nama Proyek: ${proyek.nama}`, 20, 40);
        doc.text(`ID Proyek: ${proyek.id}`, 20, 50);
        doc.text(`User ID: ${proyek.userId}`, 20, 60);
        doc.text(`Sertifikat Offset ID: ${proyek.sertifikatOffsetId}`, 20, 70);
        doc.text(`Dokumen ID: ${proyek.dokumenId}`, 20, 80);
        doc.text(`Tanggal Pembuatan: ${proyek.createdAt}`, 20, 90);
        doc.text(`Hash Kepemilikan: ${proyek.ownershipHash}`, 20, 100);

        doc.setFontSize(10);
        doc.text('Dokumen ini dihasilkan secara otomatis oleh sistem LEDGRON.', 20, 120);

        doc.save(`Sertifikat_${proyek.nama.replace(/\s+/g, '_')}.pdf`);
    };

    const handleMulaiJual = () => {
        setTampilkanFormJual(true);
    };

    const handleKonfirmasiJual = () => {
        const volume = parseFloat(proyek.volume);
        const harga = parseInt(proyek.harga);
        const totalHarga = volume * harga;
        const tanggalTransaksi = new Date().toLocaleDateString();

        setPenjualanDetail({
            hargaPenjualan: `Rp ${totalHarga.toLocaleString()}`,
            tanggal: tanggalTransaksi,
            volumeTerjual: `${volume} Ton`,
            status: 'Penjualan Berhasil',
        });

        setProyek((prev) => ({
            ...prev,
            status: 'Terjual',
        }));

        setIsSold(true);
        setTampilkanFormJual(false);
    };

    if (!proyek) return <div className="p-8 text-center">Proyek tidak ditemukan.</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-[#1D3C34]">{proyek.nama}</h2>
                    <p className="text-gray-700">{proyek.deskripsi}</p>

                    <hr className="my-4 border-gray-300" />

                    <div>
                        <h4 className="font-bold">Detail Proyek</h4>
                        <p><strong>Project ID:</strong> {proyek.id}</p>
                        <p><strong>Kategori:</strong> {proyek.kategori}</p>
                        <p><strong>Periode:</strong> {proyek.periode}</p>
                        <p><strong>Harga per Ton:</strong> Rp {parseInt(proyek.harga).toLocaleString()}</p>
                        <p><strong>Volume:</strong> {proyek.volume} Ton</p>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    <div>
                        <p><strong>User ID:</strong> {proyek.userId}</p>
                        <p><strong>Sertifikat Offset ID:</strong> {proyek.sertifikatOffsetId}</p>
                        <p><strong>Dokumen ID:</strong> {proyek.dokumenId}</p>
                        <p><strong>Dibuat pada:</strong> {proyek.createdAt}</p>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-start gap-4">
                        {proyek.status !== 'Aktif' && (
                            <div className="text-red-500 font-semibold">
                                {isSold ? 'Proyek Terjual' : 'Status: Expired'}
                            </div>
                        )}

                        <button
                            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                            onClick={() => navigate(-1)}
                        >
                            Kembali
                        </button>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    <div>
                        <h4 className="font-bold text-lg text-[#1D3C34] mb-2">Proof of Ownership</h4>
                        {proyek.proofOfOwnership ? (
                            <>
                                <p>
                                    <strong>Ownership Hash:</strong>{' '}
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                                        {proyek.ownershipHash}
                                    </span>
                                </p>
                                <button
                                    onClick={generatePDF}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Lihat Sertifikat Kepemilikan untuk {proyek.nama}
                                </button>
                            </>
                        ) : (
                            <p className="text-red-500">Proof of Ownership belum tersedia.</p>
                        )}
                    </div>

                    {/* FORM PENJUALAN DIPINDAH KE SINI */}
                    {tampilkanFormJual && (
                        <div className="mt-6 bg-yellow-50 p-4 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-[#1D3C34]">Form Penjualan</h4>
                            <p><strong>Volume yang dijual:</strong> {proyek.volume} Ton</p>
                            <p><strong>Total Harga:</strong> Rp {(parseFloat(proyek.volume) * parseInt(proyek.harga)).toLocaleString()}</p>
                            <button
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={handleKonfirmasiJual}
                            >
                                Konfirmasikan Jual
                            </button>
                        </div>
                    )}

                    {penjualanDetail && (
                        <div className="mt-6 bg-green-50 p-4 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-[#1D3C34]">Detail Penjualan</h4>
                            <p><strong>Volume Terjual:</strong> {penjualanDetail.volumeTerjual}</p>
                            <p><strong>Total Harga:</strong> {penjualanDetail.hargaPenjualan}</p>
                            <p><strong>Tanggal Transaksi:</strong> {penjualanDetail.tanggal}</p>
                            <p><strong>Status:</strong> {penjualanDetail.status}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <img
                            src={proyek.gambar}
                            alt={proyek.nama}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <div>
                            <p><strong>Status:</strong> {proyek.status}</p>
                            <p><strong>Lokasi:</strong> {proyek.lokasi}</p>
                        </div>
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
            </div>
        </div>
    );
};

export default DetailProyekSaya;
