import React from 'react';
import { HeadphonesIcon, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AMSalesSupport: React.FC = () => {
  const tickets = [
    { id: 'T-001', subject: 'Demo not loading', customer: 'USR-***123', priority: 'high', status: 'open', time: '10 min ago' },
    { id: 'T-002', subject: 'Payment issue', customer: 'USR-***456', priority: 'high', status: 'in_progress', time: '30 min ago' },
    { id: 'T-003', subject: 'Feature request', customer: 'USR-***789', priority: 'low', status: 'open', time: '1 hour ago' },
    { id: 'T-004', subject: 'Account access', customer: 'USR-***012', priority: 'medium', status: 'resolved', time: '2 hours ago' },
  ];

  const salesStats = [
    { label: 'Demos Scheduled', value: 12, today: true },
    { label: 'Sales Calls', value: 28, today: true },
    { label: 'Conversions', value: 5, today: true },
    { label: 'Follow-ups Due', value: 8, today: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Sales & Support</h2>
        <p className="text-muted-foreground">Ticket queue and sales activity overview</p>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-4 gap-4">
        {salesStats.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <Badge variant="outline" className="mt-1 text-xs">Today</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Tickets */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5 text-blue-400" />
            Active Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Ticket ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Subject</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Priority</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-mono">{ticket.id}</td>
                    <td className="p-3 text-foreground">{ticket.subject}</td>
                    <td className="p-3 text-muted-foreground font-mono">{ticket.customer}</td>
                    <td className="p-3">
                      <Badge variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        ticket.status === 'open' ? 'secondary' :
                        ticket.status === 'in_progress' ? 'default' : 'outline'
                      }>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{ticket.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SLA Status */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            SLA Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">94%</p>
              <p className="text-sm text-muted-foreground">First Response</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-400">87%</p>
              <p className="text-sm text-muted-foreground">Resolution Time</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">4.5/5</p>
              <p className="text-sm text-muted-foreground">CSAT Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMSalesSupport;
