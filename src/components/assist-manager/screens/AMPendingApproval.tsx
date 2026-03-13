/**
 * PENDING APPROVAL - All buttons functional
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Clock, Check, X, AlertTriangle, User, Timer } from 'lucide-react';

interface ApprovalData {
  id: string;
  sessionId: string;
  requester: string;
  target: string;
  type: string;
  awaiting: string;
  expiresIn: number;
  submitted: string;
  scope: string;
  status: 'pending' | 'approved' | 'rejected' | 'extended';
}

const INITIAL_APPROVALS: ApprovalData[] = [
  { id: 'APR-001', sessionId: 'SVL-P9K2M4', requester: 'AGT-****15', target: 'USR-****42', type: 'Control', awaiting: 'Boss Owner', expiresIn: 12, submitted: '3 min ago', scope: 'Full Control', status: 'pending' },
  { id: 'APR-002', sessionId: 'SVL-Q3N7P1', requester: 'AGT-****22', target: 'USR-****67', type: 'Dev', awaiting: 'Manager', expiresIn: 8, submitted: '7 min ago', scope: 'Limited Control', status: 'pending' },
  { id: 'APR-003', sessionId: 'SVL-R5X4L6', requester: 'AGT-****08', target: 'USR-****89', type: 'Support', awaiting: 'Boss Owner', expiresIn: 2, submitted: '13 min ago', scope: 'View + Chat', status: 'pending' },
];

export function AMPendingApproval() {
  const [approvals, setApprovals] = useState<ApprovalData[]>(INITIAL_APPROVALS);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setApprovals(prev => prev.map(a => {
        if (a.status !== 'pending') return a;
        const newExpiry = Math.max(0, a.expiresIn - 0.05);
        if (newExpiry <= 0) {
          toast.error(`Approval ${a.id} expired`, { description: `Session ${a.sessionId} auto-rejected` });
          return { ...a, expiresIn: 0, status: 'rejected' as const };
        }
        return { ...a, expiresIn: newExpiry };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    const approval = approvals.find(a => a.id === id);
    toast.success(`Session ${approval?.sessionId} approved`, { description: 'Token generated • Session starting' });
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    toast.error(`Approval ${id} rejected`, { description: 'Request denied and logged' });
  };

  const handleExtend = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, expiresIn: a.expiresIn + 10, status: 'extended' } : a));
    toast.info(`Approval ${id} extended`, { description: '+10 minutes added to expiry timer' });
    // Reset to pending after brief state
    setTimeout(() => {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'pending' } : a));
    }, 1000);
  };

  const pendingCount = approvals.filter(a => a.status === 'pending' || a.status === 'extended').length;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pending Approval</h1>
            <p className="text-muted-foreground">Sessions awaiting authorization</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm">{pendingCount} Waiting</span>
          </div>
        </div>

        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id} className={`border-l-4 ${
              approval.status === 'approved' ? 'border-l-green-500 opacity-60' :
              approval.status === 'rejected' ? 'border-l-muted opacity-40' :
              approval.expiresIn <= 5 ? 'border-l-red-500' : 'border-l-amber-500'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{approval.sessionId}</span>
                      <Badge variant="secondary">{approval.type}</Badge>
                      <Badge variant="outline">{approval.scope}</Badge>
                      {approval.status !== 'pending' && (
                        <Badge variant={approval.status === 'approved' ? 'default' : 'destructive'}>{approval.status}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Requester</p>
                        <p className="font-mono">{approval.requester}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-mono">{approval.target}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Awaiting</p>
                        <p className="font-medium">{approval.awaiting}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p>{approval.submitted}</p>
                      </div>
                    </div>
                    {approval.status === 'pending' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground"><Timer className="h-3 w-3" /> Expires in</span>
                          <span className={approval.expiresIn <= 5 ? 'text-red-500 font-medium' : ''}>{Math.ceil(approval.expiresIn)} minutes</span>
                        </div>
                        <Progress value={(approval.expiresIn / 15) * 100} className={`h-1 ${approval.expiresIn <= 5 ? '[&>div]:bg-red-500' : ''}`} />
                      </div>
                    )}
                    {approval.expiresIn <= 5 && approval.status === 'pending' && (
                      <div className="flex items-center gap-2 text-xs text-red-500">
                        <AlertTriangle className="h-3 w-3" /> Request will expire soon
                      </div>
                    )}
                  </div>

                  {(approval.status === 'pending' || approval.status === 'extended') && (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(approval.id)}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExtend(approval.id)}>
                        <Clock className="h-4 w-4 mr-1" /> Extend
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center"><Clock className="h-8 w-8 mx-auto text-amber-500 mb-2" /><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><Check className="h-8 w-8 mx-auto text-green-500 mb-2" /><p className="text-2xl font-bold">{approvals.filter(a => a.status === 'approved').length + 28}</p><p className="text-xs text-muted-foreground">Approved Today</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><X className="h-8 w-8 mx-auto text-red-500 mb-2" /><p className="text-2xl font-bold">{approvals.filter(a => a.status === 'rejected').length + 4}</p><p className="text-xs text-muted-foreground">Rejected Today</p></CardContent></Card>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMPendingApproval;
