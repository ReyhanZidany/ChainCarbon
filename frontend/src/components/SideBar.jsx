import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiGrid,
  FiFolder,
  FiUpload,
  FiRepeat,
  FiBarChart2,
} from 'react-icons/fi';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Beranda', icon: <FiHome />, path: '/' },
    { name: 'Dashboard', icon: <FiGrid />, path: '/dashboard' },
    { name: 'Proyek Saya', icon: <FiFolder />, path: '/proyeksaya' },
    { name: 'Pengajuan Proyek', icon: <FiUpload />, path: '/pengajuan-proyek' },
    { name: 'Transaksi', icon: <FiRepeat />, path: '/transaksi' },
    { name: 'Laporan', icon: <FiBarChart2 />, path: '/laporan' },
  ];

  return (
    <div
      className={`bg-white border-r transition-all duration-300 ${
        isHovered ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition ${
              location.pathname === item.path ? 'bg-gray-100 font-bold' : ''
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            {isHovered && <span className="text-gray-800">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
