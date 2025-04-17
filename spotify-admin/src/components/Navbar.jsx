import React from 'react';

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="w-full bg-white/10 backdrop-blur-sm shadow-md border-b border-gray-200 px-5 sm:px-12 py-4 flex justify-between items-center">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Admin Panel</h1>
      
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-green-800 to-green-500 text-black px-5 py-2 sm:px-7 sm:py-2 rounded-full text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
