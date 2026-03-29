import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Shield, 
  Clock, 
  FileText,
  Activity,
  Ban,
  AlertTriangle,
  ClockAlert,
  TrendingUp,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import useTaskManagerGuard from '@/hooks/useTaskManagerGuard';
import TMNewTasksQueue from '@/components/task-manager/TMNewTasksQueue';
import TMActiveTasks from '@/components/task-manager/TMActiveTasks';
import TMBlockedTasks from '@/components/task-manager/TMBlockedTasks';
import TMSLABreachAlerts from '@/components/task-manager/TMSLABreachAlerts';
import TMOverdueTasks from '@/components/task-manager/TMOverdueTasks';
import TMEscalations from '@/components/task-manager/TMEscalations';
import TMStatusFlow from '@/components/task-manager/TMStatusFlow';

const SecureTaskManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logAction } = useTaskManagerGuard();
  const [sessionTime, setSessionTime] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    logAction('session_started', { timestamp: new Date().toISOString() });

    return () => {
      clearInterval(interval);
      logAction('session_ended', { 
        timestamp: new Date().toISOString(),
        duration: sessionTime 
      });
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logAction('logout', { timestamp: new Date().toISOString() });
    toast.success('Session ended securely');
    navigate('/');
  };

  // Summary stats
  const stats = {
    unassigned: 3,
    active: 8,
    blocked: 2,
    nearBreach: 2,
    overdue: 3,
    escalations: 2
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Task Manager</span>
              </div>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Lock className="h-3 w-3" />
                OPERATION SPINE
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Session: {formatTime(sessionTime)}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        >
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <FileText className="h-5 w-5 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{stats.unassigned}</p>
            <p className="text-xs text-muted-foreground">Unassigned</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <Activity className="h-5 w-5 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <Ban className="h-5 w-5 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold">{stats.blocked}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold">{stats.nearBreach}</p>
            <p className="text-xs text-muted-foreground">Near Breach</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <ClockAlert className="h-5 w-5 mx-auto mb-2 text-orange-400" />
            <p className="text-2xl font-bold">{stats.overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold">{stats.escalations}</p>
            <p className="text-xs text-muted-foreground">Escalations</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <TabsTrigger value="overview" className="gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Active</span>
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-1">
              <Ban className="h-4 w-4" />
              <span className="hidden sm:inline">Blocked</span>
            </TabsTrigger>
            <TabsTrigger value="sla" className="gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">SLA</span>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-1">
              <ClockAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Overdue</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Escalations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TMStatusFlow />
            <div className="grid md:grid-cols-2 gap-6">
              <TMSLABreachAlerts />
              <TMBlockedTasks />
            </div>
          </TabsContent>

          <TabsContent value="new">
            <TMNewTasksQueue />
          </TabsContent>

          <TabsContent value="active">
            <TMActiveTasks />
          </TabsContent>

          <TabsContent value="blocked">
            <TMBlockedTasks />
          </TabsContent>

          <TabsContent value="sla">
            <TMSLABreachAlerts />
          </TabsContent>

          <TabsContent value="overdue">
            <TMOverdueTasks />
          </TabsContent>

          <TabsContent value="escalations">
            <TMEscalations />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Task Manager Role • All actions logged • Delete disabled • Edit locked after assignment
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecureTaskManagerDashboard;
