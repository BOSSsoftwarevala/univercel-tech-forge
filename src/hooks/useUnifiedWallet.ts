import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Wallet {
  id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  currency: string;
  is_frozen: boolean;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export function useUnifiedWallet() {
  const { user, userRole } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!user || !userRole) return;
    // Wallet data will be fetched when types regenerate
    setWallet({
      id: 'temp',
      available_balance: 0,
      pending_balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
      currency: 'INR',
      is_frozen: false
    });
    setIsLoading(false);
  }, [user, userRole]);

  const requestPayout = useCallback(async () => false, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }, []);

  useEffect(() => {
    if (user) fetchWallet();
  }, [user, fetchWallet]);

  return { wallet, transactions, isLoading, requestPayout, formatCurrency, refetch: fetchWallet };
}
