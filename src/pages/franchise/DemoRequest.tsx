import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Calendar, User, Building2, 
  Send, CheckCircle, XCircle, Loader2, Plus, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DemoRequest {
  id: string;
  leadName: string;
  demoTitle: string;
  category: string;
  requestedAt: string;
  scheduledFor: string | null;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'rejected';
  notes: string;
}

const FranchiseDemoRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const demoRequests: DemoRequest[] = [
    { id: '1', leadName: 'Raj Kumar', demoTitle: 'POS System', category: 'Retail', requestedAt: '2024-01-15', scheduledFor: '2024-01-20 10:00 AM', status: 'scheduled', notes: 'Client prefers morning slot' },
    { id: '2', leadName: 'Priya Singh', demoTitle: 'Hospital Management', category: 'Healthcare', requestedAt: '2024-01-14', scheduledFor: null, status: 'pending', notes: 'Urgent requirement' },
    { id: '3', leadName: 'Amit Patel', demoTitle: 'School ERP', category: 'Education', requestedAt: '2024-01-13', scheduledFor: '2024-01-18 2:00 PM', status: 'approved', notes: '' },
    { id: '4', leadName: 'Sneha Gupta', demoTitle: 'Banking Software', category: 'Finance', requestedAt: '2024-01-12', scheduledFor: null, status: 'rejected', notes: 'Region not covered' },
    { id: '5', leadName: 'Vikram Shah', demoTitle: 'E-Commerce Suite', category: 'Retail', requestedAt: '2024-01-11', scheduledFor: '2024-01-16', status: 'completed', notes: 'Successfully converted' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', label: 'Pending' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', label: 'Approved' };
      case 'scheduled':
        return { icon: Calendar, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30', label: 'Scheduled' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-400 bg-green-500/20 border-green-500/30', label: 'Completed' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-400 bg-red-500/20 border-red-500/30', label: 'Rejected' };
      default:
        return { icon: Clock, color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', label: status };
    }
  };

  const handleNewRequest = () => {
    toast.success('Demo request submitted successfully');
    setIsDialogOpen(false);
  };

  const filteredRequests = statusFilter === 'all' 
    ? demoRequests 
    : demoRequests.filter(req => req.status === statusFilter);

  const stats = {
    total: demoRequests.length,
    pending: demoRequests.filter(r => r.status === 'pending').length,
    scheduled: demoRequests.filter(r => r.status === 'scheduled').length,
    completed: demoRequests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Demo Requests</h1>
          <p className="text-slate-400">Manage demo requests for your leads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Demo Request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Request New Demo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Lead Name</label>
                <Input placeholder="Enter lead name" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Demo Category</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Demo Product</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pos">POS System</SelectItem>
                    <SelectItem value="erp">School ERP</SelectItem>
                    <SelectItem value="hms">Hospital Management</SelectItem>
                    <SelectItem value="ecom">E-Commerce Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Preferred Date & Time</label>
                <Input type="datetime-local" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Notes</label>
                <Textarea placeholder="Any special requirements..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleNewRequest}>
                <Send className="w-4 h-4 mr-2" />
                Submit Request
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
              <Play className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Requests</p>
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
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-slate-400">Pending</p>
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
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
              <p className="text-xs text-slate-400">Scheduled</p>
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
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Play className="w-5 h-5 text-indigo-400" />
            Demo Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRequests.map((request, index) => {
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{request.demoTitle}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {request.leadName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {request.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    {request.scheduledFor && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {request.scheduledFor}
                      </p>
                    )}
                  </div>
                </div>
                {request.notes && (
                  <p className="mt-3 text-xs text-slate-400 p-2 bg-slate-800/50 rounded">{request.notes}</p>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseDemoRequest;
