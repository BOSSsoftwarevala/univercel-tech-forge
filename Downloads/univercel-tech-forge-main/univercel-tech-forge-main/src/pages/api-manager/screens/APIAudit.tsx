import React from 'react';
import { FileText, Lock, Activity, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const APIAudit: React.FC = () => {
  const auditLogs = [
    { time: '14:32:45', action: 'API Key Created', actor: 'API Manager', approval: 'APR-001', result: 'Approved' },
    { time: '14:28:12', action: 'AI Model Activated (GPT-4)', actor: 'API Manager', approval: 'APR-002', result: 'Approved' },
    { time: '14:15:33', action: 'Rate Limit Changed', actor: 'Super Admin', approval: '-', result: 'Direct' },
    { time: '13:45:22', action: 'API Key Rotated', actor: 'API Manager', approval: 'APR-003', result: 'Approved' },
    { time: '13:30:11', action: 'Integration Added (Stripe)', actor: 'API Manager', approval: 'APR-004', result: 'Approved' },
    { time: '12:55:44', action: 'Automation Rule Created', actor: 'API Manager', approval: 'APR-005', result: 'Approved' },
    { time: '12:30:18', action: 'AI Model Deactivated (Claude)', actor: 'API Manager', approval: 'APR-006', result: 'Rejected' },
    { time: '11:45:33', action: 'API Key Disabled', actor: 'System', approval: 'AUTO', result: 'Auto-triggered' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Audit Trail</h2>
        <p className="text-muted-foreground">Read-only audit log with approval references</p>
      </div>

      {/* Read-Only Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-medium text-blue-400">Read-Only Access</p>
              <p className="text-sm text-muted-foreground">
                Audit logs are immutable and cannot be modified. All actions are tracked with approval references.
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
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Time</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Action</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actor</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Approval Ref</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-sm text-muted-foreground">{log.time}</td>
                    <td className="p-3 text-foreground">{log.action}</td>
                    <td className="p-3">
                      <Badge variant="outline">{log.actor}</Badge>
                    </td>
                    <td className="p-3 font-mono text-sm text-muted-foreground">{log.approval}</td>
                    <td className="p-3">
                      <Badge variant={
                        log.result === 'Approved' ? 'default' :
                        log.result === 'Rejected' ? 'destructive' :
                        log.result === 'Direct' ? 'secondary' : 'outline'
                      }>
                        {log.result}
                      </Badge>
                    </td>
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
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Log Integrity Verified</p>
              <p className="text-sm text-muted-foreground">
                All audit entries are cryptographically signed. Last verification: 30 seconds ago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIAudit;
