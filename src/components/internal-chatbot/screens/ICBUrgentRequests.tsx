/**
 * URGENT REQUESTS
 * Double approval required
 * Timer visible • High alert badge
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, XCircle, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

const urgentRequests = [
  { 
    id: 'URG-001', 
    user: 'USER-A1B2', 
    subject: 'Critical server issue', 
    time: '5:00', 
    firstApproval: true,
    secondApproval: false 
  },
  { 
    id: 'URG-002', 
    user: 'USER-C3D4', 
    subject: 'Payment gateway down', 
    time: '3:45', 
    firstApproval: false,
    secondApproval: false 
  },
  { 
    id: 'URG-003', 
    user: 'USER-E5F6', 
    subject: 'Data breach alert', 
    time: '8:20', 
    firstApproval: true,
    secondApproval: false 
  },
];

export const ICBUrgentRequests: React.FC = () => {
  const handleApprove = (id: string) => {
    toast.success(`Urgent request ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.error(`Urgent request ${id} rejected`);
  };

  const handleDowngrade = (id: string) => {
    toast.info(`Request ${id} downgraded to normal priority`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Urgent Requests</h1>
        <p className="text-muted-foreground">High priority requests requiring double approval</p>
      </div>

      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Urgent Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentRequests.map((request) => (
              <div 
                key={request.id}
                className="p-4 bg-background border border-red-500/30 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">{request.id}</span>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        URGENT
                      </Badge>
                    </div>
                    <p className="font-medium">{request.subject}</p>
                    <p className="text-xs text-muted-foreground">{request.user}</p>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono font-bold">{request.time}</span>
                  </div>
                </div>

                {/* Approval Progress */}
                <div className="flex items-center gap-4 mb-4 p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${request.firstApproval ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    <span className="text-xs">1st Approval</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${request.secondApproval ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    <span className="text-xs">2nd Approval</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Urgent
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDowngrade(request.id)}
                  >
                    <ArrowDown className="h-4 w-4 mr-1" />
                    Downgrade
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleReject(request.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
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

export default ICBUrgentRequests;
