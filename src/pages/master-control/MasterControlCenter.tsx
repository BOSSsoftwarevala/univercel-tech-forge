import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutGrid, Globe2, Users, Shield, AlertTriangle, 
  Eye, FileText, Lock, LogOut, Clock, Activity
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MasterThroneIcon from '@/components/icons/MasterThroneIcon';

// Views
import OverviewView from './views/OverviewView';
import ContinentsView from './views/ContinentsView';
import SuperAdminsView from './views/SuperAdminsView';
import GlobalRulesView from './views/GlobalRulesView';
import HighRiskApprovalsView from './views/HighRiskApprovalsView';
import SecurityMonitorView from './views/SecurityMonitorView';
import AuditView from './views/AuditView';
import SystemLockView from './views/SystemLockView';
import AIInsightsPanel from './components/AIInsightsPanel';

type ViewType = 'overview' | 'continents' | 'super-admins' | 'global-rules' | 
                'approvals' | 'security' | 'audit' | 'system-lock';

const sidebarItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'continents', label: 'Continents', icon: Globe2 },
  { id: 'super-admins', label: 'Super Admins', icon: Users },
  { id: 'global-rules', label: 'Global Rules', icon: Shield },
  { id: 'approvals', label: 'Approvals (High Risk)', icon: AlertTriangle },
  { id: 'security', label: 'Security Monitor', icon: Eye },
  { id: 'audit', label: 'Audit (Read-Only)', icon: FileText },
  { id: 'system-lock', label: 'System Lock', icon: Lock },
];

const MasterControlCenter = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Session timer
  useState(() => {
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
  });

  const handleLogout = async () => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'master-control',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Secure logout complete');
    navigate('/sv-master-control');
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'continents': return <ContinentsView />;
      case 'super-admins': return <SuperAdminsView />;
      case 'global-rules': return <GlobalRulesView />;
      case 'approvals': return <HighRiskApprovalsView />;
      case 'security': return <SecurityMonitorView />;
      case 'audit': return <AuditView />;
      case 'system-lock': return <SystemLockView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="h-screen w-screen bg-neutral-100 flex flex-col overflow-hidden select-none">
      {/* TOP HEADER - Dark charcoal matching sidebar */}
      <header className="h-14 bg-neutral-800 flex items-center justify-between px-6 flex-shrink-0 border-b border-neutral-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MasterThroneIcon size="md" showTooltip />
            <div>
              <span className="font-semibold text-white">Master Admin Control Center</span>
              <span className="text-xs text-neutral-400 ml-2">Supreme Control</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 rounded border border-neutral-600">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-neutral-200">All Systems Normal</span>
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-neutral-500 text-neutral-200 hover:bg-neutral-700 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Secure Logout
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Dark charcoal */}
        <aside className="w-56 bg-neutral-800 flex-shrink-0 border-r border-neutral-700">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* MAIN CONTENT - Light warm gray background */}
        <main className="flex-1 overflow-auto bg-neutral-100 p-6">
          {renderView()}
        </main>

        {/* RIGHT AI PANEL - Light background */}
        <aside className="w-72 bg-neutral-50 border-l border-neutral-200 flex-shrink-0">
          <AIInsightsPanel />
        </aside>
      </div>
    </div>
  );
};

export default MasterControlCenter;
