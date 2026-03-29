import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Paperclip,
  Send,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ResellerEscalations = () => {
  const [showNewTicket, setShowNewTicket] = useState(false);

  const escalations = [
    {
      id: 'ESC-001',
      subject: 'Lead not responding - Tech Solutions',
      type: 'lead_issue',
      priority: 'high',
      status: 'open',
      created: '2024-01-14',
      lastUpdate: '2h ago',
      responses: 2
    },
    {
      id: 'ESC-002',
      subject: 'Commission calculation discrepancy',
      type: 'payment_dispute',
      priority: 'medium',
      status: 'in_progress',
      created: '2024-01-12',
      lastUpdate: '1d ago',
      responses: 4
    },
    {
      id: 'ESC-003',
      subject: 'Demo link technical issue',
      type: 'technical',
      priority: 'low',
      status: 'resolved',
      created: '2024-01-10',
      lastUpdate: '3d ago',
      responses: 3
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-500/20 text-red-400 border-red-500/30',
      in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-500/20 text-slate-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lead_issue: 'Lead Issue',
      payment_dispute: 'Payment Dispute',
      technical: 'Technical',
      customer_complaint: 'Customer Complaint',
      other: 'Other'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-emerald-400" />
            Escalations
          </h1>
          <p className="text-slate-400">Submit and track your support tickets</p>
        </div>
        <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-500">
              <Plus className="w-4 h-4 mr-2" />
              New Escalation
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-emerald-500/30 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Escalation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Type</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="lead_issue">Lead Issue</SelectItem>
                    <SelectItem value="payment_dispute">Payment Dispute</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Priority</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                <Input 
                  placeholder="Brief subject of the issue" 
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea 
                  placeholder="Describe your issue in detail..." 
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Attachments</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <Paperclip className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Click to upload or drag files here</p>
                  <p className="text-slate-500 text-xs mt-1">Documents only (PDF, DOC, PNG)</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-slate-600 text-slate-300"
                  onClick={() => setShowNewTicket(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open', value: 1, color: 'red' },
          { label: 'In Progress', value: 1, color: 'amber' },
          { label: 'Resolved', value: 5, color: 'green' },
          { label: 'Avg Response', value: '4h', color: 'teal' },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Escalation List */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white">Your Escalations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {escalations.map((esc, index) => (
            <motion.div
              key={esc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-emerald-400 font-mono text-sm">{esc.id}</span>
                    <Badge className={`${getStatusColor(esc.status)} border`}>
                      {esc.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(esc.priority)}>
                      {esc.priority}
                    </Badge>
                  </div>
                  <h4 className="text-white font-medium mb-1">{esc.subject}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {getTypeLabel(esc.type)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {esc.lastUpdate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {esc.responses} responses
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
            </motion.div>
          ))}

          {escalations.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-white font-medium">No escalations</p>
              <p className="text-slate-400 text-sm">You don't have any active escalations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerEscalations;
