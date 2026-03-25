import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import type { AMSection } from '../AMFullSidebar';
import {
  Inbox,
  Check,
  X,
  Clock,
  User,
  Shield,
  Edit,
} from 'lucide-react';

interface AMSessionRequestsProps {
  system: ReturnType<typeof useAssistManagerSystem>;
  onNavigate: (section: AMSection) => void;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

const getPriority = (scope: string[]) => {
  if (scope.includes('keyboard') || scope.includes('mouse')) return 'critical';
  if (scope.includes('file_transfer')) return 'high';
  return 'normal';
};

export function AMSessionRequests({ system, onNavigate }: AMSessionRequestsProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Session Requests</h1>
            <p className="text-muted-foreground">Incoming assist session requests</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {system.pendingSessions.length} Pending
          </Badge>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {system.pendingSessions.map((request) => {
            const priority = getPriority(request.permission_scope);
            return (
            <Card 
              key={request.id} 
              className={`border-l-4 ${
                priority === 'critical' ? 'border-l-red-500' :
                priority === 'high' ? 'border-l-amber-500' : 'border-l-blue-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{request.session_id}</span>
                      <Badge 
                        variant={
                          priority === 'critical' ? 'destructive' :
                          priority === 'high' ? 'default' : 'secondary'
                        }
                      >
                        {priority}
                      </Badge>
                      <Badge variant="outline">{request.assist_type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> From
                        </p>
                        <p className="font-mono">{maskId(request.target_user_id)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Shield className="h-3 w-3" /> Scope
                        </p>
                        <p>{request.permission_scope.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Duration
                        </p>
                        <p>{request.max_duration_minutes} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Requested</p>
                        <p>{new Date(request.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Purpose:</span> {request.purpose}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => system.approveSession.mutate({ session_id: request.session_id, decision: 'approved' })}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => system.approveSession.mutate({ session_id: request.session_id, decision: 'denied', reason: 'Rejected from Session Requests queue' })}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { system.setSelectedSessionId(request.session_id); onNavigate('live_assist'); }}>
                      <Edit className="h-4 w-4 mr-1" />
                      Inspect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );})}
        </div>

        {/* Flow Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {['Request Created', 'Manager Approval', 'Token Generated', 'Session Starts'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === 0 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-sm hidden md:block">{step}</span>
                  {i < 3 && <div className="w-8 h-0.5 bg-muted hidden md:block" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMSessionRequests;
