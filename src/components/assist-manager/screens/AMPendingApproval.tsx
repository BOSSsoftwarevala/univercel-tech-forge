/**
 * PENDING APPROVAL
 * Sessions awaiting boss/manager approval
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Check,
  X,
  AlertTriangle,
  User,
  Timer,
} from 'lucide-react';

const PENDING_APPROVALS = [
  {
    id: 'APR-001',
    sessionId: 'SVL-P9K2M4',
    requester: 'AGT-****15',
    target: 'USR-****42',
    type: 'Control',
    awaiting: 'Boss Owner',
    expiresIn: 12,
    submitted: '3 min ago',
    scope: 'Full Control',
  },
  {
    id: 'APR-002',
    sessionId: 'SVL-Q3N7P1',
    requester: 'AGT-****22',
    target: 'USR-****67',
    type: 'Dev',
    awaiting: 'Manager',
    expiresIn: 8,
    submitted: '7 min ago',
    scope: 'Limited Control',
  },
  {
    id: 'APR-003',
    sessionId: 'SVL-R5X4L6',
    requester: 'AGT-****08',
    target: 'USR-****89',
    type: 'Support',
    awaiting: 'Boss Owner',
    expiresIn: 2,
    submitted: '13 min ago',
    scope: 'View + Chat',
  },
];

export function AMPendingApproval() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pending Approval</h1>
            <p className="text-muted-foreground">Sessions awaiting authorization</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm">{PENDING_APPROVALS.length} Waiting</span>
          </div>
        </div>

        {/* Approval Cards */}
        <div className="space-y-4">
          {PENDING_APPROVALS.map((approval) => (
            <Card 
              key={approval.id}
              className={`border-l-4 ${
                approval.expiresIn <= 5 ? 'border-l-red-500' : 'border-l-amber-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{approval.sessionId}</span>
                      <Badge variant="secondary">{approval.type}</Badge>
                      <Badge variant="outline">{approval.scope}</Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> Requester
                        </p>
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

                    {/* Expiry Timer */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          Expires in
                        </span>
                        <span className={approval.expiresIn <= 5 ? 'text-red-500 font-medium' : ''}>
                          {approval.expiresIn} minutes
                        </span>
                      </div>
                      <Progress 
                        value={(approval.expiresIn / 15) * 100} 
                        className={`h-1 ${approval.expiresIn <= 5 ? '[&>div]:bg-red-500' : ''}`}
                      />
                    </div>

                    {/* Warning */}
                    {approval.expiresIn <= 5 && (
                      <div className="flex items-center gap-2 text-xs text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        Request will expire soon
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Extend
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">28</p>
              <p className="text-xs text-muted-foreground">Approved Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <X className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Rejected Today</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMPendingApproval;
