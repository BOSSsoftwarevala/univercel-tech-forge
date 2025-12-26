// Continent Super Admin - Approvals Screen
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowUpCircle, ClipboardCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Approval {
  id: string;
  requestedBy: string;
  country: string;
  impact: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  type: string;
}

const ApprovalsView = () => {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<Approval[]>([
    { id: 'APR-001', requestedBy: 'John Okafor', country: 'Nigeria', impact: 'High', status: 'Pending', type: 'Budget Increase' },
    { id: 'APR-002', requestedBy: 'Mary Wanjiku', country: 'Kenya', impact: 'Medium', status: 'Pending', type: 'New Hire' },
    { id: 'APR-003', requestedBy: 'David Nkosi', country: 'South Africa', impact: 'Critical', status: 'Pending', type: 'Policy Change' },
    { id: 'APR-004', requestedBy: 'Kwame Asante', country: 'Ghana', impact: 'Low', status: 'Pending', type: 'Resource Request' },
    { id: 'APR-005', requestedBy: 'Ahmed Hassan', country: 'Egypt', impact: 'High', status: 'Pending', type: 'Contract Extension' },
  ]);
  
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-500/20 text-red-500';
      case 'High': return 'bg-amber-500/20 text-amber-500';
      case 'Medium': return 'bg-blue-500/20 text-blue-500';
      case 'Low': return 'bg-emerald-500/20 text-emerald-500';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/20 text-emerald-500';
      case 'Rejected': return 'bg-red-500/20 text-red-500';
      case 'Escalated': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const logAudit = async (action: string, approvalId: string, details: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action,
          module: 'continent_approvals',
          role: 'super_admin',
          meta_json: { approval_id: approvalId, ...details }
        });
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
  };

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      await logAudit('approval_approved', id, { status: 'approved' });
      
      setApprovals(prev => prev.map(a => 
        a.id === id ? { ...a, status: 'Approved' as const } : a
      ));
      
      toast({
        title: 'Request Approved',
        description: `Approval ${id} has been approved successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve request.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.id) return;
    
    if (!rejectReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoadingId(rejectDialog.id);
    try {
      await logAudit('approval_rejected', rejectDialog.id, { 
        status: 'rejected', 
        reason: rejectReason 
      });
      
      setApprovals(prev => prev.map(a => 
        a.id === rejectDialog.id ? { ...a, status: 'Rejected' as const } : a
      ));
      
      toast({
        title: 'Request Rejected',
        description: `Approval ${rejectDialog.id} has been rejected.`,
      });
      
      setRejectDialog({ open: false, id: null });
      setRejectReason('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject request.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleEscalate = async (id: string) => {
    setLoadingId(id);
    try {
      await logAudit('approval_escalated', id, { status: 'escalated', escalated_to: 'master_admin' });
      
      setApprovals(prev => prev.map(a => 
        a.id === id ? { ...a, status: 'Escalated' as const } : a
      ));
      
      toast({
        title: 'Request Escalated',
        description: `Approval ${id} has been escalated to Master Admin.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to escalate request.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approvals</h1>
          <p className="text-muted-foreground">Review and manage pending approvals</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {pendingCount} Pending
        </Badge>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ClipboardCheck className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Approval ID</TableHead>
                <TableHead className="text-muted-foreground">Requested By</TableHead>
                <TableHead className="text-muted-foreground">Country</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Impact</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval, index) => (
                <motion.tr
                  key={approval.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-border"
                >
                  <TableCell className="font-mono text-foreground">{approval.id}</TableCell>
                  <TableCell className="text-foreground">{approval.requestedBy}</TableCell>
                  <TableCell className="text-muted-foreground">{approval.country}</TableCell>
                  <TableCell className="text-muted-foreground">{approval.type}</TableCell>
                  <TableCell>
                    <Badge className={getImpactColor(approval.impact)}>
                      {approval.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {approval.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleApprove(approval.id)}
                          disabled={loadingId === approval.id}
                        >
                          {loadingId === approval.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setRejectDialog({ open: true, id: approval.id })}
                          disabled={loadingId === approval.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-border"
                          onClick={() => handleEscalate(approval.id)}
                          disabled={loadingId === approval.id}
                        >
                          <ArrowUpCircle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {approval.status}
                      </span>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => {
        if (!open) {
          setRejectDialog({ open: false, id: null });
          setRejectReason('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Approval Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, id: null })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loadingId !== null}
            >
              {loadingId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalsView;
