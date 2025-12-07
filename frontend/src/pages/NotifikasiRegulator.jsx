import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { showValidationSuccessAlert } from "../utils/validatealert";
import {
  FiGrid,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiMail,
  FiCalendar,
  FiFileText,
  FiAlertCircle,
  FiLoader,
  FiInbox,
  FiInfo,
  FiMapPin,
  FiDollarSign,
  FiPackage,
  FiTag,
  FiX,
  FiHome,
  FiGlobe,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios";

const POLL_INTERVAL = 5000;

const RegulatorNotification = () => {
  const navigate = useNavigate();
  const [activeMenu] = useState("notifikasi");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifikasiPendaftaranAkun, setAccountRegistrationNotifications] = useState([]);
  const [notifikasiProyek, setProjectNotifications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [notifikasiRetirement, setRetirementNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const pollRef = useRef(null);
  const isMountedRef = useRef(true);

  // fetch functions (useCallback for stable identity)
  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await API.get("/regulator/pending-users");
      const data = res.data;
      if (data.success) {
        if (!isMountedRef.current) return;
        setAccountRegistrationNotifications(
          data.data.map((u) => ({
            id: u.id,
            tipe: "account",
            nama: u.company,
            companyid: u.company_id,
            email: u.email,
            jenis: u.type,
            tanggal: new Date(u.created_at).toISOString().split("T")[0],
            status: "pending",
            detail: `Account registration request for company ${u.company}`,
            fullData: u,
          }))
        );
      }
    } catch (e) {
      console.error("Error fetch users:", e);
    }
  }, []);

  const fetchPendingProjects = useCallback(async () => {
    try {
      const res = await API.get("/projects/regulator/pending-projects");
      const data = res.data;
      if (data.success) {
        if (!isMountedRef.current) return;
        setProjectNotifications(
          data.data.map((p) => ({
            id: p.project_id,
            tipe: "project",
            nama: p.title,
            email: p.email,
            jenis: p.category,
            tanggal: new Date(p.created_at).toISOString().split("T")[0],
            status: "pending",
            detail: `Project submission for ${p.title} by ${p.email}`,
            fullData: p,
          }))
        );
      }
    } catch (e) {
      console.error("Error fetch projects:", e);
    }
  }, []);

  const fetchRejectedUsers = useCallback(async () => {
    try {
      const res = await API.get("/regulator/rejected-users");
      const data = res.data;
      if (data.success) {
        if (!isMountedRef.current) return;
        setRejectedUsers(data.data);
      }
    } catch (e) {
      console.error("Error fetch rejected users:", e);
    }
  }, []);

  const fetchRejectedProjects = useCallback(async () => {
    try {
      const res = await API.get("/regulator/rejected-projects?days=30");
      const data = res.data;
      if (data.success) {
        if (!isMountedRef.current) return;
        setRejectedProjects(data.data);
        console.log(`✅ Fetched ${data.data.length} rejected projects`);
      }
    } catch (e) {
      console.error("Error fetch rejected projects:", e);
    }
  }, []);

  // single function to refresh all lists (used by polling and after actions)
  const fetchAllNotifications = useCallback(async () => {
    await Promise.all([
      fetchPendingUsers(),
      fetchPendingProjects(),
      fetchRejectedUsers(),
      fetchRejectedProjects(),
    ]);
  }, [fetchPendingUsers, fetchPendingProjects, fetchRejectedUsers, fetchRejectedProjects]);

  // initial load + polling setup
  useEffect(() => {
    isMountedRef.current = true;

    // initial load
    fetchAllNotifications();

    // start polling
    pollRef.current = setInterval(() => {
      // optional: skip polling if a modal is open to avoid UI jump
      if (showProjectModal || selectedUser) {
        // skip refresh while admin is reviewing to avoid disrupting their action
        return;
      }
      fetchAllNotifications();
    }, POLL_INTERVAL);

    return () => {
      // cleanup
      isMountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // intentionally not including showProjectModal/selectedUser in deps so interval doesn't recreate frequently
    // fetchAllNotifications is stable via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllNotifications]);

  const sidebarMenu = [
    { id: "dashboard", icon: FiGrid, text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: FiSearch, text: "Audit & Inspection", link: "/regulator/audit" },
    { id: "laporan", icon: FiBarChart2, text: "Reports & Analytics", link: "/regulator/laporan" },
    { id: "notifikasi", icon: FiBell, text: "Notifications", link: "/regulator/notifikasi" },
    { id: "pengaturan", icon: FiSettings, text: "Settings", link: "/regulator/pengaturan" },
  ];

  const semuaNotifikasi = [
    ...notifikasiPendaftaranAkun,
    ...notifikasiProyek,
    ...notifikasiRetirement,
  ];

  const filterNotifikasi = () => {
    if (activeTab === "all") return semuaNotifikasi;
    if (activeTab === "rejected-users")
      return rejectedUsers.map((u) => ({
        id: u.id,
        tipe: "rejected-account",
        nama: u.company,
        email: u.email,
        jenis: u.type,
        tanggal: u.rejected_at,
        status: "rejected",
        detail: `Rejected: ${u.rejection_reason}`,
        fullData: u,
      }));
    if (activeTab === "rejected-projects")
      return rejectedProjects.map((p) => ({
        id: p.project_id,
        tipe: "rejected-project",
        nama: p.title,
        email: p.email,
        jenis: p.category,
        tanggal: p.rejected_at,
        status: "rejected",
        detail: `Rejected: ${p.rejection_reason}`,
        fullData: p,
      }));
    return semuaNotifikasi.filter((n) => n.tipe === activeTab);
  };

  const handleDetailClick = async (notif) => {
    if (notif.tipe === "project") {
      setSelectedProject(notif);
      setShowProjectModal(true);
    } else if (notif.tipe === "account") {
      setUserDetails({
        id: notif.id,
        tipe: notif.tipe,
        nama: notif.nama,
        email: notif.email,
        jenis: notif.jenis,
        tanggal: notif.tanggal,
        status: notif.status,
        detail: notif.detail,
        fullData: {
          id: notif.fullData?.id || notif.id,
          company: notif.fullData?.company || notif.nama,
          company_id: notif.fullData?.company_id || "N/A",
          email: notif.fullData?.email || notif.email,
          type: notif.fullData?.type || notif.jenis,
          website: notif.fullData?.website || null,
          province: notif.fullData?.province || "Not provided",
          city: notif.fullData?.city || "Not provided",
          phone: notif.fullData?.phone || null,
          address: notif.fullData?.address || null,
          postal_code: notif.fullData?.postal_code || null,
          created_at: notif.fullData?.created_at || notif.tanggal,
          is_validated: notif.fullData?.is_validated || 0,
          total_projects: 0,
          total_carbon_credits: 0,
        },
      });
      setSelectedUser(notif);
    }
  };

  const handleValidateProject = async () => {
    const projectData = selectedProject.fullData;
  
    // ✅ Validation
    if (!projectData?.est_volume || projectData.est_volume <= 0) {
      alert("⚠️ Invalid certificate volume in project data");
      return;
    }
    if (!projectData?.price_per_unit || projectData.price_per_unit <= 0) {
      alert("⚠️ Invalid certificate price in project data");
      return;
    }
    if (!projectData?.end_date) {
      alert("⚠️ Invalid project end date");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("📤 Validating project:", {
        projectId: selectedProject.id,
        certAmount: parseInt(projectData.est_volume),
        certPricePerUnit: parseInt(projectData.price_per_unit),
        expiresAt: projectData.end_date,
      });
  
      const response = await API.post("/projects/regulator/validate-project", {
        projectId: selectedProject.id,
        certAmount: parseInt(projectData.est_volume),
        certPricePerUnit: parseInt(projectData.price_per_unit),
        expiresAt: projectData.end_date,
      });
  
      console.log("📥 Validation response:", response);
  
      const data = response.data;
  
      // ✅ Check success (accept both 200 and 201)
      if ((response.status === 200 || response.status === 201) && data.success) {
        console.log("✅ Project validated successfully");
        
        // ✅ Show success alert
        try {
          showValidationSuccessAlert(data, projectData, selectedProject);
        } catch (alertError) {
          console.error("⚠️ Error showing alert (but validation succeeded):", alertError);
          // Still show basic success message if custom alert fails
          alert(`✅ Project "${selectedProject.nama}" validated successfully!\n\nCertificate ID: ${data.data?. cert_id || 'N/A'}`);
        }
  
        // ✅ Refresh and close
        await fetchAllNotifications();
        setShowProjectModal(false);
        setSelectedProject(null);
      } else {
        // ❌ API returned error
        console.error("❌ Validation failed:", data);
        alert(`❌ Failed to validate project: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Error validating project:", error);
      
      // ✅ Better error message
      let errorMessage = "An error occurred while validating the project";
      
      if (error.response) {
        // Server responded with error
        console.error("Response error:", error.response.data);
        errorMessage = error.response.data?. message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        console.error("No response:", error.request);
        errorMessage = "No response from server.  Please check your connection.";
      } else {
        // Other errors
        console.error("Error details:", error.message);
        errorMessage = error.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectProject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setIsLoading(true);

    try {
      const response = await API.post("/projects/regulator/reject-project", {
        projectId: selectedProject.id,
        reason,
      });
      const data = response.data;
      if (response.status === 200 && data.success) {
        alert(`❌ Project "${selectedProject.nama}" rejected`);
        // refresh lists after action
        await fetchAllNotifications();
        setShowProjectModal(false);
        setSelectedProject(null);
      } else {
        alert(`Failed to reject project: ${data.message}`);
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      alert("Failed to reject project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, tipe) => {
    setIsLoading(true);

    try {
      // Approve user
      if (tipe === "account" && newStatus === "approved") {
        const response = await API.post("/regulator/validate-user", { userId: id });
        const data = response.data;
        if (response.status === 200 && data.success) {
          toast.success("User approved");
          // refresh lists after action
          await fetchAllNotifications();
          setSelectedUser(null);
          setUserDetails(null);
        } else {
          toast.error(`Failed to approve user: ${data.message}`);
        }
      }

      // Reject user
      if (tipe === "account" && newStatus === "rejected") {
        const reason = prompt("Enter rejection reason:");
        if (!reason) {
          setIsLoading(false);
          return;
        }
        const response = await API.post("/regulator/reject-user", { userId: id, reason });
        const data = response.data;
        if (response.status === 200 && data.success) {
          toast.success("❌ User rejected");
          // refresh lists after action
          await fetchAllNotifications();
          setSelectedUser(null);
          setUserDetails(null);
        } else {
          toast.error(`Failed to reject user: ${data.message}`);
        }
      }
    } catch (e) {
      console.error("Error in handleStatusChange:", e);
      toast.error("Failed to update status: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "-";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} years ${months} months`;
    }
    return `${months} months`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
            fontSize: "14px",
            maxWidth: "500px",
          },
          success: {
            background: "#10b981",
          },
          error: {
            background: "#ef4444",
          },
          loading: {
            background: "#3b82f6",
          },
        }}
        containerStyle={{ top: 80 }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <FiLoader className="animate-spin h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Processing...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ChainCarbon" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">ChainCarbon</h1>
              <p className="text-xs text-gray-500">Regulator Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span className="text-sm">{item.text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Link to="/regulator" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <FiGrid className="inline" /> Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Notifications</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <FiBell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-emerald-600 transition" />
                {semuaNotifikasi.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {semuaNotifikasi.length}
                  </span>
                )}
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full 
                              flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105">
                  <span className="font-bold text-base">AR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm transition-colors group-hover:text-emerald-600">
                    Admin Regulator
                  </p>
                  <p className="text-xs text-gray-400">System Supervisor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-8 py-5 bg-white border-b border-gray-200">
          <div className="flex space-x-3">
            {[
              { id: "all", label: "All", count: semuaNotifikasi.length },
              { id: "account", label: "Account Registration", count: notifikasiPendaftaranAkun.length },
              { id: "project", label: "Projects", count: notifikasiProyek.length },
              { id: "retirement", label: "Retirement", count: notifikasiRetirement.length },
              { id: "rejected-users", label: "Rejected Users", count: rejectedUsers.length }, // ✅ NEW
              { id: "rejected-projects", label: "Rejected Projects", count: rejectedProjects.length }, // ✅ NEW
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg"
                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? "bg-white text-emerald-600" : "bg-red-100 text-red-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <main className="flex-1 overflow-y-auto p-8">
          {filterNotifikasi().length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FiInbox className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-2xl text-gray-600 font-semibold">
                No notifications
              </p>
              <p className="text-gray-400 mt-3 text-lg">
                {activeTab !== "all" && `No ${activeTab} to review`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filterNotifikasi().map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        n.tipe === "account"
                          ? "bg-blue-100" 
                          : n.tipe === "project"
                          ? "bg-emerald-100"
                          : "bg-purple-100"
                      }`}>
                        {n.tipe === "account" ? (
                          <FiUser className={`h-6 w-6 ${
                            n.tipe === "account" ? "text-blue-600" : "text-gray-600"
                          }`} />
                        ) : (
                          <FiFileText className={`h-6 w-6 ${
                            n.tipe === "project" ? "text-emerald-600" : "text-gray-600"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">
                          {n.nama}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {n.detail}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <FiMail className="h-4 w-4" />
                            {n.email}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="h-4 w-4" />
                            {formatDate(n.tanggal)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiFileText className="h-4 w-4" />
                            {n.jenis}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        n.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : n.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {n.status === "pending" && <FiClock className="h-3.5 w-3.5" />}
                      {n.status === "approved" && <FiCheckCircle className="h-3.5 w-3.5" />}
                      {n.status === "rejected" && <FiXCircle className="h-3.5 w-3.5" />}
                      {n.status === "pending" ? "Pending" : n.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                  {n.status === "pending" && (
                    <button
                      onClick={() => handleDetailClick(n)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <FiSearch className="h-4 w-4" />
                      Review & Validate
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedUser && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header - Professional Blue */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <FiUser className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Account Verification</h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserDetails(null);
                  }}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                >
                  <FiX className="h-7 w-7" />
                </button>
              </div>
            </div>

            {/* Content - Clean & Professional */}
            <div className="p-8">
              {/* Company Header Card */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FiHome className="h-5 w-5 text-slate-600" />
                      <h3 className="text-2xl font-bold text-slate-900">{userDetails.fullData?.company}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FiTag className="h-4 w-4" />
                        <span className="font-medium">ID:</span>
                        <code className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono">
                          {userDetails.fullData?.company_id}
                        </code>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FiMail className="h-4 w-4" />
                        <span>{userDetails.fullData?.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FiCalendar className="h-4 w-4" />
                        <span>{formatDate(userDetails.fullData?.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <FiClock className="h-3.5 w-3.5" />
                      Pending Approval
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                      #{userDetails.fullData?.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid - Professional Layout */}
              <div className="space-y-4">
                {/* Business Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <FiPackage className="h-4 w-4" />
                      Business Information
                    </h4>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                          Business Type
                        </label>
                        <p className="text-base font-medium text-slate-900">{userDetails.fullData?.type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                          Company ID
                        </label>
                        <p className="text-base font-mono font-bold text-slate-900">{userDetails.fullData?.company_id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <FiMail className="h-4 w-4" />
                      Contact Information
                    </h4>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                          Email Address
                        </label>
                        <p className="text-base font-medium text-slate-900 break-all">{userDetails.fullData?.email}</p>
                      </div>
                      {userDetails.fullData?.phone && (
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                            Phone Number
                          </label>
                          <p className="text-base font-medium text-slate-900">{userDetails.fullData.phone}</p>
                        </div>
                      )}
                      {userDetails.fullData?.website && (
                        <div className={userDetails.fullData?.phone ? "col-span-2" : "col-span-1"}>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                            Website
                          </label>
                          <a
                            href={userDetails.fullData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline break-all inline-flex items-center gap-1"
                          >
                            {userDetails.fullData.website}
                            <FiGlobe className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <FiMapPin className="h-4 w-4" />
                      Location Details
                    </h4>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                          Province
                        </label>
                        <p className="text-base font-medium text-slate-900">
                          {userDetails.fullData?.province || (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                          City
                        </label>
                        <p className="text-base font-medium text-slate-900">
                          {userDetails.fullData?.city || (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </p>
                      </div>
                      {userDetails.fullData?.address && (
                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                            Full Address
                          </label>
                          <p className="text-base font-medium text-slate-900">{userDetails.fullData.address}</p>
                        </div>
                      )}
                      {userDetails.fullData?.postal_code && (
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                            Postal Code
                          </label>
                          <p className="text-base font-medium text-slate-900">{userDetails.fullData.postal_code}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Summary */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <FiInfo className="h-4 w-4" />
                      Registration Summary
                    </h4>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">User ID</p>
                        <p className="text-lg font-bold text-slate-900">#{userDetails.fullData?.id}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Registered</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(userDetails.fullData?.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 border border-amber-300 rounded text-xs font-semibold">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-semibold text-amber-900 text-sm mb-1">Verification Required</h5>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Please carefully verify all information before approving. Approved accounts will gain full access to the carbon credit trading system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer - Clean & Professional */}
            <div className="border-t-2 border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserDetails(null);
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white hover:border-slate-400 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedUser.id, "rejected", selectedUser.tipe)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiXCircle className="h-5 w-5" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleStatusChange(selectedUser.id, "approved", selectedUser.tipe)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-green border-2 border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiCheckCircle className="h-5 w-5" />
                  Approve Account
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center mt-4">
                Approving: <span className="font-semibold text-slate-700">{userDetails?.fullData?.company}</span> • 
                ID: <span className="font-mono font-semibold text-slate-700">{userDetails?.fullData?.company_id}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Project Validation */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiFileText className="h-6 w-6" />
                Project Validation
              </h2>
              <p className="text-emerald-100 mt-1">{selectedProject.nama}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border-2 border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <FiFileText className="h-5 w-5 text-emerald-600" />
                  Basic Project Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiTag className="h-3.5 w-3.5" />
                        Project ID
                      </span>
                      <p className="font-mono font-bold text-gray-800 text-lg">#{selectedProject.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiPackage className="h-3.5 w-3.5" />
                        Category
                      </span>
                      <p className="font-semibold text-gray-800">{selectedProject.jenis}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiMail className="h-3.5 w-3.5" />
                        Submitter Email
                      </span>
                      <p className="font-semibold text-gray-800">{selectedProject.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiCalendar className="h-3.5 w-3.5" />
                        Submission Date
                      </span>
                      <p className="font-semibold text-gray-800">{formatDate(selectedProject.tanggal)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiMapPin className="h-3.5 w-3.5" />
                        Location
                      </span>
                      <p className="font-semibold text-gray-800">{selectedProject.fullData?.location || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <FiClock className="h-3.5 w-3.5" />
                        Project Duration
                      </span>
                      <p className="font-semibold text-gray-800">
                        {calculateDuration(selectedProject.fullData?.start_date, selectedProject.fullData?.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              {selectedProject.fullData?.description && (
                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FiInfo className="h-5 w-5" />
                    Project Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProject.fullData.description}
                  </p>
                </div>
              )}

              {/* Project Timeline */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                  <div className="flex items-start gap-3">
                    <FiCalendar className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-base font-bold text-gray-900 mb-2">
                        Project Start Date
                      </label>
                      <div className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3">
                        <p className="text-lg font-bold text-gray-800">
                          {formatDate(selectedProject.fullData?.start_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                  <div className="flex items-start gap-3">
                    <FiCalendar className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-base font-bold text-gray-900 mb-2">
                        Project End Date
                      </label>
                      <div className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3">
                        <p className="text-lg font-bold text-gray-800">
                          {formatDate(selectedProject.fullData?.end_date)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-700 mt-2">
                        ⚠️ Certificate will expire on this date
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border-2 border-slate-300">
                <h3 className="font-bold text-lg mb-5 text-gray-800 flex items-center gap-2">
                  <FiPackage className="h-5 w-5 text-gray-600" />
                  Certificate Details (From User Submission)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <FiPackage className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Certificate Volume
                        </label>
                        <div className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3">
                          <p className="text-3xl font-bold text-gray-1000">
                            {selectedProject.fullData?.est_volume?.toLocaleString('en-US') || 0}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">tCO₂e</p>
                        </div>
                        <p className="text-xs text-gray-700 mt-2 flex items-center gap-1">
                          <FiInfo className="h-3 w-3" />
                          Estimated emission reduction
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <FiDollarSign className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Price per tCO₂e
                        </label>
                        <div className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3">
                          <p className="text-2xl font-bold text-gray-1000">
                            {formatCurrency(selectedProject.fullData?.price_per_unit || 0)}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">per unit</p>
                        </div>
                        <p className="text-xs text-gray-700 mt-2 flex items-center gap-1">
                          <FiInfo className="h-3 w-3" />
                          Price submitted by user
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Value */}
              {selectedProject.fullData?.est_volume && selectedProject.fullData?.price_per_unit && (
                <div className="bg-gray rounded-xl p-6 border-2 border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-700 text-xl">Total Certificate Value:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text">
                      {formatCurrency(selectedProject.fullData.est_volume * selectedProject.fullData.price_per_unit)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm bg-white rounded-lg p-4">
                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <p className="font-bold text-gray-800">{selectedProject.fullData.est_volume.toLocaleString('en-US')} tCO₂e</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price per unit:</span>
                      <p className="font-bold text-gray-800">{formatCurrency(selectedProject.fullData.price_per_unit)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Validity period:</span>
                      <p className="font-bold text-gray-800">
                        {calculateDuration(new Date(), selectedProject.fullData.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 flex items-start gap-3">
                <FiAlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-bold mb-3 text-base">⚠️ Important - Please Note:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>All data (volume, price, date) come from the user's submission and **cannot be changed**</li>
                    <li>The certificate will automatically **expire on the project end date** ({formatDate(selectedProject.fullData?.end_date)})</li>
                    <li>This validation will issue the certificate **permanently on the blockchain**</li>
                    <li>Issued certificates **cannot be revoked**</li>
                    <li>Ensure all data has been **carefully verified** before validating</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setSelectedProject(null);
                }}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProject}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiXCircle className="h-4 w-4" />
                Reject Project
              </button>
              <button
                onClick={handleValidateProject}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin h-4 w-4" />
                    Processing Validation...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="h-4 w-4" />
                    Approve Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorNotification;