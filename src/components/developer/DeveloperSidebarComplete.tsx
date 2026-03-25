import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ListTodo, Bug, Code2, Timer, Bot, BarChart3, Settings, 
  LogOut, ChevronLeft, ChevronRight, Zap, Target, AlertCircle, Sparkles,
  FolderLock, Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DeveloperSidebarCompleteProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: null, description: 'Dashboard & AI suggestions' },
  { id: 'source-lock', label: 'Source Code Lock', icon: FolderLock, badge: null, description: 'Assigned project & code access' },
  { id: 'tasks', label: 'Tasks', icon: ListTodo, badge: 3, description: 'All tasks & assignments' },
  { id: 'bugs', label: 'Bugs & Issues', icon: Bug, badge: 2, description: 'Bug tracking & fixes' },
  { id: 'code-submission', label: 'Code Submission', icon: Code2, badge: null, description: 'Submit code for review' },
  { id: 'timer', label: 'Timer & Productivity', icon: Timer, badge: null, description: 'Time tracking & stats' },
  { id: 'ai-chat', label: 'AI Chat', icon: Bot, badge: null, isAI: true, description: 'Live AI coding help' },
  { id: 'code-quality', label: 'Code Quality AI', icon: Brain, badge: null, isAI: true, description: 'Vala AI reviews & testing' },
  { id: 'performance', label: 'Performance', icon: BarChart3, badge: null, description: 'Metrics & analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null, description: 'Preferences & config' },
];

const DeveloperSidebarComplete = ({ activeSection, onSectionChange }: DeveloperSidebarCompleteProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Session ended - All timers stopped');
    navigate('/auth');
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-slate-950/95 backdrop-blur-xl border-r border-cyan-500/20 z-40 transition-all duration-300 flex flex-col`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Quick Stats (when not collapsed) */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-800/50">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-slate-400">Active</span>
              </div>
              <p className="text-lg font-bold text-white mt-0.5">3</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-slate-400">Blocked</span>
              </div>
              <p className="text-lg font-bold text-white mt-0.5">1</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              activeSection === item.id
                ? item.isAI 
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/50 text-violet-400'
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400'
                : item.isAI
                  ? 'hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 border border-transparent'
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400 border border-transparent'
            }`}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? (item.isAI ? 'text-violet-400' : 'text-cyan-400') : ''}`} />
              {activeSection === item.id && (
                <div className={`absolute inset-0 ${item.isAI ? 'bg-violet-400/30' : 'bg-cyan-400/30'} blur-md rounded-full`} />
              )}
            </div>
            
            {!collapsed && (
              <>
                <span className="font-medium text-sm text-left flex-1">{item.label}</span>
                
                {/* AI indicator */}
                {item.isAI && (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </motion.div>
                )}
                
                {/* Badge */}
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
                
                {/* Active indicator */}
                {activeSection === item.id && !item.isAI && !item.badge && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                )}
              </>
            )}

            {/* Tooltip for collapsed mode */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Performance Widget */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/50">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400 font-semibold">Today's Progress</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Tasks</span>
                  <span className="text-emerald-400">2/5</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Bugs Fixed</span>
                  <span className="text-cyan-400">3/4</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default DeveloperSidebarComplete;
