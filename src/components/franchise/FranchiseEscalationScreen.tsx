import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Plus, Clock, CheckCircle2, XCircle,
  MessageSquare, FileText, Upload, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface Escalation {
  id: string;
  type: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  createdAt: string;
  responses: number;
}

const FranchiseEscalationScreen = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: '1', type: 'territory_dispute', subject: 'Lead assignment overlap with Franchise Beta', description: 'Leads from Navi Mumbai are being assigned to both franchises.', priority: 'high', status: 'in_review', createdAt: '2 days ago', responses: 3 },
    { id: '2', type: 'commission_dispute', subject: 'Commission not credited for Sale #4521', description: 'Sale was closed 10 days ago but commission is still pending.', priority: 'medium', status: 'open', createdAt: '5 days ago', responses: 1 },
    { id: '3', type: 'payment_issue', subject: 'Withdrawal request delayed', description: 'Bank transfer has been pending for 7 business days.', priority: 'high', status: 'resolved', createdAt: '1 week ago', responses: 5 },
  ]);

  const [showNewEscalation, setShowNewEscalation] = useState(false);
  const [newEscalation, setNewEscalation] = useState({
    type: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const escalationTypes = [
    { id: 'territory_dispute', label: 'Territory Dispute' },
    { id: 'commission_dispute', label: 'Commission Dispute' },
    { id: 'lead_dispute', label: 'Lead Dispute' },
    { id: 'contract_issue', label: 'Contract Issue' },
    { id: 'payment_issue', label: 'Payment Issue' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmitEscalation = () => {
    if (!newEscalation.type || !newEscalation.subject || !newEscalation.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Escalation Submitted",
      description: "Your escalation has been sent to the Super Admin for review.",
    });
    setShowNewEscalation(false);
    setNewEscalation({ type: '', subject: '', description: '', priority: 'medium' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-cyan-400 bg-cyan-500/20';
      case 'in_review': return 'text-amber-400 bg-amber-500/20';
      case 'resolved': return 'text-emerald-400 bg-emerald-500/20';
      case 'closed': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_review': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Escalation Tickets</h1>
          <p className="text-slate-400">Raise and track disputes with Super Admin</p>
        </div>
        <Button onClick={() => setShowNewEscalation(true)} className="bg-indigo-500 hover:bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          New Escalation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
          <p className="text-2xl font-bold text-white">{escalations.filter(e => e.status === 'open').length}</p>
          <p className="text-sm text-slate-400">Open</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-2xl font-bold text-white">{escalations.filter(e => e.status === 'in_review').length}</p>
          <p className="text-sm text-slate-400">In Review</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-2xl font-bold text-white">{escalations.filter(e => e.status === 'resolved').length}</p>
          <p className="text-sm text-slate-400">Resolved</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-center">
          <p className="text-2xl font-bold text-white">{escalations.length}</p>
          <p className="text-sm text-slate-400">Total</p>
        </div>
      </div>

      {/* Escalation List */}
      <div className="space-y-4">
        {escalations.map((escalation, index) => (
          <motion.div
            key={escalation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(escalation.status)}`}>
                  {getStatusIcon(escalation.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{escalation.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{escalation.type.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{escalation.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(escalation.priority)}`}>
                  {escalation.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(escalation.status)}`}>
                  {escalation.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">{escalation.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span>{escalation.responses} responses</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Escalation Modal */}
      {showNewEscalation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewEscalation(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-full max-w-lg p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">New Escalation</h2>
                <p className="text-slate-400 text-sm">Raise a ticket to Super Admin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Escalation Type</label>
                <select
                  value={newEscalation.type}
                  onChange={e => setNewEscalation(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Select type...</option>
                  {escalationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <Input
                  value={newEscalation.subject}
                  onChange={e => setNewEscalation(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <Textarea
                  value={newEscalation.description}
                  onChange={e => setNewEscalation(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about the issue..."
                  className="bg-slate-800 border-slate-700"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high', 'critical'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => setNewEscalation(prev => ({ ...prev, priority }))}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        newEscalation.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowNewEscalation(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitEscalation} className="flex-1 bg-indigo-500 hover:bg-indigo-600">
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FranchiseEscalationScreen;
