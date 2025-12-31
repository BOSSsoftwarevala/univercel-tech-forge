// Continent Super Admin Dashboard - Full Screen Navigation
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Globe2, Users, ClipboardCheck, ClipboardList,
  TrendingUp, AlertTriangle, Brain, FileText, LogOut, Clock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Views
import OverviewView from './views/OverviewView';
import CountriesView from './views/CountriesView';
import AreaManagersView from './views/AreaManagersView';
import ApprovalsView from './views/ApprovalsView';
import TasksView from './views/TasksView';
import PerformanceView from './views/PerformanceView';
import RiskAlertsView from './views/RiskAlertsView';
import AIInsightsView from './views/AIInsightsView';
import AuditView from './views/AuditView';

type ViewType = 'overview' | 'countries' | 'area-managers' | 'approvals' | 
                'tasks' | 'performance' | 'risk-alerts' | 'ai-insights' | 'audit';

const sidebarItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'countries', label: 'Countries', icon: Globe2 },
  { id: 'area-managers', label: 'Area Managers', icon: Users },
  { id: 'approvals', label: 'Approvals', icon: ClipboardCheck },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'risk-alerts', label: 'Risk & Alerts', icon: AlertTriangle },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'audit', label: 'Audit', icon: FileText },
];

const ContinentSuperAdminDashboard = () => {
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
      role: 'super_admin' as any,
      module: 'continent-super-admin',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Secure logout complete');
    navigate('/auth');
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'countries': return <CountriesView />;
      case 'area-managers': return <AreaManagersView />;
      case 'approvals': return <ApprovalsView />;
      case 'tasks': return <TasksView />;
      case 'performance': return <PerformanceView />;
      case 'risk-alerts': return <RiskAlertsView />;
      case 'ai-insights': return <AIInsightsView />;
      case 'audit': return <AuditView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-background flex flex-col overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* TOP HEADER */}
      <header className="h-14 bg-card flex items-center justify-between px-6 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-primary" />
            <div>
              <span className="font-semibold text-foreground">Continent Super Admin</span>
              <span className="text-xs text-muted-foreground ml-2">Africa Region</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Session Timer */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-border"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Secure Logout
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-56 bg-card flex-shrink-0 border-r border-border">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-background p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ContinentSuperAdminDashboard;
