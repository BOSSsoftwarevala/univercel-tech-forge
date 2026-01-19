/**
 * WALLET HEADER COMPONENT
 * Shows wallet balance with low balance alert
 * Global component for all dashboards
 */
import React from 'react';
import { Wallet, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WalletHeaderProps {
  balance: number;
  currency?: string;
  lowBalanceThreshold?: number;
  onAddMoney?: () => void;
  className?: string;
}

export function WalletHeader({
  balance,
  currency = '$',
  lowBalanceThreshold = 200,
  onAddMoney,
  className,
}: WalletHeaderProps) {
  const isLowBalance = balance < lowBalanceThreshold;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-xl border transition-all',
        isLowBalance
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30',
        className
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          isLowBalance ? 'bg-red-500/20' : 'bg-emerald-500/20'
        )}
      >
        <Wallet className={cn('h-5 w-5', isLowBalance ? 'text-red-400' : 'text-emerald-400')} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Wallet Balance</p>
        <p className={cn('text-lg font-bold', isLowBalance ? 'text-red-400' : 'text-emerald-400')}>
          {currency}{balance.toLocaleString()}
        </p>
      </div>

      {isLowBalance && (
        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          Low Balance
        </Badge>
      )}

      {onAddMoney && (
        <Button
          size="sm"
          onClick={onAddMoney}
          className={cn(
            'gap-1',
            isLowBalance
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          )}
        >
          <Plus className="h-4 w-4" />
          Add Money
        </Button>
      )}
    </div>
  );
}

export default WalletHeader;
