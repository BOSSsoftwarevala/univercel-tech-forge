import React from 'react';
import { FileText, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const APILogs: React.FC = () => {
  const logs = [
    { timestamp: '14:32:45.123', api: 'Payment Gateway', event: 'Transaction processed', result: 'success', details: 'Amount: ₹25,000' },
    { timestamp: '14:32:44.892', api: 'AI Gateway', event: 'GPT-4 completion', result: 'success', details: 'Tokens: 1,245' },
    { timestamp: '14:32:43.456', api: 'SMS Service', event: 'OTP sent', result: 'success', details: 'To: +91-***-***-1234' },
    { timestamp: '14:32:42.789', api: 'Email Service', event: 'Email queued', result: 'success', details: 'Template: welcome' },
    { timestamp: '14:32:41.234', api: 'AI Gateway', event: 'Rate limit warning', result: 'warning', details: '90% capacity' },
    { timestamp: '14:32:40.567', api: 'Payment Gateway', event: 'Webhook received', result: 'success', details: 'Event: payment.captured' },
    { timestamp: '14:32:39.890', api: 'CRM Integration', event: 'Lead sync', result: 'error', details: 'Connection timeout' },
    { timestamp: '14:32:38.123', api: 'SMS Service', event: 'Delivery confirmed', result: 'success', details: 'Message ID: MSG-***123' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Logs</h2>
        <p className="text-muted-foreground">API and AI operation logs - Read only</p>
      </div>

      {/* Security Notice */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Export Disabled</p>
              <p className="text-sm text-muted-foreground">
                Log export and copy features are disabled for security. View-only access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Badge variant="default">All</Badge>
            <Badge variant="outline">Payment</Badge>
            <Badge variant="outline">AI</Badge>
            <Badge variant="outline">SMS</Badge>
            <Badge variant="outline">Email</Badge>
            <Badge variant="outline">Errors Only</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Recent Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">API / Model</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Event</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Result</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-sm text-muted-foreground">{log.timestamp}</td>
                    <td className="p-3">
                      <Badge variant="outline">{log.api}</Badge>
                    </td>
                    <td className="p-3 text-foreground">{log.event}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {log.result === 'success' ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : log.result === 'warning' ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-400" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          log.result === 'success' ? 'text-green-400' :
                          log.result === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {log.result}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APILogs;
