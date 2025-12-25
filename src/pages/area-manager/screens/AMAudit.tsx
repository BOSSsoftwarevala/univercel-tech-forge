import React from 'react';
import { FileText, Lock, Clock, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AMAudit: React.FC = () => {
  const auditLogs = [
    { time: '09:15:32', role: 'Area Manager', action: 'Approved payout request APR-001', result: 'Success', device: 'Chrome/Windows', ip: '192.168.1.***' },
    { time: '09:30:45', role: 'Franchise F-001', action: 'Submitted lead L-001', result: 'Success', device: 'Safari/iOS', ip: '192.168.2.***' },
    { time: '10:00:12', role: 'Reseller R-003', action: 'Wallet withdrawal request', result: 'Pending', device: 'Firefox/Mac', ip: '192.168.3.***' },
    { time: '10:45:28', role: 'System', action: 'Auto-assigned lead to franchise', result: 'Success', device: 'System', ip: 'Internal' },
    { time: '11:00:55', role: 'Area Manager', action: 'Escalated ticket T-005', result: 'Success', device: 'Chrome/Windows', ip: '192.168.1.***' },
    { time: '11:30:18', role: 'Support', action: 'Resolved ticket T-003', result: 'Success', device: 'Edge/Windows', ip: '192.168.4.***' },
    { time: '12:00:42', role: 'Franchise F-002', action: 'Updated profile information', result: 'Success', device: 'Chrome/Android', ip: '192.168.5.***' },
    { time: '12:30:09', role: 'System', action: 'SLA breach detected for T-001', result: 'Alert', device: 'System', ip: 'Internal' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Audit Trail</h2>
        <p className="text-muted-foreground">Read-only audit log - All actions are immutable</p>
      </div>

      {/* Read-Only Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-medium text-blue-400">Read-Only Access</p>
              <p className="text-sm text-muted-foreground">
                Audit logs are immutable and cannot be modified or deleted. Export and copy features are disabled.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Regional Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Role</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Action</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Result</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Device</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-sm text-muted-foreground">{log.time}</td>
                    <td className="p-3">
                      <Badge variant="outline">{log.role}</Badge>
                    </td>
                    <td className="p-3 text-foreground">{log.action}</td>
                    <td className="p-3">
                      <Badge variant={
                        log.result === 'Success' ? 'default' :
                        log.result === 'Pending' ? 'secondary' : 'destructive'
                      }>
                        {log.result}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{log.device}</td>
                    <td className="p-3 font-mono text-sm text-muted-foreground">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Integrity Notice */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Log Integrity Verified</p>
              <p className="text-sm text-muted-foreground">
                All audit entries are cryptographically signed and verified. Last integrity check: 2 minutes ago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMAudit;
