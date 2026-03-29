import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import useDeveloperWorkflowCenter from '@/hooks/useDeveloperWorkflowCenter';
import { DeveloperStatusBanner } from '@/components/developer-secure/DeveloperStatusBanner';
import { DeveloperTaskList } from '@/components/developer-secure/DeveloperTaskList';
import { DeveloperTaskDetail } from '@/components/developer-secure/DeveloperTaskDetail';
import { DeveloperPromiseTracker } from '@/components/developer-secure/DeveloperPromiseTracker';
import { DeveloperProfileView } from '@/components/developer-secure/DeveloperProfileView';

export default function SecureDeveloperDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, developerProfile, isBlocked, blockReason, logAction } = useDeveloperGuard();
  const permissions = useDeveloperPermissions();
  const workflow = useDeveloperWorkflowCenter({ developerOnly: true });
  
  const [selectedTask, setSelectedTask] = useState<DeveloperTask | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'promises' | 'workflow'>('tasks');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tasks: DeveloperTask[] = workflow.tasks
    .filter((task) => task.assignedToType === 'human')
    .map((task, index) => {
      const minutesRemaining = task.deadline
        ? Math.round((new Date(task.deadline).getTime() - Date.now()) / 60000)
        : null;

      let status: DeveloperTask['status'] = 'pending';
      if (task.status === 'accepted') {
        status = 'accepted';
      } else if (task.status === 'in_progress') {
        status = 'in_progress';
      } else if (task.status === 'paused') {
        status = 'blocked';
      } else if (task.status === 'completed') {
        status = 'completed';
      } else if (task.qualityStatus === 'rejected') {
        status = 'review';
      }

      return {
        id: task.id,
        task_id: `TASK-${index + 1}`,
        title: task.title,
        description: task.description,
        priority: task.priority === 'high' ? 'critical' : (task.priority as DeveloperTask['priority']),
        status,
        deadline: task.deadline || new Date().toISOString(),
        sla_hours: task.estimatedHours || 0,
        sla_remaining_minutes: minutesRemaining,
        sla_breached: task.deadlineBreached,
        promise_id: null,
        created_at: task.createdAt,
        updated_at: task.updatedAt,
        category: task.module,
        tech_stack: task.requiredSkills,
      };
    });

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

    await workflow.acceptTask.mutateAsync(taskId);
    await logAction('TASK_ACCEPTED', { task_id: taskId });
    toast.success('Task accepted', { description: 'Start working when ready' });
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    if (!permissions.canUpdateStatus) {
      toast.error('You do not have permission to update status');
      return;
    }

    if (status === 'in_progress') {
      await workflow.startTask.mutateAsync(taskId);
    } else if (status === 'blocked' || status === 'paused') {
      await workflow.pauseTask.mutateAsync({ taskId, reason: 'Paused by developer from secure dashboard' });
    } else if (status === 'completed') {
      await workflow.submitTask.mutateAsync({
        taskId,
        notes: 'Submitted from secure developer dashboard for AI quality review.',
      });
    }
    
    await logAction('TASK_STATUS_UPDATED', { task_id: taskId, new_status: status });
    toast.success('Status updated', { description: `Task is now ${status.replace('_', ' ')}` });
  };

  const handleAddNote = async (taskId: string, note: string) => {
    await workflow.addTaskComment.mutateAsync({ taskId, body: note });
    await logAction('TASK_NOTE_ADDED', { task_id: taskId, note_preview: note.slice(0, 50) });
  };

  const handleUploadFile = async (taskId: string, file: File) => {
    await workflow.uploadTaskFile.mutateAsync({ taskId, file });
    await logAction('TASK_FILE_UPLOADED', { task_id: taskId, file_name: file.name, file_size: file.size });
  };

  const handleSubmitCode = async (taskId: string, notes: string, commitMessage: string) => {
    await workflow.submitCode.mutateAsync({ taskId, notes, commitMessage });
    await logAction('TASK_CODE_SUBMITTED', { task_id: taskId, commit_message: commitMessage });
  };

  const handleViewTask = (task: DeveloperTask) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await logAction('DASHBOARD_REFRESHED', {});

    await workflow.refetchAll();
    setIsRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const handleLogout = async () => {
    await logAction('LOGOUT', {});
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (location.pathname === '/developer/profile' || searchParams.get('view') === 'profile') {
      setIsProfileOpen(true);
    }
  }, [location.pathname, location.search]);

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
                {Math.min(9, workflow.alerts.length)}
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
              variant={activeTab === 'workflow' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('workflow')}
              className={activeTab === 'workflow' ? 'bg-emerald-500' : ''}
            >
              <FileText className="h-4 w-4 mr-2" />
              Workflow Ops
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'tasks' && (
            <DeveloperTaskList
              tasks={tasks}
              onAcceptTask={handleAcceptTask}
              onUpdateStatus={handleUpdateStatus}
              onViewTask={handleViewTask}
              isLoading={workflow.isLoading}
            />
          )}

          {activeTab === 'promises' && (
            <DeveloperPromiseTracker />
          )}

          {activeTab === 'workflow' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
                <h3 className="font-semibold text-white">Build Queue</h3>
                <div className="mt-4 space-y-3">
                  {workflow.builds.slice(0, 4).map((build) => (
                    <div key={build.id} className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-white">Task {build.task_id.slice(0, 8)}</div>
                          <div className="text-xs text-slate-400">{build.status} • {build.build_target}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.stopBuild.mutateAsync({ taskId: build.task_id })}>Stop</Button>
                          <Button size="sm" className="bg-violet-500 text-white hover:bg-violet-400" onClick={() => workflow.sendBuildToQa.mutateAsync(build.task_id)}>Send To QA</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
                <h3 className="font-semibold text-white">Bugs And Alerts</h3>
                <div className="mt-4 space-y-3">
                  {workflow.bugs.slice(0, 3).map((bug) => (
                    <div key={bug.id} className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                      <div className="text-sm font-medium text-white">{bug.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{bug.status} • {bug.severity}</div>
                      {bug.status !== 'fixed' && (
                        <Button size="sm" className="mt-3 bg-emerald-500 text-slate-950 hover:bg-emerald-400" onClick={() => workflow.fixBug.mutateAsync({ bugId: bug.id, fixNotes: 'Fixed from secure dashboard.' })}>
                          Mark Fixed
                        </Button>
                      )}
                    </div>
                  ))}
                  {workflow.alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                      <div className="text-sm font-medium text-white">{alert.title}</div>
                      <div className="mt-1 text-xs text-slate-300">{alert.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5 lg:col-span-2">
                <h3 className="font-semibold text-white">Notification And AI Toggles</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {workflow.settings.map((setting: any) => {
                    const enabled = String(setting.setting_value).toLowerCase() === 'true';
                    return (
                      <button
                        key={setting.id}
                        onClick={() => workflow.saveSetting.mutateAsync({ settingKey: setting.setting_key, settingValue: String(!enabled) })}
                        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-3 text-left"
                      >
                        <span className="text-sm text-white">{setting.setting_key.replace('developer.', '')}</span>
                        <Badge className={enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                          {enabled ? 'ON' : 'OFF'}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
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
        onSubmitCode={handleSubmitCode}
        comments={selectedTask ? (workflow.commentsByTaskId[selectedTask.id] || []) : []}
      />

      {/* Profile Sheet */}
      <DeveloperProfileView
        profile={developerProfile}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          if (location.pathname === '/developer/profile') {
            navigate('/developer/dashboard', { replace: true });
          }
        }}
      />
    </div>
  );
}
