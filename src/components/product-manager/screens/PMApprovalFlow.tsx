import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { listFactoryApprovalRequests, listFactoryProducts, updateFactoryApprovalRequest, type FactoryApprovalRequest, type FactoryProduct } from '@/lib/api/vala-factory';
import {
  CheckCircle2, XCircle, Clock, AlertCircle, Rocket, GitBranch,
  Cpu, Shield, User, Calendar, MessageSquare, AlertTriangle
} from 'lucide-react';

interface PMApprovalFlowProps {
  approvalType: string;
}

const PMApprovalFlow: React.FC<PMApprovalFlowProps> = ({ approvalType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [approvals, setApprovals] = useState<FactoryApprovalRequest[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<FactoryApprovalRequest | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const requestType = useMemo<'deployment' | 'version' | 'module' | undefined>(() => {
    if (approvalType === 'deployment-approval') return 'deployment';
    if (approvalType === 'version-approval') return 'version';
    if (approvalType === 'module-approval') return 'module';
    return undefined;
  }, [approvalType]);

  const load = async (productId?: string) => {
    try {
      setLoading(true);
      const productsResponse = await listFactoryProducts();
      const productItems = productsResponse.data.items || [];
      setProducts(productItems);
      const nextProductId = productId || selectedProductId || productItems[0]?.id || '';
      if (!nextProductId) {
        setApprovals([]);
        return;
      }
      setSelectedProductId(nextProductId);
      const approvalsResponse = await listFactoryApprovalRequests(nextProductId, requestType);
      setApprovals(approvalsResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load approvals', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [approvalType]);

  const getTitle = () => {
    switch (approvalType) {
      case 'deployment-approval': return 'Deployment Approval';
      case 'version-approval': return 'Version Approval';
      case 'module-approval': return 'Module Approval';
      case 'emergency-override': return 'Emergency Override';
      default: return 'Approval Flow';
    }
  };

  const applyDecision = async (decision: 'approved' | 'rejected' | 'override') => {
    if (!selectedProductId || !selectedApproval) {
      toast.error('Select an approval first');
      return;
    }
    try {
      const response = await updateFactoryApprovalRequest(selectedProductId, {
        request_type: selectedApproval.request_type,
        stage_name: selectedApproval.stage_name,
        target_id: selectedApproval.target_id || undefined,
        decision,
        note: comment || undefined,
      });
      toast.success(`${response.data.approval.request_type} ${decision}`);
      setSelectedApproval(null);
      setComment('');
      await load(selectedProductId);
    } catch (error) {
      console.error('Failed to update approval', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update approval');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deployment': return Rocket;
      case 'version': return GitBranch;
      case 'module': return Cpu;
      default: return CheckCircle2;
    }
  };

  const filteredApprovals = approvals;

  if (approvalType === 'emergency-override') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-red-400">Emergency Override</h1>
            <p className="text-sm text-muted-foreground">Boss Only - Use with caution</p>
          </div>
        </motion.div>

        <Card className="bg-red-500/5 border-red-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-400">Warning: Critical Action</h3>
                <p className="text-sm text-muted-foreground">
                  Emergency override bypasses all approval workflows. This action will be logged and requires Boss authorization.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Override Reason (Required)</label>
              <Textarea 
                placeholder="Explain the emergency situation requiring override..."
                className="min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-red-600 hover:bg-red-700 gap-2"
                onClick={() => void applyDecision('override')}
                disabled={!comment.trim()}
              >
                <Shield className="w-4 h-4" /> Activate Emergency Override
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Pending Approvals to Override</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {approvals.filter(a => a.status === 'pending').map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                  <span className="text-sm">{approval.request_type} • {approval.stage_name}</span>
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {approval.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredApprovals.filter(a => a.status === 'pending').length} pending approvals
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
          {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval List */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Approval Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="divide-y divide-border/50">
                {filteredApprovals.map((approval) => {
                  const TypeIcon = getTypeIcon(approval.type);
                  return (
                    <motion.div
                      key={approval.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 cursor-pointer hover:bg-secondary/30 transition-all ${selectedApproval?.id === approval.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                      onClick={() => setSelectedApproval(approval)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          approval.status === 'approved' ? 'bg-emerald-500/20' :
                          approval.status === 'rejected' ? 'bg-red-500/20' : 'bg-amber-500/20'
                        }`}>
                          <TypeIcon className={`w-4 h-4 ${
                            approval.status === 'approved' ? 'text-emerald-400' :
                            approval.status === 'rejected' ? 'text-red-400' : 'text-amber-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{approval.request_type} approval</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            <span>{approval.stage_name}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(approval.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          approval.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          approval.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }>
                          {approval.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Approval Details */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Approval Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedApproval ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedApproval.request_type} approval</h3>
                  <p className="text-sm text-muted-foreground mt-1">Stage {selectedApproval.stage_name} for target {selectedApproval.target_id || 'project-level approval'}.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Requested By</span>
                    <p className="font-medium">{selectedApproval.requested_by || 'system'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stage</span>
                    <p className="font-medium capitalize">{selectedApproval.stage_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">{selectedApproval.request_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p className="font-medium capitalize">{selectedApproval.status}</p>
                  </div>
                </div>
                {selectedApproval.status === 'pending' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Comment (Optional)</label>
                      <Textarea 
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => void applyDecision('approved')}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => void applyDecision('rejected')}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{loading ? 'Loading approvals...' : 'Select an approval to view details'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMApprovalFlow;
