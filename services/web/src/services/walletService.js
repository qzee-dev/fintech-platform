import api from './api';

export const walletService = {
  getWallets: async (userId) => {
    const response = await api.get(`/wallet/user/${userId}`);
    return response.data;
  },
  createWallet: async (accountType) => {
    const response = await api.post('/wallet/create', { accountType });
    return response.data;
  },
  getWallet: async (walletId) => {
    const response = await api.get(`/wallet/${walletId}`);
    return response.data;
  },
};
