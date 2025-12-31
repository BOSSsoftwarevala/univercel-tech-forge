import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, Shield, Clock, CheckCircle, AlertTriangle, 
  ListTodo, FileText, User, LogOut, Bell, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import { useDeveloperGuard, useDeveloperPermissions, DeveloperTask } from '@/hooks/useDeveloperGuard';
import { DeveloperStatusBanner } from '@/components/developer-secure/DeveloperStatusBanner';
import { DeveloperTaskList } from '@/components/developer-secure/DeveloperTaskList';
import { DeveloperTaskDetail } from '@/components/developer-secure/DeveloperTaskDetail';
import { DeveloperPromiseTracker } from '@/components/developer-secure/DeveloperPromiseTracker';
import { DeveloperProfileView } from '@/components/developer-secure/DeveloperProfileView';

// Mock tasks for demonstration
const mockDeveloperTasks: DeveloperTask[] = [
  {
    id: '1',
    task_id: 'T-1234',
    title: 'API Integration for CRM Module',
    description: 'Integrate third-party CRM API with existing system. Handle authentication, data sync, and error handling.',
    priority: 'high',
    status: 'in_progress',
    deadline: '2025-01-02T18:00:00Z',
    sla_hours: 8,
    sla_remaining_minutes: 125,
    sla_breached: false,
    promise_id: 'PRM-2847',
    created_at: '2024-12-30T10:00:00Z',
    updated_at: '2024-12-31T14:00:00Z',
    category: 'Backend',
    tech_stack: ['Node.js', 'Express', 'MongoDB']
  },
  {
    id: '2',
    task_id: 'T-1235',
    title: 'Bug Fix - Login Authentication',
    description: 'Fix token refresh issue causing users to be logged out unexpectedly.',
    priority: 'critical',
    status: 'pending',
    deadline: '2025-01-01T12:00:00Z',
    sla_hours: 4,
    sla_remaining_minutes: 45,
    sla_breached: false,
    promise_id: null,
    created_at: '2024-12-31T08:00:00Z',
    updated_at: '2024-12-31T08:00:00Z',
    category: 'Bug Fix',
    tech_stack: ['React', 'TypeScript', 'JWT']
  },
  {
    id: '3',
    task_id: 'T-1236',
    title: 'Dashboard UI Redesign',
    description: 'Implement new dashboard design with improved UX and responsive layout.',
    priority: 'medium',
    status: 'completed',
    deadline: '2024-12-30T18:00:00Z',
    sla_hours: 12,
    sla_remaining_minutes: null,
    sla_breached: false,
    promise_id: 'PRM-2845',
    created_at: '2024-12-28T10:00:00Z',
    updated_at: '2024-12-30T16:00:00Z',
    category: 'Frontend',
    tech_stack: ['React', 'Tailwind CSS', 'Framer Motion']
  },
];

export default function SecureDeveloperDashboard() {
  const navigate = useNavigate();
  const { isLoading, developerProfile, isBlocked, blockReason, logAction } = useDeveloperGuard();
  const permissions = useDeveloperPermissions();
  
  const [tasks, setTasks] = useState<DeveloperTask[]>(mockDeveloperTasks);
  const [selectedTask, setSelectedTask] = useState<DeveloperTask | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'promises' | 'notes'>('tasks');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Task summary stats
  const taskStats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  const handleAcceptTask = async (taskId: string) => {
    if (!permissions.canAcceptTask) {
      toast.error('You do not have permission to accept tasks');
      return;
    }

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'accepted' as const } : t
    ));
    
    await logAction('TASK_ACCEPTED', { task_id: taskId });
    toast.success('Task accepted', { description: 'Start working when ready' });
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    if (!permissions.canUpdateStatus) {
      toast.error('You do not have permission to update status');
      return;
    }

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: status as DeveloperTask['status'] } : t
    ));
    
    await logAction('TASK_STATUS_UPDATED', { task_id: taskId, new_status: status });
    toast.success('Status updated', { description: `Task is now ${status.replace('_', ' ')}` });
  };

  const handleAddNote = async (taskId: string, note: string) => {
    await logAction('TASK_NOTE_ADDED', { task_id: taskId, note_preview: note.slice(0, 50) });
  };

  const handleUploadFile = async (taskId: string, file: File) => {
    await logAction('TASK_FILE_UPLOADED', { task_id: taskId, file_name: file.name, file_size: file.size });
  };

  const handleViewTask = (task: DeveloperTask) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await logAction('DASHBOARD_REFRESHED', {});
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed');
    }, 1000);
  };

  const handleLogout = async () => {
    await logAction('LOGOUT', {});
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-xl bg-red-500/10 border border-red-500/30">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">{blockReason}</p>
          <Button onClick={() => navigate('/developer/secure-dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Developer Dashboard</h1>
              <p className="text-xs text-muted-foreground">Execution Mode • Secure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                2
              </span>
            </Button>

            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white">{developerProfile?.developer_id || 'DEV***XXX'}</p>
                <p className="text-[10px] text-muted-foreground">{developerProfile?.expertise_level || 'Developer'}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Status Banner */}
          <DeveloperStatusBanner
            developerId={developerProfile?.developer_id || 'DEV***XXX'}
            status={developerProfile?.status || 'active'}
            performanceScore={developerProfile?.performance_score || 85}
            slaComplianceRate={developerProfile?.sla_compliance_rate || 92}
            activeTasks={taskStats.inProgress}
            expertiseLevel={developerProfile?.expertise_level || 'junior'}
            onViewProfile={() => setIsProfileOpen(true)}
          />

          {/* Task Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-amber-500">{taskStats.pending}</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-5 w-5 text-cyan-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-cyan-500">{taskStats.inProgress}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold text-emerald-500">{taskStats.completed}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-muted-foreground">Blocked</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{taskStats.blocked}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Button
              variant={activeTab === 'tasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('tasks')}
              className={activeTab === 'tasks' ? 'bg-cyan-500' : ''}
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Assigned Tasks
            </Button>
            <Button
              variant={activeTab === 'promises' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('promises')}
              className={activeTab === 'promises' ? 'bg-purple-500' : ''}
            >
              <Shield className="h-4 w-4 mr-2" />
              Promise Tracker
              <Badge variant="outline" className="ml-2 text-[10px]">READ-ONLY</Badge>
            </Button>
            <Button
              variant={activeTab === 'notes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notes')}
              className={activeTab === 'notes' ? 'bg-emerald-500' : ''}
            >
              <FileText className="h-4 w-4 mr-2" />
              Internal Notes
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'tasks' && (
            <DeveloperTaskList
              tasks={tasks}
              onAcceptTask={handleAcceptTask}
              onUpdateStatus={handleUpdateStatus}
              onViewTask={handleViewTask}
            />
          )}

          {activeTab === 'promises' && (
            <DeveloperPromiseTracker />
          )}

          {activeTab === 'notes' && (
            <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Internal Notes</h3>
              <p className="text-muted-foreground text-sm">
                Select a task to view and add internal notes.
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Task Detail Sheet */}
      <DeveloperTaskDetail
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onUploadFile={handleUploadFile}
      />

      {/* Profile Sheet */}
      <DeveloperProfileView
        profile={developerProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
