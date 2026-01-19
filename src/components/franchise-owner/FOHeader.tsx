/**
 * FRANCHISE OWNER HEADER
 * Fixed header with Wallet, Alerts, Promise Status, Chat, Notifications
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Bell,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Globe,
  User,
  Plus,
  Package,
} from 'lucide-react';

interface FOHeaderProps {
  walletBalance: number;
  orderAlerts: number;
  promiseStatus: 'healthy' | 'warning' | 'critical';
  unreadMessages: number;
  notifications: number;
  franchiseCode: string;
  territory: string;
  onAddMoney?: () => void;
}

export function FOHeader({
  walletBalance,
  orderAlerts,
  promiseStatus,
  unreadMessages,
  notifications,
  franchiseCode,
  territory,
  onAddMoney,
}: FOHeaderProps) {
  const isLowBalance = walletBalance < 200;

  const getPromiseStatusColor = () => {
    switch (promiseStatus) {
      case 'healthy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-card/50">
      {/* Wallet Balance */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border',
          isLowBalance
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-emerald-500/10 border-emerald-500/30'
        )}
      >
        <Wallet className={cn('h-4 w-4', isLowBalance ? 'text-red-400' : 'text-emerald-400')} />
        <div>
          <p className="text-[10px] text-muted-foreground">Wallet</p>
          <p className={cn('text-sm font-bold', isLowBalance ? 'text-red-400' : 'text-emerald-400')}>
            ${walletBalance.toLocaleString()}
          </p>
        </div>
        {isLowBalance && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low
          </Badge>
        )}
        {onAddMoney && (
          <Button size="sm" variant="ghost" onClick={onAddMoney} className="h-7 px-2">
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Order Alerts */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
        <Package className="h-4 w-4 text-orange-400" />
        <div>
          <p className="text-[10px] text-muted-foreground">Order Alerts</p>
          <p className="text-sm font-semibold">{orderAlerts}</p>
        </div>
        {orderAlerts > 0 && (
          <Badge className="bg-orange-500 text-white text-[10px] px-1.5">{orderAlerts}</Badge>
        )}
      </div>

      {/* Promise Status */}
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', getPromiseStatusColor())}>
        <ShieldCheck className="h-4 w-4" />
        <div>
          <p className="text-[10px] opacity-70">Promise SLA</p>
          <p className="text-sm font-semibold capitalize">{promiseStatus}</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Internal Chat */}
      <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
        <MessageSquare className="h-4 w-4" />
        {unreadMessages > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
            {unreadMessages}
          </Badge>
        )}
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
        <Bell className="h-4 w-4" />
        {notifications > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
            {notifications}
          </Badge>
        )}
      </Button>

      {/* Language/Currency */}
      <Button variant="ghost" size="sm" className="h-9 px-2 gap-1 text-xs">
        <Globe className="h-4 w-4" />
        EN / USD
      </Button>

      {/* Profile */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold">{franchiseCode}</p>
          <p className="text-[10px] text-muted-foreground">{territory}</p>
        </div>
      </div>
    </div>
  );
}

export default FOHeader;
