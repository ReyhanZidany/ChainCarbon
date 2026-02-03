// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import VerifyCertificate from "./pages/VerifyCertificate";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProjectDetail from './pages/ProjectDetail';

// Pages that need sidebar (both guest and authenticated)
import DashboardUser from "./pages/DashboardUser";
import Marketplace from "./pages/Marketplace";
import ProyekSaya from "./pages/ProyekSaya";
import PengajuanProyek from "./pages/PengajuanProyek";
import DetailProyekSaya from "./pages/DetailProyekSaya";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import Laporan from "./pages/Laporan";
import Profile from "./pages/Profile";
import CertificateDetail from "./pages/CertificateDetail";
import DetailTransaksi from "./pages/DetailTransaksi";

// Regulator (Protected)
import RegulatorDashboard from "./pages/RegulatorDashboard";
import AuditPerusahaan from "./pages/AuditPerusahaan";
import LaporanAnalisis from "./pages/LaporanAnalisis";
import NotifikasiRegulator from "./pages/NotifikasiRegulator";
import AuditDetail from "./pages/AuditDetail";
import RegulatorPengaturan from "./pages/RegulatorPengaturan";

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
          className: 'shadow-lg border border-gray-100',
          style: {
            background: '#ffffff',
            color: '#1e293b',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            maxWidth: '400px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            duration: 4000,
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
            iconTheme: {
              primary: '#166534',
              secondary: '#f0fdf4',
            },
          },
          error: {
            duration: 6000,
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#991b1b',
              secondary: '#fef2f2',
            },
          },
          loading: {
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
            },
          },
        }}
      />
      <AuthProvider>
        <Routes>
          {/* ============================================
              PUBLIC ROUTES (No Sidebar)
          ============================================ */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:certId" element={<VerifyCertificate />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* ============================================
              ROUTES WITH SIDEBAR (Guest + Authenticated)
              ✅ FIXED: Use element={<DashboardUser />} WITHOUT path="/"
          ============================================ */}
          <Route element={<DashboardUser />}>
            {/* ✅ Public routes with sidebar */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:certId" element={<ProjectDetail />} />

            {/* ✅ Protected routes with sidebar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div /> {/* Empty div for main dashboard content */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/project"
              element={
                <ProtectedRoute>
                  <ProyekSaya />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/project/:id"
              element={
                <ProtectedRoute>
                  <DetailProyekSaya />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/pengajuan"
              element={
                <ProtectedRoute>
                  <PengajuanProyek />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/sertifikat/:certId"
              element={
                <ProtectedRoute>
                  <CertificateDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transaksi"
              element={
                <ProtectedRoute>
                  <RiwayatTransaksi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/laporan"
              element={
                <ProtectedRoute>
                  <Laporan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transaksi/:txId"
              element={
                <ProtectedRoute>
                  <DetailTransaksi />
                </ProtectedRoute>
              }
            />

            {/* ✅ Alternative certificate route */}
            <Route
              path="/sertifikat/:certId"
              element={
                <ProtectedRoute>
                  <CertificateDetail />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ============================================
              REGULATOR ROUTES (Separate Layout)
          ============================================ */}
          <Route
            path="/regulator"
            element={
              <ProtectedRoute requireRegulator={true}>
                <RegulatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator/audit"
            element={
              <ProtectedRoute requireRegulator={true}>
                <AuditPerusahaan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator/audit/:id"
            element={
              <ProtectedRoute requireRegulator={true}>
                <AuditDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator/laporan"
            element={
              <ProtectedRoute requireRegulator={true}>
                <LaporanAnalisis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator/notifikasi"
            element={
              <ProtectedRoute requireRegulator={true}>
                <NotifikasiRegulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator/pengaturan"
            element={
              <ProtectedRoute requireRegulator={true}>
                <RegulatorPengaturan />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;