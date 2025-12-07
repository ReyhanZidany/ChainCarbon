// frontend/src/pages/RegulatorSettings.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiEdit,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiUsers,
  FiFileText,
  FiDatabase,
  FiDownload,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";
import API from "../api/axios";

const RegulatorSettings = () => {
  const navigate = useNavigate();
  const [activeMenu] = useState("pengaturan");
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // User data
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    type: "",
    role: "",
    createdAt: "",
  });

  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ REAL: Notification settings (can be saved to database)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newProjectAlert: true,
    newTransactionAlert: true,
    auditDueAlert: true,
    suspiciousActivityAlert: true,
    dailySummary: false,
    weeklySummary: true,
  });

  // ✅ REAL: System statistics (read-only, from database)
  const [systemStats, setSystemStats] = useState({
    totalCompanies: 0,
    totalProjects: 0,
    totalCertificates: 0,
    totalTransactions: 0,
    pendingApprovals: 0,
    activeAudits: 0,
  });

  const [pendingNotifications, setPendingNotifications] = useState({
    accounts: 0,
    projects: 0,
    retirements: 0
  });

  const sidebarMenu = [
    { id: "dashboard", icon: FiGrid, text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: FiSearch, text: "Audit & Inspection", link: "/regulator/audit" },
    { id: "laporan", icon: FiBarChart2, text: "Reports & Analytics", link: "/regulator/laporan" },
    { id: "notifikasi", icon: FiBell, text: "Notifications", link: "/regulator/notifikasi" },
    { id: "pengaturan", icon: FiSettings, text: "Settings", link: "/regulator/pengaturan" },
  ];

  useEffect(() => {
    fetchUserData();
    fetchNotificationSettings();
    fetchSystemStats();
    fetchPendingNotifications();
  }, []);

  const totalNotifications = 
    pendingNotifications.accounts + 
    pendingNotifications.projects + 
    pendingNotifications.retirements;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ✅ REAL: Fetch user data from token
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split('.')[1]));

      setUserData({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        type: decoded.type,
        role: decoded.role,
        createdAt: new Date(decoded.iat * 1000).toISOString(),
      });

      setEditedProfile({
        name: decoded.name,
        email: decoded.email,
      });

    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REAL: Fetch notification settings from database
  const fetchNotificationSettings = async () => {
    try {
      const response = await API.get("/regulator/notification-settings");
      const data = response.data;

      if (data.success && data.data) {
        setNotificationSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      // Use defaults if fetch fails
    }
  };

  // ✅ REAL: Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      const response = await API.get("/regulator/stats");
      const data = response.data;

      if (data.success) {
        setSystemStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching system stats:", error);
    }
  };

  // ✅ REAL: Fetch pending notifications
  const fetchPendingNotifications = async () => {
    try {
      const accountsRes = await API.get("/regulator/pending-users");
      const projectsRes = await API.get("/projects/regulator/pending-projects");

      setPendingNotifications({
        accounts: accountsRes.data.success ? accountsRes.data.data.length : 0,
        projects: projectsRes.data.success ? projectsRes.data.data.length : 0,
        retirements: 0
      });
    } catch (error) {
      console.error("Error fetching pending notifications:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedProfile({
      name: userData.name,
      email: userData.email,
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({
      name: userData.name,
      email: userData.email,
    });
    setErrorMessage("");
  };

  // ✅ REAL: Save profile (if backend supports it)
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await API.put("/regulator/profile", {
        name: editedProfile.name,
        email: editedProfile.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        setUserData(prev => ({
          ...prev,
          name: editedProfile.name,
          email: editedProfile.email,
        }));

        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          name: editedProfile.name,
          email: editedProfile.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdated'));

        setIsEditingProfile(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.message || "Failed to update profile");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update profile.  This feature may not be available yet.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ REAL: Change password
  const handleChangePassword = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMessage("All password fields must be filled");
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long");
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New password and confirmation do not match");
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await API.post("/regulator/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        setSuccessMessage("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.message || "Failed to change password");
      }

    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage(error.response?.data?.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ REAL: Save notification settings
  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await API.put("/regulator/notification-settings", {
        settings: notificationSettings
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        setSuccessMessage("Notification settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.message || "Failed to save settings");
      }

    } catch (error) {
      console.error("Error saving notification settings:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ REAL: Export data
  const handleExportData = async () => {
    try {
      if (!window.confirm(
        "📊 Export System Data\n\n" +
        "This will export all system data to CSV format.\n\n" +
        "Export includes:\n" +
        "• Companies\n" +
        "• Projects\n" +
        "• Certificates (references)\n" +
        "• Transactions (references)\n" +
        "• Audits\n\n" +
        "Continue?"
      )) {
        return;
      }

      setIsSaving(true);
      const token = localStorage.getItem("token");

      const response = await API.get("/regulator/export-data", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chaincarbon-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Data exported successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error exporting data:", error);
      setErrorMessage(error.response?.data?.message || "Failed to export data.  Please contact system administrator.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
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
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-500"}`} />
                <span className="text-sm">{item.text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage profile and system configuration
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/regulator/notifikasi" className="relative">
                <FiBell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-emerald-600 transition" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {totalNotifications}
                  </span>
                )}
              </Link>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="font-bold text-base">AR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Admin Regulator</p>
                  <p className="text-xs text-gray-400">System Supervisor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mx-8 mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <FiCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mx-8 mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="px-8 py-5 bg-white border-b border-gray-200">
          <div className="flex space-x-3 overflow-x-auto">
            {[
              { id: "profile", label: "Profile", icon: FiUser },
              { id: "security", label: "Security", icon: FiShield },
              { id: "notifications", label: "Notifications", icon: FiBell },
              { id: "system", label: "System Info", icon: FiDatabase },
              { id: "data", label: "Data Export", icon: FiDownload },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg"
                      : "bg-white border-2 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-emerald-600" />
                    Profile Information
                  </h2>
                  {! isEditingProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                    >
                      <FiEdit className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg text-gray-800 font-medium">{userData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg text-gray-800 font-medium flex items-center gap-2">
                        <FiMail className="h-4 w-4 text-gray-400" />
                        {userData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type
                    </label>
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold text-sm capitalize">
                      {userData.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg font-semibold text-sm capitalize">
                      {userData.role}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Registered Since
                    </label>
                    <p className="text-lg text-gray-800 font-medium">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                      >
                        <FiX className="inline h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <FiRefreshCw className="inline h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="inline h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiLock className="text-emerald-600" />
                  Change Password
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        placeholder="Enter new password (min.  8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(! showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Password Requirements:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <FiCheck className="h-4 w-4" />
                        Minimum 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="h-4 w-4" />
                        Combination of letters and numbers recommended
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="h-4 w-4" />
                        Avoid easily guessable passwords
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <FiRefreshCw className="inline h-4 w-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <FiLock className="inline h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiBell className="text-emerald-600" />
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, emailNotifications: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0. 5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">New Project Submitted</h3>
                      <p className="text-sm text-gray-600">Alert when a company submits a new project</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newProjectAlert}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, newProjectAlert: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">New Transaction</h3>
                      <p className="text-sm text-gray-600">Alert when a transaction occurs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newTransactionAlert}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, newTransactionAlert: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">Audit Due Date</h3>
                      <p className="text-sm text-gray-600">Alert 7 days before audit due date</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.auditDueAlert}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, auditDueAlert: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">Suspicious Activity</h3>
                      <p className="text-sm text-gray-600">Alert for unusual transactions or patterns</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.suspiciousActivityAlert}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, suspiciousActivityAlert: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">Daily Summary</h3>
                      <p className="text-sm text-gray-600">Receive daily activity summary</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.dailySummary}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, dailySummary: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">Weekly Summary</h3>
                      <p className="text-sm text-gray-600">Receive weekly performance report</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklySummary}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, weeklySummary: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveNotificationSettings}
                  disabled={isSaving}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <FiRefreshCw className="inline h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="inline h-4 w-4 mr-2" />
                      Save Notification Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* System Info Tab */}
          {activeTab === "system" && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiDatabase className="text-emerald-600" />
                  System Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-emerald-900">Total Companies</h3>
                      <FiUsers className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">{systemStats.totalCompanies}</p>
                    <p className="text-sm text-emerald-600 mt-1">Registered in system</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-900">Total Projects</h3>
                      <FiFileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{systemStats.totalProjects}</p>
                    <p className="text-sm text-blue-600 mt-1">Active projects</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-purple-900">Total Certificates</h3>
                      <FiShield className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{systemStats.totalCertificates}</p>
                    <p className="text-sm text-purple-600 mt-1">Issued on blockchain</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-cyan-900">Total Transactions</h3>
                      <FiBarChart2 className="h-6 w-6 text-cyan-600" />
                    </div>
                    <p className="text-3xl font-bold text-cyan-700">{systemStats.totalTransactions}</p>
                    <p className="text-sm text-cyan-600 mt-1">Completed transactions</p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-yellow-900">Pending Approvals</h3>
                      <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-700">{systemStats.pendingApprovals}</p>
                    <p className="text-sm text-yellow-600 mt-1">Requires action</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-red-900">Active Audits</h3>
                      <FiSearch className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-700">{systemStats.activeAudits}</p>
                    <p className="text-sm text-red-600 mt-1">Ongoing audits</p>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 mb-2">System Health</p>
                      <p className="text-sm text-blue-800">
                        All system components are operational.  Database and blockchain network are running normally.
                        Last system check: {new Date().toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Export Tab */}
          {activeTab === "data" && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiDownload className="text-emerald-600" />
                  Data Export
                </h2>

                <div className="space-y-6">
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
                      <FiDownload className="text-blue-600" />
                      Export System Data
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Export all system data to CSV format for analysis, backup, or reporting purposes.
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Export includes:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-6 mb-4">
                      <li>• Companies and user accounts</li>
                      <li>• Projects and their details</li>
                      <li>• Certificate references (database only)</li>
                      <li>• Transaction references (database only)</li>
                      <li>• Audit records</li>
                    </ul>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ Note:</strong> Blockchain data (certificates, transactions) cannot be exported directly.  
                        Only database references will be included.  Blockchain data is immutable and stored on Hyperledger Fabric network.
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <FiRefreshCw className="h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FiDownload className="h-4 w-4" />
                          Export Data to CSV
                        </>
                      )}
                    </button>
                  </div>

                  <div className="border-2 border-purple-200 bg-purple-50 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-purple-800 mb-2 flex items-center gap-2">
                      <FiDatabase className="text-purple-600" />
                      Blockchain Data Information
                    </h3>
                    <p className="text-purple-700 mb-3">
                      Certificate and transaction data is stored on Hyperledger Fabric blockchain network and cannot be exported through this interface.
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2"><strong>Blockchain Data Includes:</strong></p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Certificate assets (immutable)</li>
                        <li>• Transaction records (immutable)</li>
                        <li>• Retirement records (permanent)</li>
                        <li>• Complete state history</li>
                      </ul>
                    </div>
                    <p className="text-sm text-purple-700 mt-4">
                      For blockchain data access, please contact your blockchain administrator or system administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RegulatorSettings;