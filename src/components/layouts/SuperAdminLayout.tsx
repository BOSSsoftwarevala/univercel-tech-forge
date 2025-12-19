import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Building2, MapPin, Monitor, 
  Package, Megaphone, ListTodo, Code2, Store, UserCheck, Crown,
  Wallet, HeadphonesIcon, Target, BarChart3, Scale, Search,
  Ban, Bell, Settings, Activity, GitBranch, Lock, Zap
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/super-admin/dashboard' },
  { icon: Activity, label: 'Live Tracking', path: '/super-admin/live-tracking' },
  { icon: Users, label: 'Role Manager', path: '/super-admin/role-manager' },
  { icon: UserCheck, label: 'User Manager', path: '/super-admin/user-manager' },
  { icon: Shield, label: 'Permission Matrix', path: '/super-admin/permission-matrix' },
  { icon: Lock, label: 'Security Center', path: '/super-admin/security-center' },
  { icon: Building2, label: 'Branch Manager', path: '/super-admin/branch-manager' },
  { icon: Monitor, label: 'IP/Device Control', path: '/super-admin/ip-device-control' },
  { icon: Package, label: 'Demo Manager', path: '/super-admin/demo-manager' },
  { icon: GitBranch, label: 'Product Library', path: '/super-admin/product-library' },
  { icon: Megaphone, label: 'Lead Engine', path: '/super-admin/lead-engine' },
  { icon: ListTodo, label: 'Task Engine', path: '/super-admin/task-engine' },
  { icon: Code2, label: 'Developer Manager', path: '/super-admin/developer-manager' },
  { icon: Store, label: 'Franchise Manager', path: '/super-admin/franchise-manager' },
  { icon: Users, label: 'Reseller Manager', path: '/super-admin/reseller-manager' },
  { icon: Crown, label: 'Prime Manager', path: '/super-admin/prime-manager' },
  { icon: Zap, label: 'Influencer Manager', path: '/super-admin/influencer-manager' },
  { icon: Wallet, label: 'Finance Center', path: '/super-admin/finance-center' },
  { icon: Wallet, label: 'Wallet', path: '/super-admin/wallet' },
  { icon: HeadphonesIcon, label: 'Support Center', path: '/super-admin/support-center' },
  { icon: Target, label: 'Client Success', path: '/super-admin/client-success' },
  { icon: Megaphone, label: 'Marketing Center', path: '/super-admin/marketing-center' },
  { icon: GitBranch, label: 'R&D', path: '/super-admin/rnd' },
  { icon: BarChart3, label: 'Performance Center', path: '/super-admin/performance-center' },
  { icon: Scale, label: 'Legal & Compliance', path: '/super-admin/legal-compliance' },
  { icon: Search, label: 'SEO Engine', path: '/super-admin/seo-engine' },
  { icon: Ban, label: 'Suspension Queue', path: '/super-admin/suspension-queue' },
  { icon: Bell, label: 'Alert Center', path: '/super-admin/alert-center' },
  { icon: Settings, label: 'System Settings', path: '/super-admin/system-settings' },
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
