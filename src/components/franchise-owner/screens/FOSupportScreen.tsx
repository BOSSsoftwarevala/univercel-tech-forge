import React from 'react';
import { HeadphonesIcon, CheckCircle, Clock, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tickets = [
  { id: 'TKT-001', subject: 'Payment Issue', priority: 'High', sla: '2 hours', status: 'Open', created: '1 hour ago' },
  { id: 'TKT-002', subject: 'Lead Assignment Query', priority: 'Medium', sla: '4 hours', status: 'Open', created: '3 hours ago' },
  { id: 'TKT-003', subject: 'Report Access', priority: 'Low', sla: '24 hours', status: 'Open', created: '5 hours ago' },
  { id: 'TKT-004', subject: 'Staff Onboarding', priority: 'Medium', sla: 'Resolved', status: 'Closed', created: '1 day ago' },
  { id: 'TKT-005', subject: 'Billing Question', priority: 'High', sla: 'Resolved', status: 'Closed', created: '2 days ago' },
];

export function FOSupportScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
            Customer Support
          </h1>
          <p className="text-muted-foreground">Open Tickets • Closed Tickets • Priority • SLA</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Open Tickets</span>
            </div>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Closed Tickets</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">High Priority</span>
            </div>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Avg Response</span>
            </div>
            <p className="text-2xl font-bold">2.5h</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HeadphonesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">{ticket.id} • {ticket.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    ticket.priority === 'High' ? 'destructive' :
                    ticket.priority === 'Medium' ? 'default' : 'secondary'
                  }>
                    {ticket.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">SLA: {ticket.sla}</span>
                  <Badge variant={ticket.status === 'Open' ? 'outline' : 'default'}>
                    {ticket.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {ticket.status === 'Open' && (
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
