import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { walletService } from '../services/walletService';
import { transactionService } from '../services/transactionService';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [wallets, setWallets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const walletsData = await walletService.getWallets(user.id);
          setWallets(walletsData.wallets || []);
          const total = walletsData.wallets?.reduce(
            (sum, w) => sum + parseFloat(w.balance || 0),
            0
          ) || 0;
          setTotalBalance(total);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
        <p className="text-lg mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold">₦{totalBalance.toFixed(2)}</h2>
      </div>

      {/* Wallets Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Wallets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600"
            >
              <p className="text-gray-600 text-sm">Account Number</p>
              <p className="text-2xl font-bold text-gray-800 mb-2">
                {wallet.accountNumber}
              </p>
              <p className="text-gray-600 text-sm mb-2">{wallet.accountType}</p>
              <p className="text-xl font-semibold text-blue-600">
                ₦{parseFloat(wallet.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-600">No transactions yet</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Reference</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t">
                    <td className="px-6 py-3">{tx.reference}</td>
                    <td className="px-6 py-3">₦{parseFloat(tx.amount).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        tx.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
