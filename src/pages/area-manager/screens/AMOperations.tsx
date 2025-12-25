import React from 'react';
import { Activity, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AMOperations: React.FC = () => {
  const operations = [
    { time: '09:15', action: 'Lead assigned to Franchise F-001', status: 'completed', user: 'System' },
    { time: '09:30', action: 'Support ticket escalated', status: 'pending', user: 'Support Team' },
    { time: '10:00', action: 'Demo scheduled for Prime User', status: 'completed', user: 'Sales Team' },
    { time: '10:45', action: 'Payout request submitted', status: 'pending', user: 'Franchise F-003' },
    { time: '11:00', action: 'New reseller onboarded', status: 'completed', user: 'HR Team' },
    { time: '11:30', action: 'Task deadline approaching', status: 'alert', user: 'Developer D-012' },
  ];

  const dailyStats = [
    { label: 'Tasks Completed', value: 45, total: 62 },
    { label: 'Leads Processed', value: 28, total: 35 },
    { label: 'Tickets Resolved', value: 12, total: 18 },
    { label: 'Approvals Pending', value: 7, total: 12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Daily Operations</h2>
        <p className="text-muted-foreground">Real-time operational activity for today</p>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dailyStats.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">/ {stat.total}</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(stat.value / stat.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operations Log */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Today's Operations Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operations.map((op, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{op.time}</span>
                  <span className="text-foreground">{op.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{op.user}</span>
                  <Badge variant={
                    op.status === 'completed' ? 'default' :
                    op.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {op.status}
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

export default AMOperations;
