// src/pages/DashboardUser. jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from 'react-hot-toast'; 
import {
  FiGrid,
  FiFolder,
  FiUpload,
  FiRepeat,
  FiBarChart2,
  FiLogOut,
  FiTrendingUp,
  FiDollarSign,
  FiAward,
  FiUsers,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiLogIn,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = 5000;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  return `http://${hostname}:${port}`;
};

// ============================================
// Sidebar Item Component
// ============================================
const SidebarItem = ({ icon: Icon, label, to, isExpanded, isActive, requireAuth = false, onClick }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick();
    
    if (requireAuth && !isAuthenticated()) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: to } } });
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg mx-2 mb-1 hover:bg-emerald-50 transition-all duration-300 ease-in-out ${
        isActive
          ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg"
          : "text-gray-700 hover:text-emerald-600"
      }`}
    >
      <Icon className="text-xl flex-shrink-0" />
      {isExpanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </Link>
  );
};

// ============================================
// StatsCard Component
// ============================================
const StatsCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2">{title}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${color} mb-1 truncate`}>{value}</p>
        <p className="text-gray-600 text-xs sm:text-sm">{subtitle}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl ${color.replace("text-", "bg-").replace("-600", "-100")} flex-shrink-0 ml-2`}>
        <Icon className={`${color} text-lg sm:text-xl`} />
      </div>
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================
const DashboardUser = () => {
  const { user, logout, isAuthenticated, getToken, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCertificatesCount, setActiveCertificatesCount] = useState(0);
  const [company, setCompany] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMainDashboard = location.pathname === "/dashboard";
  
  const hasFetchedData = useRef(false);
  const hasCheckedRole = useRef(false); // ✅ NEW: Prevent multiple role checks

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ CRITICAL FIX: Check user role on mount
  useEffect(() => {
    // Wait for auth to load
    if (loading || hasCheckedRole.current) {
      return;
    }

    const checkUserRole = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const userData = JSON.parse(userStr);
          const actualUser = userData.user || userData;
          
          console.log('🔍 [DashboardUser] Checking user role:', {
            type: actualUser.type,
            role: actualUser.role,
            path: location.pathname
          });

          // ✅ CRITICAL: Check if user is regulator
          const isRegulator = 
            actualUser.type === 'regulator' || 
            actualUser.role === 'regulator';

          if (isRegulator && location.pathname.startsWith('/dashboard')) {
            console.log('⚠️ [DashboardUser] Regulator detected in user dashboard!  Redirecting.. .');
            
            // ✅ Clear user dashboard state
            setCompany(null);
            setProjects([]);
            setActivities([]);
            setSchedules([]);
            hasFetchedData.current = false;
            
            // ✅ Redirect to regulator dashboard
            toast.info('Redirecting to regulator dashboard...');
            navigate('/regulator', { replace: true });
            
            hasCheckedRole.current = true;
            return;
          }

          // ✅ User is NOT regulator, allow access
          console.log('✅ [DashboardUser] User role verified - access granted');
          setCompany(actualUser);
        }
      } catch (error) {
        console.error('❌ [DashboardUser] Error checking user role:', error);
      }

      hasCheckedRole.current = true;
    };

    checkUserRole();
  }, [loading, location.pathname, navigate]);

  // ✅ Load user from localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedData = JSON.parse(storedUser);
          const userData = parsedData.user || parsedData;
          
          // ✅ CRITICAL: Double-check role before setting state
          const isRegulator = 
            userData.type === 'regulator' || 
            userData.role === 'regulator';

          if (isRegulator && location.pathname.startsWith('/dashboard')) {
            console.log('⚠️ [DashboardUser] Regulator data detected in storage, skipping.. .');
            return;
          }

          setCompany(userData);
          console.log('✅ User data loaded from localStorage:', userData.company || userData.email);
        }
      } catch (error) {
        console.error('❌ Error loading user from localStorage:', error);
      }
    };

    loadUserFromStorage();

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUserFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', loadUserFromStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated',loadUserFromStorage);
    };
  }, [location.pathname]);

  // ✅ UPDATED: Listen for logout event - INSTANT redirect
  useEffect(() => {
    const handleLogoutEvent = () => {
      console.log('🔓 [DashboardUser] Logout event received');
      
      // ✅ Clear ALL state
      setCompany(null);
      setProjects([]);
      setActivities([]);
      setSchedules([]);
      hasFetchedData.current = false;
      hasCheckedRole.current = false; // ✅ Reset role check
      setIsMobileMenuOpen(false);
      setIsLoggingOut(false);
      
      // ✅ INSTANT redirect to home (not login)
      navigate('/', { replace: true });
    };

    window.addEventListener('userLoggedOut', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('userLoggedOut', handleLogoutEvent);
    };
  }, [navigate]);

  // ✅ Update company when user from context changes
  useEffect(() => {
    if (user && ! company) {
      // ✅ Check if user is regulator
      const isRegulator = 
        user.type === 'regulator' || 
        user.role === 'regulator';

      if (isRegulator && location.pathname.startsWith('/dashboard')) {
        console.log('⚠️ [DashboardUser] Regulator user from context, redirecting...');
        navigate('/regulator', { replace: true });
        return;
      }

      setCompany(user);
      console.log('✅ User data loaded from context:', user.company || user.email);
    }
  }, [user, company, location.pathname, navigate]);

  // ✅ Auth check - Allow marketplace as public route
  useEffect(() => {
    if (loading) {
      console.log('⏳ [DashboardUser] Auth loading...');
      return;
    }

    // ✅ Public routes
    const publicRoutes = ['/marketplace'];
    const isPublicRoute = publicRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route)
    );

    if (isPublicRoute) {
      console.log('✅ [DashboardUser] Public route - no auth required:', location.pathname);
      return;
    }

    // ✅ Check auth for protected dashboard routes
    if (location.pathname.startsWith('/dashboard')) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (! token || !userStr) {
        console.log('❌ [DashboardUser] No auth data, redirecting to login');
        navigate('/login', { 
          replace: true, 
          state: { from: location.pathname } 
        });
      } else {
        // ✅ Additional role check
        try {
          const userData = JSON.parse(userStr);
          const actualUser = userData.user || userData;
          const isRegulator = 
            actualUser.type === 'regulator' || 
            actualUser.role === 'regulator';

          if (isRegulator) {
            console.log('⚠️ [DashboardUser] Regulator trying to access user dashboard, blocking...');
            navigate('/regulator', { replace: true });
            return;
          }

          console.log('✅ [DashboardUser] Authenticated user access granted');
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
        }
      }
    }
  }, [location.pathname, navigate, loading]);

  // ✅ Stable fetchData with useCallback
  const fetchData = useCallback(async () => {
    if (hasFetchedData.current) {
      console.log('⚠️ Data already fetched, skipping...');
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();

      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const API_BASE_URL = getApiBaseUrl();
      console.log("🔌 API Base URL:", API_BASE_URL);

      // Fetch user profile
      const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user data');
      
      const userData = await userRes.json();
      
      // ✅ CRITICAL: Check if fetched user is regulator
      const isRegulator = 
        userData.type === 'regulator' || 
        userData.role === 'regulator';

      if (isRegulator) {
        console.log('⚠️ [fetchData] Regulator data fetched in user dashboard!  Aborting...');
        navigate('/regulator', { replace: true });
        return;
      }

      setCompany(userData);

      // Fetch user projects
      const projRes = await fetch(`${API_BASE_URL}/api/projects/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!projRes.ok) throw new Error('Failed to fetch projects');
      
      const projData = await projRes.json();
      setProjects(projData.data || []);

      console.log('📊 Fetching certificate stats...');
      const certStatsRes = await fetch(
        `${API_BASE_URL}/api/certificates/my-certificates/stats`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      let activeCertificatesCount = 0;
      if (certStatsRes.ok) {
        const certStatsData = await certStatsRes.json();
        
        if (certStatsData.success) {
          activeCertificatesCount = certStatsData.data.active_on_marketplace || 0;
          console.log('✅ Certificate Stats Loaded - Active on Marketplace:', activeCertificatesCount);
        }
      } else {
        console.warn('⚠️ Failed to fetch certificate stats:', certStatsRes.status);
      }
  
      setActiveCertificatesCount(activeCertificatesCount);

      // Create recent activities
      const act = (projData.data || []).slice(-3).reverse().map((p) => ({
        id: p.project_id,
        projectId: p.project_id,
        title: `Project ${p.title}`,
        description:
          p.is_validated === 0
            ? "Awaiting regulator validation"
            : p.is_validated === 1
            ? "Already active"
            : p.is_validated === 2
            ? `Rejected: ${p.rejected_reason || "-"}`
            : "Unknown status",
        date: p.created_at,
      }));
      setActivities(act);

      // Schedule: projects under review
      const sched = (projData.data || [])
        .filter((p) => p.is_validated === 0)
        .map((p) => ({
          id: p.project_id,
          projectId: p.project_id,
          title: `Project Validation: ${p.title}`,
          date: p.start_date || new Date().toISOString(),
        }));
      setSchedules(sched);

      hasFetchedData.current = true;
      console.log('✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error("❌ Fetch dashboard error:", err);
      
      let errorMessage = 'Failed to load dashboard data';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (! navigator.onLine) {
        errorMessage = 'No internet connection. ';
      }
      
      toast.error(errorMessage, { duration: 5000, icon: '⚠️' });
    } finally {
      setIsLoading(false);
    }
  }, [getToken, navigate]);

  // ✅ Fetch data only once when conditions are met
  useEffect(() => {
    if (! loading && isAuthenticated() && isMainDashboard && !hasFetchedData.current) {
      console.log('📊 [DashboardUser] Fetching data...');
      fetchData();
    }
  }, [loading, isAuthenticated, isMainDashboard, fetchData]);

  // ✅ Reset fetch flag when leaving dashboard
  useEffect(() => {
    if (! isMainDashboard) {
      hasFetchedData.current = false;
    }
  }, [isMainDashboard]);

  // ✅ UPDATED: Enhanced Logout Handler
  const handleLogout = async () => {
    toast((t) => (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <FiLogOut className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Confirm Logout</h3>
            <p className="text-sm text-gray-600">You will be signed out of your account</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-4 py-2. 5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performLogout();
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0. 04)',
        border: '1px solid #e5e7eb',
        minWidth: '400px',
        maxWidth: '500px',
      },
    });
  };
  
  const performLogout = () => {
    try {
      console.log('🔓 [DashboardUser] Performing logout...');
      
      // ✅ Set logging out state
      setIsLoggingOut(true);
      
      // ✅ Smooth fade out (300ms)
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 300ms ease-out';
      
      setTimeout(() => {
        // ✅ Clear all state
        setCompany(null);
        setProjects([]);
        setActivities([]);
        setSchedules([]);
        setIsMobileMenuOpen(false);
        hasFetchedData.current = false;
        hasCheckedRole.current = false;
        
        // ✅ Perform logout
        logout();
        
        // ✅ Navigate
        navigate('/', { replace: true }); // or '/login'
        
        // ✅ Fade back in
        setTimeout(() => {
          document.body.style.opacity = '1';
          
          // ✅ Show success toast
          toast.success(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiLogOut className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-base">Logged out successfully</p>
                <p className="text-sm opacity-90">Thank you for using ChainCarbon</p>
              </div>
            </div>,
            {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
                padding: '16px',
              },
            }
          );
          
          setIsLoggingOut(false);
        }, 100);
      }, 300); // Wait for fade out
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      document.body.style.opacity = '1';
      setIsLoggingOut(false);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(! isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ✅ Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ChainCarbon Logo" className="w-8 h-8" />
          <span className="font-bold text-gray-800">ChainCarbon</span>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ?  <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
      >
        {/* Logo (Desktop only) */}
        <div className="hidden md:block p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ChainCarbon Logo" className="w-10 h-10 cursor-pointer" />
            {isExpanded && (
              <div>
                <h2 className="font-bold text-gray-800">ChainCarbon</h2>
                <p className="text-xs text-gray-500">Carbon Marketplace</p>
              </div>
            )}
          </Link>
        </div>

        {/* Mobile Menu Header */}
        <div className="md:hidden p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <img src={logo} alt="ChainCarbon Logo" className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-gray-800">ChainCarbon</h2>
              <p className="text-xs text-gray-500">Carbon Marketplace</p>
            </div>
          </Link>
          <button onClick={closeMobileMenu} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="py-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <SidebarItem
            icon={FiGrid}
            label="Dashboard"
            to="/dashboard"
            isExpanded={window.innerWidth < 768 ?  true : isExpanded}
            isActive={isMainDashboard}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiShoppingBag}
            label="Marketplace"
            to="/marketplace"
            isExpanded={window.innerWidth < 768 ? true : isExpanded}
            isActive={location.pathname === "/marketplace"}
            requireAuth={false}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiFolder}
            label="My Projects"
            to="/dashboard/project"
            isExpanded={window.innerWidth < 768 ? true : isExpanded}
            isActive={location.pathname.startsWith("/dashboard/project")}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiUpload}
            label="Submit Project"
            to="/dashboard/pengajuan"
            isExpanded={window.innerWidth < 768 ? true : isExpanded}
            isActive={location.pathname === "/dashboard/pengajuan"}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiRepeat}
            label="Transactions"
            to="/dashboard/transaksi"
            isExpanded={window.innerWidth < 768 ? true : isExpanded}
            isActive={location.pathname === "/dashboard/transaksi"}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiBarChart2}
            label="Reports"
            to="/dashboard/laporan"
            isExpanded={window.innerWidth < 768 ? true : isExpanded}
            isActive={location.pathname === "/dashboard/laporan"}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
          <SidebarItem
            icon={FiUser}
            label="Profile"
            to="/dashboard/profile"
            isExpanded={window.innerWidth < 768 ?  true : isExpanded}
            isActive={location.pathname === "/dashboard/profile"}
            requireAuth={true}
            onClick={closeMobileMenu}
          />
        </div>

        {/* User Info & Login/Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          {isAuthenticated() && (company || user) ?  (
            <div className="flex items-center justify-between gap-2">
              <Link 
                to="/dashboard/profile" 
                onClick={closeMobileMenu}
                className="flex items-center gap-3 min-w-0 hover:opacity-80 transition flex-1"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUsers className="text-white text-sm" />
                </div>
                {(window.innerWidth < 768 || isExpanded) && (
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {company?.company || user?.company || company?.email || user?.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate capitalize">
                      {company?.type || user?.type}
                    </p>
                  </div>
                )}
              </Link>
              {(window.innerWidth < 768 || isExpanded) && (
                <button
                  className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-2"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FiLogIn className="text-xl" />
              {(window.innerWidth < 768 || isExpanded) && <span>Login</span>}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* MAIN CONTENT */}
      <div className={`
        flex-1 overflow-auto transition-all duration-300 ease-in-out
        pt-16 md:pt-0
        ${isExpanded ? 'md:ml-64' : 'md:ml-20'}
      `}>
        {/* ✅ CRITICAL: Show loading spinner while logging out */}
        {isLoggingOut ?  (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Logging out...</p>
            </div>
          </div>
        ) : isMainDashboard ?  (
          isAuthenticated() ? (
            // ✅ Authenticated Dashboard
            <div>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-16 md:top-0 z-30 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                      <Link to="/" className="hover:text-emerald-600 transition-colors">
                        <FiHome className="inline" /> Home
                      </Link>
                      <span>/</span>
                      <span className="text-gray-700 font-medium">Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <StatsCard
                        title="My Projects"
                        value={projects.length}
                        subtitle="total projects"
                        icon={FiFolder}
                        color="text-emerald-600"
                      />
                      <StatsCard
                        title="Active on Marketplace"
                        value={activeCertificatesCount}
                        subtitle="available for sale"
                        icon={FiTrendingUp}
                        color="text-blue-600"
                      />
                      <StatsCard
                        title="Pending Projects"
                        value={projects.filter((p) => p.is_validated === 0).length}
                        subtitle="awaiting regulator"
                        icon={FiRepeat}
                        color="text-cyan-600"
                      />
                      <StatsCard
                        title="Total Value"
                        value={`Rp ${projects
                          .reduce((sum, p) => sum + (p.est_volume || 0) * (p.price_per_unit || 0), 0)
                          .toLocaleString("id-ID")}`}
                        subtitle="portfolio value"
                        icon={FiDollarSign}
                        color="text-purple-600"
                      />
                    </div>

                    {/* Activities */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Recent Activity</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {activities.length > 0 ? (
                          activities.map((a) => (
                            <Link
                              to={`/dashboard/project/${a.projectId}`}
                              key={a.id}
                              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                            >
                              <div className="p-2 rounded-lg bg-emerald-500 flex-shrink-0">
                                <FiAward className="text-white" size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{a.title}</p>
                                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{a.description}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(a.date).toLocaleString("en-US", {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No recent activity.</p>
                        )}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Upcoming Schedule</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {schedules.length > 0 ?  (
                          schedules.map((s) => (
                            <Link
                              to={`/dashboard/project/${s.projectId}`}
                              key={s.id}
                              className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                            >
                              <FiCalendar className="text-blue-600 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{s.title}</p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {new Date(s.date).toLocaleDateString("en-US", {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No upcoming schedule.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            // ✅ Guest Dashboard - ONLY show if NOT logging out
            // This block will NOT render if isLoggingOut is true (handled above)
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">Welcome to ChainCarbon!  🌱</h1>
                <p className="text-blue-50 mb-6 text-sm sm:text-base">
                  Login to access your dashboard, manage projects, and trade carbon credits. 
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-center"
                  >
                    Register
                  </Link>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <FiShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Browse Marketplace</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">
                    Explore carbon credits available for purchase
                  </p>
                  <Link to="/marketplace" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                    Go to Marketplace →
                  </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <FiFolder className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Manage Projects</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">
                    Create and track your carbon reduction projects
                  </p>
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Login Required →
                  </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <FiAward className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Track Certificates</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">
                    Monitor your carbon credit certificates
                  </p>
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    Login Required →
                  </Link>
                </div>
              </div>
            </div>
          )
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default DashboardUser;