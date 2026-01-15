import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutGrid, Globe2, Users, Shield, AlertTriangle, 
  Eye, FileText, Lock, LogOut, Clock, CheckCircle, Smartphone, Layers
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MasterThroneIcon from '@/components/icons/MasterThroneIcon';
import { PendingRequestsBanner } from '@/components/shared/PendingRequestsBanner';

// Views
import OverviewView from './views/OverviewView';
import ContinentsView from './views/ContinentsView';
import SuperAdminsView from './views/SuperAdminsView';
import GlobalRulesView from './views/GlobalRulesView';
import HighRiskApprovalsView from './views/HighRiskApprovalsView';
import SecurityMonitorView from './views/SecurityMonitorView';
import AuditView from './views/AuditView';
import SystemLockView from './views/SystemLockView';
import PlayConsoleView from './views/PlayConsoleView';
import DemoManagerView from './views/DemoManagerView';
import AIInsightsPanel from './components/AIInsightsPanel';

type ViewType = 'overview' | 'continents' | 'super-admins' | 'global-rules' | 
                'approvals' | 'security' | 'audit' | 'system-lock' | 'play-console' | 'demo-manager';

const sidebarItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'continents', label: 'Continents', icon: Globe2 },
  { id: 'super-admins', label: 'Super Admins', icon: Users },
  { id: 'global-rules', label: 'Global Rules', icon: Shield },
  { id: 'approvals', label: 'Approvals (High Risk)', icon: AlertTriangle },
  { id: 'security', label: 'Security Monitor', icon: Eye },
  { id: 'audit', label: 'Audit (Read-Only)', icon: FileText },
  { id: 'system-lock', label: 'System Lock', icon: Lock },
  { id: 'play-console', label: 'Play Console', icon: Smartphone },
  { id: 'demo-manager', label: 'Demo Manager', icon: Layers },
];

const MasterControlCenter = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sessionTime, setSessionTime] = useState('00:00:00');
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
      role: 'boss_owner' as any,
      module: 'master-control',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Secure logout complete');
    navigate('/boss-fortress');
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
      case 'play-console': return <PlayConsoleView />;
      case 'demo-manager': return <DemoManagerView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] flex flex-col overflow-hidden select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Pending Requests Banner - TOP PRIORITY */}
      <PendingRequestsBanner />
      
      {/* TOP HEADER - Dark theme */}
      <header className="h-14 bg-[#12121a] flex items-center justify-between px-6 flex-shrink-0 border-b border-gray-800/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MasterThroneIcon size="md" showTooltip />
            <div>
              <span className="font-semibold text-white">Master Admin Control Center</span>
              <span className="text-xs text-gray-500 ml-2">Supreme Control</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Scope Badge */}
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium gap-1 bg-amber-500/15 text-amber-400 border-amber-500/25">
            <Globe2 className="w-3 h-3" />
            Global
          </Badge>

          {/* Global Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">All Systems Normal</span>
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <PremiumButton 
            variant="danger" 
            size="sm" 
            onClick={handleLogout}
            userRole="master"
            className="gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Secure Logout
          </PremiumButton>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Dark theme */}
        <aside className="w-56 bg-[#12121a] flex-shrink-0 border-r border-gray-800/50">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <PremiumButton
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  variant={activeView === item.id ? 'sidebar-active' : 'sidebar'}
                  size="sm"
                  userRole="master"
                  glowOnHover={true}
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </PremiumButton>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* MAIN CONTENT - Dark theme */}
        <main className="flex-1 overflow-auto bg-[#0a0a0f] p-6">
          {renderView()}
        </main>

        {/* RIGHT AI PANEL - Dark theme */}
        <aside className="w-72 bg-[#12121a] border-l border-gray-800/50 flex-shrink-0">
          <AIInsightsPanel />
        </aside>
      </div>
    </div>
  );
};

export default MasterControlCenter;
