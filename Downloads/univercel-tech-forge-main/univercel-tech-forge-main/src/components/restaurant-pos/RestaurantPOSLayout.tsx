import React from 'react';
import { 
  ShoppingCart, 
  ClipboardList, 
  LayoutGrid, 
  UtensilsCrossed,
  Users,
  BarChart3,
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantPOSLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navItems = [
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'tables', label: 'Tables', icon: LayoutGrid },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export const RestaurantPOSLayout: React.FC<RestaurantPOSLayoutProps> = ({
  children,
  activeModule,
  onModuleChange,
}) => {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-20 bg-zinc-900 flex flex-col items-center py-4 border-r border-zinc-800">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-xl transition-all",
                  "hover:bg-zinc-800",
                  isActive 
                    ? "bg-gradient-to-br from-orange-500 to-red-600 text-white" 
                    : "text-zinc-500"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Time */}
        <div className="text-center text-zinc-500 text-xs">
          <p className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
