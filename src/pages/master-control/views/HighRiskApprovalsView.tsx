import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
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
        <h2 className="text-lg font-semibold text-zinc-800">High Risk Approvals</h2>
        <p className="text-sm text-zinc-500">Pending critical actions requiring Master Admin approval</p>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-white border-zinc-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Pending Approvals</p>
            <p className="text-2xl font-bold text-zinc-800">{pendingApprovals.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Critical</p>
            <p className="text-2xl font-bold text-zinc-800">
              {pendingApprovals.filter(a => a.risk === 'Critical').length}
            </p>
          </div>
        </div>
      </Card>

      {/* Approvals Table */}
      <Card className="bg-white border-zinc-300">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200">
              <TableHead className="text-zinc-600">Request ID</TableHead>
              <TableHead className="text-zinc-600">Requested By</TableHead>
              <TableHead className="text-zinc-600">Action Type</TableHead>
              <TableHead className="text-zinc-600">Risk Level</TableHead>
              <TableHead className="text-zinc-600">Requested Time</TableHead>
              <TableHead className="text-zinc-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApprovals.map((approval) => (
              <TableRow key={approval.id} className="border-zinc-200">
                <TableCell className="font-mono text-zinc-800">{approval.id}</TableCell>
                <TableCell className="text-zinc-700">{approval.requestedBy}</TableCell>
                <TableCell className="text-zinc-700">{approval.action}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    approval.risk === 'Critical' 
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-300 text-zinc-700'
                  }`}>
                    {approval.risk}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-700">{approval.time}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleApprove(approval.id)}
                      className="border-zinc-300 h-8"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setRejectDialog(approval.id)}
                      className="border-zinc-300 h-8"
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
        <DialogContent className="bg-white border-zinc-300">
          <DialogHeader>
            <DialogTitle className="text-zinc-800">Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-600">Rejection Reason (Required)</Label>
              <Textarea 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="mt-2 bg-zinc-50 border-zinc-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)} className="border-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleReject} className="bg-zinc-800 text-white">
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HighRiskApprovalsView;
