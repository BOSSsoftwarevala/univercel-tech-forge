import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Escalation {
  id: string;
  taskId: string;
  title: string;
  escalatedTo: string;
  escalatedAt: string;
  reason: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  priority: 'normal' | 'high' | 'critical';
  resolution?: string;
}

const mockEscalations: Escalation[] = [
  { id: 'ESC-001', taskId: 'TSK-201', title: 'Third-party API integration blocked', escalatedTo: 'Dev Manager', escalatedAt: '2024-01-15T10:30:00Z', reason: 'Blocked for 28h - exceeds threshold', status: 'acknowledged', priority: 'high' },
  { id: 'ESC-002', taskId: 'TSK-302', title: 'User authentication bypass - SLA breached', escalatedTo: 'Super Admin', escalatedAt: '2024-01-15T08:00:00Z', reason: 'Critical SLA breach - 2h overdue', status: 'pending', priority: 'critical' },
  { id: 'ESC-003', taskId: 'TSK-401', title: 'Legacy system migration overdue', escalatedTo: 'Pro Manager', escalatedAt: '2024-01-13T14:00:00Z', reason: '5 days overdue without progress', status: 'resolved', priority: 'high', resolution: 'Reassigned to senior developer' },
];

const TMEscalations: React.FC = () => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'resolved':
        return { color: 'bg-green-500/20 text-green-400', icon: CheckCircle };
      case 'acknowledged':
        return { color: 'bg-blue-500/20 text-blue-400', icon: Loader2 };
      default:
        return { color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const pendingCount = mockEscalations.filter(e => e.status === 'pending').length;
  const acknowledgedCount = mockEscalations.filter(e => e.status === 'acknowledged').length;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Escalations
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400">
              Pending: {pendingCount}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400">
              In Progress: {acknowledgedCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockEscalations.map((escalation, index) => {
            const StatusIcon = getStatusConfig(escalation.status).icon;
            
            return (
              <motion.div
                key={escalation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getStatusConfig(escalation.status).color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm text-muted-foreground">{escalation.id}</span>
                      <Badge className={getStatusConfig(escalation.status).color}>
                        {escalation.status}
                      </Badge>
                      <Badge className={getPriorityColor(escalation.priority)}>
                        {escalation.priority}
                      </Badge>
                    </div>
                    <p className="font-medium mb-1">{escalation.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Task: {escalation.taskId} • Escalated to: {escalation.escalatedTo}
                    </p>
                    <div className="p-2 rounded bg-muted/30 text-sm">
                      <span className="text-muted-foreground">Reason: </span>
                      {escalation.reason}
                    </div>
                    {escalation.resolution && (
                      <div className="p-2 rounded bg-green-500/10 text-sm mt-2 border border-green-500/30">
                        <span className="text-green-400">Resolution: </span>
                        {escalation.resolution}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(escalation.escalatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {mockEscalations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No escalations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TMEscalations;
