import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Headphones, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  TrendingUp,
  Phone,
  Mail,
  Star,
  BarChart3
} from 'lucide-react';

// Mock data
const supportMetrics = {
  openTickets: 47,
  avgResponseTime: '2.4h',
  resolvedToday: 34,
  satisfaction: '94%',
  slaCompliance: 89
};

const tickets = [
  { id: 'TKT-1234', subject: 'Unable to access dashboard', customer: 'John Smith', priority: 'high', status: 'open', channel: 'email', created: '10 min ago', assignee: 'Agent A' },
  { id: 'TKT-1233', subject: 'Billing inquiry - overcharge', customer: 'Sarah Johnson', priority: 'medium', status: 'in-progress', channel: 'chat', created: '25 min ago', assignee: 'Agent B' },
  { id: 'TKT-1232', subject: 'Feature request: export to PDF', customer: 'Mike Davis', priority: 'low', status: 'open', channel: 'email', created: '1 hour ago', assignee: 'Unassigned' },
  { id: 'TKT-1231', subject: 'Integration not syncing', customer: 'Emily Brown', priority: 'high', status: 'escalated', channel: 'phone', created: '2 hours ago', assignee: 'Agent C' },
  { id: 'TKT-1230', subject: 'Password reset not working', customer: 'Chris Wilson', priority: 'medium', status: 'in-progress', channel: 'chat', created: '3 hours ago', assignee: 'Agent A' },
  { id: 'TKT-1229', subject: 'API rate limit questions', customer: 'Tech Corp', priority: 'low', status: 'waiting', channel: 'email', created: '4 hours ago', assignee: 'Agent D' }
];

const agentPerformance = [
  { name: 'Agent A', tickets: 12, resolved: 10, avgTime: '1.8h', satisfaction: 96 },
  { name: 'Agent B', tickets: 15, resolved: 13, avgTime: '2.1h', satisfaction: 94 },
  { name: 'Agent C', tickets: 8, resolved: 6, avgTime: '2.5h', satisfaction: 92 },
  { name: 'Agent D', tickets: 10, resolved: 8, avgTime: '1.5h', satisfaction: 98 }
];

const recentActivity = [
  { action: 'Ticket resolved', ticket: 'TKT-1228', agent: 'Agent B', time: '5 min ago' },
  { action: 'New ticket created', ticket: 'TKT-1234', agent: 'System', time: '10 min ago' },
  { action: 'Ticket escalated', ticket: 'TKT-1231', agent: 'Agent C', time: '15 min ago' },
  { action: 'Customer replied', ticket: 'TKT-1230', agent: 'Chris Wilson', time: '20 min ago' },
  { action: 'SLA warning', ticket: 'TKT-1225', agent: 'System', time: '30 min ago' }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-green-500/20 text-green-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-blue-500/20 text-blue-400';
    case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
    case 'escalated': return 'bg-red-500/20 text-red-400';
    case 'waiting': return 'bg-purple-500/20 text-purple-400';
    case 'resolved': return 'bg-green-500/20 text-green-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'email': return <Mail className="h-3 w-3" />;
    case 'chat': return <MessageSquare className="h-3 w-3" />;
    case 'phone': return <Phone className="h-3 w-3" />;
    default: return <MessageSquare className="h-3 w-3" />;
  }
};

export function SupportDashboardScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Dashboard</h1>
          <p className="text-muted-foreground">Manage tickets & customer support</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supportMetrics.openTickets}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supportMetrics.avgResponseTime}</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supportMetrics.resolvedToday}</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supportMetrics.satisfaction}</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SLA Compliance</span>
                <span className="font-medium">{supportMetrics.slaCompliance}%</span>
              </div>
              <Progress value={supportMetrics.slaCompliance} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Ticket Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </div>
                      <p className="font-medium">{ticket.subject}</p>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getChannelIcon(ticket.channel)}
                      <span className="text-xs">{ticket.channel}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{ticket.customer}</span>
                      <span>→ {ticket.assignee}</span>
                    </div>
                    <span>{ticket.created}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agentPerformance.map((agent, index) => (
                  <div key={index} className="p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{agent.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span className="text-sm">{agent.satisfaction}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p>Tickets</p>
                        <p className="font-medium text-foreground">{agent.tickets}</p>
                      </div>
                      <div>
                        <p>Resolved</p>
                        <p className="font-medium text-green-400">{agent.resolved}</p>
                      </div>
                      <div>
                        <p>Avg Time</p>
                        <p className="font-medium text-foreground">{agent.avgTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.ticket} • {activity.agent}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
