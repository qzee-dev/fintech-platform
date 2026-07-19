import api from './api';

export const transactionService = {
  createTransaction: async (data) => {
    const response = await api.post('/transaction/create', data);
    return response.data;
  },
  getTransaction: async (transactionId) => {
    const response = await api.get(`/transaction/${transactionId}`);
    return response.data;
  },
  getWalletTransactions: async (walletId) => {
    const response = await api.get(`/transaction/wallet/${walletId}`);
    return response.data;
  },
};
