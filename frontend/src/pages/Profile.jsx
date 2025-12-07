// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiGlobe,
  FiMapPin,
  FiEdit,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiCalendar,
  FiShield,
  FiRefreshCw,
  FiCamera,
} from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFetching(false);
          setMessageType("error");
          setMessage("Token not found. Please login again.");
          return;
        }

        const freshUser = await getUserProfile(token);
        setUser(freshUser.user);
        setForm(freshUser.user);
        localStorage.setItem("user", JSON.stringify(freshUser));
        window.dispatchEvent(new Event('userUpdated'));
        console.log('✅ [Profile] User loaded and event dispatched:', freshUser.user?.company);
    
      } catch (err) {
        console.error("Fetch user error:", err);
        setMessageType("error");
        setMessage("Failed to load profile data. Please refresh the page.");
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm(user); 
    setMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUserProfile(form, token);

      setUser(updatedUser.user);
      setForm(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));
      console.log('✅ [Profile] User updated and event dispatched:', updatedUser.user?.company);
      setMessageType("success");
      setMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setMessageType("error");
      setMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Data Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {message || "Failed to load profile data. Please login again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <FiRefreshCw className="inline h-4 w-4 mr-2" />
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
<   div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4 max-w-[1600px] mx-auto w-full">
      <div className="w-full">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center gap-3 ${
              messageType === "success"
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}
          >
            {messageType === "success" ? (
              <FiCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`font-medium ${
                messageType === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="text-3xl font-bold">
                    {user.company ? user.company.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <FiCamera className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user.company || "Company"}
                </h1>
                {/* Email */}
                <p className="text-gray-500 flex items-center gap-2 mt-2">
                  <FiMail className="h-4 w-4" />
                  {user.email}
                </p>
                {/* Status & Type Badges */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_validated === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.is_validated === 1 ? (
                      <>
                        <FiCheck className="inline h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <FiAlertCircle className="inline h-3 w-3 mr-1" />
                        Awaiting Verification
                      </>
                    )}
                  </span>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold capitalize">
                    <FiShield className="inline h-3 w-3 mr-1" />
                    {user.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                <FiEdit className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Registration Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <FiCalendar className="h-4 w-4" />
            Registered since{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiUser className="text-emerald-600" />
            Company Information
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* ✅ Company ID (Read-only) - Tambahkan field baru */}
            {user.company_id && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company ID
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.company_id || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600 font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Unique company identifier
                </p>
              </div>
            )}

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email || ""}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={form.company || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-colors ${
                    isEditing
                      ? "border-gray-200 focus:border-emerald-500 focus:outline-none"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={form.website || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-colors ${
                    isEditing
                      ? "border-gray-200 focus:border-emerald-500 focus:outline-none"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Location (Province & City) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Province */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Province
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="province"
                    value={form.province || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-colors ${
                      isEditing
                        ? "border-gray-200 focus:border-emerald-500 focus:outline-none"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                    placeholder="Example: DKI Jakarta"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City/District
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={form.city || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-colors ${
                      isEditing
                        ? "border-gray-200 focus:border-emerald-500 focus:outline-none"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                    placeholder="Example: South Jakarta"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons (only show when editing) */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  <FiX className="inline h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? (
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;