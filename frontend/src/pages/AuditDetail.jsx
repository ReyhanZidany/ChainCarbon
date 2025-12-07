// frontend/src/pages/AuditDetail.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import {
  FiArrowLeft,
  FiAlertCircle,
  FiFileText,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiSave,
  FiX,
  FiCheckCircle,
  FiInfo,
  FiGlobe,
  FiActivity,
  FiTarget,
  FiLayers,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

const AuditDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState(location.state?.company || null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(!company);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company"); 
  
  const [auditData, setAuditData] = useState({
    auditDate: new Date().toISOString().split('T')[0],
    auditor: "Admin Regulator",
    
    // Financial (2)
    financialTransparency: 0,
    complianceRegulatory: 0,
    
    // Documentation (2)
    documentationCompleteness: 0,
    verificationMethodology: 0,
    
    // Operational (3)
    projectImplementation: 0,
    monitoringReporting: 0,
    stakeholderEngagement: 0,
    
    findings: "",
    recommendations: "",
    strengths: "",
    weaknesses: "",
    actionItems: "",
    nextAuditDate: "",
    status: "draft",
    riskLevel: "Medium",
  });

  useEffect(() => {
    if (!company && id) {
      fetchCompanyDetail();
    } else if (company) {
      fetchCompanyProjects();
      fetchCompanyCertificates();
      fetchCompanyTransactions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, company]);

  const fetchCompanyDetail = async () => {
    try {
      console.log("🏢 Fetching company detail...");
      const res = await API.get(`/regulator/companies/${id}`);
      const data = res.data;
      
      console.log("🏢 Company response:", data);
      
      if (data.success) {
        const companyData = {
          id: data.data.id,
          companyId: data.data.company_id,
          name: data.data.company,
          email: data.data.email,
          sector: data.data.type,
          status: data.data.is_validated === 1 ? "Active" : "Inactive",
          totalProjects: data.data.total_projects || 0,
          carbonCredits: data.data.total_carbon_credits || 0,
          website: data.data.website || "N/A",
          province: data.data.province || "N/A",
          city: data.data.city || "N/A",
          address: data.data.address || "N/A",
          postalCode: data.data.postal_code || "N/A",
          registrationDate: new Date(data.data.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          lastActivity: data.data.updated_at 
            ? new Date(data.data.updated_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : "No activity",
        };
        
        console.log("✅ Company data processed:", companyData);
        
        setCompany(companyData);
        
        await Promise.all([
          fetchCompanyProjects(companyData.id),
          fetchCompanyCertificates(companyData.id),
          fetchCompanyTransactions(companyData.id),
        ]);
      }
    } catch (error) {
      console.error("❌ Error fetching company:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCompanyProjects = async (companyUserId = company?.id) => {
    try {
      console.log(`📁 Fetching projects for company user ID: ${companyUserId}`);
      const res = await API.get(`/regulator/companies/${companyUserId}/projects`);
      const data = res.data;
      
      console.log("📁 Projects response:", data);
      
      if (data.success) {
        setProjects(data.data || []);
        console.log(`✅ Loaded ${data.data.length} projects`);
      } else {
        console.log("⚠️ No projects found or error:", data.message);
        setProjects([]);
      }
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setProjects([]);
    }
  };
  
  const fetchCompanyCertificates = async (companyUserId = company?.id) => {
    try {
      console.log(`📜 Fetching certificates for company user ID: ${companyUserId}`);
      const res = await API.get(`/regulator/companies/${companyUserId}/certificates`);
      const data = res.data;
      
      console.log("📜 Certificates response:", data);
      
      if (data.success) {
        setCertificates(data.data || []);
        console.log(`✅ Loaded ${data.data.length} certificates`);
      } else {
        console.log("⚠️ No certificates found or error:", data.message);
        setCertificates([]);
      }
    } catch (error) {
      console.error("❌ Error fetching certificates:", error);
      setCertificates([]);
    }
  };
  
  const fetchCompanyTransactions = async (companyUserId = company?.id) => {
    try {
      console.log(`💰 Fetching transactions for company user ID: ${companyUserId}`);
      const res = await API.get(`/regulator/companies/${companyUserId}/transactions`);
      const data = res.data;
      
      console.log("💰 Transactions response:", data);
      
      if (data.success) {
        setTransactions(data.data || []);
        console.log(`✅ Loaded ${data.data.length} transactions`);
      } else {
        console.log("⚠️ No transactions found or error:", data.message);
        setTransactions([]);
      }
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  const handleInputChange = (field, value) => {
    setAuditData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field.includes('Score') || field.includes('accuracy') || field.includes('Proof')) {
        const overallScore = calculateOverallScore(updated);
        updated.riskLevel = 
          overallScore >= 85 ? "Low" :
          overallScore >= 70 ? "Medium" : "High";
      }
      
      return updated;
    });
  };

  const calculateOverallScore = (data = auditData) => {
    const scores = [
      // Financial (2)
      data.financialTransparency,
      data.complianceRegulatory,
      
      // Documentation (2)
      data.documentationCompleteness,
      data.verificationMethodology,
      
      // Operational (3)
      data.projectImplementation,
      data.monitoringReporting,
      data.stakeholderEngagement,
    ];
    
    const total = scores.reduce((sum, score) => sum + parseInt(score || 0), 0);
    return Math.round(total / scores.length);
  };

  const getRating = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getRiskColor = (risk) => {
    if (risk === "Low") return "bg-green-100 text-green-700";
    if (risk === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleSaveAudit = async () => {
    setIsSaving(true);
    
    try {
      const overallScore = calculateOverallScore();
      const rating = getRating(overallScore);
      
      if (!auditData.findings || !auditData.recommendations) {
        alert("⚠️ Please fill in findings and recommendations before saving.");
        setIsSaving(false);
        return;
      }
      
      const auditPayload = {
        company_id: company.id,
        audit_date: auditData.auditDate,
        auditor_name: auditData.auditor,
        
        financial_score: Math.round((
          parseInt(auditData.financialTransparency || 0) + 
          parseInt(auditData.complianceRegulatory || 0)
        ) / 2),
        
        documentation_score: Math.round((
          parseInt(auditData.documentationCompleteness || 0) + 
          parseInt(auditData.verificationMethodology || 0)
        ) / 2),
        
        operational_score: Math.round((
          parseInt(auditData.projectImplementation || 0) +
          parseInt(auditData.monitoringReporting || 0) +
          parseInt(auditData.stakeholderEngagement || 0)
        ) / 3),
        
        compliance_score: parseInt(auditData.complianceRegulatory || 0),
        
        overall_score: overallScore,
        overall_rating: rating,
        
        findings: auditData.findings,
        recommendations: auditData.recommendations,
        strengths: auditData.strengths || null,
        weaknesses: auditData.weaknesses || null,
        action_items: auditData.actionItems || null,
        
        next_audit_date: auditData.nextAuditDate || null,
        status: auditData.status || "draft",
        risk_level: auditData.riskLevel || "Medium",
      };
  
      console.log("📤 Sending audit payload:", auditPayload);
  
      const response = await API.post("/regulator/audits", auditPayload);
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || "Failed to save audit");
      }      
      
      alert(
        `✅ Audit Successfully Saved!\n\n` +
        `Company: ${company.name}\n` +
        `Overall Score: ${overallScore}/100\n` +
        `Rating: ${rating}\n` +
        `Audit ID: ${data.data.auditId}`
      );
      
      navigate("/regulator/audit?refresh=" + new Date().getTime());
    } catch (error) {
      console.error("❌ Error saving audit:", error);
      alert(`❌ Failed to save audit:\n${error.message}`);
    } finally {
      setIsSaving(false);
    }
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

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-4">Company data not found</p>
          <Link to="/regulator/audit" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            ← Back to Audit List
          </Link>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const rating = getRating(overallScore);

  const auditCriteria = [
    {
      category: "Financial & Compliance",
      criteria: [
        {
          field: "financialTransparency",
          label: "Financial Transparency",
          description: "Clear financial records and transparent fund allocation",
        },
        {
          field: "complianceRegulatory",
          label: "Regulatory Compliance",
          description: "Adherence to local and international regulations",
        },
      ],
    },
    {
      category: "Documentation & Verification",
      criteria: [
        {
          field: "documentationCompleteness",
          label: "Documentation Completeness",
          description: "Completeness and quality of project documentation",
        },
        {
          field: "verificationMethodology",
          label: "Verification Methodology",
          description: "Quality and reliability of verification methods used",
        },
      ],
    },
    {
      category: "Operational Excellence",
      criteria: [
        {
          field: "projectImplementation",
          label: "Project Implementation",
          description: "Quality and effectiveness of project execution",
        },
        {
          field: "monitoringReporting",
          label: "Monitoring & Reporting",
          description: "Regular monitoring and transparent reporting practices",
        },
        {
          field: "stakeholderEngagement",
          label: "Stakeholder Engagement",
          description: "Community involvement and local stakeholder participation",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/regulator/audit"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Audit List</span>
            </Link>
            <div className="flex items-center gap-3">
              <img src={logo} alt="ChainCarbon" className="w-8 h-8" />
              <span className="font-bold text-gray-800">ChainCarbon Audit System</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Company Audit: {company.name}
              </h1>
              <p className="text-gray-600">
                Company ID: {company.companyId} • Sector: {company.sector}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                company.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {company.status}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(auditData.riskLevel)}`}>
                Risk: {auditData.riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-b-0 border-gray-100 overflow-hidden mb-0">
          <div className="flex overflow-x-auto">
            {[
              { id: "company", label: "Company Details", icon: FiUsers },
              { id: "projects", label: "Projects & Certificates", icon: FiLayers },
              { id: "audit", label: "Audit Evaluation", icon: FiCheckCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                      : "border-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {tab.id === "projects" && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                      {projects.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 p-6">
          {/* Company Details Tab */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Company Profile & Information</h2>
              
              {/* Company Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiMail className="text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Email Address</span>
                      <p className="text-gray-800 font-medium text-sm break-all">{company.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Website</span>
                      {company.website ? (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 break-all"
                        >
                          <FiGlobe className="flex-shrink-0" size={14} />
                          {company.website}
                        </a>
                      ) : (
                        <p className="text-gray-400 text-sm">N/A</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-emerald-600" />
                    Location Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">City</span>
                      <p className="text-gray-800 font-medium text-sm">{company.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Province</span>
                      <p className="text-gray-800 font-medium text-sm">{company.province}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiActivity className="text-purple-600" />
                    Business Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Business Sector</span>
                      <p className="text-gray-800 font-medium text-sm">{company.sector}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Registration Date</span>
                      <p className="text-gray-800 font-medium text-sm flex items-center gap-1">
                        <FiCalendar size={14} className="text-gray-400" />
                        {company.registrationDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Total Projects</p>
                      <h3 className="text-3xl font-bold text-gray-800">{company.totalProjects}</h3>
                      <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                        <FiTarget size={12} />
                        Active in system
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-4 rounded-xl">
                      <FiFileText className="text-emerald-600 text-2xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-cyan-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Carbon Credits</p>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800">
                          {company.carbonCredits.toLocaleString("en-US")}
                        </h3>
                        <p className="text-xs text-gray-500">tCO₂e</p>
                      </div>
                      <p className="text-xs text-cyan-600 mt-2 flex items-center gap-1">
                        <FiTrendingUp size={12} />
                        Total issued
                      </p>
                    </div>
                    <div className="bg-cyan-100 p-4 rounded-xl">
                      <FiDollarSign className="text-cyan-600 text-2xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Certificates</p>
                      <h3 className="text-3xl font-bold text-gray-800">{certificates.length}</h3>
                      <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                        <FiCheckCircle size={12} />
                        Total issued
                      </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-xl">
                      <FiLayers className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
                <div className="flex items-start gap-3">
                  <FiInfo className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Company Verification Status</p>
                    <p className="text-sm text-blue-800">
                      This company is currently <strong>{company.status}</strong> in the ChainCarbon system. 
                      {company.status === "Active" 
                        ? " All projects and certificates are validated and operational."
                        : " Please verify all information before approving projects."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects & Certificates Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Projects & Certificates</h2>
              
              {/* Projects Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiTarget className="text-emerald-600" />
                  Active Projects ({projects.length})
                </h3>
                
                {projects.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No projects found for this company</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.project_id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 text-lg">{project.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            project.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Category:</span>
                            <span className="font-medium text-gray-700">{project.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium text-gray-700">{project.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Expected Reduction:</span>
                            <span className="font-semibold text-emerald-600">
                              {parseInt(project.volume).toLocaleString()} tCO₂e
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Start Date:</span>
                            <span className="font-medium text-gray-700">
                              {new Date(project.start_date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {project.description && (
                          <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificates Section */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-purple-600" />
                  Issued Certificates ({certificates.length})
                </h3>
                
                {certificates.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <FiLayers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No certificates issued yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cert ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Issued Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expires</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {certificates.map((cert) => (
                          <tr key={cert.cert_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm text-gray-700">{cert.cert_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{cert.project_title || 'N/A'}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-semibold text-emerald-600">
                                {parseInt(cert.amount).toLocaleString()} tCO₂e
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                cert.status === 'ISSUED' 
                                  ? 'bg-green-100 text-green-700'
                                  : cert.status === 'RETIRED'
                                  ? 'bg-gray-100 text-gray-700'
                                  : cert.status === 'LISTED'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {cert.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {new Date(cert.issued_at).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {cert.expires_at 
                                ? new Date(cert.expires_at).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                : 'No expiry'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ✅ COMPLETE FIX: Transaction Summary */}
              {transactions.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiActivity className="text-cyan-600" />
                    Recent Transactions ({transactions.length})
                  </h3>
                  
                  <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      {/* ✅ Total Sales (company as seller) */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Sales</p>
                        <p className="text-2xl font-bold text-cyan-700">
                          {transactions.filter(t => 
                            t.seller_company_id === company.companyId || 
                            t.seller_company_id === company.id
                          ).length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transactions
                            .filter(t => 
                              t.seller_company_id === company.companyId || 
                              t.seller_company_id === company.id
                            )
                            .reduce((sum, t) => sum + parseInt(t.amount || 0), 0)
                            .toLocaleString()} tCO₂e sold
                        </p>
                      </div>
                      
                      {/* ✅ Total Purchases (company as buyer) */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Purchases</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {transactions.filter(t => 
                            t.buyer_company_id === company.companyId || 
                            t.buyer_company_id === company.id
                          ).length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transactions
                            .filter(t => 
                              t.buyer_company_id === company.companyId || 
                              t.buyer_company_id === company.id
                            )
                            .reduce((sum, t) => sum + parseInt(t.amount || 0), 0)
                            .toLocaleString()} tCO₂e bought
                        </p>
                      </div>
                      
                      {/* ✅ Total Volume (all transactions) */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Volume</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          {transactions.reduce((sum, t) => sum + parseInt(t.amount || 0), 0).toLocaleString()} tCO₂e
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Combined volume
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit Evaluation Tab */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2 opacity-90">Overall Audit Score</h2>
                  <div className="text-7xl font-bold mb-2">{overallScore}</div>
                  <div className="text-2xl opacity-90">/ 100</div>
                  <div className="mt-4 inline-block px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full">
                    <span className="font-semibold text-lg">{rating}</span>
                  </div>
                  <p className="text-sm opacity-75 mt-4">
                    Based on {auditCriteria.reduce((sum, cat) => sum + cat.criteria.length, 0)} evaluation criteria
                  </p>
                </div>
              </div>

              {/* Audit Criteria by Category */}
              {auditCriteria.map((category) => (
                <div key={category.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-600" />
                    {category.category}
                  </h2>
                  
                  <div className="space-y-6">
                    {category.criteria.map((item) => (
                      <div key={item.field} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700">
                              {item.label}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg font-bold text-sm ml-4 ${getScoreColor(auditData[item.field])}`}>
                            {auditData[item.field]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={auditData[item.field]}
                          onChange={(e) => handleInputChange(item.field, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${auditData[item.field]}%, #e5e7eb ${auditData[item.field]}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Audit Details Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-lg text-gray-800 mb-6">Audit Details & Metadata</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Audit Date</label>
                      <input
                        type="date"
                        value={auditData.auditDate}
                        onChange={(e) => handleInputChange("auditDate", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Auditor</label>
                      <input
                        type="text"
                        value={auditData.auditor}
                        onChange={(e) => handleInputChange("auditor", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={auditData.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Strengths <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={auditData.strengths}
                      onChange={(e) => handleInputChange("strengths", e.target.value)}
                      rows="3"
                      placeholder="Document company's strong points and best practices..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Weaknesses <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={auditData.weaknesses}
                      onChange={(e) => handleInputChange("weaknesses", e.target.value)}
                      rows="3"
                      placeholder="Identify areas that need improvement..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Audit Findings <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={auditData.findings}
                      onChange={(e) => handleInputChange("findings", e.target.value)}
                      rows="4"
                      placeholder="Document all audit findings, issues discovered, and observations..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recommendations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={auditData.recommendations}
                      onChange={(e) => handleInputChange("recommendations", e.target.value)}
                      rows="4"
                      placeholder="Provide actionable recommendations for improvement..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Action Items <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={auditData.actionItems}
                      onChange={(e) => handleInputChange("actionItems", e.target.value)}
                      rows="3"
                      placeholder="List specific action items with deadlines..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Next Audit Date</label>
                    <input
                      type="date"
                      value={auditData.nextAuditDate}
                      onChange={(e) => handleInputChange("nextAuditDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/regulator/audit")}
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiX className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveAudit}
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-5 w-5" />
                      Save Audit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditDetail;