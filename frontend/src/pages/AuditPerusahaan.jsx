// frontend/src/pages/AuditCompanies.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import {
  FiGrid,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiFilter,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiFileText,
  FiAlertCircle,
  FiTrendingUp,
  FiEye,
  FiEdit,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

const AuditCompanies = () => {
  const [activeMenu] = useState("audit");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    auditedCompanies: 0,
    notAuditedCompanies: 0,
  });
  const navigate = useNavigate();

  const sidebarMenu = [
    { id: "dashboard", icon: FiGrid, text: "Dashboard", link: "/regulator" },
    { id: "audit", icon: FiSearch, text: "Audit & Inspection", link: "/regulator/audit" },
    { id: "reports", icon: FiBarChart2, text: "Reports & Analytics", link: "/regulator/laporan" },
    { id: "notifications", icon: FiBell, text: "Notifications", link: "/regulator/notifikasi" },
    { id: "settings", icon: FiSettings, text: "Settings", link: "/regulator/pengaturan" },
  ];

  const [pendingNotifications, setPendingNotifications] = useState({
    accounts: 0,
    projects: 0,
    retirements: 0
  });

  useEffect(() => {
    // ✅ Force refresh on mount
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching companies and audits...");
  
        // ✅ Fetch companies with timestamp to prevent cache
        const companiesRes = await API.get(`/regulator/companies?t=${new Date().getTime()}`);
        const companiesData = companiesRes.data;
  
        // ✅ Fetch audits with timestamp to prevent cache
        const auditsRes = await API.get(`/regulator/audits?t=${new Date().getTime()}`);
        const auditsData = auditsRes.data;
  
        console.log("📊 Companies fetched:", companiesData.success ? companiesData.data.length : 0);
        console.log("📊 Audits fetched:", auditsData.success ? auditsData.data.length : 0);
  
        if (companiesData.success) {
          // ✅ Create audit map (latest audit per company)
          const auditMap = {};
          if (auditsData.success && auditsData.data.length > 0) {
            console.log("📋 Processing audits...");
            
            auditsData.data.forEach((audit) => {
              console.log(`   Audit for company_id ${audit.company_id}:`, {
                audit_date: audit.audit_date,
                score: audit.overall_score,
                risk: audit.risk_level,
                next_date: audit.next_audit_date
              });
              
              // Get latest audit for each company based on audit_date
              if (!auditMap[audit.company_id] || 
                  new Date(audit.audit_date) > new Date(auditMap[audit.company_id].audit_date)) {
                auditMap[audit.company_id] = audit;
              }
            });
            
            console.log("✅ Audit map created:", Object.keys(auditMap).length, "companies");
          } else {
            console.log("⚠️ No audits found");
          }
  
          // ✅ Transform companies with audit data
          const transformedData = companiesData.data.map((company) => {
            const latestAudit = auditMap[company.id];
  
            const companyData = {
              id: company.id,
              companyId: company.company_id,
              name: company.company,
              email: company.email,
              sector: company.type,
              status: company.is_validated === 1 ? "Active" : "Inactive",
              registrationDate: new Date(company.created_at).toLocaleDateString("en-US"),
              totalProjects: company.total_projects || 0,
              carbonCredits: company.total_carbon_credits || 0,
              
              // ✅ Audit data from database
              lastAuditDate: latestAudit 
                ? new Date(latestAudit.audit_date).toLocaleDateString("en-US")
                : null,
              lastAuditScore: latestAudit?.overall_score || null,
              lastAuditRating: latestAudit?.overall_rating || null,
              lastAuditStatus: latestAudit?.status || null,
              auditor: latestAudit?.auditor || null,
              nextAuditDate: latestAudit?.next_audit_date 
                ? new Date(latestAudit.next_audit_date).toLocaleDateString("en-US")
                : null,
              riskLevel: latestAudit?.risk_level || null,
              
              // ✅ Determine risk from audit score
              risk: determineRisk(latestAudit?.overall_score, latestAudit?.risk_level),
              
              website: company.website,
              province: company.province,
              city: company.city,
            };
  
            if (latestAudit) {
              console.log(`✅ Company ${company.company} has audit:`, {
                date: companyData.lastAuditDate,
                score: companyData.lastAuditScore,
                risk: companyData.risk,
                next: companyData.nextAuditDate
              });
            }
  
            return companyData;
          });
  
          console.log("✅ Transformed companies:", transformedData.length);
  
          setCompanies(transformedData);
  
          // ✅ Calculate stats
          const auditedCompanies = transformedData.filter(c => c.lastAuditDate !== null);
          const newStats = {
            totalCompanies: transformedData.length,
            auditedCompanies: auditedCompanies.length,
            notAuditedCompanies: transformedData.length - auditedCompanies.length,
          };
          
          console.log("📊 Stats:", newStats);
          setStats(newStats);
  
          // ✅ Generate upcoming schedule from next_audit_date
          generateUpcomingSchedule(transformedData);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();

    // ✅ Fetch pending notifications
    const fetchPendingNotifications = async () => {
      try {
        const accountsRes = await API.get("/regulator/pending-users");
        const accountsData = accountsRes.data;
        
        const projectsRes = await API.get("/projects/regulator/pending-projects");
        const projectsData = projectsRes.data;
        
        setPendingNotifications({
          accounts: accountsData.success ? accountsData.data.length : 0,
          projects: projectsData.success ? projectsData.data.length : 0,
          retirements: 0
        });
      } catch (error) {
        console.error("❌ Error fetching pending notifications:", error);
      }
    };
    
    fetchPendingNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // ✅ Determine risk based on overall_score or risk_level from database
  const determineRisk = (overallScore, riskLevel) => {
    // Prioritize risk_level from database if exists
    if (riskLevel) return riskLevel;
    
    // Otherwise calculate from score
    if (!overallScore) return "Not Assessed";
    if (overallScore >= 85) return "Low";
    if (overallScore >= 70) return "Medium";
    return "High";
  };

  // ✅ Generate upcoming schedule from next_audit_date in database
  const generateUpcomingSchedule = (companiesData) => {
    const companiesWithNextAudit = companiesData
      .filter(c => c.nextAuditDate !== null)
      .sort((a, b) => {
        const dateA = new Date(a.nextAuditDate);
        const dateB = new Date(b.nextAuditDate);
        return dateA - dateB;
      })
      .slice(0, 5);

    const schedule = companiesWithNextAudit.map((company) => ({
      id: company.id,
      company: company.name,
      date: company.nextAuditDate,
      auditor: company.auditor || "Admin Regulator",
      risk: company.risk,
      status: getAuditStatus(company.nextAuditDate),
    }));

    setUpcomingSchedule(schedule);
  };

  // ✅ Determine audit status based on next_audit_date
  const getAuditStatus = (nextAuditDate) => {
    if (!nextAuditDate) return "Not Scheduled";
    
    const nextDate = new Date(nextAuditDate);
    const today = new Date();
    const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return "Overdue";
    if (daysUntil <= 7) return "Upcoming";
    if (daysUntil <= 30) return "Scheduled";
    return "Planned";
  };

  const totalNotifications = 
    pendingNotifications.accounts + 
    pendingNotifications.projects + 
    pendingNotifications.retirements;

  const filteredCompanies = companies.filter((company) => {
    const matchStatus =
      selectedFilter === "all" ||
      (selectedFilter === "active" && company.status === "Active") ||
      (selectedFilter === "inactive" && company.status === "Inactive") ||
      (selectedFilter === "notaudited" && company.lastAuditDate === null);

    const matchSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.companyId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleStartAudit = (company) => {
    navigate(`/regulator/audit/${company.id}`, { state: { company } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading audit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar - sama seperti sebelumnya */}
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
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Audits</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Link to="/regulator" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <FiGrid className="inline" /> Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Company Audits</span>
              </div>
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

        {/* Stats Section - ✅ Updated dengan data real */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Companies</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalCompanies}</h3>
                  <p className="text-xs text-blue-600 mt-2 flex items-center">
                    <FiTrendingUp className="mr-1" />
                    Registered in system
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-4 rounded-xl shadow-sm">
                  <FiFileText className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Audited</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.auditedCompanies}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <FiCheckCircle className="mr-1" />
                    Audit completed
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-xl shadow-sm">
                  <FiCheckCircle className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Not Audited</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.notAuditedCompanies}</h3>
                  <p className="text-xs text-yellow-600 mt-2 flex items-center">
                    <FiClock className="mr-1" />
                    Requires audit
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-xl shadow-sm">
                  <FiAlertCircle className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <FiFilter className="text-gray-400" />
                <select
                  className="border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="notaudited">Not Audited Yet</option>
                </select>
              </div>
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search company..."
                  className="border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-12 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Companies Table - ✅ Updated dengan data audit real */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                <FiUsers className="text-emerald-600" />
                Company Audit List
              </h3>
              <span className="text-sm text-gray-500">
                Showing {filteredCompanies.length} of {companies.length} companies
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sector</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Last Audit</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Score</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Risk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Projects</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{company.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{company.companyId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            {company.sector}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              company.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {company.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {company.lastAuditDate ? (
                            <div className="text-sm">
                              <div className="text-gray-700 font-medium">{company.lastAuditDate}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                by {company.auditor}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm italic">Not audited yet</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {company.lastAuditScore ? (
                            <div>
                              <span
                                className={`px-3 py-1.5 rounded-lg font-bold text-lg ${
                                  company.lastAuditScore >= 85
                                    ? "bg-green-100 text-green-600"
                                    : company.lastAuditScore >= 70
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {company.lastAuditScore}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">{company.lastAuditRating}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              company.risk === "Low"
                                ? "bg-green-100 text-green-700"
                                : company.risk === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : company.risk === "High"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {company.risk}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div>
                            <span className="font-semibold text-gray-700">{company.totalProjects}</span>
                            <div className="text-xs text-gray-500">
                              {company.carbonCredits.toLocaleString("en-US")} tCO₂e
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleStartAudit(company)}
                            className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all transform hover:scale-105 text-sm font-semibold flex items-center gap-2 mx-auto"
                          >
                            {company.lastAuditDate ? (
                              <>
                                <FiEdit className="h-4 w-4" />
                                Re-Audit
                              </>
                            ) : (
                              <>
                                <FiEye className="h-4 w-4" />
                                Start Audit
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Audit Schedule - ✅ From next_audit_date */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-emerald-600" />
                Upcoming Audit Schedule
              </h3>
              <span className="text-sm text-gray-500">
                {upcomingSchedule.length} scheduled
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Next Audit Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Auditor</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Risk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingSchedule.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p>No upcoming audit scheduled</p>
                        <p className="text-xs text-gray-400 mt-1">Schedule audits by setting next audit date</p>
                      </td>
                    </tr>
                  ) : (
                    upcomingSchedule.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 font-medium text-gray-700">{schedule.company}</td>
                        <td className="px-4 py-4 text-gray-600 flex items-center gap-2">
                          <FiCalendar className="h-4 w-4 text-gray-400" />
                          {schedule.date}
                        </td>
                        <td className="px-4 py-4 text-gray-600">{schedule.auditor}</td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              schedule.risk === "Low"
                                ? "bg-green-100 text-green-700"
                                : schedule.risk === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : schedule.risk === "High"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {schedule.risk}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              schedule.status === "Overdue"
                                ? "bg-red-100 text-red-700"
                                : schedule.status === "Upcoming"
                                ? "bg-orange-100 text-orange-700"
                                : schedule.status === "Scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {schedule.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditCompanies;