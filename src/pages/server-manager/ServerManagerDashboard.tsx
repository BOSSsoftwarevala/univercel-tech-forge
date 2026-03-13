// ============================================
// SERVER MANAGER — VERCEL CLONE
// Enterprise Execution Mode
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, LayoutGrid, Activity, AlertTriangle, Database, Shield, 
  FileText, LogOut, Lock, Clock, Cpu, Network, Globe,
  Rocket, Layers, ShoppingCart, Receipt, Settings,
  List, Gauge, ArrowLeft, Plus, Brain, Terminal, HardDrive,
  ChevronRight, GitBranch, Search, Bell, MoreVertical,
  ExternalLink, Zap
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Screens
import SMOverview from './screens/SMOverview';
import SMServers from './screens/SMServers';
import SMServices from './screens/SMServices';
import SMUptime from './screens/SMUptime';
import SMIncidents from './screens/SMIncidents';
import SMBackups from './screens/SMBackups';
import SMSecurity from './screens/SMSecurity';
import SMLogs from './screens/SMLogs';
import SMMaintenance from './screens/SMMaintenance';
import SMReports from './screens/SMReports';
import SMAudit from './screens/SMAudit';
import SMRegistry from './screens/SMRegistry';
import SMMonitoring from './screens/SMMonitoring';
import SMPerformance from './screens/SMPerformance';
import SMResources from './screens/SMResources';
import SMNetwork from './screens/SMNetwork';
import SMDeployments from './screens/SMDeployments';
import SMExplorePlans from './screens/SMExplorePlans';
import SMBuyServer from './screens/SMBuyServer';
import SMBilling from './screens/SMBilling';
import SMSettings from './screens/SMSettings';
import SMAddServer from './screens/SMAddServer';
import SMAIHealthSuggestions from './screens/SMAIHealthSuggestions';
import SMServerLogin from './screens/SMServerLogin';
import SMBackupManager from './screens/SMBackupManager';
import SMDomains from './screens/SMDomains';

type ViewType = 'dashboard' | 'registry' | 'monitoring' | 'performance' | 'alerts' | 
                'resources' | 'network' | 'storage' | 'security' | 'deployments' |
                'plans' | 'buy' | 'billing' | 'logs' | 'settings' | 'addserver' | 
                'aihealth' | 'serverlogin' | 'backups' | 'domains';

interface SidebarSection {
  title: string;
  items: { id: ViewType; label: string; icon: any; badge?: string }[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: '',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    ]
  },
  {
    title: 'INFRASTRUCTURE',
    items: [
      { id: 'registry', label: 'Servers', icon: Server },
      { id: 'addserver', label: 'Add Server', icon: Plus },
      { id: 'serverlogin', label: 'Console', icon: Terminal },
      { id: 'domains', label: 'Domains', icon: Globe },
    ]
  },
  {
    title: 'DEPLOYMENTS',
    items: [
      { id: 'deployments', label: 'Deployments', icon: Rocket },
      { id: 'monitoring', label: 'Monitoring', icon: Activity },
      { id: 'performance', label: 'Performance', icon: Gauge },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'alerts', label: 'Incidents', icon: AlertTriangle, badge: '3' },
      { id: 'aihealth', label: 'AI Diagnostics', icon: Brain },
      { id: 'backups', label: 'Backups', icon: HardDrive },
      { id: 'security', label: 'Firewall', icon: Shield },
    ]
  },
  {
    title: 'RESOURCES',
    items: [
      { id: 'resources', label: 'Usage', icon: Cpu },
      { id: 'network', label: 'Network', icon: Network },
      { id: 'storage', label: 'Storage', icon: Database },
    ]
  },
  {
    title: 'BILLING',
    items: [
      { id: 'plans', label: 'Plans', icon: Layers },
      { id: 'buy', label: 'New Server', icon: ShoppingCart },
      { id: 'billing', label: 'Usage & Billing', icon: Receipt },
    ]
  },
  {
    title: '',
    items: [
      { id: 'logs', label: 'Logs', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

const ServerManagerDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sessionTime, setSessionTime] = useState('00:00');
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
      role: 'server_manager' as any,
      module: 'server-manager',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Logged out');
    navigate('/auth');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <SMOverview />;
      case 'addserver': return <SMAddServer />;
      case 'registry': return <SMRegistry />;
      case 'serverlogin': return <SMServerLogin />;
      case 'monitoring': return <SMMonitoring />;
      case 'aihealth': return <SMAIHealthSuggestions />;
      case 'performance': return <SMPerformance />;
      case 'alerts': return <SMIncidents />;
      case 'resources': return <SMResources />;
      case 'network': return <SMNetwork />;
      case 'backups': return <SMBackupManager />;
      case 'storage': return <SMBackups />;
      case 'security': return <SMSecurity />;
      case 'deployments': return <SMDeployments />;
      case 'domains': return <SMDomains />;
      case 'plans': return <SMExplorePlans />;
      case 'buy': return <SMBuyServer />;
      case 'billing': return <SMBilling />;
      case 'logs': return <SMLogs />;
      case 'settings': return <SMSettings />;
      default: return <SMOverview />;
    }
  };

  const activeLabel = sidebarSections.flatMap(s => s.items).find(i => i.id === activeView)?.label || 'Overview';

  return (
    <div className="h-screen w-screen bg-[#000] flex flex-col overflow-hidden">
      {/* ═══ VERCEL-STYLE TOP BAR ═══ */}
      <header className="h-12 bg-[#000] flex items-center justify-between px-4 flex-shrink-0 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Vercel-style breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-[#666] flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="text-white text-sm font-medium">Software Vala</span>
            <ChevronRight className="w-3 h-3 text-[#555]" />
            <span className="text-[#888] text-sm">Infrastructure</span>
            <ChevronRight className="w-3 h-3 text-[#555]" />
            <span className="text-white text-sm">{activeLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#333] bg-[#111] text-[#666] text-xs hover:border-[#555] transition-colors">
            <Search className="w-3 h-3" />
            <span>Search...</span>
            <kbd className="ml-4 px-1.5 py-0.5 rounded bg-[#222] text-[#555] text-[10px] border border-[#333]">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-[#888] hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          {/* Session */}
          <div className="flex items-center gap-1.5 text-[#555] text-xs font-mono">
            <Clock className="w-3 h-3" />
            {sessionTime}
          </div>

          {/* User */}
          <button 
            onClick={handleLogout}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
            title="Logout"
          >
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </button>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR — Vercel Style */}
        <aside className="w-56 bg-[#000] flex-shrink-0 border-r border-[#333] flex flex-col">
          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-4 px-2">
              {sidebarSections.map((section, sIdx) => (
                <div key={sIdx}>
                  {section.title && (
                    <p className="px-3 py-1 text-[10px] font-semibold text-[#555] tracking-wider uppercase">
                      {section.title}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveView(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] transition-all ${
                            isActive
                              ? 'bg-[#222] text-white'
                              : 'text-[#888] hover:bg-[#111] hover:text-[#ccc]'
                          }`}
                        >
                          <item.icon className={`w-[14px] h-[14px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#666]'}`} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400 min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Bottom Status */}
          <div className="p-3 border-t border-[#222]">
            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-[#0a0a0a]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-[#888]">All systems operational</span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT — Dark with minimal borders */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a]">
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

export default ServerManagerDashboard;
