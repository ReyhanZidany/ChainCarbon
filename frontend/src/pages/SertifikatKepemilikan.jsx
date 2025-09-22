import React from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from "jspdf";

const dummyProyekSaya = [
  {
    id: '1',
    nama: 'Proyek Reforestasi Gunung Salak',
    userId: '12345',
    kategori: 'Reforestasi',
    lokasi: 'Jawa Barat',
    volume: 5000, // dalam Ton CO₂e
    harga: 2500000, // harga per Ton CO₂e
    periode: 'Januari 2025 - Desember 2025',
    createdAt: '01-01-2025',
    ownershipHash: 'a3f5b7e3a5e6...1298hfbw95fsl8',
  },
  // Proyek lainnya ...
];

const SertifikatKepemilikan = () => {
    const { id } = useParams();
    const proyek = dummyProyekSaya.find((p) => p.id === id);

    if (!proyek) return <div className="p-8 text-center">Sertifikat tidak ditemukan.</div>;

    // Fungsi untuk membuat PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Menambahkan teks sertifikat
        doc.setFontSize(20);
        doc.text('Sertifikat Kepemilikan Proyek', 20, 30);
        
        doc.setFontSize(16);
        doc.text(`Nama Proyek: ${proyek.nama}`, 20, 50);
        doc.text(`ID Proyek: ${proyek.id}`, 20, 60);
        doc.text(`User ID (Pemilik): ${proyek.userId}`, 20, 70);
        doc.text(`Lokasi: ${proyek.lokasi}`, 20, 80);
        doc.text(`Kategori: ${proyek.kategori}`, 20, 90);
        doc.text(`Volume: ${proyek.volume} Ton CO₂e`, 20, 100);
        doc.text(`Harga per Ton: Rp ${parseInt(proyek.harga).toLocaleString()}`, 20, 110);
        doc.text(`Periode: ${proyek.periode}`, 20, 120);
        doc.text(`Tanggal Diterbitkan: ${proyek.createdAt}`, 20, 130);
        doc.text(`Ownership Hash: ${proyek.ownershipHash}`, 20, 140);

        // Tanda tangan digital
        doc.text(`Ditandatangani secara digital oleh LEDGRON System`, 20, 160);
        doc.text(new Date().toLocaleDateString(), 20, 170);
        
        // Mengunduh PDF
        doc.save(`${proyek.nama}-sertifikat.pdf`);
    };

    return (
        <div className="p-10 bg-white min-h-screen font-serif">
            <div className="max-w-3xl mx-auto border-4 border-gray-800 p-10 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sertifikat Kepemilikan Proyek
                </h1>

                {/* Informasi Proyek */}
                <div className="space-y-4 text-lg text-gray-700 mb-8">
                    <p><strong>Nama Proyek:</strong> {proyek.nama}</p>
                    <p><strong>ID Proyek:</strong> {proyek.id}</p>
                    <p><strong>User ID (Pemilik):</strong> {proyek.userId}</p>
                    <p><strong>Lokasi:</strong> {proyek.lokasi}</p>
                    <p><strong>Kategori:</strong> {proyek.kategori}</p>
                    <p><strong>Volume:</strong> {proyek.volume} Ton CO₂e</p>
                    <p><strong>Harga per Ton:</strong> Rp {parseInt(proyek.harga).toLocaleString()}</p>
                    <p><strong>Periode:</strong> {proyek.periode}</p>
                    <p><strong>Tanggal Diterbitkan:</strong> {proyek.createdAt}</p>
                    <p><strong>Ownership Hash:</strong> <span className="font-mono">{proyek.ownershipHash}</span></p>
                </div>

                {/* Button untuk mengunduh PDF */}
                <div className="mt-6 text-center">
                    <button 
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        onClick={generatePDF}
                    >
                        Unduh Sertifikat Kepemilikan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SertifikatKepemilikan;
