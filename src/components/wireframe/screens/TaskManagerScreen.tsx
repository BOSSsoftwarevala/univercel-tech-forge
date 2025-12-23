import React, { useState } from 'react';
import { 
  CheckSquare, Clock, AlertTriangle, Play, Pause, Square, Filter, Search,
  Calendar, GitBranch, MessageSquare, BarChart3, History, Wallet,
  Timer, CheckCircle, XCircle, ArrowRight, User, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockTasks = [
  { id: 'T-001', title: 'POS Module Enhancement', developer: 'DEV***042', status: 'in_progress', priority: 'high', deadline: '2h 15m', progress: 65 },
  { id: 'T-002', title: 'Hospital Dashboard Bug Fix', developer: 'DEV***018', status: 'pending', priority: 'critical', deadline: '4h 00m', progress: 0 },
  { id: 'T-003', title: 'School ERP API Integration', developer: 'DEV***089', status: 'review', priority: 'medium', deadline: '1d 2h', progress: 100 },
  { id: 'T-004', title: 'CRM Report Generator', developer: 'DEV***034', status: 'completed', priority: 'low', deadline: 'Done', progress: 100 },
  { id: 'T-005', title: 'Payment Gateway Fix', developer: null, status: 'pending', priority: 'urgent', deadline: '30m', progress: 0 },
];

const buzzerAlerts = [
  { id: 1, type: 'deadline', message: 'T-002 deadline approaching in 30 minutes', severity: 'high' },
  { id: 2, type: 'unassigned', message: 'T-005 needs immediate assignment', severity: 'critical' },
  { id: 3, type: 'escalation', message: 'Prime client waiting > 5 min', severity: 'high' },
];

const pipelineColumns = [
  { id: 'pending', label: 'Pending', color: 'amber' },
  { id: 'in_progress', label: 'In Progress', color: 'cyan' },
  { id: 'review', label: 'Under Review', color: 'purple' },
  { id: 'completed', label: 'Completed', color: 'emerald' },
];

export function TaskManagerScreen() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const isDark = true;

  const statusColors = {
    pending: 'bg-amber-500',
    in_progress: 'bg-cyan-500',
    review: 'bg-purple-500',
    completed: 'bg-emerald-500',
  };

  const priorityColors = {
    low: 'text-slate-400 bg-slate-500/20',
    medium: 'text-cyan-400 bg-cyan-500/20',
    high: 'text-amber-400 bg-amber-500/20',
    critical: 'text-red-400 bg-red-500/20',
    urgent: 'text-red-500 bg-red-500/30 animate-pulse',
  };

  const getTasksByStatus = (status: string) => mockTasks.filter(t => t.status === status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-cyan-500" />
            Task Manager
          </h1>
          <p className="text-muted-foreground">Manage tasks, timers, and developer assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            {mockTasks.filter(t => t.status === 'in_progress').length} Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
            <AlertTriangle className="h-3 w-3" />
            {buzzerAlerts.length} Alerts
          </Badge>
          <Button className="bg-gradient-to-r from-cyan-500 to-violet-500">
            + New Task
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Timer & SLA
          </TabsTrigger>
          <TabsTrigger value="buzzer" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Buzzer
            <Badge variant="destructive" className="text-[10px] h-4 px-1">{buzzerAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Dependencies
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Pipeline View */}
        <TabsContent value="pipeline" className="mt-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-4 gap-4">
            {pipelineColumns.map((column) => {
              const tasks = getTasksByStatus(column.id);
              return (
                <div key={column.id} className={`rounded-xl border p-3 ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-${column.color}-500`} />
                      <span className="font-semibold text-sm">{column.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{tasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div 
                        key={task.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-cyan-500/50 ${
                          isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-[10px]">{task.id}</Badge>
                          <Badge className={`text-[10px] ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.developer || 'Unassigned'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.deadline}
                          </span>
                        </div>
                        {task.status !== 'pending' && task.progress > 0 && (
                          <Progress value={task.progress} className="h-1 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Timer & SLA View */}
        <TabsContent value="timer" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockTasks.filter(t => t.status === 'in_progress').map((task) => (
              <div key={task.id} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="mb-1">{task.id}</Badge>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.developer}</p>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <Timer className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
                    <span className="text-xl font-mono font-bold text-cyan-400">02:34:12</span>
                    <p className="text-[10px] text-muted-foreground">Elapsed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="font-semibold text-amber-400">{task.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-emerald-500 text-emerald-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Buzzer Alerts View */}
        <TabsContent value="buzzer" className="mt-4">
          <div className="space-y-3">
            {buzzerAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500/10 border-red-500/50 animate-pulse' 
                    : 'bg-amber-500/10 border-amber-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-6 w-6 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <Badge className={`mb-1 ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <p className="font-medium">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Acknowledge
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-violet-500">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Dependencies View */}
        <TabsContent value="dependencies" className="mt-4">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-violet-500" />
              Task Dependencies
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {mockTasks.slice(0, 4).map((task, idx) => (
                <React.Fragment key={task.id}>
                  <div className={`min-w-[200px] p-3 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                    <Badge variant="outline" className="text-xs mb-2">{task.id}</Badge>
                    <p className="text-sm font-medium">{task.title}</p>
                    <div className={`mt-2 h-2 w-2 rounded-full ${statusColors[task.status as keyof typeof statusColors]}`} />
                  </div>
                  {idx < 3 && <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Performance View */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-amber-500" />
                <h3 className="font-semibold">Task Completion</h3>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">87%</div>
              <p className="text-sm text-muted-foreground">On-time delivery rate</p>
              <Progress value={87} className="h-2 mt-3" />
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Timer className="h-6 w-6 text-cyan-500" />
                <h3 className="font-semibold">Avg. Task Time</h3>
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">4.2h</div>
              <p className="text-sm text-muted-foreground">Average completion time</p>
              <Progress value={65} className="h-2 mt-3" />
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <h3 className="font-semibold">Tasks This Week</h3>
              </div>
              <div className="text-3xl font-bold text-violet-400 mb-1">42</div>
              <p className="text-sm text-muted-foreground">Completed tasks</p>
              <Progress value={78} className="h-2 mt-3" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Footer */}
      <div className={`grid grid-cols-4 gap-4`}>
        {[
          { label: 'Total Tasks', value: mockTasks.length, icon: CheckSquare, color: 'cyan' },
          { label: 'In Progress', value: getTasksByStatus('in_progress').length, icon: Play, color: 'amber' },
          { label: 'Under Review', value: getTasksByStatus('review').length, icon: Clock, color: 'purple' },
          { label: 'Completed Today', value: getTasksByStatus('completed').length, icon: CheckCircle, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'}`}>
            <stat.icon className={`h-5 w-5 text-${stat.color}-500 mx-auto mb-1`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
