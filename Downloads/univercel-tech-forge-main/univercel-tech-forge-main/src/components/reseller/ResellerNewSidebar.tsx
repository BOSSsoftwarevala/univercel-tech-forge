import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Link, 
  Wallet, 
  Brain, 
  AlertTriangle, 
  BarChart3, 
  Target,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useState } from 'react';

interface ResellerNewSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead Inbox', icon: Users },
  { id: 'demos', label: 'Demo Links', icon: Link },
  { id: 'wallet', label: 'Wallet & Commission', icon: Wallet },
  { id: 'training', label: 'AI Training', icon: Brain },
  { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'targets', label: 'Targets', icon: Target },
];

const ResellerNewSidebar = ({ activeSection, onSectionChange }: ResellerNewSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900/95 to-emerald-950/30 backdrop-blur-xl border-r border-emerald-500/20 z-40"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-500 transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Area */}
      <div className="p-4 border-b border-emerald-500/20">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-white font-bold">Reseller Hub</h2>
              <p className="text-emerald-400 text-xs">Sales Partner Portal</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="reseller-activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Performance Widget */}
      {!collapsed && (
        <div className="absolute bottom-20 left-3 right-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">Monthly Target</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-emerald-400">72%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">₹7.2L / ₹10L</span>
                <span className="text-teal-400">28% to go</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="absolute bottom-4 left-3 right-3">
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default ResellerNewSidebar;
