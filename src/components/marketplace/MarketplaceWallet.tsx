import React from 'react';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, History, Lock, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';

interface MarketplaceWalletProps {
  title: string;
  subtitle: string;
}

export function MarketplaceWallet({ title, subtitle }: MarketplaceWalletProps) {
  const { wallet, transactions, isLoading, formatCurrency, refetch } = useUnifiedWallet();

  const availableBalance = Number(wallet?.available_balance || 0);
  const pendingBalance = Number(wallet?.pending_balance || 0);
  const totalEarned = Number(wallet?.total_earned || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <Button type="button" variant="outline" className="border-slate-800 bg-slate-950/70 text-white" onClick={() => void refetch()}>
          Refresh wallet
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500 p-3 text-slate-950">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-emerald-200">Available balance</p>
                <p className="text-3xl font-semibold text-white">{formatCurrency(availableBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500 p-3 text-slate-950">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-amber-200">Pending balance</p>
                <p className="text-3xl font-semibold text-white">{formatCurrency(pendingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/70">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500 p-3 text-slate-950">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Lifetime inflow</p>
                <p className="text-3xl font-semibold text-white">{formatCurrency(totalEarned)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {availableBalance < 10000 ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-medium">Low wallet balance</p>
            <p className="mt-1 text-sm text-amber-100/80">Wallet purchases will fail until balance is restored. External methods still create pending-verification orders.</p>
          </div>
        </div>
      ) : null}

      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader>
          <CardTitle className="text-white">Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400">Loading wallet activity...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No transactions yet.</div>
          ) : (
            transactions.slice(0, 20).map((transaction) => {
              const isCredit = transaction.amount > 0;
              return (
                <div key={transaction.id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${isCredit ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                      {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{transaction.transaction_type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-slate-400">{new Date(transaction.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <div>
                      <p className={`font-semibold ${isCredit ? 'text-emerald-300' : 'text-red-300'}`}>{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-slate-500">{transaction.reference || 'No reference'}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-700 bg-slate-950/70 text-slate-300">{transaction.status}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
