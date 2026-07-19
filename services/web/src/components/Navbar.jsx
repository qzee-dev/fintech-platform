/*
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ Replace FiWallet with FiCreditCard (valid Feather icon)
import { FiHome, FiCreditCard, FiSend, FiList, FiUser, FiLogOut } from 'react-icons/fi';
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
            <FiCreditCard /> Wallets
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

*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiCreditCard, FiSend, FiList, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link to="/dashboard" className="text-2xl font-bold text-gray-900">
          RevolutClone
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center text-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FiHome /> Dashboard
          </Link>
          <Link to="/wallets" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FiCreditCard /> Wallets
          </Link>
          <Link to="/transfer" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FiSend /> Transfer
          </Link>
          <Link to="/transactions" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FiList /> Transactions
          </Link>
          <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FiUser /> Profile
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
