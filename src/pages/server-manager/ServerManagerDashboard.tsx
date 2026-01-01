// Server Manager Dashboard - Infrastructure Command Center (EXPANDED)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, LayoutGrid, Activity, AlertTriangle, Database, Shield, 
  FileText, BarChart3, LogOut, Lock, Clock, Cpu, Network, 
  Rocket, Layers, ShoppingCart, Receipt, FileSearch, Settings,
  List, Gauge, ArrowLeft, Plus, Brain, Terminal, HardDrive
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

type ViewType = 'dashboard' | 'registry' | 'monitoring' | 'performance' | 'alerts' | 
                'resources' | 'network' | 'storage' | 'security' | 'deployments' |
                'plans' | 'buy' | 'billing' | 'logs' | 'settings' | 'addserver' | 
                'aihealth' | 'serverlogin' | 'backups';

const sidebarItems: { id: ViewType; label: string; icon: any; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'addserver', label: 'Add Server', icon: Plus },
  { id: 'registry', label: 'Server Registry', icon: List },
  { id: 'serverlogin', label: 'Server Login', icon: Terminal },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'aihealth', label: 'AI Health Suggestions', icon: Brain },
  { id: 'performance', label: 'Performance', icon: Gauge },
  { id: 'alerts', label: 'Alerts & Incidents', icon: AlertTriangle, badge: '3' },
  { id: 'resources', label: 'Resource Usage', icon: Cpu },
  { id: 'network', label: 'Network & Traffic', icon: Network },
  { id: 'backups', label: 'Backup Manager', icon: HardDrive },
  { id: 'storage', label: 'Storage', icon: Database },
  { id: 'security', label: 'Security & Firewall', icon: Shield },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'plans', label: 'Explore Plans', icon: Layers },
  { id: 'buy', label: 'Buy New Server', icon: ShoppingCart },
  { id: 'billing', label: 'Billing & Usage', icon: Receipt },
  { id: 'logs', label: 'Logs & Audit', icon: FileSearch },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ServerManagerDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [infraStatus, setInfraStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Session timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
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
    toast.success('Secure logout complete');
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
      case 'plans': return <SMExplorePlans />;
      case 'buy': return <SMBuyServer />;
      case 'billing': return <SMBilling />;
      case 'logs': return <SMLogs />;
      case 'settings': return <SMSettings />;
      default: return <SMOverview />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* TOP HEADER */}
      <header className="h-14 bg-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 border-b border-cyan-500/20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Server className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-semibold text-white">Server Manager</span>
              <span className="text-cyan-400 text-sm ml-2">Command Center</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Infra Status */}
          <motion.div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              infraStatus === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/30' :
              infraStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-2 h-2 rounded-full ${
              infraStatus === 'healthy' ? 'bg-emerald-500' :
              infraStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              infraStatus === 'healthy' ? 'text-emerald-400' :
              infraStatus === 'warning' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {infraStatus === 'healthy' ? 'All Systems Healthy' : 
               infraStatus === 'warning' ? 'Warning' : 'Critical'}
            </span>
          </motion.div>

          {/* Session Timer */}
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Fixed, No Hover Popups */}
        <aside className="w-60 bg-slate-900/80 backdrop-blur-xl flex-shrink-0 border-r border-cyan-500/20 flex flex-col">
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                    )}
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Security Notice */}
          <div className="p-4 border-t border-cyan-500/10">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="h-3 w-3 text-cyan-400" />
                <span>IP Locked · Audited</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Infrastructure scope only</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-slate-950 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
