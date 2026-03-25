import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, Bug, Sparkles, Rocket, RotateCcw, GitBranch,
  Play, Square, CheckCircle, Clock, AlertTriangle, Plus, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DevTask {
  id: string;
  name: string;
  type: string;
  linkedProduct: string;
  status: 'running' | 'stopped' | 'completed' | 'pending';
  aiHandling: 'auto' | 'manual' | 'hybrid';
  approvalRequired: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
}

const DEV_TASKS: DevTask[] = [
  { id: 'feat-1', name: 'User Dashboard Redesign', type: 'Feature Request', linkedProduct: 'Main App', status: 'running', aiHandling: 'auto', approvalRequired: true, priority: 'high', progress: 65 },
  { id: 'bug-1', name: 'Login Timeout Fix', type: 'Bug Report', linkedProduct: 'Auth Module', status: 'running', aiHandling: 'auto', approvalRequired: false, priority: 'critical', progress: 80 },
  { id: 'bug-2', name: 'Payment Gateway Error', type: 'Bug Report', linkedProduct: 'Billing', status: 'pending', aiHandling: 'hybrid', approvalRequired: true, priority: 'critical', progress: 0 },
  { id: 'debug-1', name: 'API Response Slow', type: 'Auto Debug', linkedProduct: 'API Server', status: 'running', aiHandling: 'auto', approvalRequired: false, priority: 'medium', progress: 45 },
  { id: 'demo-1', name: 'Sales Demo v2', type: 'Demo Creation', linkedProduct: 'Demo System', status: 'completed', aiHandling: 'auto', approvalRequired: true, priority: 'high', progress: 100 },
  { id: 'demo-2', name: 'Fix Broken Demo #45', type: 'Demo Repair', linkedProduct: 'Demo System', status: 'running', aiHandling: 'auto', approvalRequired: false, priority: 'medium', progress: 55 },
  { id: 'deploy-1', name: 'Production Deploy v3.2', type: 'Live Deploy', linkedProduct: 'Main App', status: 'pending', aiHandling: 'manual', approvalRequired: true, priority: 'high', progress: 0 },
  { id: 'roll-1', name: 'Rollback v3.1', type: 'Rollback', linkedProduct: 'Main App', status: 'stopped', aiHandling: 'manual', approvalRequired: true, priority: 'low', progress: 0 },
];

const DEV_TYPES = ['All', 'Feature Request', 'Bug Report', 'Auto Debug', 'Demo Creation', 'Demo Repair', 'Live Deploy', 'Rollback', 'Version Control'];

export const UnifiedDevControl = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [tasks, setTasks] = useState(DEV_TASKS);

  const filteredTasks = selectedType === 'All' 
    ? tasks 
    : tasks.filter(t => t.type === selectedType);

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      if (t.status === 'running') return { ...t, status: 'stopped' as const };
      if (t.status === 'stopped' || t.status === 'pending') return { ...t, status: 'running' as const };
      return t;
    }));
  };

  const approveTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: 'running' as const, approvalRequired: false } : t
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-pink-400" />
            Development Control
          </h1>
          <p className="text-muted-foreground">No-code AI development with boss approval</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> New Task
          </Button>
          <Button size="sm" variant="outline" className="border-violet-500/50 text-violet-400">
            <Sparkles className="w-4 h-4 mr-1" /> AI Build
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {DEV_TYPES.map(type => (
          <Button
            key={type}
            size="sm"
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            className={selectedType === type ? "bg-pink-600" : ""}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{tasks.filter(t => t.status === 'running').length}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{tasks.filter(t => t.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.status === 'completed').length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{tasks.filter(t => t.aiHandling === 'auto').length}</p>
            <p className="text-xs text-muted-foreground">AI Auto</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{tasks.filter(t => t.approvalRequired).length}</p>
            <p className="text-xs text-muted-foreground">Need Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Dev Tasks Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Task</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Product</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">AI</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Priority</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Progress</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTasks.map((task) => (
                  <motion.tr 
                    key={task.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {task.type.includes('Bug') ? <Bug className="w-4 h-4 text-red-400" /> : 
                         task.type.includes('Feature') ? <Sparkles className="w-4 h-4 text-violet-400" /> :
                         task.type.includes('Deploy') ? <Rocket className="w-4 h-4 text-emerald-400" /> :
                         <Code2 className="w-4 h-4 text-pink-400" />}
                        <span className="text-sm font-medium text-white">{task.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{task.type}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{task.linkedProduct}</td>
                    <td className="p-3">
                      <Badge className={
                        task.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' :
                        task.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        task.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }>
                        {task.status === 'running' ? '● RUN' : 
                         task.status === 'completed' ? '✓ DONE' :
                         task.status === 'pending' ? '○ PENDING' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        task.aiHandling === 'auto' ? 'bg-violet-500/20 text-violet-400' :
                        task.aiHandling === 'hybrid' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-slate-500/20 text-slate-400'
                      }>
                        {task.aiHandling}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                        task.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-3 w-24">
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        {task.approvalRequired && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-xs text-emerald-400"
                            onClick={() => approveTask(task.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(task.id)}
                          disabled={task.status === 'completed'}
                        >
                          {task.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {task.status === 'running' ? 'Stop' : 'Start'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
