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
import { useSupportTickets } from '@/hooks/useSupportTickets';

interface DBTicket {
  ticket_id: string;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'in_progress' | 'resolved' | 'escalated';
  created_at: string;
  sla_deadline: string;
  assigned_to?: string;
  response_count: number;
}

export const SSMSupportTickets: React.FC = () => {
  const { tickets, loading, fetchTickets, assignTicket } = useSupportTickets();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [slaTimers, setSlaTimers] = useState<Record<string, number>>({});

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // SLA Timer calculation
  useEffect(() => {
    const calculateSLA = () => {
      const timers: Record<string, number> = {};
      tickets.forEach(ticket => {
        const now = new Date().getTime();
        const deadline = new Date(ticket.sla_deadline).getTime();
        timers[ticket.ticket_id] = Math.max(0, deadline - now);
      });
      setSlaTimers(timers);
    };

    calculateSLA();
    const interval = setInterval(calculateSLA, 1000);
    return () => clearInterval(interval);
  }, [tickets]);

  const handleAssignTicket = async (ticketId: string, agentId: string) => {
    try {
      await assignTicket(ticketId, agentId);
      await fetchTickets();
      toast.success(`Ticket assigned to ${agentId}`);
      setSelectedTicket(null);
    } catch (err) {
      // Error already shown in hook
    }
  };

  const getPriorityBadge = (priority: 'critical' | 'high' | 'medium' | 'low') => {
    const colors = {
      critical: 'bg-red-500 text-white animate-pulse',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    };
    return <Badge className={colors[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-500',
      assigned: 'bg-purple-500/10 text-purple-500',
      in_progress: 'bg-yellow-500/10 text-yellow-500',
      resolved: 'bg-green-500/10 text-green-500',
      escalated: 'bg-red-500/10 text-red-500'
    };
    return <Badge className={colors[status] || colors.new}>{status.replace('_', ' ')}</Badge>;
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading tickets...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.filter(t => t.status !== 'resolved').map((ticket) => (
              <motion.div
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 bg-background ${
                  slaTimers[ticket.ticket_id] <= 0 ? 'border-red-500' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">{ticket.ticket_id}</span>
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground">{ticket.category}</p>
                  </div>
                  <Badge className={`${getSLAColor(slaTimers[ticket.ticket_id] || 0)} font-mono`}>
                    <Clock className="h-3 w-3 mr-1" />
                    SLA: {formatSLATime(slaTimers[ticket.ticket_id] || 0)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.response_count} responses
                    </span>
                    {ticket.assigned_to && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.assigned_to}
                      </span>
                    )}
                  </div>
                </div>

                {ticket.status === 'new' && (
                  selectedTicket === ticket.ticket_id ? (
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-medium text-foreground mb-2">Assign to Support Agent:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket.ticket_id, 'agent-001')}
                          className="flex items-center gap-2"
                        >
                          <User className="h-3 w-3" />
                          agent-001
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket.ticket_id, 'agent-002')}
                          className="flex items-center gap-2"
                        >
                          <User className="h-3 w-3" />
                          agent-002
                        </Button>
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
                      onClick={() => setSelectedTicket(ticket.ticket_id)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Assign Ticket
                    </Button>
                  )
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && activeTickets.length === 0 && (
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
