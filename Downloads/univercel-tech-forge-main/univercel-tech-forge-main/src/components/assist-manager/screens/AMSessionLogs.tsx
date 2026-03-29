/**
 * SESSION LOGS - Search functional, read-only
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { FileText, Search, User, Clock, Shield, Brain, Lock } from 'lucide-react';

const ALL_LOGS = [
  { id: 'LOG-001', sessionId: 'SVL-A8K2M9', participants: ['USR-****42', 'AGT-****15'], startTime: '2024-01-15 10:23:45', endTime: '2024-01-15 10:48:21', duration: '24:36', permissions: ['Screen View', 'Chat'], aiInvolved: true, actions: 12, status: 'completed' },
  { id: 'LOG-002', sessionId: 'SVL-B3N7P1', participants: ['USR-****67', 'AGT-****22'], startTime: '2024-01-15 09:15:00', endTime: '2024-01-15 09:45:30', duration: '30:30', permissions: ['Screen View', 'Control', 'File Transfer'], aiInvolved: false, actions: 28, status: 'completed' },
  { id: 'LOG-003', sessionId: 'SVL-C9X4L6', participants: ['USR-****89', 'AGT-****08'], startTime: '2024-01-15 08:00:00', endTime: '2024-01-15 08:12:15', duration: '12:15', permissions: ['Screen View'], aiInvolved: true, actions: 5, status: 'terminated' },
];

export function AMSessionLogs() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = ALL_LOGS.filter(log => 
    !searchQuery || 
    log.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
    log.startTime.includes(searchQuery) ||
    log.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Session Logs</h1>
            <p className="text-muted-foreground">Read-only audit trail of all sessions</p>
          </div>
          <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3" /> No Edit • No Delete</Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs by session ID, user, or date..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No logs match your search</CardContent></Card>
          ) : filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="h-5 w-5 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{log.sessionId}</span>
                        <Badge variant={log.status === 'completed' ? 'default' : 'destructive'}>{log.status}</Badge>
                        {log.aiInvolved && <Badge variant="secondary" className="gap-1"><Brain className="h-3 w-3" /> AI</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{log.id}</p>
                    </div>
                  </div>
                  <div className="text-right"><p className="text-sm font-medium">{log.duration}</p><p className="text-xs text-muted-foreground">Duration</p></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Participants</p>
                    <div className="mt-1 space-y-1">{log.participants.map(p => <p key={p} className="font-mono text-xs">{p}</p>)}</div>
                  </div>
                  <div><p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Start</p><p className="font-mono text-xs mt-1">{log.startTime}</p></div>
                  <div><p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> End</p><p className="font-mono text-xs mt-1">{log.endTime}</p></div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Permissions</p>
                    <div className="flex flex-wrap gap-1 mt-1">{log.permissions.map(p => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>{log.actions} actions recorded</span>
                  <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Immutable record</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-500">Audit Integrity</p>
                <p className="text-xs text-muted-foreground mt-1">All session logs are immutable. Records cannot be edited or deleted.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMSessionLogs;
