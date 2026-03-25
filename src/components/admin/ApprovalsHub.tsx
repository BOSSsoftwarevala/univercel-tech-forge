import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  AlertTriangle,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Filter
} from "lucide-react";

interface ApprovalItem {
  id: string;
  user_id: string;
  user_role: string;
  action_type: string;
  action_target: string;
  action_data: any;
  approval_status: string;
  priority: string;
  risk_score: number | null;
  created_at: string;
  expires_at: string | null;
  device_fingerprint: string | null;
  ip_address: string | null;
}

const ApprovalsHub = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch approvals
  const { data: approvals, isLoading, refetch } = useQuery({
    queryKey: ['approvals-hub', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('action_approval_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab === 'pending') {
        query = query.eq('approval_status', 'pending');
      } else if (activeTab === 'approved') {
        query = query.eq('approval_status', 'approved');
      } else if (activeTab === 'rejected') {
        query = query.eq('approval_status', 'rejected');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ApprovalItem[];
    }
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('action_approval_queue')
        .update({
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Log approval
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'approve_action',
        module: 'approvals',
        meta_json: { approval_id: itemId }
      });
    },
    onSuccess: () => {
      toast.success('Action approved successfully');
      queryClient.invalidateQueries({ queryKey: ['approvals-hub'] });
      setShowDetailDialog(false);
    },
    onError: () => {
      toast.error('Failed to approve action');
    }
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ itemId, reason }: { itemId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('action_approval_queue')
        .update({
          approval_status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Action rejected');
      queryClient.invalidateQueries({ queryKey: ['approvals-hub'] });
      setShowRejectDialog(false);
      setShowDetailDialog(false);
      setRejectionReason("");
    },
    onError: () => {
      toast.error('Failed to reject action');
    }
  });

  const pendingCount = approvals?.filter(a => a.approval_status === 'pending').length || 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-green-400';
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'delete': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'update': return <FileText className="w-4 h-4 text-blue-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Approvals Hub
          </h2>
          <p className="text-muted-foreground">Manage all pending approvals and action requests</p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {pendingCount} Pending
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {approvals?.filter(a => a.approval_status === 'pending').length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-400">
                    {approvals?.filter(a => a.approval_status === 'approved').length || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-400">
                    {approvals?.filter(a => a.approval_status === 'rejected').length || 0}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-primary">
                    {approvals?.filter(a => a.priority === 'high' || a.priority === 'critical').length || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Filter className="w-4 h-4" />
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>User Role</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : approvals?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No approvals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvals?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(item.action_type)}
                            <span className="capitalize">{item.action_type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.action_target.slice(0, 20)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.user_role.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority || 'normal')}>
                            {item.priority || 'normal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getRiskColor(item.risk_score)}>
                            {item.risk_score || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            {item.approval_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => approveMutation.mutate(item.id)}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Approval Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Action Type</p>
                  <p className="font-medium capitalize">{selectedItem.action_type.replace('_', ' ')}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(selectedItem.priority || 'normal')}>
                    {selectedItem.priority || 'normal'}
                  </Badge>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">User Role</p>
                  <p className="font-medium">{selectedItem.user_role.replace('_', ' ')}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className={`font-medium ${getRiskColor(selectedItem.risk_score)}`}>
                    {selectedItem.risk_score || 'Not calculated'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Action Data</p>
                <pre className="text-xs overflow-auto max-h-40 bg-background/50 p-2 rounded">
                  {JSON.stringify(selectedItem.action_data, null, 2)}
                </pre>
              </div>

              {selectedItem.ip_address && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>IP: {selectedItem.ip_address}</span>
                  {selectedItem.device_fingerprint && (
                    <span>Device: {selectedItem.device_fingerprint.slice(0, 8)}...</span>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedItem?.approval_status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => selectedItem && approveMutation.mutate(selectedItem.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Reject Action</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this action.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedItem && rejectMutation.mutate({
                itemId: selectedItem.id,
                reason: rejectionReason
              })}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalsHub;
