import create from 'zustand';

export const useWalletStore = create((set) => ({
  wallets: [],
  loading: false,
  error: null,
  setWallets: (wallets) => set({ wallets }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
