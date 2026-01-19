/**
 * RESELLER SUPPORT (RESELLER ONLY)
 * Raise Ticket, Chat with AI Support, Upload Screenshot, Track Resolution
 * NO internal chat access
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Ticket,
  MessageSquare,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Image,
  Bot,
} from 'lucide-react';
import { toast } from 'sonner';

const existingTickets = [
  {
    id: 'TKT-001',
    subject: 'Payment not reflecting',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-18',
    lastUpdate: '2024-01-18',
  },
  {
    id: 'TKT-002',
    subject: 'Commission calculation issue',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-15',
    lastUpdate: '2024-01-17',
  },
  {
    id: 'TKT-003',
    subject: 'Product demo access',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-01-10',
    lastUpdate: '2024-01-12',
  },
];

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export function RSSupportScreen() {
  const [activeView, setActiveView] = useState<'tickets' | 'chat'>('tickets');
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('medium');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'ai', text: 'Hello! I\'m your support assistant. How can I help you today?', time: '10:00 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleCreateTicket = () => {
    if (!ticketSubject || !ticketDescription) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success('Ticket created successfully!');
    setNewTicketOpen(false);
    setTicketSubject('');
    setTicketDescription('');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response with delay (human-like)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const aiResponses = [
      'I understand your concern. Let me look into this for you...',
      'Thank you for sharing that. I\'m checking our records now.',
      'I can help you with that. Could you provide more details?',
      'I\'ve found some information that might help. Let me explain...',
      'That\'s a valid question. Here\'s what I can tell you...',
    ];

    const aiMessage: ChatMessage = {
      id: chatMessages.length + 2,
      sender: 'ai',
      text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400';
      case 'in-progress':
        return 'bg-amber-500/20 text-amber-400';
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Center</h1>
          <p className="text-sm text-slate-400">Get help from our support team</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'tickets' ? 'default' : 'outline'}
            onClick={() => setActiveView('tickets')}
            className={activeView === 'tickets' ? 'bg-emerald-600' : 'border-slate-700 text-slate-300'}
          >
            <Ticket className="h-4 w-4 mr-2" />
            Tickets
          </Button>
          <Button
            variant={activeView === 'chat' ? 'default' : 'outline'}
            onClick={() => setActiveView('chat')}
            className={activeView === 'chat' ? 'bg-emerald-600' : 'border-slate-700 text-slate-300'}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Chat
          </Button>
        </div>
      </div>

      {/* Tickets View */}
      {activeView === 'tickets' && (
        <div className="space-y-4">
          {/* Create Ticket Button */}
          <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Ticket className="h-4 w-4 mr-2" />
                Raise New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                  <Input
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of issue"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Priority</label>
                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Description</label>
                  <Textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Detailed description of your issue..."
                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  />
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Screenshot
                </Button>
              </div>
              <DialogFooter>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateTicket}>
                  Submit Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Tickets List */}
          <div className="space-y-3">
            {existingTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{ticket.id}</p>
                          <Badge className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                          <Badge className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                        <p className="text-slate-300">{ticket.subject}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Created: {ticket.createdAt} • Last update: {ticket.lastUpdate}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat View */}
      {activeView === 'chat' && (
        <Card className="bg-slate-900/50 border-slate-800 h-[600px] flex flex-col">
          <CardHeader className="border-b border-slate-800 py-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              AI Support Assistant
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs ml-2">Online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="border-slate-700 text-slate-400">
                  <Image className="h-4 w-4" />
                </Button>
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
