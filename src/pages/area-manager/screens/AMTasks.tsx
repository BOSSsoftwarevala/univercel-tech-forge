import React from 'react';
import { ListTodo, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AMTasks: React.FC = () => {
  const tasks = [
    { id: 'TSK-001', title: 'Review franchise application', assignee: 'Self', sla: '2h remaining', status: 'in_progress', priority: 'high' },
    { id: 'TSK-002', title: 'Approve pending payouts', assignee: 'Self', sla: '4h remaining', status: 'pending', priority: 'medium' },
    { id: 'TSK-003', title: 'Weekly performance review', assignee: 'Self', sla: '1d remaining', status: 'pending', priority: 'low' },
    { id: 'TSK-004', title: 'Escalate blocked tickets', assignee: 'Self', sla: 'Overdue', status: 'overdue', priority: 'high' },
    { id: 'TSK-005', title: 'Audit regional sales data', assignee: 'Self', sla: '3d remaining', status: 'pending', priority: 'medium' },
  ];

  const slaMetrics = [
    { label: 'On Time', value: 85, color: 'bg-green-500' },
    { label: 'At Risk', value: 10, color: 'bg-yellow-500' },
    { label: 'Breached', value: 5, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tasks & SLA</h2>
        <p className="text-muted-foreground">Task management with SLA tracking</p>
      </div>

      {/* SLA Overview */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            SLA Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {slaMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-muted"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="36"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className={metric.color.replace('bg-', 'text-')}
                      strokeWidth="8"
                      strokeDasharray={`${metric.value * 2.26} 226`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="36"
                      cx="48"
                      cy="48"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">
                    {metric.value}%
                  </span>
                </div>
                <p className="text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-purple-400" />
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'overdue' ? 'bg-red-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground font-mono">{task.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {task.priority}
                  </Badge>
                  <span className={`text-sm font-mono ${
                    task.sla === 'Overdue' ? 'text-red-400' : 'text-muted-foreground'
                  }`}>
                    {task.sla}
                  </span>
                  <Badge variant={
                    task.status === 'overdue' ? 'destructive' :
                    task.status === 'in_progress' ? 'default' : 'secondary'
                  }>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMTasks;
