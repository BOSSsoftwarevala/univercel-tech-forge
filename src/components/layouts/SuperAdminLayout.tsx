import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Package, UserCheck, Crown,
  Settings, Activity, Lock, Scale, LogOut, KeyRound, ArrowLeft
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  { icon: Scale, label: 'Compliance Center', path: '/super-admin/compliance-center' },
  { icon: Crown, label: 'Prime Manager', path: '/super-admin/prime-manager' },
  { icon: Package, label: 'Product Manager', path: '/super-admin/product-manager' },
  { icon: Settings, label: 'System Audit', path: '/super-admin/system-audit' },
];

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Link to="/super-admin" className="flex items-center gap-2">
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

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/50 space-y-2">
          {/* Back to Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Change Password */}
          <Link
            to="/auth/change-password"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
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
