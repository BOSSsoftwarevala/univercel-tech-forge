/**
 * ISSUE & BUG TRACKER
 * Issue ID • Related Build • Fix Status • AI Fix Attempt Log
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockIssues = [
  { id: 'BUG-001', build: 'v4.2.1-beta', status: 'open', aiAttempts: 2, lastAttempt: '1 hour ago' },
  { id: 'BUG-002', build: 'v4.2.0', status: 'ai_fixing', aiAttempts: 1, lastAttempt: '30 min ago' },
  { id: 'BUG-003', build: 'v4.1.9', status: 'dev_review', aiAttempts: 3, lastAttempt: '2 hours ago' },
  { id: 'BUG-004', build: 'v4.2.1-beta', status: 'resolved', aiAttempts: 1, lastAttempt: '1 day ago' },
];

export const PROIssueBugTracker: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-red-500/20 text-red-500">Open</Badge>;
      case 'ai_fixing': return <Badge className="bg-blue-500/20 text-blue-500">AI Fixing</Badge>;
      case 'dev_review': return <Badge className="bg-amber-500/20 text-amber-500">Dev Review</Badge>;
      case 'resolved': return <Badge className="bg-green-500/20 text-green-500">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Issue & Bug Tracker</h1>
        <p className="text-muted-foreground">Track and resolve product issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Active Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockIssues.map((issue, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Bug className="h-5 w-5 text-red-500" />
                  <span className="font-mono text-sm text-foreground">{issue.id}</span>
                  <Badge variant="outline">{issue.build}</Badge>
                  {getStatusBadge(issue.status)}
                  <span className="text-xs text-muted-foreground">AI Attempts: {issue.aiAttempts}</span>
                  <span className="text-xs text-muted-foreground">Last: {issue.lastAttempt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info('AI fix retry initiated')}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry Fix
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Sent to dev team')}>
                    <Send className="h-4 w-4 mr-1" />
                    Send to Dev
                  </Button>
                  <Button size="sm" onClick={() => toast.success('Marked as resolved')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Resolved
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

export default PROIssueBugTracker;
