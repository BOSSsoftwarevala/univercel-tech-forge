/**
 * PENDING APPROVAL
 * Boss / Manager approval required
 * NO APPROVAL = NO CHAT ACCESS
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

const pendingRequests = [
  { id: 'INQ-101', user: 'USER-A1B2', type: 'Support', priority: 'normal', subject: 'Account access issue', time: '5 min ago' },
  { id: 'INQ-102', user: 'USER-C3D4', type: 'Dev', priority: 'urgent', subject: 'Critical bug report', time: '10 min ago' },
  { id: 'INQ-103', user: 'USER-E5F6', type: 'Sales', priority: 'normal', subject: 'Pricing clarification', time: '15 min ago' },
  { id: 'INQ-104', user: 'USER-G7H8', type: 'Legal', priority: 'normal', subject: 'Contract query', time: '20 min ago' },
  { id: 'INQ-105', user: 'USER-I9J0', type: 'Server', priority: 'urgent', subject: 'Server downtime', time: '25 min ago' },
];

export const ICBPendingApproval: React.FC = () => {
  const handleApprove = (id: string) => {
    toast.success(`Inquiry ${id} approved - Chat session created`);
  };

  const handleReject = (id: string) => {
    toast.error(`Inquiry ${id} rejected`);
  };

  const handleMarkUrgent = (id: string) => {
    toast.warning(`Inquiry ${id} marked as urgent`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Approval</h1>
        <p className="text-muted-foreground">Review and approve chat requests</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Approval Queue</CardTitle>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {pendingRequests.length} Pending
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div 
                key={request.id}
                className={`p-4 rounded-lg border ${
                  request.priority === 'urgent' ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{request.id}</span>
                    {request.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        URGENT
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{request.time}</span>
                </div>
                
                <div className="mb-3">
                  <p className="font-medium">{request.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{request.user}</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">{request.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleReject(request.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  {request.priority !== 'urgent' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleMarkUrgent(request.id)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Mark Urgent
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBPendingApproval;
