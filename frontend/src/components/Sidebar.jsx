// // src/components/Sidebar.jsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   LayoutDashboard,
//   Package,
//   Award,
//   ShoppingBag,
//   FileText,
//   User,
//   Bell,
//   LogOut,
// } from "lucide-react";

// const Sidebar = () => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const location = useLocation();

//   const menus = [
//     { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { path: "/dashboard/proyek", label: "Proyek Saya", icon: Package },
//     { path: "/dashboard/sertifikat", label: "Sertifikat", icon: Award },
//     { path: "/dashboard/transaksi", label: "Transaksi", icon: FileText },
//     { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
//   ];

//   const handleLogout = () => {
//     if (window.confirm("Apakah Anda yakin ingin logout?")) {
//       logout();
//     }
//   };

//   // ✅ Don't render sidebar if not authenticated
//   if (!isAuthenticated()) {
//     return null;
//   }

//   return (
//     <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
//       {/* Logo */}
//       <div className="p-6 border-b border-gray-200">
//         <Link to="/" className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-xl">C</span>
//           </div>
//           <h1 className="text-xl font-bold text-emerald-600">ChainCarbon</h1>
//         </Link>
//       </div>

//       {/* ✅ Profile Section (Only show if authenticated) */}
//       {user && (
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
//               <User className="h-6 w-6 text-emerald-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-800 truncate">{user.company}</p>
//               <p className="text-sm text-gray-500 truncate">{user.email}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-y-auto">
//         <ul className="space-y-2">
//           {menus.map((menu) => {
//             const Icon = menu.icon;
//             const isActive = location.pathname === menu.path || location.pathname.startsWith(menu.path + '/');

//             return (
//               <li key={menu.path}>
//                 <Link
//                   to={menu.path}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
//                     isActive
//                       ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   {menu.label}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Logout Button */}
//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;