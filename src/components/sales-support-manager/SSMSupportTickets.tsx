import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Clock,
  User,
  AlertTriangle,
  MessageSquare,
  Shield,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'escalated';

interface SupportTicket {
  id: string;
  ticketId: string;
  customerName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  slaDeadline: string;
  assignedTo?: string;
  responseCount: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketId: 'TKT-2024-8901',
    customerName: 'Vikram Industries',
    subject: 'Payment gateway integration failing',
    category: 'Technical',
    priority: 'critical',
    status: 'new',
    createdAt: '2024-01-15T08:00:00Z',
    slaDeadline: '2024-01-15T10:00:00Z',
    responseCount: 0
  },
  {
    id: '2',
    ticketId: 'TKT-2024-8902',
    customerName: 'Sunrise Exports',
    subject: 'Invoice discrepancy query',
    category: 'Billing',
    priority: 'high',
    status: 'assigned',
    createdAt: '2024-01-15T07:30:00Z',
    slaDeadline: '2024-01-15T11:30:00Z',
    assignedTo: 'VL-SA-001',
    responseCount: 2
  },
  {
    id: '3',
    ticketId: 'TKT-2024-8903',
    customerName: 'Metro Solutions',
    subject: 'Feature request - bulk export',
    category: 'Feature',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-01-14T16:00:00Z',
    slaDeadline: '2024-01-15T16:00:00Z',
    assignedTo: 'VL-SA-002',
    responseCount: 4
  },
  {
    id: '4',
    ticketId: 'TKT-2024-8904',
    customerName: 'Global Tech',
    subject: 'Account access issue',
    category: 'Account',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-14T10:00:00Z',
    slaDeadline: '2024-01-15T10:00:00Z',
    assignedTo: 'VL-SA-001',
    responseCount: 3
  }
];

const supportAgents = [
  { id: 'VL-SA-001', name: 'Support Agent 1', activeTickets: 4 },
  { id: 'VL-SA-002', name: 'Support Agent 2', activeTickets: 3 },
  { id: 'VL-SA-003', name: 'Support Agent 3', activeTickets: 2 },
];

export const SSMSupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [slaTimers, setSlaTimers] = useState<Record<string, number>>({});

  // SLA Timer simulation
  useEffect(() => {
    const calculateSLA = () => {
      const timers: Record<string, number> = {};
      tickets.forEach(ticket => {
        const now = new Date().getTime();
        const deadline = new Date(ticket.slaDeadline).getTime();
        timers[ticket.id] = Math.max(0, deadline - now);
      });
      setSlaTimers(timers);
    };

    calculateSLA();
    const interval = setInterval(calculateSLA, 1000);
    return () => clearInterval(interval);
  }, [tickets]);

  const handleAssignTicket = (ticketId: string, agentId: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'assigned' as TicketStatus, assignedTo: agentId }
          : ticket
      )
    );
    toast.success(`Ticket assigned to ${agentId}`);
    setSelectedTicket(null);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const colors = {
      critical: 'bg-red-500 text-white animate-pulse',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    };
    return <Badge className={colors[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: TicketStatus) => {
    const colors = {
      new: 'bg-blue-500/10 text-blue-500',
      assigned: 'bg-purple-500/10 text-purple-500',
      in_progress: 'bg-yellow-500/10 text-yellow-500',
      resolved: 'bg-green-500/10 text-green-500',
      escalated: 'bg-red-500/10 text-red-500'
    };
    return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const formatSLATime = (ms: number) => {
    if (ms <= 0) return 'BREACHED';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSLAColor = (ms: number) => {
    if (ms <= 0) return 'text-red-500 bg-red-500/10';
    if (ms < 1000 * 60 * 60) return 'text-red-500 bg-red-500/10'; // < 1 hour
    if (ms < 1000 * 60 * 60 * 4) return 'text-yellow-500 bg-yellow-500/10'; // < 4 hours
    return 'text-green-500 bg-green-500/10';
  };

  const activeTickets = tickets.filter(t => t.status !== 'resolved');

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Headphones className="h-5 w-5 text-primary" />
            Support Tickets Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <Shield className="h-3 w-3 mr-1" />
              Delete BLOCKED
            </Badge>
            <Badge variant="outline">
              {activeTickets.length} Active
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          One ticket → One agent • SLA timers are server-based • Auto-escalation on breach
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {tickets.filter(t => t.status !== 'resolved').map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 bg-background ${
                slaTimers[ticket.id] <= 0 ? 'border-red-500' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-primary">{ticket.ticketId}</span>
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                  <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                  <p className="text-sm text-muted-foreground">{ticket.customerName} • {ticket.category}</p>
                </div>
                <Badge className={`${getSLAColor(slaTimers[ticket.id] || 0)} font-mono`}>
                  <Clock className="h-3 w-3 mr-1" />
                  SLA: {formatSLATime(slaTimers[ticket.id] || 0)}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.responseCount} responses
                  </span>
                  {ticket.assignedTo && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ticket.assignedTo}
                    </span>
                  )}
                </div>
              </div>

              {ticket.status === 'new' && (
                selectedTicket === ticket.id ? (
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-medium text-foreground mb-2">Assign to Support Agent:</p>
                    <div className="flex flex-wrap gap-2">
                      {supportAgents.map((agent) => (
                        <Button
                          key={agent.id}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket.id, agent.id)}
                          className="flex items-center gap-2"
                        >
                          <User className="h-3 w-3" />
                          {agent.id}
                          <Badge variant="secondary" className="text-xs">
                            {agent.activeTickets} tickets
                          </Badge>
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedTicket(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Assign Ticket
                  </Button>
                )
              )}
            </motion.div>
          ))}
        </div>

        {activeTickets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Headphones className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No active support tickets</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
            <p className="text-xs text-orange-500">
              SLA timers are server-based and cannot be modified. 
              Tickets nearing breach will auto-escalate. Delete is permanently blocked.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
