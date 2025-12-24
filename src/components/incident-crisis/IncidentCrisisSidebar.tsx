import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Activity, Bell,
  FileText, Shield, Users, TrendingUp, Settings,
  LogOut, Lock, Radio, Zap, Server, Clock, ArrowLeft, KeyRound
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface IncidentCrisisSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
  { id: 'active-incidents', label: 'Active Incidents', icon: AlertTriangle, badge: '3', critical: true },
  { id: 'monitoring', label: 'System Monitoring', icon: Activity },
  { id: 'alerts', label: 'Alert Management', icon: Bell, badge: '8' },
  { id: 'response-teams', label: 'Response Teams', icon: Users },
  { id: 'escalations', label: 'Escalations', icon: Zap },
  { id: 'servers', label: 'Server Status', icon: Server },
  { id: 'timeline', label: 'Incident Timeline', icon: Clock },
  { id: 'reports', label: 'Incident Reports', icon: FileText },
  { id: 'security', label: 'Security Center', icon: Shield },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
];

const IncidentCrisisSidebar = ({ activeSection, onSectionChange }: IncidentCrisisSidebarProps) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const userName = user?.email?.split('@')[0] || 'Crisis Manager';

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900/60 backdrop-blur-2xl border-r border-red-500/10 z-40 overflow-hidden"
    >
      {/* User Profile Section */}
      <div className="p-4 border-b border-red-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[9px] uppercase mt-0.5">
              Support Manager
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
              activeSection === item.id
                ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                : 'hover:bg-slate-800/40 text-slate-400 hover:text-red-400'
            }`}
          >
            <item.icon className={`w-4 h-4 transition-colors ${
              activeSection === item.id ? 'text-red-400' : 'text-slate-500 group-hover:text-red-400'
            }`} />
            <span className="font-medium flex-1 text-left text-sm truncate">{item.label}</span>
            {item.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                item.critical
                  ? 'bg-red-500 text-white animate-pulse'
                  : activeSection === item.id
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-700/50 text-slate-400'
              }`}>
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Status Panel */}
      <div className="absolute bottom-32 left-4 right-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">Crisis Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">Threat Level</span>
                <span className="text-[10px] font-bold text-amber-400">ELEVATED</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-red-500/20 text-red-300 text-xs hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={() => navigate('/change-password')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-red-500/20 text-red-300 text-xs hover:bg-slate-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Password
          </button>
        </div>
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-red-500/20 text-red-300 text-xs hover:bg-slate-800 transition-colors"
        >
          <KeyRound className="w-3.5 h-3.5" />
          Forgot Password
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-red-500/20 text-red-300 text-xs hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.aside>
  );
};

export default IncidentCrisisSidebar;
