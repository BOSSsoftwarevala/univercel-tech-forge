import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Package, UserCheck, Crown,
  Activity, Lock, Scale, LogOut, KeyRound, BarChart3, Eye
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

// ============================================
// SUPER ADMIN SIDEBAR - LOCKED & FINAL
// DO NOT MODIFY ORDER OR ADD DYNAMIC LOGIC
// ============================================

// SECTION 1: CORE CONTROL
const coreControlItems = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/super-admin' },
  { icon: Activity, label: 'Live Tracking', path: '/super-admin/live-tracking' },
];

// SECTION 2: ACCESS & ROLES
const accessRolesItems = [
  { icon: Users, label: 'Role Manager', path: '/super-admin/role-manager' },
  { icon: UserCheck, label: 'User Manager', path: '/super-admin/user-manager' },
  { icon: Shield, label: 'Permission Matrix', path: '/super-admin/permission-matrix' },
];

// SECTION 3: SECURITY & GOVERNANCE
const securityItems = [
  { icon: Lock, label: 'Security Center', path: '/super-admin/security-center' },
  { icon: Scale, label: 'Compliance Center', path: '/super-admin/compliance-center' },
  { icon: Eye, label: 'System Audit', path: '/super-admin/system-audit' },
];

// SECTION 4: BUSINESS CONTROL
const businessItems = [
  { icon: Crown, label: 'Prime Manager', path: '/super-admin/prime-manager' },
  { icon: Package, label: 'Product Manager', path: '/super-admin/product-manager' },
  { icon: BarChart3, label: 'Performance', path: '/super-admin/performance' },
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

  const renderMenuItem = (item: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link key={item.path} to={item.path} className="block">
        <PremiumButton
          variant={isActive ? 'sidebar-active' : 'sidebar'}
          size="sm"
          className="w-full justify-start gap-3"
          glowOnHover
          userRole="super_admin"
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span>{item.label}</span>
        </PremiumButton>
      </Link>
    );
  };

  const renderSection = (title: string, items: typeof coreControlItems) => (
    <div className="mb-6">
      <div className="px-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </span>
      </div>
      <nav className="space-y-1">
        {items.map(renderMenuItem)}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - FIXED WIDTH, NO COLLAPSE */}
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <Link to="/super-admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg block leading-tight">Super Admin</span>
              <span className="text-xs text-muted-foreground">Control Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation - FIXED ORDER, NO DYNAMIC CHANGES */}
        <ScrollArea className="flex-1 py-4 px-2">
          {renderSection('Core Control', coreControlItems)}
          {renderSection('Access & Roles', accessRolesItems)}
          {renderSection('Security & Governance', securityItems)}
          {renderSection('Business Control', businessItems)}
        </ScrollArea>

        {/* Footer - ACCOUNT ACTIONS ONLY */}
        <div className="p-3 border-t border-border/50 space-y-1">
          {/* Change Password */}
          <Link to="/change-password" className="block">
            <PremiumButton
              variant="sidebar"
              size="sm"
              className="w-full justify-start gap-3"
              glowOnHover
              userRole="super_admin"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </PremiumButton>
          </Link>

          {/* Logout */}
          <PremiumButton
            variant="danger"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
            glowOnHover
            userRole="super_admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </PremiumButton>
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
