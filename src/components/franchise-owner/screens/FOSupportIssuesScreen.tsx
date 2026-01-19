/**
 * SUPPORT & ISSUES SCREEN
 * My Tickets, Technical/Billing, Create/Track
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Headphones,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Wrench,
  CreditCard,
  Eye,
} from 'lucide-react';

const tickets = [
  {
    id: 'TKT-001',
    subject: 'Order deployment delay',
    type: 'technical',
    status: 'open',
    priority: 'high',
    created: '2024-01-15',
    lastUpdate: '2 hours ago',
  },
  {
    id: 'TKT-002',
    subject: 'Invoice discrepancy',
    type: 'billing',
    status: 'in_progress',
    priority: 'medium',
    created: '2024-01-14',
    lastUpdate: '1 day ago',
  },
  {
    id: 'TKT-003',
    subject: 'Feature request for CRM',
    type: 'technical',
    status: 'resolved',
    priority: 'low',
    created: '2024-01-10',
    lastUpdate: '3 days ago',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500/20 text-blue-400';
    case 'in_progress':
      return 'bg-orange-500/20 text-orange-400';
    case 'resolved':
      return 'bg-emerald-500/20 text-emerald-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 text-red-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'low':
      return 'bg-emerald-500/20 text-emerald-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function FOSupportIssuesScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support & Issues</h1>
          <p className="text-muted-foreground">Create and track support tickets</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Headphones className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
              <p className="text-xl font-bold">15</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-xl font-bold">10</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        ticket.type === 'technical' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                      }`}
                    >
                      {ticket.type === 'technical' ? (
                        <Wrench className="h-5 w-5 text-purple-400" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{ticket.id}</span>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </div>
                      <p className="font-semibold">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {ticket.created} • Last update: {ticket.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          {tickets
            .filter((t) => t.type === 'technical')
            .map((ticket) => (
              <Card key={ticket.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{ticket.id}</span>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                        <p className="font-semibold">{ticket.subject}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          {tickets
            .filter((t) => t.type === 'billing')
            .map((ticket) => (
              <Card key={ticket.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{ticket.id}</span>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                        <p className="font-semibold">{ticket.subject}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOSupportIssuesScreen;
