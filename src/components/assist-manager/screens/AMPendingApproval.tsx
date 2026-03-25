import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import type { AMSection } from '../AMFullSidebar';
import {
  Clock,
  Check,
  X,
  AlertTriangle,
  User,
  Timer,
} from 'lucide-react';

interface AMPendingApprovalProps {
  system: ReturnType<typeof useAssistManagerSystem>;
  onNavigate: (section: AMSection) => void;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

export function AMPendingApproval({ system, onNavigate }: AMPendingApprovalProps) {
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
            <span className="text-sm">{system.approvals.length} Waiting</span>
          </div>
        </div>

        {/* Approval Cards */}
        <div className="space-y-4">
          {system.approvals.map((approval) => {
            const session = approval.assist_manager_sessions;
            const expiresIn = Math.max(0, 15 - Math.floor((Date.now() - new Date(approval.created_at).getTime()) / 60000));
            return (
            <Card 
              key={approval.id}
              className={`border-l-4 ${
                expiresIn <= 5 ? 'border-l-red-500' : 'border-l-amber-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{session?.session_id || approval.session_id}</span>
                      <Badge variant="secondary">{session?.assist_type || 'assist'}</Badge>
                      <Badge variant="outline">{session?.permission_scope?.join(', ') || 'No scope'}</Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> Requester
                        </p>
                        <p className="font-mono">{maskId(approval.requester_user_id)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-mono">{maskId(approval.target_user_id)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Awaiting</p>
                        <p className="font-medium">Target Consent</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p>{new Date(approval.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Expiry Timer */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          Expires in
                        </span>
                        <span className={expiresIn <= 5 ? 'text-red-500 font-medium' : ''}>
                          {expiresIn} minutes
                        </span>
                      </div>
                      <Progress 
                        value={(expiresIn / 15) * 100} 
                        className={`h-1 ${expiresIn <= 5 ? '[&>div]:bg-red-500' : ''}`}
                      />
                    </div>

                    {expiresIn <= 5 && (
                      <div className="flex items-center gap-2 text-xs text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        Request will expire soon
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => session && system.approveSession.mutate({ session_id: session.session_id, decision: 'approved' })}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => session && system.approveSession.mutate({ session_id: session.session_id, decision: 'denied', reason: 'Rejected from Pending Approval queue' })}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { if (session) { system.setSelectedSessionId(session.session_id); onNavigate('live_assist'); } }}>
                      <Clock className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );})}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{system.approvals.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">{system.metrics.approvalsToday}</p>
              <p className="text-xs text-muted-foreground">Approved Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <X className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold">{system.metrics.deniedToday}</p>
              <p className="text-xs text-muted-foreground">Rejected Today</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMPendingApproval;
