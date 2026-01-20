import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, UserPlus, Users, CheckCircle, Megaphone,
  FileText, MousePointer, BarChart3, ShieldAlert, Wallet,
  UserCheck, MessageSquare, History, FileSearch, Settings,
  ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IMFullSidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Influencer Dashboard', icon: LayoutDashboard },
  { id: 'onboarding', label: 'Influencer Onboarding', icon: UserPlus },
  { id: 'profiles', label: 'Influencer Profiles', icon: Users },
  { id: 'verification', label: 'Platform Verification', icon: CheckCircle },
  { id: 'campaigns', label: 'Campaign Management', icon: Megaphone },
  { id: 'content', label: 'Content Submissions', icon: FileText },
  { id: 'leads', label: 'Lead & Conversion Tracking', icon: MousePointer },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
  { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert },
  { id: 'payout', label: 'Payout & Wallet', icon: Wallet },
  { id: 'approval', label: 'Approval & Suspension', icon: UserCheck },
  { id: 'communication', label: 'Influencer Communication', icon: MessageSquare },
  { id: 'history', label: 'Influencer History', icon: History },
  { id: 'audit', label: 'Influencer Audit Log', icon: FileSearch },
  { id: 'settings', label: 'Influencer Settings', icon: Settings },
];

const IMFullSidebar = ({ activeScreen, onScreenChange }: IMFullSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeScreen !== 'dashboard') {
      onScreenChange('dashboard');
    } else {
      navigate('/super-admin-system/role-switch?role=boss_owner');
    }
  };

  return (
    <div className={cn(
      "h-full bg-slate-900 border-r border-pink-500/20 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Back Button */}
      <div className="p-2 border-b border-slate-700/50">
        <motion.button
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all group w-full",
            isCollapsed && "justify-center"
          )}
          title={activeScreen === 'dashboard' ? "Back to Control Panel" : "Back to Dashboard"}
        >
          <ArrowLeft className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
          {!isCollapsed && (
            <span className="text-sm font-medium text-pink-400 group-hover:text-pink-300">
              {activeScreen === 'dashboard' ? 'Control Panel' : 'Back'}
            </span>
          )}
        </motion.button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Influencer Manager</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onScreenChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              activeScreen === item.id
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 text-center">
            Influencer Manager v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default IMFullSidebar;
