import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ListTodo, Timer, MessageSquare, 
  Code2, TrendingUp, Wallet, Zap, Settings,
  ChevronLeft, ChevronRight, LogOut, Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DeveloperSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Task Assignment', icon: ListTodo },
  { id: 'timer', label: 'Timer & Progress', icon: Timer },
  { id: 'chat', label: 'Internal Chat', icon: MessageSquare },
  { id: 'code', label: 'Code Submission', icon: Code2 },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
];

const DeveloperSidebar = ({ activeSection, onSectionChange }: DeveloperSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-slate-900/80 backdrop-blur-xl border-r border-cyan-500/20 z-40 transition-all duration-300`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="p-4 space-y-2 mt-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10'
                : 'hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400'
            }`}
          >
            <div className={`relative ${activeSection === item.id ? 'text-cyan-400' : ''}`}>
              <item.icon className="w-5 h-5" />
              {activeSection === item.id && (
                <motion.div
                  layoutId="dev-sidebar-glow"
                  className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full"
                />
              )}
            </div>
            {!collapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="dev-active-dot"
                    className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                  />
                )}
              </>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Performance Widget */}
      {!collapsed && (
        <div className="absolute bottom-20 left-4 right-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-semibold">Performance</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Speed</span>
                  <span className="text-cyan-400">92%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Quality</span>
                  <span className="text-emerald-400">88%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: '88%' }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">On-Time</span>
                  <span className="text-amber-400">95%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Logout */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <button 
          onClick={() => navigate('/change-password')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Lock className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Change Password</span>}
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default DeveloperSidebar;
