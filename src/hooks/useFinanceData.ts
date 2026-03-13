/**
 * useFinanceData - Centralized hook for Finance Manager real data
 * Fetches from transactions, wallets, invoices, payout_requests
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FinanceStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingAmount: number;
  payoutsDue: number;
  invoicesSent: number;
  paymentsReceived: number;
  refundsProcessed: number;
  failedTransactions: number;
}

export interface TransactionRecord {
  transaction_id: string;
  type: string;
  amount: number;
  reference: string | null;
  status: string;
  timestamp: string;
  related_user: string | null;
}

export interface InvoiceRecord {
  invoice_id: string;
  invoice_number: string;
  amount: number;
  tax: number;
  status: string;
  timestamp: string;
  user_id: string;
}

export interface PayoutRecord {
  payout_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  user_role: string;
  requested_at: string;
  timestamp: string;
}

export const useFinanceStats = () => {
  return useQuery({
    queryKey: ['finance-stats'],
    queryFn: async (): Promise<FinanceStats> => {
      // Fetch transactions
      const { data: txns } = await supabase
        .from('transactions')
        .select('type, amount, status')
        .limit(1000);

      // Fetch payout requests
      const { data: payouts } = await supabase
        .from('payout_requests')
        .select('amount, status')
        .limit(1000);

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('amount, status')
        .limit(1000);

      const transactions = txns || [];
      const payoutList = payouts || [];
      const invoiceList = invoices || [];

      const revenueTypes = ['order_created', 'payment_received', 'subscription', 'deposit', 'credit'];
      const expenseTypes = ['payout', 'refund', 'debit', 'commission_paid', 'expense'];

      const totalRevenue = transactions
        .filter(t => revenueTypes.includes(t.type || '') && t.status === 'success')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const totalExpenses = transactions
        .filter(t => expenseTypes.includes(t.type || '') && t.status === 'success')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const payoutsDue = payoutList
        .filter(p => p.status === 'pending' || p.status === 'approved')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const failedTransactions = transactions.filter(t => t.status === 'failed').length;
      const refundsProcessed = transactions.filter(t => t.type === 'refund' && t.status === 'success').length;

      return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingAmount,
        payoutsDue,
        invoicesSent: invoiceList.length,
        paymentsReceived: transactions.filter(t => revenueTypes.includes(t.type || '') && t.status === 'success').length,
        refundsProcessed,
        failedTransactions,
      };
    },
    refetchInterval: 30000,
  });
};

export const useTransactions = (limit = 50) => {
  return useQuery({
    queryKey: ['finance-transactions', limit],
    queryFn: async (): Promise<TransactionRecord[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as TransactionRecord[];
    },
    refetchInterval: 30000,
  });
};

export const useInvoices = (limit = 50) => {
  return useQuery({
    queryKey: ['finance-invoices', limit],
    queryFn: async (): Promise<InvoiceRecord[]> => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as InvoiceRecord[];
    },
    refetchInterval: 30000,
  });
};

export const usePayouts = (limit = 50) => {
  return useQuery({
    queryKey: ['finance-payouts', limit],
    queryFn: async (): Promise<PayoutRecord[]> => {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as PayoutRecord[];
    },
    refetchInterval: 30000,
  });
};

export const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};
