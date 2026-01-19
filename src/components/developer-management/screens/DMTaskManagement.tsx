/**
 * TASK MANAGEMENT (CORE)
 * New • Assigned • In Progress • Blocked • Completed
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, UserPlus, RefreshCw, Pause, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useActionHandler } from '@/hooks/useActionHandler';

const tasks = [
  { id: 'TSK-001', project: 'Project Alpha', module: 'Auth', priority: 'high', deadline: '2024-01-20', dependency: 'None', status: 'new', assignee: null },
  { id: 'TSK-002', project: 'Project Alpha', module: 'Dashboard', priority: 'medium', deadline: '2024-01-22', dependency: 'TSK-001', status: 'assigned', assignee: 'DEV-001' },
  { id: 'TSK-003', project: 'Project Beta', module: 'API', priority: 'high', deadline: '2024-01-19', dependency: 'None', status: 'in_progress', assignee: 'DEV-003' },
  { id: 'TSK-004', project: 'Project Beta', module: 'Payment', priority: 'critical', deadline: '2024-01-18', dependency: 'TSK-003', status: 'blocked', assignee: 'DEV-002' },
  { id: 'TSK-005', project: 'Project Gamma', module: 'UI', priority: 'low', deadline: '2024-01-25', dependency: 'None', status: 'completed', assignee: 'DEV-005' },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical': return <Badge variant="destructive">Critical</Badge>;
    case 'high': return <Badge className="bg-red-500/20 text-red-500">High</Badge>;
    case 'medium': return <Badge className="bg-amber-500/20 text-amber-500">Medium</Badge>;
    case 'low': return <Badge variant="secondary">Low</Badge>;
    default: return <Badge>{priority}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new': return <Badge className="bg-blue-500/20 text-blue-500">New</Badge>;
    case 'assigned': return <Badge className="bg-cyan-500/20 text-cyan-500">Assigned</Badge>;
    case 'in_progress': return <Badge className="bg-green-500/20 text-green-500">In Progress</Badge>;
    case 'blocked': return <Badge className="bg-red-500/20 text-red-500">Blocked</Badge>;
    case 'completed': return <Badge variant="secondary">Completed</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export const DMTaskManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { assign, reassign, pause, escalate, close, isActionLoading } = useActionHandler();

  const filteredTasks = tasks.filter(task => 
    activeTab === 'all' || task.status === activeTab
  );

  const handleAssign = (taskId: string) => {
    assign('Task', taskId, { action: 'assign_developer' });
  };

  const handleReassign = (taskId: string) => {
    reassign('Task', taskId, { action: 'reassign_developer' });
  };

  const handlePause = (taskId: string) => {
    pause('Task', taskId, { action: 'pause_task' });
  };

  const handleEscalate = (taskId: string) => {
    escalate('Task', taskId, { action: 'escalate_to_lead' });
  };

  const handleClose = (taskId: string) => {
    close('Task', taskId, { action: 'close_task' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Task Management</h1>
        <p className="text-muted-foreground">Manage developer tasks and assignments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Task List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-lg border ${task.status === 'blocked' ? 'bg-red-500/5 border-red-500/30' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium">{task.id}</span>
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.project} / {task.module} • Deadline: {task.deadline}
                        </p>
                        {task.dependency !== 'None' && (
                          <p className="text-xs text-muted-foreground">Depends on: {task.dependency}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {task.assignee ? (
                          <span className="font-mono text-sm">{task.assignee}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAssign(task.id)}
                        disabled={isActionLoading('assign', task.id)}
                      >
                        {isActionLoading('assign', task.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-1" />
                        )}
                        Assign
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleReassign(task.id)}
                        disabled={isActionLoading('reassign', task.id)}
                      >
                        {isActionLoading('reassign', task.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Reassign
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePause(task.id)}
                        disabled={isActionLoading('pause', task.id)}
                      >
                        {isActionLoading('pause', task.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Pause className="h-4 w-4 mr-1" />
                        )}
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEscalate(task.id)}
                        disabled={isActionLoading('escalate', task.id)}
                      >
                        {isActionLoading('escalate', task.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 mr-1" />
                        )}
                        Escalate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleClose(task.id)}
                        disabled={isActionLoading('close', task.id)}
                      >
                        {isActionLoading('close', task.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Close
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DMTaskManagement;
