import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, Building2, MapPin, Monitor,
  Package, Megaphone, ListTodo, Code2, Store, UserCheck, Crown,
  Wallet, HeadphonesIcon, Target, BarChart3, Scale, Search,
  Ban, Bell, Settings, Activity, GitBranch, Lock, Zap, Heart,
  Brain, UserPlus, MessageSquare, Star, ChevronLeft, ChevronRight,
  Sparkles, DollarSign, FileText, TrendingUp, Lightbulb, LogOut, KeyRound, ArrowLeft,
  Globe2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ROLE_CONFIG, AppRole } from '@/types/roles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: number;
}

// Role-specific menu configurations (uses database-compatible role names)
const roleMenus: Record<AppRole, MenuItem[]> = {
  // GRADE 0 – OWNERSHIP
  master: [
    { icon: Shield, label: 'Super Admin', path: '/super-admin?cat=super-admin' },
    { icon: Globe2, label: 'Continent Super Admin', path: '/super-admin-system/role-switch?role=continent_super_admin' },
    { icon: MapPin, label: 'Area Manager', path: '/super-admin-system/role-switch?role=area_manager' },
    { icon: Monitor, label: 'Server Manager', path: '/super-admin-system/role-switch?role=server_manager' },
    { icon: Store, label: 'Franchise Manager', path: '/super-admin-system/role-switch?role=franchise_manager' },
    { icon: HeadphonesIcon, label: 'Sales & Support Manager', path: '/super-admin-system/role-switch?role=sales_support_manager' },
    { icon: Package, label: 'Reseller Manager', path: '/super-admin-system/role-switch?role=reseller_manager' },
    { icon: Brain, label: 'API / AI Manager', path: '/super-admin?cat=api-ai-manager' },
    { icon: Star, label: 'Influencer Manager', path: '/super-admin?cat=influencer-manager' },
    { icon: Search, label: 'SEO Manager', path: '/super-admin?cat=seo-manager' },
    { icon: Megaphone, label: 'Marketing Manager', path: '/super-admin?cat=marketing-manager' },
    { icon: Target, label: 'Lead Manager', path: '/super-admin?cat=lead-manager' },
    { icon: Crown, label: 'Pro Manager', path: '/super-admin?cat=pro-manager' },
    { icon: Scale, label: 'Legal Manager', path: '/super-admin?cat=legal-manager' },
    { icon: ListTodo, label: 'Task Manager', path: '/super-admin?cat=task-manager' },
    { icon: Building2, label: 'HR Manager', path: '/super-admin?cat=hr-manager' },
    { icon: Code2, label: 'Developer Manager', path: '/super-admin?cat=developer-manager' },
    { icon: Store, label: 'Franchise', path: '/super-admin?cat=franchise' },
    { icon: Code2, label: 'Developer', path: '/super-admin?cat=developer' },
    { icon: Package, label: 'Reseller', path: '/super-admin?cat=reseller' },
    { icon: Sparkles, label: 'Influencer', path: '/super-admin?cat=influencer' },
    { icon: Crown, label: 'Prime User', path: '/super-admin?cat=prime-user' },
    { icon: UserCheck, label: 'User', path: '/super-admin?cat=user' },
    { icon: Monitor, label: 'Frontend', path: '/super-admin?cat=frontend' },
    { icon: HeadphonesIcon, label: 'Safe Assist', path: '/super-admin?cat=safe-assist' },
    { icon: Users, label: 'Assist Manager', path: '/super-admin?cat=assist-manager' },
    { icon: Activity, label: 'Promise Tracker', path: '/super-admin?cat=promise-tracker' },
    { icon: Shield, label: 'Promise Management', path: '/super-admin?cat=promise-management' },
    { icon: LayoutDashboard, label: 'Dashboard Management', path: '/super-admin?cat=dashboard-management' },
  ],
  // GRADE 1 – PLATFORM CONTROL
  super_admin: [
    { icon: Shield, label: 'Super Admin', path: '/super-admin?cat=super-admin' },
    { icon: Globe2, label: 'Continent Super Admin', path: '/super-admin-system/role-switch?role=continent_super_admin' },
    { icon: MapPin, label: 'Area Manager', path: '/super-admin-system/role-switch?role=area_manager' },
    { icon: Monitor, label: 'Server Manager', path: '/super-admin-system/role-switch?role=server_manager' },
    { icon: Store, label: 'Franchise Manager', path: '/super-admin-system/role-switch?role=franchise_manager' },
    { icon: HeadphonesIcon, label: 'Sales & Support Manager', path: '/super-admin-system/role-switch?role=sales_support_manager' },
    { icon: Package, label: 'Reseller Manager', path: '/super-admin-system/role-switch?role=reseller_manager' },
    { icon: Brain, label: 'API / AI Manager', path: '/super-admin?cat=api-ai-manager' },
    { icon: Star, label: 'Influencer Manager', path: '/super-admin?cat=influencer-manager' },
    { icon: Search, label: 'SEO Manager', path: '/super-admin?cat=seo-manager' },
    { icon: Megaphone, label: 'Marketing Manager', path: '/super-admin?cat=marketing-manager' },
    { icon: Target, label: 'Lead Manager', path: '/super-admin?cat=lead-manager' },
    { icon: Crown, label: 'Pro Manager', path: '/super-admin?cat=pro-manager' },
    { icon: Scale, label: 'Legal Manager', path: '/super-admin?cat=legal-manager' },
    { icon: ListTodo, label: 'Task Manager', path: '/super-admin?cat=task-manager' },
    { icon: Building2, label: 'HR Manager', path: '/super-admin?cat=hr-manager' },
    { icon: Code2, label: 'Developer Manager', path: '/super-admin?cat=developer-manager' },
    { icon: Store, label: 'Franchise', path: '/super-admin?cat=franchise' },
    { icon: Code2, label: 'Developer', path: '/super-admin?cat=developer' },
    { icon: Package, label: 'Reseller', path: '/super-admin?cat=reseller' },
    { icon: Sparkles, label: 'Influencer', path: '/super-admin?cat=influencer' },
    { icon: Crown, label: 'Prime User', path: '/super-admin?cat=prime-user' },
    { icon: UserCheck, label: 'User', path: '/super-admin?cat=user' },
    { icon: Monitor, label: 'Frontend', path: '/super-admin?cat=frontend' },
    { icon: HeadphonesIcon, label: 'Safe Assist', path: '/super-admin?cat=safe-assist' },
    { icon: Users, label: 'Assist Manager', path: '/super-admin?cat=assist-manager' },
    { icon: Activity, label: 'Promise Tracker', path: '/super-admin?cat=promise-tracker' },
    { icon: Shield, label: 'Promise Management', path: '/super-admin?cat=promise-management' },
    { icon: LayoutDashboard, label: 'Dashboard Management', path: '/super-admin?cat=dashboard-management' },
  ],
  // ROLE 4 — SERVER MANAGER (Infra only)
  server_manager: [
    { icon: LayoutDashboard, label: 'Overview', path: '/server-manager' },
    { icon: Monitor, label: 'Servers', path: '/server-manager/servers' },
    { icon: Activity, label: 'Services', path: '/server-manager/services' },
    { icon: TrendingUp, label: 'Uptime & SLA', path: '/server-manager/uptime' },
    { icon: Bell, label: 'Incidents', path: '/server-manager/incidents' },
    { icon: Shield, label: 'Backups', path: '/server-manager/backups' },
    { icon: Lock, label: 'Security', path: '/server-manager/security' },
    { icon: FileText, label: 'Logs', path: '/server-manager/logs' },
    { icon: Settings, label: 'Maintenance', path: '/server-manager/maintenance' },
    { icon: BarChart3, label: 'Reports', path: '/server-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/server-manager/audit' },
  ],
  // ROLE 3 — AREA MANAGER (Country Level)
  area_manager: [
    { icon: LayoutDashboard, label: 'Overview', path: '/area-manager' },
    { icon: Activity, label: 'Daily Operations', path: '/area-manager/operations' },
    { icon: Target, label: 'Leads & Routing', path: '/area-manager/leads' },
    { icon: HeadphonesIcon, label: 'Sales & Support', path: '/area-manager/sales-support' },
    { icon: Shield, label: 'Approvals', path: '/area-manager/approvals' },
    { icon: ListTodo, label: 'Tasks & SLA', path: '/area-manager/tasks' },
    { icon: TrendingUp, label: 'Performance', path: '/area-manager/performance' },
    { icon: Bell, label: 'Risk & Alerts', path: '/area-manager/alerts' },
    { icon: BarChart3, label: 'Reports', path: '/area-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/area-manager/audit' },
  ],
  // GRADE 2 – BUSINESS MANAGEMENT
  client_success: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client-success' },
    { icon: Heart, label: 'Satisfaction', path: '/clients/satisfaction' },
    { icon: HeadphonesIcon, label: 'Support Queue', path: '/clients/support' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  // ROLE 5 — SALES & SUPPORT MANAGER
  support: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/sales-support' },
    { icon: Activity, label: 'Live Queue', path: '/sales-support/queue' },
    { icon: Target, label: 'Leads Pipeline', path: '/sales-support/leads' },
    { icon: HeadphonesIcon, label: 'Support Tickets', path: '/sales-support/tickets' },
    { icon: TrendingUp, label: 'SLA Monitor', path: '/sales-support/sla' },
    { icon: Users, label: 'Customer Profiles', path: '/sales-support/customers' },
    { icon: BarChart3, label: 'Reports', path: '/sales-support/reports' },
    { icon: Bell, label: 'Alerts', path: '/sales-support/alerts' },
  ],
  // ROLE 9 — API / AI MANAGER
  ai_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/api-manager' },
    { icon: KeyRound, label: 'API Keys', path: '/api-manager/keys' },
    { icon: Zap, label: 'Integrations', path: '/api-manager/integrations' },
    { icon: Activity, label: 'Rate Limits', path: '/api-manager/limits' },
    { icon: Brain, label: 'AI Models', path: '/api-manager/models' },
    { icon: FileText, label: 'Logs', path: '/api-manager/logs' },
    { icon: Shield, label: 'Security', path: '/api-manager/security' },
    { icon: BarChart3, label: 'Reports', path: '/api-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/api-manager/audit' },
  ],
  api_security: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/api-security' },
    { icon: Lock, label: 'API Keys', path: '/api-security/keys' },
    { icon: Shield, label: 'Security Logs', path: '/api-security/logs' },
    { icon: Activity, label: 'Monitoring', path: '/api-security/monitoring' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  // ROLE 11 — SEO MANAGER
  seo_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seo-manager' },
    { icon: FileText, label: 'Pages', path: '/seo-manager/pages' },
    { icon: Search, label: 'Keywords', path: '/seo-manager/keywords' },
    { icon: Settings, label: 'Meta Rules', path: '/seo-manager/meta' },
    { icon: Activity, label: 'Traffic', path: '/seo-manager/traffic' },
    { icon: TrendingUp, label: 'Rankings', path: '/seo-manager/rankings' },
    { icon: BarChart3, label: 'Reports', path: '/seo-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/seo-manager/audit' },
  ],
  // ROLE 10 — MARKETING MANAGER
  marketing_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/marketing-manager' },
    { icon: Megaphone, label: 'Campaigns', path: '/marketing-manager/campaigns' },
    { icon: Sparkles, label: 'Offers', path: '/marketing-manager/offers' },
    { icon: Star, label: 'Festival Rules', path: '/marketing-manager/festivals' },
    { icon: MapPin, label: 'Location Targeting', path: '/marketing-manager/targeting' },
    { icon: TrendingUp, label: 'Performance', path: '/marketing-manager/performance' },
    { icon: BarChart3, label: 'Reports', path: '/marketing-manager/reports' },
    { icon: Shield, label: 'Approvals', path: '/marketing-manager/approvals' },
  ],
  // ROLE 6 — LEAD MANAGER
  lead_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/lead-manager' },
    { icon: Target, label: 'Lead Inbox', path: '/lead-manager/inbox' },
    { icon: UserCheck, label: 'Qualification', path: '/lead-manager/qualification' },
    { icon: GitBranch, label: 'Routing Rules', path: '/lead-manager/routing' },
    { icon: Ban, label: 'Duplicates & Fraud', path: '/lead-manager/fraud' },
    { icon: Activity, label: 'SLA', path: '/lead-manager/sla' },
    { icon: BarChart3, label: 'Reports', path: '/lead-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/lead-manager/audit' },
  ],
  demo_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/demo-manager' },
    { icon: Package, label: 'Catalog', path: '/demos/catalog' },
    { icon: Activity, label: 'Health Monitor', path: '/demos/health' },
    { icon: Sparkles, label: 'Rental Links', path: '/demos/rental' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  // ROLE 12 — LEGAL MANAGER
  legal_compliance: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/legal-manager' },
    { icon: Scale, label: 'Compliance', path: '/legal-manager/compliance' },
    { icon: FileText, label: 'Policies', path: '/legal-manager/policies' },
    { icon: Shield, label: 'Trademarks', path: '/legal-manager/trademarks' },
    { icon: Bell, label: 'Incidents', path: '/legal-manager/incidents' },
    { icon: BarChart3, label: 'Reports', path: '/legal-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/legal-manager/audit' },
  ],
  // ROLE 7 — TASK MANAGER
  task_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/task-manager' },
    { icon: Target, label: 'Task Inbox', path: '/task-manager/inbox' },
    { icon: ListTodo, label: 'Create Task', path: '/task-manager/create' },
    { icon: Users, label: 'Assignments', path: '/task-manager/assignments' },
    { icon: Activity, label: 'SLA Timers', path: '/task-manager/sla' },
    { icon: Bell, label: 'Escalations', path: '/task-manager/escalations' },
    { icon: TrendingUp, label: 'Performance', path: '/task-manager/performance' },
    { icon: BarChart3, label: 'Reports', path: '/task-manager/reports' },
    { icon: FileText, label: 'Audit', path: '/task-manager/audit' },
  ],
  // ROLE 8 — HR MANAGER
  hr_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hr-manager' },
    { icon: Users, label: 'Staff Directory', path: '/hr-manager/staff' },
    { icon: UserPlus, label: 'Hiring & Onboarding', path: '/hr-manager/hiring' },
    { icon: Activity, label: 'Attendance', path: '/hr-manager/attendance' },
    { icon: TrendingUp, label: 'Performance', path: '/hr-manager/performance' },
    { icon: Bell, label: 'Warnings', path: '/hr-manager/warnings' },
    { icon: Wallet, label: 'Payroll', path: '/hr-manager/payroll' },
    { icon: BarChart3, label: 'Reports', path: '/hr-manager/reports' },
    { icon: FileText, label: 'Policy', path: '/hr-manager/policy' },
  ],
  performance_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/performance' },
    { icon: TrendingUp, label: 'Metrics', path: '/performance/metrics' },
    { icon: Code2, label: 'Developers', path: '/performance/developers' },
    { icon: Ban, label: 'Escalations', path: '/performance/escalations' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  rnd_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/rnd-dashboard' },
    { icon: Lightbulb, label: 'Suggestions', path: '/rnd/suggestions' },
    { icon: GitBranch, label: 'Roadmap', path: '/rnd/roadmap' },
    { icon: FileText, label: 'Research', path: '/rnd/research' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  finance_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/finance' },
    { icon: Wallet, label: 'Wallets', path: '/finance/wallets' },
    { icon: DollarSign, label: 'Payouts', path: '/finance/payouts' },
    { icon: FileText, label: 'Reports', path: '/finance/reports' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  r_and_d: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/rnd-dashboard' },
    { icon: Lightbulb, label: 'Research', path: '/rnd/research' },
    { icon: GitBranch, label: 'Development', path: '/rnd/development' },
    { icon: Activity, label: 'Testing', path: '/rnd/testing' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  // GRADE 3 – PARTNERS
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
  developer: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/developer/dashboard' },
    { icon: ListTodo, label: 'My Tasks', path: '/developer/tasks' },
    { icon: Activity, label: 'Timer', path: '/developer/timer' },
    { icon: Wallet, label: 'Wallet', path: '/developer/wallet' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
    { icon: TrendingUp, label: 'Performance', path: '/developer/performance' },
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
  // GRADE 4 – USERS
  prime: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/prime/dashboard' },
    { icon: Star, label: 'Priority Support', path: '/prime/support' },
    { icon: Package, label: 'My Demos', path: '/prime/demos' },
    { icon: ListTodo, label: 'Task Status', path: '/prime/tasks' },
    { icon: MessageSquare, label: 'Dedicated Chat', path: '/prime/chat' },
  ],
  client: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client/dashboard' },
    { icon: Package, label: 'Demos', path: '/client/demos' },
    { icon: HeadphonesIcon, label: 'Support', path: '/client/support' },
  ],
  // NEW ROLES (25-28)
  safe_assist: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/safe-assist' },
    { icon: HeadphonesIcon, label: 'Active Sessions', path: '/safe-assist/sessions' },
    { icon: Heart, label: 'Support Queue', path: '/safe-assist/queue' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  assist_manager: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/assist-manager' },
    { icon: Users, label: 'Agents', path: '/assist-manager/agents' },
    { icon: HeadphonesIcon, label: 'Tickets', path: '/assist-manager/tickets' },
    { icon: BarChart3, label: 'Analytics', path: '/assist-manager/analytics' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  promise_tracker: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/promise-tracker' },
    { icon: Target, label: 'Active Promises', path: '/promise-tracker/active' },
    { icon: Activity, label: 'Tracking', path: '/promise-tracker/tracking' },
    { icon: TrendingUp, label: 'Reports', path: '/promise-tracker/reports' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
  ],
  promise_management: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/promise-management' },
    { icon: ListTodo, label: 'All Promises', path: '/promise-management/promises' },
    { icon: Users, label: 'Developers', path: '/promise-management/developers' },
    { icon: Shield, label: 'Approvals', path: '/promise-management/approvals' },
    { icon: BarChart3, label: 'Analytics', path: '/promise-management/analytics' },
    { icon: Settings, label: 'Settings', path: '/promise-management/settings' },
    { icon: MessageSquare, label: 'Chat', path: '/internal-chat' },
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
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span 
                className="text-sm font-medium px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${roleConfig?.color}20`,
                  color: roleConfig?.color 
                }}
              >
                {roleConfig?.label || 'User'}
              </span>
            </motion.div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 shrink-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
          const isActive = `${location.pathname}${location.search}` === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  "hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10",
                  isActive 
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-4 border-primary shadow-lg shadow-primary/20" 
                    : "border-l-4 border-transparent"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all",
                  isActive 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "text-sm font-semibold truncate",
                      isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <SidebarFooter collapsed={collapsed} />
    </motion.aside>
  );
};

// Sidebar Footer Component with Logout, Change Password, Back
const SidebarFooter = ({ collapsed }: { collapsed: boolean }) => {
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
    <div className="p-3 border-t border-border/50 space-y-2">
      {/* Back to Dashboard */}
      <Link
        to="/dashboard"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
          collapsed && "justify-center"
        )}
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Back to Dashboard</span>}
      </Link>

      {/* Change Password */}
      <Link
        to="/change-password"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
          collapsed && "justify-center"
        )}
      >
        <KeyRound className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Change Password</span>}
      </Link>

      {/* Forgot Password */}
      <Link
        to="/forgot-password"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
          collapsed && "justify-center"
        )}
      >
        <KeyRound className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Forgot Password</span>}
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors",
          collapsed && "justify-center"
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default RoleSidebar;
