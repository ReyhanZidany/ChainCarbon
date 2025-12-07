// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requireRegulator = false }) => {
  const { user, loading, isAuthenticated, isRegulator } = useAuth();
  const location = useLocation();

  // ✅ Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // ✅ Check if user is authenticated
  if (!isAuthenticated()) {
    console.warn("⚠️ User not authenticated - Redirecting to login");
    console.warn("   Attempted path:", location.pathname);
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Check if route requires regulator access
  if (requireRegulator) {
    console.log("🔐 Checking regulator access...");
    console.log("   User:", user?.name || user?.email);
    console.log("   Type:", user?.type);
    console.log("   Is Regulator:", isRegulator());
    
    if (!isRegulator()) {
      console.error("❌ Access denied - User is not a regulator");
      console.error("   User type:", user?.type);
      console.error("   User email:", user?.email);
      console.error("   Attempted path:", location.pathname);
      
      // ✅ Improved toast notifications
      toast.error("Access Denied: Regulator privileges required", {
        icon: '🚫',
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fca5a5'
        }
      });
      
      // ✅ Redirect based on user type
      const redirectPath = user?.type === 'company' || user?.type === 'korporasi' 
        ? '/dashboard' 
        : '/';
      
      console.log(`   → Redirecting to ${redirectPath}`);
      return <Navigate to={redirectPath} replace />;
    }

    console.log("✅ Regulator access granted");
  }

  // ✅ All checks passed - render children
  return children;
};

export default ProtectedRoute;