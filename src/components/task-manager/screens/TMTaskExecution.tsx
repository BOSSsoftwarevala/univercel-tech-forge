/**
 * TASK MANAGER - TASK EXECUTION
 * Running • Paused • Waiting Input • Auto-Fix Running
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RefreshCw, Square, Bot, User, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const executions = [
  { id: 'EXE-001', task: 'Payment batch processing', mode: 'AI', progress: 78, logs: 12, status: 'running' },
  { id: 'EXE-002', task: 'Customer data sync', mode: 'AI', progress: 45, logs: 8, status: 'paused' },
  { id: 'EXE-003', task: 'License approval workflow', mode: 'Human', progress: 30, logs: 5, status: 'waiting_input' },
  { id: 'EXE-004', task: 'Server recovery process', mode: 'AI', progress: 92, logs: 24, status: 'auto_fix' },
  { id: 'EXE-005', task: 'Report generation', mode: 'AI', progress: 65, logs: 10, status: 'running' },
];

export const TMTaskExecution: React.FC = () => {
  const [activeTab, setActiveTab] = useState('running');

  const filteredExecutions = executions.filter(e => e.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'waiting_input': return 'bg-blue-500/20 text-blue-400';
      case 'auto_fix': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Execution</h1>
          <p className="text-muted-foreground">Monitor and control running tasks</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="waiting_input">Waiting Input</TabsTrigger>
            <TabsTrigger value="auto_fix">Auto-Fix</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {filteredExecutions.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {item.mode === 'AI' ? <Bot className="h-5 w-5 text-cyan-400" /> : <User className="h-5 w-5 text-purple-400" />}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.id}</span>
                            <Badge className={getStatusColor(item.status)}>{item.status.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.task}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Progress:</span>
                              <Progress value={item.progress} className="w-32 h-2" />
                              <span className="text-xs text-foreground">{item.progress}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{item.logs} logs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400">
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredExecutions.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No tasks in this state
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMTaskExecution;
