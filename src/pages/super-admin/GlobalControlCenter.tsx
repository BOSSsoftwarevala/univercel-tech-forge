import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, Users, Activity, CheckSquare, ListTodo, 
  Brain, Shield, AlertTriangle, LogOut, LayoutGrid,
  Bell, Clock
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdminControl } from '@/hooks/useSuperAdminControl';
import { toast } from 'sonner';

// Views
import GlobalMapView from './views/GlobalMapView';
import LiveActivityView from './views/LiveActivityView';
import ApprovalCenterView from './views/ApprovalCenterView';
import TaskCommandView from './views/TaskCommandView';
import AIAdvisorView from './views/AIAdvisorView';
import AlertsView from './views/AlertsView';

type ViewType = 'global-map' | 'live-activity' | 'approvals' | 'tasks' | 'ai-advisor' | 'alerts';

const sidebarItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'global-map', label: 'Global Map', icon: Globe2 },
  { id: 'live-activity', label: 'Live Activity', icon: Activity },
  { id: 'approvals', label: 'Approval Center', icon: CheckSquare },
  { id: 'tasks', label: 'Task Command', icon: ListTodo },
  { id: 'ai-advisor', label: 'AI Advisor', icon: Brain },
  { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
];

const GlobalControlCenter = () => {
  const [activeView, setActiveView] = useState<ViewType>('global-map');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { 
    superAdmins, activities, approvals, tasks, alerts, insights, 
    isLoading, approveRequest, rejectRequest, createTask, 
    acknowledgeAlert, acknowledgeInsight 
  } = useSuperAdminControl();

  // Session timer
  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      setSessionTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestedView = searchParams.get('view');

    if (requestedView && sidebarItems.some((item) => item.id === requestedView)) {
      setActiveView(requestedView as ViewType);
      return;
    }

    if (location.pathname === '/live-activity' || location.pathname.startsWith('/activity/')) {
      setActiveView('live-activity');
      return;
    }

    if (location.pathname === '/boss/tasks') {
      setActiveView('tasks');
      return;
    }

    if (location.pathname === '/boss/alerts') {
      setActiveView('alerts');
      return;
    }

    if (location.pathname === '/boss/control-center') {
      setActiveView('global-map');
    }
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length;

  const renderView = () => {
    switch (activeView) {
      case 'global-map':
        return <GlobalMapView superAdmins={superAdmins} isLoading={isLoading} />;
      case 'live-activity':
        return <LiveActivityView activities={activities} isLoading={isLoading} />;
      case 'approvals':
        return (
          <ApprovalCenterView 
            approvals={approvals} 
            isLoading={isLoading}
            onApprove={approveRequest}
            onReject={rejectRequest}
          />
        );
      case 'tasks':
        return (
          <TaskCommandView 
            tasks={tasks} 
            isLoading={isLoading}
            onCreateTask={createTask}
          />
        );
      case 'ai-advisor':
        return (
          <AIAdvisorView 
            insights={insights} 
            isLoading={isLoading}
            onAcknowledge={acknowledgeInsight}
          />
        );
      case 'alerts':
        return (
          <AlertsView 
            alerts={alerts} 
            isLoading={isLoading}
            onAcknowledge={acknowledgeAlert}
          />
        );
      default:
        return <GlobalMapView superAdmins={superAdmins} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col z-40">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Global Control</h1>
              <p className="text-xs text-muted-foreground">Super Admin Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const badgeCount = item.id === 'approvals' ? pendingApprovals : 
                              item.id === 'alerts' ? activeAlerts : 0;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {badgeCount > 0 && (
                  <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-destructive text-destructive-foreground'
                  }`}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                {user?.email?.[0]?.toUpperCase() || 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email?.split('@')[0] || 'Super Admin'}</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Super Admin Global Control Center</h2>
              <p className="text-sm text-muted-foreground">
                Track, Control, Approve, Assign & Audit — All Roles, All Countries, Real-time
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status Indicators */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium">{superAdmins.filter(s => s.login_status === 'online').length} Online</span>
              </div>

              {criticalAlerts > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-medium text-destructive">{criticalAlerts} Critical</span>
                </div>
              )}

              {/* Session Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono">{sessionTime}</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                <Bell className="w-5 h-5" />
                {(pendingApprovals + activeAlerts) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {pendingApprovals + activeAlerts}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

export default GlobalControlCenter;
