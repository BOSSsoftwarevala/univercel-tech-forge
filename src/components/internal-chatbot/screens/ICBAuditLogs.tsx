/**
 * AUDIT LOGS (READ ONLY)
 * NO EDIT • NO DELETE
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User, Bot, Shield } from 'lucide-react';

const auditLogs = [
  { 
    id: 'LOG-001', 
    inquiryId: 'INQ-101', 
    approver: 'MGR-001', 
    duration: '15 min',
    actions: ['Approved', 'Chat Started', 'Resolved'],
    aiInvolved: true,
    timestamp: '10:30 AM'
  },
  { 
    id: 'LOG-002', 
    inquiryId: 'INQ-102', 
    approver: 'MGR-002', 
    duration: '8 min',
    actions: ['Approved', 'Escalated', 'Boss Reviewed'],
    aiInvolved: false,
    timestamp: '09:15 AM'
  },
  { 
    id: 'LOG-003', 
    inquiryId: 'INQ-103', 
    approver: 'MGR-001', 
    duration: '22 min',
    actions: ['Approved', 'Chat Started', 'Converted to Ticket'],
    aiInvolved: true,
    timestamp: 'Yesterday'
  },
];

export const ICBAuditLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Read-only system audit trail</p>
      </div>

      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-sm text-amber-500 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            NO EDIT • NO DELETE
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div 
                key={log.id}
                className="p-4 bg-muted/30 rounded-lg border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{log.id}</span>
                    <Badge variant="outline">{log.inquiryId}</Badge>
                    {log.aiInvolved && (
                      <Badge variant="secondary">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Involved
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Approver:</span>
                    <span className="font-mono">{log.approver}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{log.duration}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Actions:</span>
                  {log.actions.map((action, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBAuditLogs;
