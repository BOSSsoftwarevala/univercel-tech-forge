import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeadphonesIcon, MessageSquare, Clock, AlertTriangle, CheckCircle, Send, Plus, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tickets = [
  { 
    id: 'TKT-001', 
    subject: 'Demo system not loading', 
    priority: 'high', 
    status: 'in_progress',
    sla: '2h remaining',
    created: '3 hours ago'
  },
  { 
    id: 'TKT-002', 
    subject: 'Commission discrepancy', 
    priority: 'medium', 
    status: 'open',
    sla: '24h remaining',
    created: '1 day ago'
  },
  { 
    id: 'TKT-003', 
    subject: 'Reseller approval pending', 
    priority: 'low', 
    status: 'resolved',
    sla: 'Completed',
    created: '3 days ago'
  },
];

const chatMessages = [
  { id: 1, sender: 'support', message: 'Hello! How can I help you today?', time: '10:30 AM' },
  { id: 2, sender: 'user', message: 'I need help with a demo that is not working for my client.', time: '10:32 AM' },
  { id: 3, sender: 'support', message: 'I understand. Let me check the demo status. Which category is it?', time: '10:33 AM' },
];

export const EscalationSupport = () => {
  const [newMessage, setNewMessage] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Escalation & Support</h2>
          <p className="text-sm text-muted-foreground">Masked chat with SLA tracking</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ticket List */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">Active Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/30 ${
                  ticket.priority === 'high' ? 'border-l-4 border-l-neon-red bg-secondary/20' :
                  ticket.priority === 'medium' ? 'border-l-4 border-l-neon-orange bg-secondary/20' :
                  'border-border/30 bg-secondary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary">{ticket.id}</span>
                    <Badge variant={
                      ticket.status === 'resolved' ? 'default' :
                      ticket.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-2">{ticket.subject}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ticket.created}</span>
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${
                      ticket.sla.includes('2h') ? 'text-neon-red' : 'text-muted-foreground'
                    }`} />
                    <span className={ticket.sla.includes('2h') ? 'text-neon-red' : ''}>{ticket.sla}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Masked Chat */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="w-5 h-5 text-primary" />
              Support Chat (Masked)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto space-y-3 mb-4 p-3 rounded-lg bg-secondary/20">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary/20 text-foreground' 
                      : 'bg-secondary/50 text-foreground'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-secondary/30 border-border/30"
              />
              <Button className="bg-primary text-background">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Form */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground">Raise New Ticket to Super Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
              <Input
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief description of the issue"
                className="bg-secondary/30 border-border/30"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
              <Select value={ticketPriority} onValueChange={setTicketPriority}>
                <SelectTrigger className="bg-secondary/30 border-border/30">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Details</label>
              <Textarea
                placeholder="Provide detailed information about the issue..."
                className="bg-secondary/30 border-border/30 min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Submit Escalation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
