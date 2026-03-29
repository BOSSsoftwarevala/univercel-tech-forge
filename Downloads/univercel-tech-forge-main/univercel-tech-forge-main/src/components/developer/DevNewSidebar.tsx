import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ListTodo, Bug, Code2, Timer, 
  Bot, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DevNewSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'bugs', label: 'Bugs & Issues', icon: Bug },
  { id: 'code-submission', label: 'Code Submission', icon: Code2 },
  { id: 'timer', label: 'Timer & Productivity', icon: Timer },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DevNewSidebar = ({ activeSection, onSectionChange }: DevNewSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Session ended');
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400'
                : 'hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400 border border-transparent'
            }`}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-cyan-400' : ''}`} />
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full" />
              )}
            </div>
            {!collapsed && (
              <span className="font-medium text-sm text-left flex-1">{item.label}</span>
            )}
            {!collapsed && activeSection === item.id && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
            )}
          </motion.button>
        ))}
      </nav>

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

export default DevNewSidebar;
