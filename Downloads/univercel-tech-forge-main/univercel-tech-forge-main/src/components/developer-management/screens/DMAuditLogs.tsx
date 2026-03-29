/**
 * AUDIT LOGS (READ ONLY)
 * Every action logged • No edit • No delete
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield } from 'lucide-react';

const auditLogs = [
  { id: 'LOG-001', action: 'Task assigned', actor: 'MGR-001', target: 'DEV-001', timestamp: '2024-01-18 10:30:00' },
  { id: 'LOG-002', action: 'Code submitted', actor: 'DEV-003', target: 'TSK-003', timestamp: '2024-01-18 10:25:00' },
  { id: 'LOG-003', action: 'Access revoked', actor: 'ADMIN-001', target: 'DEV-004', timestamp: '2024-01-18 10:20:00' },
  { id: 'LOG-004', action: 'Bug resolved', actor: 'DEV-002', target: 'BUG-005', timestamp: '2024-01-18 10:15:00' },
  { id: 'LOG-005', action: 'Sprint started', actor: 'MGR-002', target: 'SPR-001', timestamp: '2024-01-18 10:00:00' },
  { id: 'LOG-006', action: 'NDA signed', actor: 'DEV-001', target: 'NDA-001', timestamp: '2024-01-18 09:45:00' },
  { id: 'LOG-007', action: 'Payment approved', actor: 'FIN-001', target: 'PAY-001', timestamp: '2024-01-18 09:30:00' },
];

export const DMAuditLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Complete system activity log</p>
      </div>

      {/* Warning */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="flex items-center gap-3 py-4">
          <Shield className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-amber-500 font-medium">
            READ ONLY • NO EDIT • NO DELETE
          </span>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div 
                key={log.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                  <Badge variant="outline">{log.action}</Badge>
                  <span className="text-sm">
                    <span className="font-mono">{log.actor}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-mono">{log.target}</span>
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DMAuditLogs;
