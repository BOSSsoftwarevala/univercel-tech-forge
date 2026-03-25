/**
 * SUPPORT REQUESTS
 * New • In Progress • Waiting User • Resolved • Escalated
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Handshake, ArrowUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockTickets = [
  { id: 'TKT-001', type: 'Technical', severity: 'High', product: 'Enterprise Suite', timeOpen: '2 hours', status: 'new' },
  { id: 'TKT-002', type: 'Billing', severity: 'Medium', product: 'Business Pro', timeOpen: '1 day', status: 'in_progress' },
  { id: 'TKT-003', type: 'Feature', severity: 'Low', product: 'Agency Pack', timeOpen: '3 days', status: 'waiting_user' },
  { id: 'TKT-004', type: 'Bug', severity: 'Critical', product: 'Developer Kit', timeOpen: '5 hours', status: 'escalated' },
  { id: 'TKT-005', type: 'Technical', severity: 'Medium', product: 'Enterprise Suite', timeOpen: '2 days', status: 'resolved' },
];

export const PROSupportRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTickets = mockTickets.filter(ticket => {
    if (activeTab === 'all') return true;
    return ticket.status === activeTab;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-500';
      case 'High': return 'bg-orange-500/20 text-orange-500';
      case 'Medium': return 'bg-amber-500/20 text-amber-500';
      case 'Low': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Requests</h1>
        <p className="text-muted-foreground">Manage pro user support tickets</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="waiting_user">Waiting User</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTickets.map((ticket, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-foreground">{ticket.id}</span>
                      <Badge variant="outline">{ticket.type}</Badge>
                      <Badge className={getSeverityColor(ticket.severity)}>{ticket.severity}</Badge>
                      <span className="text-sm text-foreground">{ticket.product}</span>
                      <span className="text-xs text-muted-foreground">Open: {ticket.timeOpen}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.info('AI assigned')}>
                        <Bot className="h-4 w-4 mr-1" />
                        Assign AI
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info('Assist assigned')}>
                        <Handshake className="h-4 w-4 mr-1" />
                        Assign Assist
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.warning('Escalated')}>
                        <ArrowUp className="h-4 w-4 mr-1" />
                        Escalate
                      </Button>
                      <Button size="sm" onClick={() => toast.success('Ticket closed')}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Close
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PROSupportRequests;
