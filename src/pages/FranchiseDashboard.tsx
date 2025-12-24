import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Monitor, Wallet, MapPin,
  GraduationCap, TrendingUp, AlertTriangle, Settings,
  ChevronLeft, ChevronRight, Target, FileText, ShieldCheck, LogOut, Lock,
  Megaphone, Search, Globe, ArrowLeft, KeyRound
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import softwareValaLogo from '@/assets/software-vala-logo.png';
import FranchiseDash from '@/components/franchise/FranchiseDash';
import FranchiseLeadConsole from '@/components/franchise/FranchiseLeadConsole';
import FranchiseDemoPanel from '@/components/franchise/FranchiseDemoPanel';
import FranchiseWalletCommission from '@/components/franchise/FranchiseWalletCommission';
import FranchiseContractTerritory from '@/components/franchise/FranchiseContractTerritory';
import FranchiseAITraining from '@/components/franchise/FranchiseAITraining';
import FranchisePerformanceBoard from '@/components/franchise/FranchisePerformanceBoard';
import FranchiseEscalationScreen from '@/components/franchise/FranchiseEscalationScreen';
import { FranchiseAuditLogs } from '@/components/franchise/FranchiseAuditLogs';
import FranchiseSecurityModule from '@/components/franchise/security/FranchiseSecurityModule';
import { LocalMarketingSuite } from '@/components/franchise/LocalMarketingSuite';
import FranchiseSEODashboard from '@/components/franchise/FranchiseSEODashboard';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead Console', icon: Users, badge: 8 },
  { id: 'demos', label: 'Demo Access', icon: Monitor },
  { id: 'wallet', label: 'Wallet & Commission', icon: Wallet },
  { id: 'territory', label: 'Territory & Contract', icon: MapPin },
  { id: 'marketing', label: 'Local Marketing', icon: Megaphone, badge: 'AI' },
  { id: 'seo', label: 'SEO & Promotions', icon: Globe },
  { id: 'training', label: 'AI Training', icon: GraduationCap, badge: 'AI' },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
  { id: 'security', label: 'Security Control', icon: ShieldCheck, badge: 'NEW' },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
];

const FranchiseDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'leads': return <FranchiseLeadConsole />;
      case 'demos': return <FranchiseDemoPanel />;
      case 'wallet': return <FranchiseWalletCommission />;
      case 'territory': return <FranchiseContractTerritory />;
      case 'marketing': return <LocalMarketingSuite />;
      case 'seo': return <FranchiseSEODashboard />;
      case 'training': return <FranchiseAITraining />;
      case 'performance': return <FranchisePerformanceBoard />;
      case 'escalations': return <FranchiseEscalationScreen />;
      case 'security': return <FranchiseSecurityModule />;
      case 'audit': return <FranchiseAuditLogs />;
      default: return <FranchiseDash />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Static Background - No JS animations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="franchise-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="currentColor" className="text-indigo-400" />
              <line x1="40" y1="0" x2="40" y2="80" stroke="currentColor" strokeWidth="0.2" className="text-purple-500" />
              <line x1="0" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.2" className="text-purple-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#franchise-grid)" />
        </svg>
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/20 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img 
            src={softwareValaLogo} 
            alt="Software Vala" 
            className="h-10 w-auto object-contain"
          />
          <p className="text-xs text-indigo-400">Franchise Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-400">Online</span>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-slate-900/60 backdrop-blur-xl border-r border-indigo-500/20 z-40 transition-all duration-300`}
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/50 text-indigo-400 shadow-lg shadow-indigo-500/10'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-indigo-400'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-indigo-400' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.badge === 'AI' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {activeSection === item.id && (
                      <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Performance Widget */}
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
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Leads Closed</span>
                      <span className="text-indigo-400">42 / 50</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[84%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <ArrowLeft className="w-5 h-5" />
              {!collapsed && <span className="font-medium">Back to Dashboard</span>}
            </button>
            <button 
              onClick={() => navigate('/change-password')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <Lock className="w-5 h-5" />
              {!collapsed && <span className="font-medium">Change Password</span>}
            </button>
            <button 
              onClick={() => navigate('/forgot-password')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <KeyRound className="w-5 h-5" />
              {!collapsed && <span className="font-medium">Forgot Password</span>}
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
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
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} p-6 min-h-screen transition-all duration-300`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default FranchiseDashboard;
