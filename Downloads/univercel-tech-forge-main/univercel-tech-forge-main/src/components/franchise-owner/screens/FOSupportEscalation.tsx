/**
 * FRANCHISE OWNER - SUPPORT & ESCALATION
 * Priority Tickets, AI Pre-Analysis, SLA Tracker
 */

import React, { useState } from 'react';
import { 
  HeadphonesIcon, AlertTriangle, Clock, CheckCircle, MessageSquare,
  Sparkles, User, Send, Timer, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const tickets = [
  { 
    id: 'TKT-2024-001', 
    subject: 'Domain DNS not propagating',
    priority: 'High',
    status: 'In Progress',
    aiAnalysis: 'DNS propagation delay detected. Estimated resolution: 2-4 hours.',
    created: 'Jan 18, 2024 10:30 AM',
    slaRemaining: '4h 30m',
    assignee: 'Tech Support'
  },
  { 
    id: 'TKT-2024-002', 
    subject: 'Invoice generation error',
    priority: 'Medium',
    status: 'Open',
    aiAnalysis: 'GST calculation mismatch. Requires manual review.',
    created: 'Jan 18, 2024 09:15 AM',
    slaRemaining: '7h 45m',
    assignee: 'Finance Support'
  },
  { 
    id: 'TKT-2024-003', 
    subject: 'SSL certificate renewal failed',
    priority: 'Critical',
    status: 'Escalated',
    aiAnalysis: 'Certificate authority validation pending. Escalated to senior team.',
    created: 'Jan 17, 2024 04:45 PM',
    slaRemaining: '1h 15m',
    assignee: 'Senior Tech'
  },
  { 
    id: 'TKT-2024-004', 
    subject: 'Software customization request',
    priority: 'Low',
    status: 'Resolved',
    aiAnalysis: 'Request fulfilled. Feature added as per specifications.',
    created: 'Jan 16, 2024 02:30 PM',
    slaRemaining: 'Completed',
    assignee: 'Dev Team'
  },
];

const slaStats = [
  { metric: 'Response Time', target: '< 30 min', actual: '18 min', performance: 92 },
  { metric: 'Resolution Time', target: '< 24 hrs', actual: '16 hrs', performance: 88 },
  { metric: 'First Contact Resolution', target: '> 70%', actual: '78%', performance: 95 },
  { metric: 'Customer Satisfaction', target: '> 90%', actual: '94%', performance: 98 },
];

export function FOSupportEscalation() {
  const { toast } = useToast();
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('');

  const handleCreateTicket = () => {
    if (!ticketSubject || !ticketDescription || !ticketPriority) {
      toast({ title: "Fields Required", description: "Please complete all fields to continue" });
      return;
    }
    toast({
      title: "Ticket Created",
      description: `Ticket TKT-2024-${Math.floor(Math.random() * 1000)} has been created.`,
    });
    setNewTicketOpen(false);
    setTicketSubject('');
    setTicketDescription('');
    setTicketPriority('');
  };

  const handleEscalate = (ticketId: string) => {
    toast({
      title: "Ticket Escalated",
      description: `${ticketId} has been escalated to human support.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
            Support & Escalation
          </h1>
          <p className="text-muted-foreground">Priority Tickets • AI Pre-Analysis • SLA Tracker</p>
        </div>
        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5 text-primary" />
                Create Support Ticket
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Brief description of the issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={ticketPriority} onValueChange={setTicketPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Detailed description of the issue..."
                  className="min-h-[120px]"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateTicket} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Open Tickets</span>
            </div>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Escalated</span>
            </div>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Resolved</span>
            </div>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
      </div>

      {/* SLA Tracker */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            SLA Performance Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slaStats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{stat.metric}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{stat.actual}</span>
                  <Badge variant="outline">{stat.target}</Badge>
                </div>
                <Progress value={stat.performance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ticket List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 bg-background/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ticket.priority === 'Critical' ? 'bg-red-500/10' :
                      ticket.priority === 'High' ? 'bg-amber-500/10' :
                      ticket.priority === 'Medium' ? 'bg-blue-500/10' : 'bg-slate-500/10'
                    }`}>
                      <HeadphonesIcon className={`h-5 w-5 ${
                        ticket.priority === 'Critical' ? 'text-red-500' :
                        ticket.priority === 'High' ? 'text-amber-500' :
                        ticket.priority === 'Medium' ? 'text-blue-500' : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">{ticket.id} • {ticket.created}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      ticket.priority === 'Critical' ? 'destructive' :
                      ticket.priority === 'High' ? 'default' : 'secondary'
                    }>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={
                      ticket.status === 'Resolved' ? 'default' :
                      ticket.status === 'Escalated' ? 'destructive' : 'outline'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="p-3 bg-primary/5 rounded-lg mb-3 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">AI Pre-Analysis</p>
                    <p className="text-sm text-muted-foreground">{ticket.aiAnalysis}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{ticket.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className={`h-4 w-4 ${
                        ticket.slaRemaining === 'Completed' ? 'text-emerald-500' :
                        ticket.slaRemaining.includes('1h') ? 'text-red-500' : 'text-amber-500'
                      }`} />
                      <span className={
                        ticket.slaRemaining === 'Completed' ? 'text-emerald-500' :
                        ticket.slaRemaining.includes('1h') ? 'text-red-500' : 'text-amber-500'
                      }>
                        SLA: {ticket.slaRemaining}
                      </span>
                    </div>
                  </div>
                  {ticket.status !== 'Resolved' && ticket.status !== 'Escalated' && (
                    <Button size="sm" variant="outline" onClick={() => handleEscalate(ticket.id)}>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Escalate to Human
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-primary/10 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <div>
              <h3 className="font-semibold">AI First Support</h3>
              <p className="text-sm text-muted-foreground">
                All tickets are pre-analyzed by AI. Escalate to human support only when needed.
                No external chat. No data leak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
