// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { updateUser } from "../api/userApi"; // ✅ gunakan userApi.js

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil data user dari localStorage (disimpan saat login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setForm(parsedUser);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      // ✅ panggil helper API
      const updatedUser = await updateUser(user.id, form, token);

      // Simpan ke state + localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profil berhasil diperbarui ✅");
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Gagal memperbarui profil ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-700">
          Data tidak ditemukan
        </h2>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Profil Saya</h2>

      <form className="space-y-4" onSubmit={handleUpdate}>
        {/* Nama */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Nama
          </label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Email (tidak bisa diubah) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Perusahaan */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Perusahaan
          </label>
          <input
            type="text"
            name="company"
            value={form.company || ""}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Website
          </label>
          <input
            type="text"
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Provinsi */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Provinsi
          </label>
          <input
            type="text"
            name="province"
            value={form.province || ""}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Kota */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Kota
          </label>
          <input
            type="text"
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("berhasil") ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;
