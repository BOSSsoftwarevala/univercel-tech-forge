import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Clock, Send, FileText, CheckCircle,
  XCircle, MessageSquare, User, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Escalation {
  id: string;
  taskId: string;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
  resolutionNotes?: string;
}

const mockEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    taskId: 'TSK-2843',
    reason: 'unclear_requirements',
    description: 'The client requirements for the payment module are ambiguous. Need clarification on currency handling.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 172800000),
    resolvedAt: new Date(Date.now() - 86400000),
    resolutionNotes: 'Requirements clarified. Multi-currency support confirmed.'
  },
  {
    id: 'ESC-002',
    taskId: 'TSK-2844',
    reason: 'technical_blocker',
    description: 'API endpoint returning 500 errors. Cannot proceed with integration testing.',
    status: 'in_review',
    createdAt: new Date(Date.now() - 3600000)
  }
];

const escalationReasons = [
  { value: 'unclear_requirements', label: 'Unclear Requirements' },
  { value: 'technical_blocker', label: 'Technical Blocker' },
  { value: 'scope_change', label: 'Scope Change' },
  { value: 'resource_needed', label: 'Additional Resources Needed' },
  { value: 'client_unresponsive', label: 'Client Unresponsive' },
  { value: 'sla_risk', label: 'SLA Risk' },
  { value: 'other', label: 'Other' }
];

const EscalationPanel = () => {
  const [escalations] = useState<Escalation[]>(mockEscalations);
  const [newReason, setNewReason] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Open</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-500/20 text-blue-400">In Review</Badge>;
      case 'resolved':
        return <Badge className="bg-emerald-500/20 text-emerald-400">Resolved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">{status}</Badge>;
    }
  };

  const handleSubmit = () => {
    if (newReason && newDescription.length > 20) {
      // Submit escalation
      setShowForm(false);
      setNewReason('');
      setNewDescription('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Escalation Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Raise and track escalation tickets</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Raise Escalation
        </Button>
      </div>

      {/* New Escalation Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-slate-900/50 border-orange-500/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              New Escalation for TSK-2846
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Reason</label>
                <Select value={newReason} onValueChange={setNewReason}>
                  <SelectTrigger className="bg-slate-800 border-orange-500/20 text-white">
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {escalationReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide detailed description of the issue (minimum 20 characters)..."
                  className="bg-slate-800 border-orange-500/20 text-white min-h-[120px]"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {newDescription.length}/20 characters minimum
                </p>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-400">
                  ⚠️ Escalations are logged permanently. False or unnecessary escalations may affect your performance score.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                  className="text-slate-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!newReason || newDescription.length < 20}
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Escalation
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Escalation Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Escalations', value: '5', icon: FileText, color: 'cyan' },
          { label: 'Open', value: '1', icon: Clock, color: 'yellow' },
          { label: 'Resolved', value: '3', icon: CheckCircle, color: 'emerald' },
          { label: 'Rejected', value: '1', icon: XCircle, color: 'red' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 bg-slate-900/50 border-${stat.color}-500/30`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Escalation History */}
      <Card className="p-6 bg-slate-900/50 border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Escalation History</h3>
        
        <div className="space-y-4">
          {escalations.map((escalation, index) => (
            <motion.div
              key={escalation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-400">{escalation.id}</span>
                    <Badge className="bg-slate-700 text-slate-300">{escalation.taskId}</Badge>
                    {getStatusBadge(escalation.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400 capitalize">
                      {escalation.reason.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white mb-3">{escalation.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created: {escalation.createdAt.toLocaleDateString()}
                    </span>
                    {escalation.resolvedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        Resolved: {escalation.resolvedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {escalation.resolutionNotes && (
                  <div className="lg:w-64 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">Resolution</span>
                    </div>
                    <p className="text-xs text-slate-300">{escalation.resolutionNotes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EscalationPanel;
