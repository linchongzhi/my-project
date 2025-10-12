
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: '預約表單', key: 'reservation-form' },
    { path: '/calendar', label: '預約日曆', key: 'reservation-calendar' },
    { path: '/all-reservations', label: '所有預約', key: 'all-reservations' },
    { path: '/excel-upload', label: 'Excel上傳', key: 'excel-upload' },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-pink-500 to-yellow-300 text-white p-4 text-center">
        <h1 className="text-xl md:text-2xl font-bold">木芷瑶</h1>
        <h2 className="text-lg md:text-xl font-semibold">M.Y BEAUTY&HEALTH</h2>
        <h3 className="text-base md:text-lg">內部預約系統</h3>
      </div>
      <nav className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-center flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-pink-500 font-semibold'
                  : 'hover:bg-pink-600'
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
