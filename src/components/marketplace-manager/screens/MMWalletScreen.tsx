import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Loader2,
  CreditCard,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Copy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { marketplaceEnterpriseService } from '@/services/marketplaceEnterpriseService';

type Wallet = {
  balance_cents: number; // store in cents/paise to avoid float issues
  currency: string;
  reserved_cents?: number;
  upi_id?: string;
  account_number?: string;
  ifsc?: string;
};

type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  amount_cents: number;
  description?: string;
  created_at: string; // ISO string
  status?: 'pending' | 'completed' | 'failed';
};

const formatCurrency = (cents: number, currency = 'INR') => {
  const value = cents / 100;
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: currency === 'INR' ? 'INR' : currency,
    maximumFractionDigits: 2,
  });
};

export function MMWalletScreen(): JSX.Element {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.id) {
        setWallet(null);
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Prefer service methods if available
        const walletRes =
          marketplaceEnterpriseService?.getWallet &&
          (await marketplaceEnterpriseService.getWallet(user.id));

        const txRes =
          marketplaceEnterpriseService?.getWalletTransactions &&
          (await marketplaceEnterpriseService.getWalletTransactions(user.id));

        if (!mounted) return;

        // Normalize responses (support service returning { data } or array directly)
        const w =
          walletRes && !Array.isArray(walletRes) ? walletRes?.data ?? walletRes : walletRes;
        const txs =
          txRes && Array.isArray(txRes) ? txRes : txRes?.data ?? txRes?.transactions ?? [];

        setWallet(
          w ?? {
            balance_cents: 0,
            currency: 'INR',
          }
        );

        setTransactions(Array.isArray(txs) ? txs : []);
      } catch (err) {
        console.error('[MMWalletScreen] load error:', err);
        toast.error('Unable to load wallet data');
        setWallet({
          balance_cents: 0,
          currency: 'INR',
        });
        setTransactions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleTopUp = async () => {
    if (!user?.id) {
      toast.error('Sign in to top up wallet');
      return;
    }
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      if (marketplaceEnterpriseService?.topUpWallet) {
        await marketplaceEnterpriseService.topUpWallet(user.id, { amount_cents: Math.round(amount * 100) });
      } else {
        // fallback API
        const res = await fetch('/api/marketplace/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, amount_cents: Math.round(amount * 100) }),
        });
        if (!res.ok) throw new Error('Top-up failed');
      }

      toast.success('Top-up initiated');
      setTopUpAmount('');
      // reload wallet & transactions
      const updated =
        (await marketplaceEnterpriseService.getWallet?.(user.id)) ??
        null;
      if (updated) setWallet(updated.data ?? updated);
      const txs =
        (await marketplaceEnterpriseService.getWalletTransactions?.(user.id)) ?? [];
      setTransactions(Array.isArray(txs) ? txs : txs.data ?? txs.transactions ?? []);
    } catch (err) {
      console.error('[MMWalletScreen] top-up error:', err);
      toast.error('Failed to top up wallet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id) {
      toast.error('Sign in to withdraw');
      return;
    }

    setActionLoading(true);
    try {
      if (marketplaceEnterpriseService?.withdrawFromWallet) {
        await marketplaceEnterpriseService.withdrawFromWallet(user.id);
      } else {
        const res = await fetch('/api/marketplace/wallet/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        });
        if (!res.ok) throw new Error('Withdraw failed');
      }

      toast.success('Withdraw request submitted');
      // reload
      const updated =
        (await marketplaceEnterpriseService.getWallet?.(user.id)) ??
        null;
      if (updated) setWallet(updated.data ?? updated);
    } catch (err) {
      console.error('[MMWalletScreen] withdraw error:', err);
      toast.error('Withdraw request failed');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = async (text?: string) => {
    if (!text) {
      toast.error('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      console.error('[MMWalletScreen] copy error:', err);
      toast.error('Unable to copy');
    }
  };

  const exportTransactionsCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const header = ['id', 'type', 'amount', 'description', 'created_at', 'status'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      (t.amount_cents / 100).toFixed(2),
      (t.description ?? '').replace(/\n/g, ' '),
      t.created_at,
      t.status ?? '',
    ]);

    const csvContent =
      [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast.success('Transactions exported');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-purple-400" />
          Wallet
        </h1>
        <p className="text-slate-400 mt-1">Manage your marketplace wallet and transactions</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-semibold">
              {wallet ? formatCurrency(wallet.balance_cents, wallet.currency) : formatCurrency(0)}
            </div>
            <div className="text-sm text-slate-400">Reserved: {wallet?.reserved_cents ? formatCurrency(wallet.reserved_cents, wallet.currency) : formatCurrency(0)}</div>

            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Amount (₹)"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="bg-slate-900 border-slate-700"
              />
              <Button onClick={handleTopUp} disabled={actionLoading || !topUpAmount.trim()}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span className="ml-2">Top up</span>
              </Button>
            </div>

            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={handleWithdraw} disabled={actionLoading}>
                <ArrowDownRight className="h-4 w-4" />
                <span className="ml-2">Withdraw</span>
              </Button>
              <Button variant="outline" onClick={exportTransactionsCSV}>
                <Download className="h-4 w-4" />
                <span className="ml-2">Export CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Account & Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">UPI ID</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="font-medium">{wallet?.upi_id ?? '—'}</div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(wallet?.upi_id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">Account</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="font-medium">{wallet?.account_number ?? '—'}</div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(wallet?.account_number)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-slate-400 mt-1">{wallet?.ifsc ?? ''}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Tip: Use the UPI ID for instant top-ups. Bank transfers may take 1-3 business days.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="mb-2">No transactions yet</div>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-md ${t.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {t.type === 'credit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{t.description ?? (t.type === 'credit' ? 'Credit' : 'Debit')}</div>
                        <div className="text-xs text-slate-400">{new Date(t.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(t.amount_cents, wallet?.currency ?? 'INR')}</div>
                    <div className="text-xs text-slate-400 mt-1">{t.status ?? ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
