import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Monitor, Wallet, FileText,
  GraduationCap, TrendingUp, AlertTriangle, Settings,
  ChevronLeft, ChevronRight, Target, MapPin
} from 'lucide-react';

interface FranchiseNewSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead Console', icon: Users },
  { id: 'demos', label: 'Demo Access', icon: Monitor },
  { id: 'wallet', label: 'Wallet & Commission', icon: Wallet },
  { id: 'territory', label: 'Territory & Contract', icon: MapPin },
  { id: 'training', label: 'AI Training', icon: GraduationCap },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
];

const FranchiseNewSidebar = ({ activeSection, onSectionChange }: FranchiseNewSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-indigo-950 to-slate-900 backdrop-blur-xl border-r border-indigo-500/20 z-40 transition-all duration-300`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-400 transition-colors"
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
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 text-indigo-400 shadow-lg shadow-indigo-500/10'
                : 'hover:bg-slate-800/50 text-slate-400 hover:text-indigo-400'
            }`}
          >
            <div className={`relative ${activeSection === item.id ? 'text-indigo-400' : ''}`}>
              <item.icon className="w-5 h-5" />
              {/* Simplified glow - no layoutId for better performance */}
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-indigo-400/30 blur-md rounded-full" />
              )}
            </div>
            {!collapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {/* Simplified dot - no layoutId for better performance */}
                {activeSection === item.id && (
                  <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50" />
                )}
              </>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Target Widget */}
      {!collapsed && (
        <div className="absolute bottom-20 left-4 right-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-400 font-semibold">Monthly Target</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Sales</span>
                  <span className="text-emerald-400">₹8.5L / ₹10L</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Leads Closed</span>
                  <span className="text-indigo-400">42 / 50</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default FranchiseNewSidebar;
