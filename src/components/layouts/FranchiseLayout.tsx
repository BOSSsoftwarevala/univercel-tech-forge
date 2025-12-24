import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  LayoutDashboard, User, Wallet, Users, UserPlus, Play, Library,
  TrendingUp, BarChart3, HeadphonesIcon, MessageSquare, GraduationCap,
  Shield, Bell, Settings, Store, LogOut, Search, UsersRound, 
  ClipboardList, Activity, Building2, KeyRound, ArrowLeft
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FranchiseLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/franchise/dashboard' },
  { icon: User, label: 'Profile', path: '/franchise/profile' },
  { icon: Wallet, label: 'Wallet & Commission', path: '/franchise/wallet', badge: '₹1.2L' },
  { icon: Users, label: 'Lead Board', path: '/franchise/lead-board', badge: '28' },
  { icon: UserPlus, label: 'Assign Lead', path: '/franchise/assign-lead' },
  { icon: Activity, label: 'Lead Activity Tracker', path: '/franchise/lead-activity' },
  { icon: Play, label: 'Demo Request', path: '/franchise/demo-request' },
  { icon: Library, label: 'Demo Library', path: '/franchise/demo-library' },
  { icon: TrendingUp, label: 'Sales Center', path: '/franchise/sales-center' },
  { icon: BarChart3, label: 'Performance', path: '/franchise/performance' },
  { icon: Search, label: 'SEO Services', path: '/franchise/seo-services', badge: 'New' },
  { icon: UsersRound, label: 'Team Management', path: '/franchise/team-management' },
  { icon: ClipboardList, label: 'CRM', path: '/franchise/crm' },
  { icon: Building2, label: 'HRM', path: '/franchise/hrm' },
  { icon: HeadphonesIcon, label: 'Support Ticket', path: '/franchise/support-ticket' },
  { icon: MessageSquare, label: 'Internal Chat', path: '/franchise/internal-chat', badge: 'New' },
  { icon: GraduationCap, label: 'Training Center', path: '/franchise/training-center' },
  { icon: Shield, label: 'Security Panel', path: '/franchise/security-panel' },
];

const FranchiseLayout = ({ children }: FranchiseLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-indigo-500/20 bg-slate-900/60 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-indigo-500/20">
          <Link to="/franchise/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">Franchise</span>
              <p className="text-xs text-indigo-300">Portal</p>
            </div>
          </Link>
        </div>

        {/* KYC Status */}
        <div className="p-3 mx-3 mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">KYC Verified</span>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-3 mt-2">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white font-medium border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : '')} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'text-xs',
                        item.badge === 'New' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 space-y-3">
          {/* Monthly Target */}
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Monthly Target</span>
              <span className="text-indigo-400 font-medium">85%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </div>

          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Dashboard
          </Link>

          <Link
            to="/change-password"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Change Password
          </Link>

          <Link
            to="/forgot-password"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
            Forgot Password
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-indigo-500/20 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Franchise Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <Link to="/franchise/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">F</span>
              </div>
            </Link>
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

export default FranchiseLayout;
