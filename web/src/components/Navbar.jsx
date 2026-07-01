import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiWallet, FiSend, FiList, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          FinTech
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-200">
            <FiHome /> Dashboard
          </Link>
          <Link to="/wallets" className="flex items-center gap-2 hover:text-blue-200">
            <FiWallet /> Wallets
          </Link>
          <Link to="/transfer" className="flex items-center gap-2 hover:text-blue-200">
            <FiSend /> Transfer
          </Link>
          <Link to="/transactions" className="flex items-center gap-2 hover:text-blue-200">
            <FiList /> Transactions
          </Link>
          <Link to="/profile" className="flex items-center gap-2 hover:text-blue-200">
            <FiUser /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-blue-200 bg-blue-700 px-4 py-2 rounded"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
