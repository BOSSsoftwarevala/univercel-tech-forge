import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  reference?: string;
}

// Role-based withdrawal limits
const WITHDRAWAL_LIMITS: Record<string, { min: number; max: number; dailyMax: number }> = {
  super_admin: { min: 0, max: Infinity, dailyMax: Infinity },
  admin: { min: 100, max: 1000000, dailyMax: 500000 },
  finance_manager: { min: 100, max: 500000, dailyMax: 200000 },
  franchise: { min: 500, max: 200000, dailyMax: 100000 },
  reseller: { min: 500, max: 100000, dailyMax: 50000 },
  developer: { min: 500, max: 50000, dailyMax: 25000 },
  influencer: { min: 200, max: 50000, dailyMax: 25000 },
  prime: { min: 1000, max: 100000, dailyMax: 50000 },
  client: { min: 500, max: 25000, dailyMax: 10000 },
};

export function useUnifiedWallet() {
  const { user, userRole } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!user || !userRole) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch wallet balance
      const { data: balanceData, error: balanceError } = await supabase.functions.invoke('api-wallet/balance');
      
      if (balanceError) {
        throw new Error(balanceError.message);
      }

      if (balanceData?.data) {
        const walletData = balanceData.data;
        
        // Fetch transaction history to calculate totals
        const { data: txData } = await supabase.functions.invoke('api-wallet/transactions');
        
        const txList = txData?.data?.transactions || [];
        
        // Calculate totals from transactions
        let totalEarned = 0;
        let totalWithdrawn = 0;
        
        txList.forEach((tx: any) => {
          const amount = Number(tx.amount) || 0;
          if (amount > 0) {
            totalEarned += amount;
          } else if (tx.type === 'withdrawal_pending' || tx.type === 'withdrawal') {
            totalWithdrawn += Math.abs(amount);
          }
        });

        setWallet({
          id: walletData.wallet_id,
          available_balance: Number(walletData.balance) || 0,
          pending_balance: Number(walletData.pending) || 0,
          total_earned: totalEarned,
          total_withdrawn: totalWithdrawn,
          currency: walletData.currency || 'INR',
          is_frozen: false,
        });

        setTransactions(txList.map((tx: any) => ({
          id: tx.id,
          transaction_type: tx.type,
          amount: Number(tx.amount) || 0,
          status: tx.status || 'completed',
          created_at: tx.timestamp,
          reference: tx.reference,
        })));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet';
      setError(errorMessage);
      console.error('Wallet fetch error:', err);
      
      // Set default empty wallet on error
      setWallet({
        id: '',
        available_balance: 0,
        pending_balance: 0,
        total_earned: 0,
        total_withdrawn: 0,
        currency: 'INR',
        is_frozen: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  const requestPayout = useCallback(async (amount: number, paymentMethod?: string) => {
    if (!user || !userRole || !wallet) {
      toast({
        title: "Error",
        description: "Please log in to request a payout",
        variant: "destructive",
      });
      return false;
    }

    // Client-side validation
    const limits = WITHDRAWAL_LIMITS[userRole] || WITHDRAWAL_LIMITS.client;
    
    if (amount < limits.min) {
      toast({
        title: "Minimum Not Met",
        description: `Minimum withdrawal amount is ₹${limits.min}`,
        variant: "destructive",
      });
      return false;
    }

    if (amount > limits.max) {
      toast({
        title: "Maximum Exceeded",
        description: `Maximum withdrawal amount is ₹${limits.max}`,
        variant: "destructive",
      });
      return false;
    }

    if (amount > wallet.available_balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('api-wallet/withdraw', {
        body: { 
          amount, 
          payment_method: paymentMethod || 'bank_transfer' 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Withdrawal request failed');
      }

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal of ₹${amount.toLocaleString()} has been submitted for approval.`,
      });

      // Refresh wallet data
      await fetchWallet();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Withdrawal request failed';
      toast({
        title: "Withdrawal Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, userRole, wallet, fetchWallet]);

  // Format currency with proper locale based on wallet currency
  const formatCurrency = useCallback((amount: number, showBaseValue = false, baseCurrency = 'INR', conversionRate = 1) => {
    const currency = wallet?.currency || 'INR';
    
    // Currency to locale mapping
    const currencyLocale: Record<string, string> = {
      INR: 'en-IN', USD: 'en-US', GBP: 'en-GB', EUR: 'de-DE',
      AED: 'ar-AE', SAR: 'ar-SA', SGD: 'en-SG', AUD: 'en-AU',
      CAD: 'en-CA', JPY: 'ja-JP', CNY: 'zh-CN',
    };
    
    const locale = currencyLocale[currency] || 'en-US';
    
    try {
      const formatted = new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      
      // Optionally show base value for audit purposes
      if (showBaseValue && currency !== baseCurrency && conversionRate !== 1) {
        const baseAmount = amount / conversionRate;
        const baseFormatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: baseCurrency,
          minimumFractionDigits: 2,
        }).format(baseAmount);
        return `${formatted} (${baseFormatted})`;
      }
      
      return formatted;
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }, [wallet?.currency]);

  const getWithdrawalLimits = useCallback(() => {
    return WITHDRAWAL_LIMITS[userRole || 'client'] || WITHDRAWAL_LIMITS.client;
  }, [userRole]);

  useEffect(() => {
    if (user) fetchWallet();
  }, [user, fetchWallet]);

  return { 
    wallet, 
    transactions, 
    isLoading, 
    error,
    requestPayout, 
    formatCurrency, 
    refetch: fetchWallet,
    getWithdrawalLimits,
  };
}
