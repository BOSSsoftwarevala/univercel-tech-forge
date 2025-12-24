import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Building2, MapPin, Monitor,
  Package, Megaphone, ListTodo, Code2, Store, UserCheck, Crown,
  Wallet, HeadphonesIcon, Target, BarChart3, Scale, Search,
  Ban, Bell, Settings, Activity, GitBranch, Lock, Zap, Heart,
  Brain, UserPlus, MessageSquare, Star, ChevronLeft, ChevronRight,
  Sparkles, DollarSign, FileText, TrendingUp, Lightbulb
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ROLE_CONFIG, AppRole } from '@/types/roles';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: number;
}

// Role-specific menu configurations
const roleMenus: Record<AppRole, MenuItem[]> = {
  super_admin: [
    { icon: LayoutDashboard, label: 'Command Center', path: '/super-admin/dashboard' },
    { icon: Activity, label: 'Live Tracking', path: '/super-admin/live-tracking' },
    { icon: Users, label: 'Role Manager', path: '/super-admin/role-manager' },
    { icon: UserCheck, label: 'User Manager', path: '/super-admin/user-manager' },
    { icon: Shield, label: 'Permission Matrix', path: '/super-admin/permission-matrix' },
    { icon: Lock, label: 'Security Center', path: '/super-admin/security-center' },
    { icon: Building2, label: 'Branch Manager', path: '/super-admin/branch-manager' },
    { icon: Package, label: 'Demo Manager', path: '/super-admin/demo-manager' },
    { icon: Sparkles, label: 'Product Manager', path: '/super-admin/product-manager' },
    { icon: Megaphone, label: 'Lead Engine', path: '/super-admin/lead-engine' },
    { icon: ListTodo, label: 'Task Engine', path: '/super-admin/task-engine' },
    { icon: Code2, label: 'Developer Manager', path: '/super-admin/developer-manager' },
    { icon: Store, label: 'Franchise Manager', path: '/super-admin/franchise-manager' },
    { icon: Users, label: 'Reseller Manager', path: '/super-admin/reseller-manager' },
    { icon: Crown, label: 'Prime Manager', path: '/super-admin/prime-manager' },
    { icon: Zap, label: 'Influencer Manager', path: '/super-admin/influencer-manager' },
    { icon: Wallet, label: 'Finance Center', path: '/super-admin/finance-center' },
    { icon: HeadphonesIcon, label: 'Support Center', path: '/super-admin/support-center' },
    { icon: Brain, label: 'AI Console', path: '/ai-console' },
    { icon: Settings, label: 'System Settings', path: '/super-admin/system-settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Manager', path: '/admin/users' },
    { icon: Shield, label: 'Permissions', path: '/admin/permissions' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ],
  developer: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/developer/dashboard' },
    { icon: ListTodo, label: 'My Tasks', path: '/developer/tasks' },
    { icon: Activity, label: 'Timer', path: '/developer/timer' },
    { icon: Wallet, label: 'Wallet', path: '/developer/wallet' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
    { icon: TrendingUp, label: 'Performance', path: '/developer/performance' },
  ],
  franchise: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/franchise/dashboard' },
    { icon: Target, label: 'Lead Board', path: '/franchise/lead-board' },
    { icon: Users, label: 'Assign Lead', path: '/franchise/assign-lead' },
    { icon: Package, label: 'Demo Library', path: '/franchise/demo-library' },
    { icon: DollarSign, label: 'Sales Center', path: '/franchise/sales-center' },
    { icon: Wallet, label: 'Wallet', path: '/franchise/wallet' },
    { icon: TrendingUp, label: 'Performance', path: '/franchise/performance' },
    { icon: MessageSquare, label: 'Internal Chat', path: '/franchise/internal-chat' },
    { icon: Lock, label: 'Security', path: '/franchise/security-panel' },
  ],
  reseller: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/reseller/dashboard' },
    { icon: Target, label: 'Leads', path: '/reseller/leads' },
    { icon: Package, label: 'Demos', path: '/reseller/demos' },
    { icon: Wallet, label: 'Wallet', path: '/reseller/wallet' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  influencer: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/influencer/dashboard' },
    { icon: Sparkles, label: 'Campaign Links', path: '/influencer/links' },
    { icon: BarChart3, label: 'Analytics', path: '/influencer/analytics' },
    { icon: Wallet, label: 'Earnings', path: '/influencer/wallet' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  prime: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/prime/dashboard' },
    { icon: Star, label: 'Priority Support', path: '/prime/support' },
    { icon: Package, label: 'My Demos', path: '/prime/demos' },
    { icon: ListTodo, label: 'Task Status', path: '/prime/tasks' },
    { icon: MessageSquare, label: 'Dedicated Chat', path: '/prime/chat' },
  ],
  seo_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seo-dashboard' },
    { icon: Search, label: 'Keywords', path: '/seo/keywords' },
    { icon: FileText, label: 'Content', path: '/seo/content' },
    { icon: BarChart3, label: 'Analytics', path: '/seo/analytics' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  lead_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/lead-manager' },
    { icon: Target, label: 'Pipeline', path: '/leads/pipeline' },
    { icon: Users, label: 'Assignment', path: '/leads/assignment' },
    { icon: BarChart3, label: 'Analytics', path: '/leads/analytics' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  task_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/task-manager' },
    { icon: ListTodo, label: 'All Tasks', path: '/tasks/all' },
    { icon: Code2, label: 'Developers', path: '/tasks/developers' },
    { icon: TrendingUp, label: 'Performance', path: '/tasks/performance' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  demo_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/demo-manager' },
    { icon: Package, label: 'Catalog', path: '/demos/catalog' },
    { icon: Activity, label: 'Health Monitor', path: '/demos/health' },
    { icon: Sparkles, label: 'Rental Links', path: '/demos/rental' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  rnd_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/rnd-dashboard' },
    { icon: Lightbulb, label: 'Suggestions', path: '/rnd/suggestions' },
    { icon: GitBranch, label: 'Roadmap', path: '/rnd/roadmap' },
    { icon: FileText, label: 'Research', path: '/rnd/research' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  client_success: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client-success' },
    { icon: Heart, label: 'Satisfaction', path: '/clients/satisfaction' },
    { icon: HeadphonesIcon, label: 'Support Queue', path: '/clients/support' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  performance_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/performance' },
    { icon: TrendingUp, label: 'Metrics', path: '/performance/metrics' },
    { icon: Code2, label: 'Developers', path: '/performance/developers' },
    { icon: Ban, label: 'Escalations', path: '/performance/escalations' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  finance_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/finance' },
    { icon: Wallet, label: 'Wallets', path: '/finance/wallets' },
    { icon: DollarSign, label: 'Payouts', path: '/finance/payouts' },
    { icon: FileText, label: 'Reports', path: '/finance/reports' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  marketing_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/marketing' },
    { icon: Megaphone, label: 'Campaigns', path: '/marketing/campaigns' },
    { icon: Zap, label: 'Influencers', path: '/marketing/influencers' },
    { icon: BarChart3, label: 'Analytics', path: '/marketing/analytics' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  legal_compliance: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/legal' },
    { icon: FileText, label: 'Documents', path: '/legal/documents' },
    { icon: Scale, label: 'Compliance', path: '/legal/compliance' },
    { icon: Shield, label: 'Policies', path: '/legal/policies' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  hr_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hr-dashboard' },
    { icon: UserPlus, label: 'Hiring', path: '/hr/hiring' },
    { icon: Users, label: 'Onboarding', path: '/hr/onboarding' },
    { icon: Heart, label: 'Team', path: '/hr/team' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  support: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/support-dashboard' },
    { icon: HeadphonesIcon, label: 'Tickets', path: '/support/tickets' },
    { icon: FileText, label: 'Knowledge', path: '/support/knowledge' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  ai_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/ai-console' },
    { icon: Brain, label: 'AI Console', path: '/ai/console' },
    { icon: Zap, label: 'Cache', path: '/ai/cache' },
    { icon: TrendingUp, label: 'Optimization', path: '/ai/optimization' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  client: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client/dashboard' },
    { icon: Package, label: 'Demos', path: '/client/demos' },
    { icon: HeadphonesIcon, label: 'Support', path: '/client/support' },
  ],
  api_security: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/api-security' },
    { icon: Lock, label: 'API Keys', path: '/api-security/keys' },
    { icon: Shield, label: 'Security Logs', path: '/api-security/logs' },
    { icon: Activity, label: 'Monitoring', path: '/api-security/monitoring' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  r_and_d: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/rnd-dashboard' },
    { icon: Lightbulb, label: 'Research', path: '/rnd/research' },
    { icon: GitBranch, label: 'Development', path: '/rnd/development' },
    { icon: Activity, label: 'Testing', path: '/rnd/testing' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  master: [
    { icon: LayoutDashboard, label: 'Command Center', path: '/super-admin/dashboard' },
    { icon: Activity, label: 'Live Tracking', path: '/super-admin/live-tracking' },
    { icon: Users, label: 'All Users', path: '/super-admin/user-manager' },
    { icon: Shield, label: 'Security', path: '/super-admin/security-center' },
    { icon: Settings, label: 'System Settings', path: '/super-admin/system-settings' },
  ],
};

interface RoleSidebarProps {
  role: AppRole;
  collapsed?: boolean;
  onToggle?: () => void;
}

const RoleSidebar = ({ role, collapsed = false, onToggle }: RoleSidebarProps) => {
  const location = useLocation();
  const menuItems = roleMenus[role] || roleMenus.client;
  const roleConfig = ROLE_CONFIG[role];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="border-r border-border/50 bg-sidebar backdrop-blur-xl flex flex-col h-full"
    >
      {/* Role Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${roleConfig.color}20`, color: roleConfig.color }}
          >
            <Crown className="w-5 h-5" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-bold text-sm truncate">{roleConfig.label}</p>
              <p className="text-xs text-muted-foreground capitalize">{roleConfig.tier} Tier</p>
            </motion.div>
          )}
        </div>
        {onToggle && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={`role-sidebar-indicator-${role}`}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {item.badge && !collapsed && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border/50">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Back to Home</span>}
        </Link>
      </div>
    </motion.aside>
  );
};

export default RoleSidebar;
