// Server Manager Dashboard - Infrastructure Command Center
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, LayoutGrid, Activity, Clock, AlertTriangle, Database,
  Shield, FileText, Wrench, BarChart3, Eye, LogOut, Lock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

type ViewType = 'overview' | 'servers' | 'services' | 'uptime' | 'incidents' | 
                'backups' | 'security' | 'logs' | 'maintenance' | 'reports' | 'audit';

const sidebarItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'services', label: 'Services', icon: Activity },
  { id: 'uptime', label: 'Uptime & SLA', icon: Clock },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit (Read Only)', icon: Eye },
];

const ServerManagerDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [infraStatus, setInfraStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Session timer - properly use useEffect
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
      case 'overview': return <SMOverview />;
      case 'servers': return <SMServers />;
      case 'services': return <SMServices />;
      case 'uptime': return <SMUptime />;
      case 'incidents': return <SMIncidents />;
      case 'backups': return <SMBackups />;
      case 'security': return <SMSecurity />;
      case 'logs': return <SMLogs />;
      case 'maintenance': return <SMMaintenance />;
      case 'reports': return <SMReports />;
      case 'audit': return <SMAudit />;
      default: return <SMOverview />;
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-stone-100 flex flex-col overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* TOP HEADER */}
      <header className="h-14 bg-slate-800 flex items-center justify-between px-6 flex-shrink-0 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Server className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-semibold text-white">Server Manager — Command Center</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Infra Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
            infraStatus === 'healthy' ? 'bg-green-500/10 border-green-500/30' :
            infraStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              infraStatus === 'healthy' ? 'bg-green-500' :
              infraStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm ${
              infraStatus === 'healthy' ? 'text-green-400' :
              infraStatus === 'warning' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {infraStatus === 'healthy' ? 'Healthy' : 
               infraStatus === 'warning' ? 'Warning' : 'Critical'}
            </span>
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-slate-500 text-slate-200 hover:bg-slate-700 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Secure Logout
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-56 bg-slate-800 flex-shrink-0 border-r border-slate-700 flex flex-col">
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>

          {/* Security Notice */}
          <div className="p-4 border-t border-slate-700">
            <div className="p-3 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="h-3 w-3" />
                <span>IP Locked · No Export</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Infra-scope only</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-stone-100 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default ServerManagerDashboard;
