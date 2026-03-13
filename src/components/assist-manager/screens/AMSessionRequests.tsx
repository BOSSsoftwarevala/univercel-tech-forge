/**
 * SESSION REQUESTS - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Inbox, Check, X, Clock, User, Shield, Edit } from 'lucide-react';

interface RequestData {
  id: string;
  from: string;
  type: string;
  purpose: string;
  scope: string;
  duration: string;
  created: string;
  priority: 'critical' | 'high' | 'normal';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
}

const INITIAL_REQUESTS: RequestData[] = [
  { id: 'REQ-001', from: 'USR-****78', type: 'Support', purpose: 'Software installation assistance', scope: 'View Only', duration: '30 min', created: '2 min ago', priority: 'high', status: 'pending' },
  { id: 'REQ-002', from: 'USR-****34', type: 'Dev', purpose: 'Debug production issue', scope: 'Control (Limited)', duration: '1 hour', created: '5 min ago', priority: 'critical', status: 'pending' },
  { id: 'REQ-003', from: 'USR-****91', type: 'Franchise', purpose: 'Configuration review', scope: 'View Only', duration: '15 min', created: '12 min ago', priority: 'normal', status: 'pending' },
  { id: 'REQ-004', from: 'USR-****56', type: 'Sales', purpose: 'Demo walkthrough', scope: 'View Only', duration: '45 min', created: '18 min ago', priority: 'normal', status: 'pending' },
];

export function AMSessionRequests() {
  const [requests, setRequests] = useState<RequestData[]>(INITIAL_REQUESTS);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    toast.success(`Request ${id} approved`, { description: 'Session token generated • User notified' });
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    toast.error(`Request ${id} rejected`, { description: 'User will be notified of rejection' });
  };

  const handleModify = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'modified', scope: 'View Only', duration: '15 min' } : r));
    toast.info(`Request ${id} modified`, { description: 'Scope reduced to View Only • 15 min limit applied' });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Session Requests</h1>
            <p className="text-muted-foreground">Incoming assist session requests</p>
          </div>
          <Badge variant="secondary" className="text-sm">{pendingCount} Pending</Badge>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className={`border-l-4 ${
              request.status !== 'pending' ? 'border-l-muted opacity-60' :
              request.priority === 'critical' ? 'border-l-red-500' :
              request.priority === 'high' ? 'border-l-amber-500' : 'border-l-blue-500'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{request.id}</span>
                      <Badge variant={request.priority === 'critical' ? 'destructive' : request.priority === 'high' ? 'default' : 'secondary'}>
                        {request.priority}
                      </Badge>
                      <Badge variant="outline">{request.type}</Badge>
                      {request.status !== 'pending' && (
                        <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {request.status}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> From</p>
                        <p className="font-mono">{request.from}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Scope</p>
                        <p>{request.scope}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</p>
                        <p>{request.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Requested</p>
                        <p>{request.created}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Purpose:</span> {request.purpose}
                    </p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(request.id)}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleModify(request.id)}>
                        <Edit className="h-4 w-4 mr-1" /> Modify
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Approval Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {['Request Created', 'Manager Approval', 'Token Generated', 'Session Starts'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
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
