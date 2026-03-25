// ============================================
// CONTINENT ADMIN — META BUSINESS MANAGER CLONE
// Enterprise Execution Mode
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Globe2, Users, ClipboardCheck, ClipboardList,
  TrendingUp, AlertTriangle, Brain, FileText, LogOut, Clock,
  Building2, Store, Target, DollarSign, Shield, Settings,
  ChevronRight, Search, Bell, HelpCircle, ChevronDown,
  BarChart3, Activity, Briefcase, UserCheck, Map,
  Megaphone, PieChart, Layers, Zap
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Views
import OverviewView from './views/OverviewView';
import CountriesView from './views/CountriesView';
import ApprovalsView from './views/ApprovalsView';
import TasksView from './views/TasksView';
import PerformanceView from './views/PerformanceView';
import RiskAlertsView from './views/RiskAlertsView';
import AIInsightsView from './views/AIInsightsView';
import AuditView from './views/AuditView';
import PeopleView from './views/PeopleView';
import BusinessAssetsView from './views/BusinessAssetsView';
import RevenueView from './views/RevenueView';
import CampaignsView from './views/CampaignsView';

type ViewType = 'overview' | 'countries' | 'people' | 'business-assets' | 'approvals' | 
                'tasks' | 'performance' | 'revenue' | 'campaigns' |
                'risk-alerts' | 'ai-insights' | 'audit' | 'settings';

interface SidebarSection {
  title: string;
  items: { id: ViewType; label: string; icon: any; badge?: string; highlight?: boolean }[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: '',
    items: [
      { id: 'overview', label: 'Home', icon: LayoutGrid },
    ]
  },
  {
    title: 'ACCOUNTS',
    items: [
      { id: 'countries', label: 'Business Accounts', icon: Globe2 },
      { id: 'people', label: 'People', icon: Users },
      { id: 'business-assets', label: 'Business Assets', icon: Briefcase },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'approvals', label: 'Requests', icon: ClipboardCheck, badge: '12' },
      { id: 'tasks', label: 'Tasks', icon: ClipboardList },
      { id: 'performance', label: 'Business Performance', icon: BarChart3 },
    ]
  },
  {
    title: 'GROWTH',
    items: [
      { id: 'revenue', label: 'Billing & Payments', icon: DollarSign },
      { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'risk-alerts', label: 'Brand Safety', icon: Shield },
      { id: 'ai-insights', label: 'AI Insights', icon: Brain },
      { id: 'audit', label: 'Activity Log', icon: Activity },
    ]
  },
  {
    title: '',
    items: [
      { id: 'settings', label: 'Business Settings', icon: Settings },
    ]
  },
];

interface ContinentDashboardProps {
  continentId?: string;
  continentName?: string;
  onBack?: () => void;
}

const ContinentSuperAdminDashboard = ({ continentId, continentName, onBack }: ContinentDashboardProps = {}) => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sessionTime, setSessionTime] = useState('00:00');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'ACCOUNTS': true, 'OPERATIONS': true, 'GROWTH': true, 'INTELLIGENCE': true
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'super_admin' as any,
      module: 'continent-super-admin',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Logged out');
    navigate('/auth');
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'countries': return <CountriesView />;
      case 'people': return <PeopleView />;
      case 'business-assets': return <BusinessAssetsView />;
      case 'approvals': return <ApprovalsView />;
      case 'tasks': return <TasksView />;
      case 'performance': return <PerformanceView />;
      case 'revenue': return <RevenueView />;
      case 'campaigns': return <CampaignsView />;
      case 'risk-alerts': return <RiskAlertsView />;
      case 'ai-insights': return <AIInsightsView />;
      case 'audit': return <AuditView />;
      case 'settings': return <OverviewView />;
      default: return <OverviewView />;
    }
  };

  const activeLabel = sidebarSections.flatMap(s => s.items).find(i => i.id === activeView)?.label || 'Home';

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden select-none"
      style={{ background: '#f0f2f5', userSelect: 'none', WebkitUserSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* ═══ META-STYLE TOP BAR ═══ */}
      <header className="h-[52px] bg-white flex items-center justify-between px-4 flex-shrink-0 border-b border-[#dddfe2] shadow-sm z-50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#1c1e21] text-base font-semibold">{continentName || 'Business Manager'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#65676b]" />
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 ml-4">
            <span className="text-[13px] text-[#1877F2] font-medium cursor-pointer hover:underline">Software Vala</span>
            <ChevronRight className="w-3 h-3 text-[#bec3c9]" />
            <span className="text-[13px] text-[#65676b]">{activeLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f2f5] text-[#65676b] text-[13px] hover:bg-[#e4e6eb] transition-colors min-w-[200px]">
            <Search className="w-3.5 h-3.5" />
            <span>Search across accounts</span>
          </button>

          {/* Help */}
          <button className="w-9 h-9 rounded-full bg-[#e4e6eb] flex items-center justify-center text-[#1c1e21] hover:bg-[#d8dadf] transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-full bg-[#e4e6eb] flex items-center justify-center text-[#1c1e21] hover:bg-[#d8dadf] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#e41e3f] rounded-full text-white text-[10px] font-bold flex items-center justify-center">5</span>
          </button>

          {/* User Avatar */}
          <button 
            onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-sm font-bold hover:bg-[#166fe5] transition-colors"
            title="Logout"
          >
            {user?.email?.charAt(0).toUpperCase() || 'C'}
          </button>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR — Meta Business Manager Style */}
        <aside className="w-[280px] bg-white flex-shrink-0 border-r border-[#dddfe2] flex flex-col">
          {/* Business Info */}
          <div className="px-4 py-3 border-b border-[#e4e6eb]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1877F2] to-[#0a5dc2] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1c1e21] truncate">{continentName || 'Software Vala Global'}</p>
                <p className="text-[12px] text-[#65676b]">Continent Admin · {continentId?.toUpperCase() || 'SV-CONT-001'}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 py-1">
            <nav className="px-2">
              {sidebarSections.map((section, sIdx) => (
                <div key={sIdx} className="mb-1">
                  {section.title && (
                    <button 
                      onClick={() => setExpandedSections(prev => ({...prev, [section.title]: !prev[section.title]}))}
                      className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-[#65676b] uppercase tracking-wider hover:bg-[#f0f2f5] rounded-md transition-colors"
                    >
                      {section.title}
                      <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections[section.title] ? '' : '-rotate-90'}`} />
                    </button>
                  )}
                  {(!section.title || expandedSections[section.title]) && (
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-md text-[13px] transition-all ${
                              isActive
                                ? 'bg-[#e7f3ff] text-[#1877F2] font-medium'
                                : 'text-[#1c1e21] hover:bg-[#f0f2f5]'
                            }`}
                          >
                            <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${
                              isActive ? 'text-[#1877F2]' : 'text-[#65676b]'
                            }`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <span className="px-[6px] py-[1px] rounded-full text-[11px] font-bold bg-[#e41e3f] text-white min-w-[20px] text-center">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Bottom Footer */}
          <div className="p-3 border-t border-[#e4e6eb]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f0f9ff] border border-[#1877F2]/20">
              <Shield className="w-4 h-4 text-[#1877F2]" />
              <div className="flex-1">
                <p className="text-[11px] font-medium text-[#1c1e21]">Enterprise Verified</p>
                <p className="text-[10px] text-[#65676b]">Session: {sessionTime}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto" style={{ background: '#f0f2f5' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ContinentSuperAdminDashboard;
