/**
 * AUDIT LOGS (READ ONLY)
 * Every action tracked • Immutable • Timestamped
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Lock, User, Bot, Shield } from 'lucide-react';

const mockAuditLogs = [
  { id: 'AUD-001', action: 'License Renewed', actor: 'System', target: 'PRO-***21', time: '2024-02-05 10:30:00', ip: '192.168.***' },
  { id: 'AUD-002', action: 'Support Ticket Created', actor: 'User', target: 'TKT-001', time: '2024-02-05 10:25:00', ip: '10.0.***' },
  { id: 'AUD-003', action: 'AI Auto-Resolution', actor: 'AI', target: 'TKT-002', time: '2024-02-05 10:20:00', ip: 'Internal' },
  { id: 'AUD-004', action: 'Access Suspended', actor: 'Admin', target: 'PRO-***78', time: '2024-02-05 10:15:00', ip: '172.16.***' },
  { id: 'AUD-005', action: 'Security Alert Triggered', actor: 'System', target: 'PRO-***92', time: '2024-02-05 10:10:00', ip: 'Internal' },
];

export const PROAuditLogs: React.FC = () => {
  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'User': return <User className="h-4 w-4 text-blue-500" />;
      case 'Admin': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'AI': return <Bot className="h-4 w-4 text-green-500" />;
      case 'System': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground">Immutable record of all system actions</p>
      </div>

      <Card className="border-amber-500/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Read-Only Access</p>
            <p className="text-xs text-muted-foreground">Logs cannot be modified or deleted</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">System Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAuditLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-mono text-xs text-foreground">{log.id}</span>
                  <span className="text-sm text-foreground">{log.action}</span>
                  <div className="flex items-center gap-1">
                    {getActorIcon(log.actor)}
                    <Badge variant="outline">{log.actor}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">→ {log.target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{log.ip}</span>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROAuditLogs;
