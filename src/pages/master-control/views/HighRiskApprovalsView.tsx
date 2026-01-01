import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ArrowUpRight, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const approvals = [
  { id: 'REQ-001', requestedBy: 'Super Admin (Asia)', role: 'super_admin', action: 'Bulk User Creation', risk: 'High', time: '5 min ago', aiSuggestion: 'Approve with additional verification - Low fraud probability detected.' },
  { id: 'REQ-002', requestedBy: 'Super Admin (Europe)', role: 'super_admin', action: 'Financial Transfer ($85,000)', risk: 'Critical', time: '15 min ago', aiSuggestion: 'Recommend manual review - Large transaction amount detected.' },
  { id: 'REQ-003', requestedBy: 'Super Admin (Africa)', role: 'super_admin', action: 'Rule Override', risk: 'High', time: '30 min ago', aiSuggestion: 'Approve - Standard rule override request with valid justification.' },
  { id: 'REQ-004', requestedBy: 'Super Admin (N. America)', role: 'super_admin', action: 'Data Export Request', risk: 'Low', time: '1 hr ago', aiSuggestion: 'Safe to approve - Export complies with data governance policies.' },
  { id: 'REQ-005', requestedBy: 'Super Admin (S. America)', role: 'super_admin', action: 'Security Policy Change', risk: 'Medium', time: '2 hrs ago', aiSuggestion: 'Escalate for review - Security policy changes require additional oversight.' },
];

const HighRiskApprovalsView = () => {
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [pendingApprovals, setPendingApprovals] = useState(approvals);
  const [aiSuggestionDialog, setAiSuggestionDialog] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleApprove = (id: string) => {
    setPendingApprovals(prev => prev.filter(a => a.id !== id));
    toast.success(`Request ${id} approved`);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setPendingApprovals(prev => prev.filter(a => a.id !== rejectDialog));
    toast.success(`Request ${rejectDialog} rejected`);
    setRejectDialog(null);
    setRejectReason('');
  };

  const handleEscalate = (id: string) => {
    toast.info(`Request ${id} escalated to higher authority`);
  };

  const handleAISuggestion = (id: string) => {
    setAiSuggestionDialog(id);
    setLoadingAI(true);
    // Simulate AI processing
    setTimeout(() => setLoadingAI(false), 800);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'High': return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      case 'Medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Low': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  const currentApproval = pendingApprovals.find(a => a.id === aiSuggestionDialog);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">High Risk Approvals</h2>
        <p className="text-sm text-gray-500">Pending critical actions requiring Master Admin approval</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-white">{pendingApprovals.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-400">
                {pendingApprovals.filter(a => a.risk === 'Critical').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card className="bg-[#1a1a2e] border-gray-800/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800/50 hover:bg-transparent">
              <TableHead className="text-gray-500">Request ID</TableHead>
              <TableHead className="text-gray-500">Requested By</TableHead>
              <TableHead className="text-gray-500">Action Type</TableHead>
              <TableHead className="text-gray-500">Risk Level</TableHead>
              <TableHead className="text-gray-500">Requested Time</TableHead>
              <TableHead className="text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApprovals.map((approval) => (
              <TableRow key={approval.id} className="border-gray-800/30 hover:bg-gray-800/30">
                <TableCell className="font-mono text-white">{approval.id}</TableCell>
                <TableCell className="text-gray-400">{approval.requestedBy}</TableCell>
                <TableCell className="text-gray-400">{approval.action}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskColor(approval.risk)}`}>
                    {approval.risk.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{approval.time}</TableCell>
              <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(approval.id)}
                      className="h-8 px-3 bg-emerald-500 text-white hover:bg-emerald-600 font-medium shadow-lg shadow-emerald-500/20"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setRejectDialog(approval.id)}
                      className="h-8 px-3 bg-rose-500 text-white hover:bg-rose-600 font-medium shadow-lg shadow-rose-500/20"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAISuggestion(approval.id)}
                      className="h-8 px-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 font-medium shadow-lg shadow-violet-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      AI Suggestion
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleEscalate(approval.id)}
                      className="h-8 px-3 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 font-medium"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />
                      Escalate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent className="bg-[#12121a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Rejection Reason (Required)</Label>
              <Textarea 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="mt-2 bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)} className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleReject} className="bg-red-500 text-white hover:bg-red-600">
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Suggestion Dialog */}
      <Dialog open={!!aiSuggestionDialog} onOpenChange={() => setAiSuggestionDialog(null)}>
        <DialogContent className="bg-[#12121a] border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              AI Suggestion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-400">Analyzing request...</span>
              </div>
            ) : currentApproval && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-violet-400 mb-1">AI Recommendation</p>
                      <p className="text-sm text-gray-300">{currentApproval.aiSuggestion}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-gray-500 text-xs mb-1">Request ID</p>
                    <p className="text-white font-mono">{currentApproval.id}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-gray-500 text-xs mb-1">Risk Level</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRiskColor(currentApproval.risk)}`}>
                      {currentApproval.risk.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAiSuggestionDialog(null)} className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
              Close
            </Button>
            <Button 
              onClick={() => {
                if (currentApproval) handleApprove(currentApproval.id);
                setAiSuggestionDialog(null);
              }} 
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HighRiskApprovalsView;
