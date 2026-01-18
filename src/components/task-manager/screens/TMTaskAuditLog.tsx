/**
 * TASK MANAGER - TASK AUDIT LOG
 * Immutable • Timestamped • Role-based trace (Read-only)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Clock, User, Shield } from 'lucide-react';

const auditLogs = [
  { id: 'LOG-001', action: 'Task Created', user: 'AI System', role: 'System', timestamp: '2024-01-15 14:32:15', details: 'Auto-generated from SLA breach detection' },
  { id: 'LOG-002', action: 'Task Assigned', user: 'John D.', role: 'Pro Manager', timestamp: '2024-01-15 14:30:00', details: 'Assigned to Support Team' },
  { id: 'LOG-003', action: 'Task Approved', user: 'Sarah M.', role: 'Finance Manager', timestamp: '2024-01-15 14:25:30', details: 'High-value payout approved' },
  { id: 'LOG-004', action: 'Task Escalated', user: 'AI System', role: 'System', timestamp: '2024-01-15 14:20:00', details: 'Auto-escalated due to SLA risk' },
  { id: 'LOG-005', action: 'Task Completed', user: 'Mike R.', role: 'Developer', timestamp: '2024-01-15 14:15:45', details: 'Bug fix deployed successfully' },
  { id: 'LOG-006', action: 'Task Modified', user: 'Emily K.', role: 'Product Manager', timestamp: '2024-01-15 14:10:00', details: 'Priority changed from Medium to High' },
  { id: 'LOG-007', action: 'Task Failed', user: 'AI System', role: 'System', timestamp: '2024-01-15 14:05:00', details: 'Payment gateway timeout' },
  { id: 'LOG-008', action: 'Task Retried', user: 'AI System', role: 'System', timestamp: '2024-01-15 14:00:00', details: 'Auto-retry attempt #2' },
];

const getActionColor = (action: string) => {
  if (action.includes('Created')) return 'bg-blue-500/20 text-blue-400';
  if (action.includes('Approved')) return 'bg-green-500/20 text-green-400';
  if (action.includes('Completed')) return 'bg-green-500/20 text-green-400';
  if (action.includes('Failed')) return 'bg-red-500/20 text-red-400';
  if (action.includes('Escalated')) return 'bg-orange-500/20 text-orange-400';
  if (action.includes('Modified')) return 'bg-purple-500/20 text-purple-400';
  return 'bg-muted text-muted-foreground';
};

export const TMTaskAuditLog: React.FC = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Audit Log</h1>
          <p className="text-muted-foreground">Immutable activity log • Every action tracked</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activity Log
              <Badge variant="outline" className="ml-2">Read-Only</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    </div>
                    <p className="text-sm text-foreground mt-1">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{log.user}</span>
                      </div>
                      <span>({log.role})</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TMTaskAuditLog;
