import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeadphonesIcon, Plus, Clock, CheckCircle, AlertTriangle, 
  MessageSquare, Paperclip, Send, X, ChevronRight, Filter,
  Loader2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Commission not credited for last campaign',
    category: 'payout',
    priority: 'high',
    status: 'in_progress',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:20:00Z',
    escalation_level: 1,
    messages: 3
  },
  {
    id: 'TKT-002',
    subject: 'Referral link not tracking clicks',
    category: 'technical',
    priority: 'medium',
    status: 'open',
    created_at: '2024-01-14T08:15:00Z',
    updated_at: '2024-01-14T08:15:00Z',
    escalation_level: 0,
    messages: 1
  },
  {
    id: 'TKT-003',
    subject: 'Request for tier upgrade review',
    category: 'account',
    priority: 'low',
    status: 'resolved',
    created_at: '2024-01-10T16:45:00Z',
    updated_at: '2024-01-12T09:30:00Z',
    escalation_level: 0,
    messages: 5
  },
  {
    id: 'TKT-004',
    subject: 'Fraud flag dispute - legitimate traffic',
    category: 'fraud_dispute',
    priority: 'urgent',
    status: 'waiting_response',
    created_at: '2024-01-13T11:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    escalation_level: 2,
    messages: 8
  }
];

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  waiting_response: { label: 'Waiting', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  closed: { label: 'Closed', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
};

const priorityConfig = {
  low: { label: 'Low', color: 'text-slate-400' },
  medium: { label: 'Medium', color: 'text-blue-400' },
  high: { label: 'High', color: 'text-orange-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' }
};

const InfluencerSupportTickets = () => {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  const filteredTickets = filterStatus === 'all' 
    ? mockTickets 
    : mockTickets.filter(t => t.status === filterStatus);

  const handleSubmitTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Support ticket submitted successfully!", {
      description: `Ticket ID: TKT-${Date.now().toString(36).toUpperCase()}`
    });
    setShowNewTicket(false);
    setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <HeadphonesIcon className="w-6 h-6 text-violet-400" />
            </div>
            Support & Escalation
          </h2>
          <p className="text-slate-400 mt-1">Submit tickets and track resolution progress</p>
        </div>
        <Button 
          onClick={() => setShowNewTicket(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: 2, icon: AlertCircle, color: 'blue' },
          { label: 'In Progress', value: 1, icon: Loader2, color: 'yellow' },
          { label: 'Resolved', value: 15, icon: CheckCircle, color: 'emerald' },
          { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'violet' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-slate-400" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="waiting_response">Waiting Response</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              setSelectedTicket(ticket.id);
              toast.info(`Viewing ticket ${ticket.id}`, {
                description: ticket.subject
              });
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTicket === ticket.id
                ? 'bg-violet-500/10 border-violet-500/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
                  <Badge className={statusConfig[ticket.status as keyof typeof statusConfig].color}>
                    {statusConfig[ticket.status as keyof typeof statusConfig].label}
                  </Badge>
                  {ticket.escalation_level > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Escalated L{ticket.escalation_level}
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium text-white mb-1">{ticket.subject}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className={priorityConfig[ticket.priority as keyof typeof priorityConfig].color}>
                    {priorityConfig[ticket.priority as keyof typeof priorityConfig].label} Priority
                  </span>
                  <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {ticket.messages} messages
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs">
                  {new Date(ticket.updated_at).toLocaleDateString()}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewTicket(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 rounded-2xl border border-violet-500/20 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create Support Ticket</h3>
                  <button onClick={() => setShowNewTicket(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Category</label>
                    <Select 
                      value={newTicket.category} 
                      onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="payout">Payout Issue</SelectItem>
                        <SelectItem value="campaign">Campaign</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="fraud_dispute">Fraud Dispute</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Priority</label>
                    <Select 
                      value={newTicket.priority} 
                      onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Description</label>
                  <Textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Paperclip className="w-4 h-4" />
                  <span>Attach files (docs only, max 5MB)</span>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitTicket}
                  className="bg-gradient-to-r from-violet-500 to-cyan-500"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfluencerSupportTickets;