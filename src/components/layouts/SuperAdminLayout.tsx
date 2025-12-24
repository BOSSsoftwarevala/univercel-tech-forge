import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Package, UserCheck, Crown,
  Settings, Activity, Lock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

// Only include menu items that have actual pages implemented
const menuItems = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/super-admin' },
  { icon: Activity, label: 'Live Tracking', path: '/super-admin/live-tracking' },
  { icon: Users, label: 'Role Manager', path: '/super-admin/role-manager' },
  { icon: UserCheck, label: 'User Manager', path: '/super-admin/user-manager' },
  { icon: Shield, label: 'Permission Matrix', path: '/super-admin/permission-matrix' },
  { icon: Lock, label: 'Security Center', path: '/super-admin/security-center' },
  { icon: Crown, label: 'Prime Manager', path: '/super-admin/prime-manager' },
  { icon: Package, label: 'Product Manager', path: '/super-admin/product-manager' },
  { icon: Settings, label: 'System Audit', path: '/super-admin/system-audit' },
];

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Link to="/super-admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Super Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-border/50">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Main Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default SuperAdminLayout;
