import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClockAlert, User, Calendar, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface OverdueTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  daysOverdue: number;
  priority: string;
  sourceId: string;
  lastUpdate: string;
}

const mockOverdueTasks: OverdueTask[] = [
  { id: 'TSK-401', title: 'Legacy system migration script', assignee: 'DEV-W3X4', dueDate: '2024-01-10', daysOverdue: 5, priority: 'high', sourceId: 'ORD-8821', lastUpdate: '2024-01-12' },
  { id: 'TSK-402', title: 'Security audit documentation', assignee: 'DEV-Y5Z6', dueDate: '2024-01-12', daysOverdue: 3, priority: 'critical', sourceId: 'TKT-9932', lastUpdate: '2024-01-14' },
  { id: 'TSK-403', title: 'Mobile app push notifications', assignee: 'DEV-A7B8', dueDate: '2024-01-13', daysOverdue: 2, priority: 'medium', sourceId: 'LD-1123', lastUpdate: '2024-01-14' },
];

const TMOverdueTasks: React.FC = () => {
  const handleForceEscalate = (task: OverdueTask) => {
    console.log('[TASK_MANAGER] Overdue task escalated:', {
      timestamp: new Date().toISOString(),
      action: 'overdue_escalated',
      taskId: task.id,
      daysOverdue: task.daysOverdue,
      assignee: task.assignee
    });

    toast.success('Overdue task escalated to management');
  };

  const getOverdueSeverity = (days: number) => {
    if (days >= 5) return 'bg-red-500/30 text-red-300 border-red-500/50';
    if (days >= 3) return 'bg-orange-500/30 text-orange-300 border-orange-500/50';
    return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClockAlert className="h-5 w-5 text-red-500" />
          Overdue Tasks
          <Badge variant="destructive" className="ml-2">{mockOverdueTasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockOverdueTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-red-500/5 border border-red-500/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm text-muted-foreground">{task.id}</span>
                    <Badge className={getOverdueSeverity(task.daysOverdue)}>
                      {task.daysOverdue} days overdue
                    </Badge>
                    <Badge className="bg-red-500/20 text-red-400">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="font-medium mb-2">{task.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {task.dueDate}
                    </span>
                    <Badge variant="outline" className="text-xs">{task.sourceId}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last update: {task.lastUpdate}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleForceEscalate(task)}
                  className="gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Force Escalate
                </Button>
              </div>
            </motion.div>
          ))}
          {mockOverdueTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClockAlert className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No overdue tasks
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TMOverdueTasks;
