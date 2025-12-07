// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

// Marketplace
import Marketplace from "./pages/Marketplace";
import DetailProyek from "./pages/DetailProyek";

// User Dashboard
import DashboardUser from "./pages/DashboardUser";
import ProyekSaya from "./pages/ProyekSaya";
import PengajuanProyek from "./pages/PengajuanProyek";
import DetailProyekSaya from "./pages/DetailProyekSaya";
import SertifikatKepemilikan from "./pages/SertifikatKepemilikan";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import Laporan from "./pages/Laporan";
import Profile from "./pages/Profile"; // ✅ Profile Page

// Regulator
import RegulatorDashboard from "./pages/RegulatorDashboard";
import AuditPerusahaan from "./pages/AuditPerusahaan";
import LaporanAnalisis from "./pages/LaporanAnalisis";
import NotifikasiRegulator from "./pages/NotifikasiRegulator";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />

        {/* === Marketplace Routes === */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/proyek/:id" element={<DetailProyek />} />

        {/* === User Dashboard Routes (Nested) === */}
        <Route path="/dashboard" element={<DashboardUser />}>
          <Route index element={<></>} /> {/* default dashboard content */}
          <Route path="proyek" element={<ProyekSaya />} />
          <Route path="proyek/:id" element={<DetailProyekSaya />} />
          <Route path="pengajuan" element={<PengajuanProyek />} />
          <Route path="sertifikat/:id" element={<SertifikatKepemilikan />} />
          <Route path="transaksi" element={<RiwayatTransaksi />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="profile" element={<Profile />} />{" "}
          {/* ✅ Profile route */}
        </Route>

        {/* === Regulator Routes === */}
        <Route path="/regulator" element={<RegulatorDashboard />} />
        <Route path="/regulator/audit" element={<AuditPerusahaan />} />
        <Route path="/regulator/laporan" element={<LaporanAnalisis />} />
        <Route path="/regulator/notifikasi" element={<NotifikasiRegulator />} />
      </Routes>
    </Router>
  );
}

export default App;
