import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WalletChipProps {
  balance: number;
  currency?: string;
  pendingAmount?: number;
  onWithdraw?: () => void;
  onHistory?: () => void;
  compact?: boolean;
  isDark?: boolean;
}

export function WalletChip({
  balance,
  currency = '₹',
  pendingAmount,
  onWithdraw,
  onHistory,
  compact = false,
  isDark = true
}: WalletChipProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-100 border border-emerald-300'
      }`}>
        <Wallet className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-500">
          {currency}{balance.toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Wallet</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onHistory}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
        <h3 className="text-3xl font-bold text-emerald-500">
          {currency}{balance.toLocaleString()}
        </h3>
        {pendingAmount !== undefined && pendingAmount > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Clock className="h-3 w-3 text-amber-500" />
            <span className="text-xs text-muted-foreground">
              {currency}{pendingAmount.toLocaleString()} pending
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 text-emerald-500">
            <ArrowDownLeft className="h-3 w-3" />
            <span className="text-xs">Earned</span>
          </div>
          <p className="font-semibold">{currency}45,230</p>
        </div>
        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 text-red-500">
            <ArrowUpRight className="h-3 w-3" />
            <span className="text-xs">Withdrawn</span>
          </div>
          <p className="font-semibold">{currency}32,780</p>
        </div>
      </div>

      {/* Actions */}
      <Button onClick={onWithdraw} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500">
        Request Withdrawal
      </Button>
    </div>
  );
}
