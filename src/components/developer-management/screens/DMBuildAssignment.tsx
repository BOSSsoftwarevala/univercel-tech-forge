/**
 * BUILD ASSIGNMENT
 * Build ID • Module Scope • Assigned Dev • Status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Play, Square, Send, Loader2 } from 'lucide-react';
import { useActionHandler } from '@/hooks/useActionHandler';

const builds = [
  { id: 'BLD-001', module: 'Auth Module', assignee: 'DEV-001', status: 'in_progress', started: '2024-01-18 10:00' },
  { id: 'BLD-002', module: 'Dashboard API', assignee: 'DEV-003', status: 'completed', started: '2024-01-17 14:00' },
  { id: 'BLD-003', module: 'Payment Gateway', assignee: 'DEV-002', status: 'failed', started: '2024-01-18 09:00' },
  { id: 'BLD-004', module: 'User Settings', assignee: null, status: 'pending', started: null },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending': return <Badge variant="secondary">Pending</Badge>;
    case 'in_progress': return <Badge className="bg-blue-500/20 text-blue-500">In Progress</Badge>;
    case 'completed': return <Badge className="bg-green-500/20 text-green-500">Completed</Badge>;
    case 'failed': return <Badge variant="destructive">Failed</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export const DMBuildAssignment: React.FC = () => {
  const { start, stop, send, isActionLoading } = useActionHandler();

  const handleStartBuild = (buildId: string) => {
    start('Build', buildId, { action: 'start_build_process' });
  };

  const handleStopBuild = (buildId: string) => {
    stop('Build', buildId, { action: 'stop_build_process' });
  };

  const handleSendToQA = (buildId: string) => {
    send('Build', buildId, 'QA', { action: 'send_to_qa_queue' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Build Assignment</h1>
        <p className="text-muted-foreground">Manage build assignments and status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hammer className="h-5 w-5" />
            Build Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {builds.map((build) => (
              <div 
                key={build.id}
                className={`p-4 rounded-lg border ${
                  build.status === 'failed' ? 'bg-red-500/5 border-red-500/30' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium">{build.id}</span>
                    {getStatusBadge(build.status)}
                  </div>
                  {build.assignee && (
                    <span className="font-mono text-sm">{build.assignee}</span>
                  )}
                </div>
                <div className="mb-3">
                  <p className="font-medium">{build.module}</p>
                  {build.started && (
                    <p className="text-xs text-muted-foreground">Started: {build.started}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStartBuild(build.id)}
                    disabled={build.status === 'in_progress' || isActionLoading('start', build.id)}
                  >
                    {isActionLoading('start', build.id) ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Start Build
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStopBuild(build.id)}
                    disabled={build.status !== 'in_progress' || isActionLoading('stop', build.id)}
                  >
                    {isActionLoading('stop', build.id) ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Square className="h-4 w-4 mr-1" />
                    )}
                    Stop Build
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSendToQA(build.id)}
                    disabled={build.status !== 'completed' || isActionLoading('send', build.id)}
                  >
                    {isActionLoading('send', build.id) ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
                    Send to QA
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DMBuildAssignment;
