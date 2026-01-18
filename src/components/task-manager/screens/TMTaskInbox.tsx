/**
 * TASK MANAGER - TASK INBOX
 * New • In Progress • Waiting Approval • Blocked • Completed • Failed
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, CheckCircle, UserCheck, ArrowUpCircle, Bot, User, Settings } from 'lucide-react';

const mockTasks = [
  { id: 'TSK-001', title: 'License renewal verification', source: 'AI', priority: 'High', deadline: '2h left', owner: 'Pro Manager', status: 'new' },
  { id: 'TSK-002', title: 'Payment sync failure', source: 'System', priority: 'Critical', deadline: '30m left', owner: 'Finance', status: 'in_progress' },
  { id: 'TSK-003', title: 'Feature access request', source: 'Human', priority: 'Medium', deadline: '1d left', owner: 'Product Manager', status: 'waiting_approval' },
  { id: 'TSK-004', title: 'Domain binding issue', source: 'AI', priority: 'High', deadline: 'Overdue', owner: 'Pro Manager', status: 'blocked' },
  { id: 'TSK-005', title: 'Server health check', source: 'System', priority: 'Low', deadline: 'Completed', owner: 'Server Manager', status: 'completed' },
  { id: 'TSK-006', title: 'API integration test', source: 'AI', priority: 'Medium', deadline: 'Failed', owner: 'Developer', status: 'failed' },
];

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'AI': return <Bot className="h-4 w-4 text-cyan-400" />;
    case 'Human': return <User className="h-4 w-4 text-purple-400" />;
    case 'System': return <Settings className="h-4 w-4 text-blue-400" />;
    default: return null;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const TMTaskInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');

  const filteredTasks = mockTasks.filter(task => task.status === activeTab);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Inbox</h1>
          <p className="text-muted-foreground">All incoming tasks • Filter by status</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="waiting_approval">Waiting</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  {activeTab.replace('_', ' ').toUpperCase()} Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getSourceIcon(task.source)}
                        <div>
                          <p className="font-medium text-foreground">{task.id}</p>
                          <p className="text-sm text-muted-foreground">{task.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <span className="text-xs text-muted-foreground">{task.deadline}</span>
                        <span className="text-xs text-muted-foreground">{task.owner}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost"><CheckCircle className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost"><UserCheck className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost"><ArrowUpCircle className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-8">No tasks in this category</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMTaskInbox;
