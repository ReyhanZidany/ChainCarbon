// 📁 src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// ✅ Export hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ✅ Helper: Decode JWT token
const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

// ✅ Helper: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// ✅ Helper: Get time until token expires (in seconds)
const getTokenExpiryTime = (token) => {
  if (!token) return 0;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const currentTime = Date.now() / 1000;
  const timeLeft = decoded.exp - currentTime;
  
  return Math.max(0, Math.floor(timeLeft));
};

// ✅ AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// ✅ FIXED: logout function with event dispatch
const logout = useCallback(() => {
  console.log('🔓 Logging out user...');
  
  // ✅ CRITICAL: Clear storage FIRST
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // ✅ Reset state
  setUser(null);
  
  // ✅ CRITICAL: Dispatch event for other components
  window.dispatchEvent(new Event('userLoggedOut'));
  
  console.log('✅ Logout successful');
}, []);

   // ✅ NEW: Load user from localStorage
   const loadUserFromStorage = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('user');

      if (!token || !userDataStr) {
        console.log('⚠️ No auth data found in storage');
        return null;
      }

      if (isTokenExpired(token)) {
        console.log('⚠️ Token expired');
        return null;
      }

      const userData = JSON.parse(userDataStr);
      // Handle both formats: { user: {...} } or direct {...}
      const actualUser = userData.user || userData;
      
      console.log('✅ [AuthContext] User loaded from storage:', actualUser?.company || actualUser?.email);
      return actualUser;
    } catch (error) {
      console.error('❌ Error loading user from storage:', error);
      return null;
    }
  }, []);

  // ✅ Check and validate authentication
  const validateAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('user');

      // No token or user data
      if (!token || !userDataStr) {
        console.log('⚠️ No auth data found');
        logout();
        return false;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('⚠️ Token expired, clearing session');
        toast.error('Your session has expired. Please login again.', {
          duration: 5000,
        });
        logout();
        return false;
      }

      // Parse and set user data
      const userData = JSON.parse(userDataStr);
      setUser(userData);
      
      // Log time until expiry
      const timeLeft = getTokenExpiryTime(token);
      const hoursLeft = Math.floor(timeLeft / 3600);
      const minutesLeft = Math.floor((timeLeft % 3600) / 60);
      console.log(`✅ User authenticated: ${userData.name} (Token expires in ${hoursLeft}h ${minutesLeft}m)`);
      
      return true;
    } catch (error) {
      console.error('❌ Auth validation error:', error);
      logout();
      return false;
    }
  }, [logout]);

  // ✅ Initial auth check on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 Checking authentication...');
      validateAuth();
      setLoading(false);
    };

    initAuth();
  }, [validateAuth]);

   // ✅ NEW: Listen for storage changes (for cross-tab sync AND same-tab updates)
   useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('📦 [AuthContext] Storage changed:', e.key);
      
      // Handle storage events (from other tabs or manual triggers)
      if (e.key === 'user' || e.key === 'token' || e.key === null) {
        console.log('🔄 [AuthContext] Reloading user from storage...');
        const updatedUser = loadUserFromStorage();
        if (updatedUser) {
          setUser(updatedUser);
          console.log('✅ [AuthContext] User updated:', updatedUser?.company || updatedUser?.email);
        } else {
          console.log('❌ [AuthContext] No valid user found, logging out');
          logout();
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // ✅ NEW: Custom event for same-tab updates
    const handleCustomUserUpdate = () => {
      console.log('🔄 [AuthContext] Custom user update event received');
      const updatedUser = loadUserFromStorage();
      if (updatedUser) {
        setUser(updatedUser);
        console.log('✅ [AuthContext] User updated from custom event:', updatedUser?.company || updatedUser?.email);
      }
    };

    window.addEventListener('userUpdated', handleCustomUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomUserUpdate);
    };
  }, [loadUserFromStorage, logout]);

  // ✅ Periodic token expiry check (every 5 minutes)
  useEffect(() => {
    if (!user) return; // Only check if user is logged in

    console.log('⏰ Starting periodic token check (every 5 minutes)');

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        clearInterval(interval);
        return;
      }

      // Check if expired
      if (isTokenExpired(token)) {
        console.log('⚠️ Token expired during session');
        toast.error('Your session has expired. Please login again.', {
          duration: 5000,
        });
        logout();
        clearInterval(interval);
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      // Warn if expiring soon (< 30 minutes)
      const timeLeft = getTokenExpiryTime(token);
      if (timeLeft < 1800 && timeLeft > 0) { // Less than 30 minutes
        const minutesLeft = Math.floor(timeLeft / 60);
        toast('⚠️ Your session will expire soon. Please save your work.', {
          icon: '⏰',
          duration: 8000,
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
        console.log(`⚠️ Token expiring in ${minutesLeft} minutes`);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      console.log('🛑 Stopping periodic token check');
      clearInterval(interval);
    };
  }, [user, logout]);

  // ✅ Login function
  const login = useCallback((userData, token) => {
    try {
      console.log('🔐 Logging in user:', userData.name);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Log token expiry
      const timeLeft = getTokenExpiryTime(token);
      const hoursLeft = Math.floor(timeLeft / 3600);
      console.log(`✅ Login successful - Token valid for ${hoursLeft} hours`);
      
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Failed to save login data');
      return false;
    }
  }, []);

  // ✅ Helper: Check if authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    return !!user && !!token && !isTokenExpired(token);
  }, [user]);

  // ✅ Helper: Check if user is regulator
  const isRegulator = useCallback(() => {
    return user?.type === 'regulator';
  }, [user]);

  // ✅ Helper: Require authentication (for protected routes)
  const requireAuth = useCallback(() => {
    if (!isAuthenticated()) {
      toast.error('Please login to access this page');
      return false;
    }
    return true;
  }, [isAuthenticated]);

  // ✅ Helper: Get current user
  const getUser = useCallback(() => {
    return user;
  }, [user]);

  // ✅ Helper: Get token
  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      logout();
      return null;
    }
    return token;
  }, [logout]);

  // ✅ Context value
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isRegulator,
    requireAuth,
    getUser,
    getToken,
    validateAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;