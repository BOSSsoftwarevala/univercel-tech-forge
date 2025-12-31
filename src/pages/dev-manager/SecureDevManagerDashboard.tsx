import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ListTodo, AlertTriangle, BarChart3, 
  ArrowUpRight, MessageSquare, LogOut, Shield,
  AlertOctagon, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDevManagerGuard } from '@/hooks/useDevManagerGuard';

import DevManagerCapacityOverview from '@/components/dev-manager/DevManagerCapacityOverview';
import DevManagerActiveTasksView from '@/components/dev-manager/DevManagerActiveTasksView';
import DevManagerSLARiskAlerts from '@/components/dev-manager/DevManagerSLARiskAlerts';
import DevManagerBlockedTasks from '@/components/dev-manager/DevManagerBlockedTasks';
import DevManagerPerformanceSnapshot from '@/components/dev-manager/DevManagerPerformanceSnapshot';
import DevManagerEscalations from '@/components/dev-manager/DevManagerEscalations';
import DevManagerInternalComms from '@/components/dev-manager/DevManagerInternalComms';

export default function SecureDevManagerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { isBlocked } = useDevManagerGuard();
  const [activeTab, setActiveTab] = useState('capacity');
  const [sessionTime, setSessionTime] = useState(0);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session timeout warning (30 min)
  useEffect(() => {
    if (sessionTime >= 1800) {
      toast({
        title: "Session Warning",
        description: "Session will expire in 5 minutes",
        variant: "destructive"
      });
    }
  }, [sessionTime, toast]);

  const handleLogout = async () => {
    console.log(`[AUDIT] Dev Manager logout at ${new Date().toISOString()}`);
    await signOut();
    navigate('/auth');
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock stats
  const stats = {
    developers: 4,
    activeTasks: 12,
    atRisk: 3,
    blocked: 2,
    escalations: 2
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h1 className="text-lg font-mono font-bold tracking-wider">
                  DEV MANAGER
                </h1>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                DELIVERY GOVERNOR
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">{formatSessionTime(sessionTime)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-zinc-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-mono">{stats.developers} Devs</span>
            </div>
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-mono">{stats.activeTasks} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-mono">{stats.atRisk} At Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span className="text-sm font-mono">{stats.blocked} Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono">{stats.escalations} Escalations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
            <TabsTrigger value="capacity" className="gap-2 data-[state=active]:bg-zinc-800">
              <Users className="w-4 h-4" />
              Capacity
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-zinc-800">
              <ListTodo className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-2 data-[state=active]:bg-zinc-800">
              <AlertTriangle className="w-4 h-4" />
              SLA Risks
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-2 data-[state=active]:bg-zinc-800">
              <AlertOctagon className="w-4 h-4" />
              Blocked
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2 data-[state=active]:bg-zinc-800">
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="escalations" className="gap-2 data-[state=active]:bg-zinc-800">
              <ArrowUpRight className="w-4 h-4" />
              Escalations
            </TabsTrigger>
            <TabsTrigger value="comms" className="gap-2 data-[state=active]:bg-zinc-800">
              <MessageSquare className="w-4 h-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="capacity" className="mt-0">
              <DevManagerCapacityOverview />
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <DevManagerActiveTasksView />
            </TabsContent>

            <TabsContent value="risks" className="mt-0">
              <DevManagerSLARiskAlerts />
            </TabsContent>

            <TabsContent value="blocked" className="mt-0">
              <DevManagerBlockedTasks />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <DevManagerPerformanceSnapshot />
            </TabsContent>

            <TabsContent value="escalations" className="mt-0">
              <DevManagerEscalations />
            </TabsContent>

            <TabsContent value="comms" className="mt-0">
              <DevManagerInternalComms />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-mono text-zinc-600 text-center">
            MANAGE PEOPLE • NOT CODE • ALL ACTIONS LOGGED
          </p>
        </div>
      </footer>
    </div>
  );
}
