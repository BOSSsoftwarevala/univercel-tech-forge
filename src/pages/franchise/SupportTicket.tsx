import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeadphonesIcon, Plus, Search, Clock, CheckCircle, 
  AlertCircle, MessageSquare, User, Calendar, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdate: string;
  messages: number;
}

const FranchiseSupportTicket = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const tickets: Ticket[] = [
    { id: 'TKT-001', subject: 'Lead assignment issue', category: 'Technical', priority: 'high', status: 'in_progress', createdAt: 'Jan 15', lastUpdate: '2 hours ago', messages: 5 },
    { id: 'TKT-002', subject: 'Commission calculation query', category: 'Billing', priority: 'medium', status: 'open', createdAt: 'Jan 14', lastUpdate: '1 day ago', messages: 2 },
    { id: 'TKT-003', subject: 'Demo access request', category: 'Demo', priority: 'low', status: 'resolved', createdAt: 'Jan 12', lastUpdate: '3 days ago', messages: 8 },
    { id: 'TKT-004', subject: 'Territory expansion request', category: 'Account', priority: 'urgent', status: 'open', createdAt: 'Jan 10', lastUpdate: '5 days ago', messages: 3 },
    { id: 'TKT-005', subject: 'Training module not loading', category: 'Technical', priority: 'medium', status: 'closed', createdAt: 'Jan 8', lastUpdate: '1 week ago', messages: 12 },
  ];

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent': return { color: 'text-red-400 bg-red-500/20 border-red-500/30', label: 'Urgent' };
      case 'high': return { color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', label: 'High' };
      case 'medium': return { color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', label: 'Medium' };
      case 'low': return { color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', label: 'Low' };
      default: return { color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', label: priority };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { icon: AlertCircle, color: 'text-amber-400', label: 'Open' };
      case 'in_progress': return { icon: Clock, color: 'text-indigo-400', label: 'In Progress' };
      case 'resolved': return { icon: CheckCircle, color: 'text-emerald-400', label: 'Resolved' };
      case 'closed': return { icon: CheckCircle, color: 'text-slate-400', label: 'Closed' };
      default: return { icon: AlertCircle, color: 'text-slate-400', label: status };
    }
  };

  const handleCreateTicket = () => {
    toast.success('Support ticket created successfully');
    setIsDialogOpen(false);
  };

  const filteredTickets = statusFilter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === statusFilter);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <p className="text-slate-400">Get help with any issues or queries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Subject</label>
                <Input placeholder="Brief description of your issue" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Category</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Priority</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Description</label>
                <Textarea placeholder="Describe your issue in detail..." className="bg-slate-800 border-slate-700 text-white min-h-[100px]" />
              </div>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleCreateTicket}>
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <HeadphonesIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Tickets</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
              <p className="text-xs text-slate-400">Open</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
              <p className="text-xs text-slate-400">Resolved</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search tickets..." 
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <HeadphonesIcon className="w-5 h-5 text-indigo-400" />
            Your Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTickets.map((ticket, index) => {
            const priorityConfig = getPriorityConfig(ticket.priority);
            const statusConfig = getStatusConfig(ticket.status);
            const StatusIcon = statusConfig.icon;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                      </div>
                      <p className="font-medium text-white mt-1">{ticket.subject}</p>
                      <p className="text-xs text-slate-400 mt-1">{ticket.category} • Created {ticket.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <MessageSquare className="w-3 h-3" />
                      {ticket.messages} messages
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Updated {ticket.lastUpdate}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseSupportTicket;
