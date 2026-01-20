import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Wallet, BarChart3, Target, Settings, LogOut,
  Radar, Brain, Sparkles, Coins, ShoppingCart, Briefcase, Percent,
  Banknote, FileText, Bell, Lock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { GlobalBackButton } from '@/components/shared/GlobalBackButton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import softwareValaLogo from '@/assets/software-vala-logo.png';

// Import all modules
import { LeadInboxReseller } from '@/components/reseller/LeadInboxReseller';
import { ResellerWallet } from '@/components/reseller/ResellerWallet';
import { ResellerPerformanceBoard } from '@/components/reseller/ResellerPerformanceBoard';
import ResellerDash from '@/components/reseller/ResellerDash';
import AIMonitoringCenter from '@/components/reseller/AIMonitoringCenter';
import AILeadScoring from '@/components/reseller/AILeadScoring';
import AIResellerAssistant from '@/components/reseller/AIResellerAssistant';
import ResellerAICredits from '@/components/reseller/ResellerAICredits';
import ResellerLeadDashboard from '@/components/reseller/ResellerLeadDashboard';
import ResellerOrders from '@/components/reseller/ResellerOrders';
import ResellerClients from '@/components/reseller/ResellerClients';
import ResellerCommission from '@/components/reseller/ResellerCommission';
import ResellerPayouts from '@/components/reseller/ResellerPayouts';
import ResellerInvoices from '@/components/reseller/ResellerInvoices';
import ResellerNotifications from '@/components/reseller/ResellerNotifications';
import ResellerSettings from '@/components/reseller/ResellerSettings';

// Menu items with icons as per Figma spec
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users, badge: 12 },
  { id: 'lead-dashboard', label: 'Lead Dashboard', icon: BarChart3 },
  { id: 'monitoring', label: 'AI Monitoring', icon: Radar },
  { id: 'scoring', label: 'AI Lead Scoring', icon: Sparkles },
  { id: 'assistant', label: 'AI Assistant', icon: Brain },
  { id: 'ai-credits', label: 'AI Credits', icon: Coins },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'orders', label: 'Orders / Sales', icon: ShoppingCart },
  { id: 'clients', label: 'Clients', icon: Briefcase },
  { id: 'commission', label: 'Commission', icon: Percent },
  { id: 'payouts', label: 'Payout Requests', icon: Banknote },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
  { id: 'performance', label: 'Performance', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ResellerDashboard = () => {
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
      case 'leads': return <LeadInboxReseller />;
      case 'lead-dashboard': return <ResellerLeadDashboard />;
      case 'monitoring': return <AIMonitoringCenter />;
      case 'scoring': return <AILeadScoring />;
      case 'assistant': return <AIResellerAssistant />;
      case 'ai-credits': return <ResellerAICredits />;
      case 'wallet': return <ResellerWallet />;
      case 'orders': return <ResellerOrders />;
      case 'clients': return <ResellerClients />;
      case 'commission': return <ResellerCommission />;
      case 'payouts': return <ResellerPayouts />;
      case 'invoices': return <ResellerInvoices />;
      case 'notifications': return <ResellerNotifications />;
      case 'performance': return <ResellerPerformanceBoard />;
      case 'settings': return <ResellerSettings />;
      default: return <ResellerDash onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_50%)]" />
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-emerald-500/20 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <GlobalBackButton
            onBack={() => {
              if (activeSection === 'dashboard') {
                toast.info('You are already on your dashboard');
                return;
              }
              setActiveSection('dashboard');
            }}
            activeScreen={activeSection}
            homeScreen="dashboard"
            showHome={false}
            variant="compact"
          />
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/30"
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="text-white font-bold text-lg">SV</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">Reseller Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400">Online</span>
          </motion.div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Fixed, Click-based, NO Hover Tooltips */}
        <aside
          className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-slate-900/80 backdrop-blur-xl border-r border-emerald-500/20 z-40 transition-all duration-300 overflow-hidden`}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors z-50"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Navigation - Scrollable */}
          <nav className="h-full overflow-y-auto pb-40 pt-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-emerald-400 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                  {!collapsed && (
                    <>
                      <span className="font-medium flex-1 text-left text-sm truncate">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer - Just Logout */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-emerald-500/10 p-3">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="text-sm">Logout</span>}
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
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ResellerDashboard;
