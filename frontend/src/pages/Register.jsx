import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios"; // axios helper

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    website: "",
    type: "",
    province: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input text
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select dropdown
  const handleSelect = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/auth/register", {
        name: form.company || form.name, // backend kita pakai "name"
        email: form.email,
        password: form.password,
        website: form.website,
        type: form.type,
        province: form.province,
        city: form.city,
      });

      setMessage(res.data.message || "Registrasi berhasil ✅");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-6">
      <div className="flex max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Kiri: Brand & Info */}
        <div className="hidden md:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-emerald-600 to-cyan-600 p-10 text-white relative">
          <img
            src={logo}
            alt="ChainCarbon Logo"
            className="h-16 w-auto mb-6 drop-shadow-xl"
          />
          <h2 className="text-3xl font-bold mb-4 text-center">
            Buat Akun Baru di{" "}
            <span className="text-yellow-200">ChainCarbon</span>
          </h2>
          <p className="text-center text-sm leading-relaxed max-w-sm opacity-90">
            Daftarkan perusahaan Anda untuk bergabung dalam ekosistem kredit
            karbon dan marketplace berbasis blockchain yang transparan serta
            berkelanjutan.
          </p>
        </div>

        {/* Kanan: Form Register */}
        <div className="w-full md:w-3/5 p-10 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-3">
            Daftar Akun Perusahaan
          </h2>
          <p className="text-sm text-center text-slate-500 mb-8">
            Isi data perusahaan Anda untuk melanjutkan
          </p>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="nama@email.com"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            {/* Nama Perusahaan */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nama Perusahaan
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                placeholder="PT Hijau Bersama"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Website Perusahaan
              </label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://perusahaan.com"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            {/* Tipe Perusahaan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Tipe Perusahaan
              </label>
              <div className="relative mt-1">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleSelect}
                  required
                  className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg shadow-sm bg-white appearance-none cursor-pointer
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ease-in-out
                  hover:shadow-md hover:border-emerald-400"
                >
                  <option value="">Pilih tipe perusahaan</option>
                  <option value="reforestasi">🌱 Proyek Reforestasi</option>
                  <option value="energi-terbarukan">
                    ⚡ Energi Terbarukan
                  </option>
                  <option value="manufaktur-ramah">
                    🏭 Manufaktur Ramah Lingkungan
                  </option>
                  <option value="pengelola-limbah">♻️ Pengelola Limbah</option>
                  <option value="teknologi-hijau">💡 Teknologi Hijau</option>
                  <option value="transportasi-emisi-rendah">
                    🚛 Transportasi Rendah Emisi
                  </option>
                  <option value="offset-karbon">🌐 Offset Karbon</option>
                  <option value="konsultan-lingkungan">
                    📊 Konsultan Lingkungan
                  </option>
                  <option value="agrikultur-berkelanjutan">
                    🌾 Agrikultur Berkelanjutan
                  </option>
                  <option value="konservasi-alam">🌳 Konservasi Alam</option>
                  <option value="pembangkit-non-fosil">
                    🔥 Pembangkit Non-Fosil
                  </option>
                  <option value="non-profit-lingkungan">
                    🤝 Organisasi Non-Profit
                  </option>
                  <option value="konstruksi-hijau">🏗️ Konstruksi Hijau</option>
                  <option value="pemerintah-hijau">
                    🏛️ Pemerintah/Kota Hijau
                  </option>
                  <option value="developer-bersertifikat">
                    📜 Developer Bersertifikat
                  </option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Provinsi */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Provinsi
              </label>
              <div className="relative mt-1">
                <select
                  name="province"
                  value={form.province}
                  onChange={handleSelect}
                  required
                  className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg shadow-sm bg-white appearance-none cursor-pointer
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ease-in-out
                  hover:shadow-md hover:border-emerald-400"
                >
                  <option value="">Pilih provinsi</option>
                  <option value="jawa-barat">Jawa Barat</option>
                  <option value="jawa-tengah">Jawa Tengah</option>
                  <option value="jawa-timur">Jawa Timur</option>
                  <option value="kalimantan-timur">Kalimantan Timur</option>
                  <option value="sumatera-utara">Sumatera Utara</option>
                  <option value="papua">Papua</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Kabupaten/Kota */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Kabupaten/Kota
              </label>
              <div className="relative mt-1">
                <select
                  name="city"
                  value={form.city}
                  onChange={handleSelect}
                  required
                  className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg shadow-sm bg-white appearance-none cursor-pointer
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ease-in-out
                  hover:shadow-md hover:border-emerald-400"
                >
                  <option value="">Pilih kabupaten/kota</option>
                  <option value="bandung">Bandung</option>
                  <option value="semarang">Semarang</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="samarinda">Samarinda</option>
                  <option value="medan">Medan</option>
                  <option value="jayapura">Jayapura</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="md:col-span-2 flex justify-between gap-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-3 rounded-lg font-semibold 
                hover:from-emerald-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 
                transition-all duration-300"
              >
                {loading ? "Mendaftarkan..." : "Daftar"}
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}

          <p className="text-sm text-center mt-6 text-slate-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-emerald-600 cursor-pointer hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
