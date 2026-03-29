import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  CreditCard, 
  Warehouse,
  BarChart3, 
  Shield,
  Settings,
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaaSPOSLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'outlets', label: 'Outlets', icon: Store },
  { id: 'catalog', label: 'Catalog', icon: Package },
  { id: 'sales', label: 'Sales', icon: CreditCard },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const outlets = [
  { id: '1', name: 'Downtown Store', status: 'online' },
  { id: '2', name: 'Mall Outlet', status: 'online' },
  { id: '3', name: 'Airport Kiosk', status: 'offline' },
  { id: 'all', name: 'All Outlets', status: 'all' },
];

export const SaaSPOSLayout: React.FC<SaaSPOSLayoutProps> = ({
  children,
  activeModule,
  onModuleChange,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState(outlets[3]);
  const [outletDropdownOpen, setOutletDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Icon Sidebar */}
      <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200">
          <Store className="w-6 h-6 text-white" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200" 
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Outlet Selector */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-80 h-10 pl-10 pr-4 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Outlet Selector & Actions */}
          <div className="flex items-center gap-4">
            {/* Outlet Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOutletDropdownOpen(!outletDropdownOpen)}
                className="flex items-center gap-3 h-10 px-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  selectedOutlet.status === 'online' ? "bg-emerald-500" :
                  selectedOutlet.status === 'offline' ? "bg-red-500" : "bg-violet-500"
                )} />
                <span className="text-sm font-medium text-slate-700">{selectedOutlet.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {outletDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  {outlets.map((outlet) => (
                    <button
                      key={outlet.id}
                      onClick={() => {
                        setSelectedOutlet(outlet);
                        setOutletDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
                        selectedOutlet.id === outlet.id && "bg-violet-50"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        outlet.status === 'online' ? "bg-emerald-500" :
                        outlet.status === 'offline' ? "bg-red-500" : "bg-violet-500"
                      )} />
                      <span className="text-sm text-slate-700">{outlet.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
