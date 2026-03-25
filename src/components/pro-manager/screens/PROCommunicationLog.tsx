/**
 * COMMUNICATION LOG
 * Masked Chat History • Assist Notes • AI Actions Log
 * NO DELETE • NO EDIT
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bot, Handshake, Lock } from 'lucide-react';

const mockLogs = [
  { id: 'LOG-001', type: 'chat', user: 'PRO-***21', content: 'User inquired about API limits...', time: '10 min ago' },
  { id: 'LOG-002', type: 'ai', user: 'PRO-***45', content: 'AI suggested solution for billing issue...', time: '25 min ago' },
  { id: 'LOG-003', type: 'assist', user: 'PRO-***78', content: 'Assist session note: Configured integration...', time: '1 hour ago' },
  { id: 'LOG-004', type: 'chat', user: 'PRO-***92', content: 'Support escalation initiated...', time: '2 hours ago' },
  { id: 'LOG-005', type: 'ai', user: 'PRO-***21', content: 'Auto-resolved: Password reset request...', time: '3 hours ago' },
];

export const PROCommunicationLog: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'ai': return <Bot className="h-5 w-5 text-green-500" />;
      case 'assist': return <Handshake className="h-5 w-5 text-purple-500" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communication Log</h1>
        <p className="text-muted-foreground">Immutable record of all communications</p>
      </div>

      <Card className="border-amber-500/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Read-Only Access</p>
            <p className="text-xs text-muted-foreground">No delete • No edit • Immutable records</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                {getTypeIcon(log.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-foreground">{log.id}</span>
                    <span className="text-sm text-foreground">{log.user}</span>
                    <Badge variant="outline">{log.type}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{log.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROCommunicationLog;
