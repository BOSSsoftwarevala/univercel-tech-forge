import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
  { id: 'REQ-001', requestedBy: 'Super Admin (Asia)', role: 'super_admin', action: 'Bulk User Creation', risk: 'High', time: '2 hours ago' },
  { id: 'REQ-002', requestedBy: 'Super Admin (Europe)', role: 'super_admin', action: 'Financial Transfer ($85,000)', risk: 'Critical', time: '3 hours ago' },
  { id: 'REQ-003', requestedBy: 'Super Admin (Africa)', role: 'super_admin', action: 'Rule Override', risk: 'High', time: '5 hours ago' },
  { id: 'REQ-004', requestedBy: 'Super Admin (N. America)', role: 'super_admin', action: 'Data Export Request', risk: 'High', time: '6 hours ago' },
  { id: 'REQ-005', requestedBy: 'Super Admin (S. America)', role: 'super_admin', action: 'Security Policy Change', risk: 'Critical', time: '8 hours ago' },
];

const HighRiskApprovalsView = () => {
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [pendingApprovals, setPendingApprovals] = useState(approvals);

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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    approval.risk === 'Critical' 
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {approval.risk}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{approval.time}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(approval.id)}
                      className="h-7 bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setRejectDialog(approval.id)}
                      className="h-7 bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
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
    </div>
  );
};

export default HighRiskApprovalsView;
