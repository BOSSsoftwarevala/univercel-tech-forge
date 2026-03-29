import React from 'react';
import {
  Store, ShoppingCart, Wallet, MessageSquare, Settings,
  Package, LayoutGrid, Library, Key, Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';

interface MMFullSidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const menuItems = [
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
  { id: 'library', label: 'My Library', icon: Library },
  { id: 'licenses', label: 'Licenses', icon: Key },
  { id: 'development', label: 'Development', icon: Code },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'support', label: 'Support Chat', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MMFullSidebar({ activeScreen, onScreenChange }: MMFullSidebarProps) {
  const { wallet, formatCurrency } = useUnifiedWallet();
  const availableBalance = Number(wallet?.available_balance || 0);
  const pendingBalance = Number(wallet?.pending_balance || 0);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Marketplace</h2>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                isActive
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">Wallet Balance</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(availableBalance)}</p>
          <p className="text-xs text-slate-400 mt-1">Pending: {formatCurrency(pendingBalance)}</p>
        </div>
      </div>
    </div>
  );
}
