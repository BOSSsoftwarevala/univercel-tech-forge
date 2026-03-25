import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RetailPOSLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navItems = [
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const RetailPOSLayout: React.FC<RetailPOSLayoutProps> = ({
  children,
  activeModule,
  onModuleChange,
}) => {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-24 bg-slate-800 flex flex-col items-center py-6">
        {/* Logo */}
        <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-8">
          <Store className="w-8 h-8 text-white" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 w-full px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-4 rounded-xl transition-all",
                  "hover:bg-slate-700",
                  isActive ? "bg-emerald-500 text-white" : "text-slate-400"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
