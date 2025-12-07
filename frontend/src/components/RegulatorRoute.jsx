// // frontend/src/components/RegulatorRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useEffect } from "react";

// const RegulatorRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const userString = localStorage.getItem("user");
  
//   useEffect(() => {
//     console.log("🔐 RegulatorRoute: Checking access...");
//     console.log("   Token exists:", !!token);
//     console.log("   User data:", userString);
//   }, [token, userString]);
  
//   // Check if user is logged in
//   if (!token || !userString) {
//     console.warn("⚠️ No authentication - Redirecting to login");
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const user = JSON.parse(userString);
    
//     console.log("👤 User info:");
//     console.log("   Type:", user.type);
//     console.log("   Email:", user.email);
//     console.log("   Name:", user.name);
    
//     // Check if user type is regulator
//     if (user.type !== "regulator") {
//       console.error("❌ Access denied - User is not a regulator");
//       console.error("   User type:", user.type);
//       console.error("   Redirecting to dashboard...");
      
//       alert("⚠️ Access Denied\n\nYou don't have permission to access regulator features.");
      
//       // Redirect based on user type
//       return <Navigate to="/dashboard" replace />;
//     }

//     console.log("✅ Regulator access granted");
//     return children;
    
//   } catch (error) {
//     console.error("❌ Error parsing user data:", error);
//     return <Navigate to="/login" replace />;
//   }
// };

// export default RegulatorRoute;