import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  Shield, CheckCircle, XCircle, Clock, AlertTriangle, 
  User, FileText, Lock, Eye, ThumbsUp, ThumbsDown,
  Smartphone, Globe, Brain
} from "lucide-react";

interface ApprovalRequest {
  id: string;
  user_id: string;
  user_role: string;
  action_type: string;
  action_target: string;
  action_data: any;
  approval_status: string;
  created_at: string;
  approved_at: string | null;
  priority: string;
  otp_verified: boolean;
  password_verified: boolean;
  device_fingerprint: string | null;
  ip_address: string | null;
  risk_score: number;
  ai_risk_assessment: any;
}

export function SuperAdminApprovalQueue() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ['approval-queue-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_approval_queue')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApprovalRequest[];
    },
    refetchInterval: 5000 // Poll every 5 seconds
  });

  const { data: processedRequests } = useQuery({
    queryKey: ['approval-queue-processed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_approval_queue')
        .select('*')
        .in('approval_status', ['approved', 'rejected'])
        .order('approved_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ApprovalRequest[];
    }
  });

  const approveRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('action_approval_queue')
        .update({
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'action_approved',
        module: 'approval_queue',
        meta_json: { request_id: requestId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-queue-pending'] });
      queryClient.invalidateQueries({ queryKey: ['approval-queue-processed'] });
      toast.success('Request approved');
      setSelectedRequest(null);
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    }
  });

  const rejectRequest = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
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
        .eq('id', requestId);

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'action_rejected',
        module: 'approval_queue',
        meta_json: { request_id: requestId, reason }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-queue-pending'] });
      queryClient.invalidateQueries({ queryKey: ['approval-queue-processed'] });
      toast.success('Request rejected');
      setSelectedRequest(null);
      setShowRejectDialog(false);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(`Failed to reject: ${error.message}`);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: 'Critical', color: 'destructive' };
    if (score >= 60) return { label: 'High', color: 'default' };
    if (score >= 40) return { label: 'Medium', color: 'secondary' };
    return { label: 'Low', color: 'outline' };
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading approval queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Action Approval Queue
          </h2>
          <p className="text-muted-foreground">
            Review and approve critical actions requiring Super Admin authorization
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {pendingRequests?.length || 0} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingRequests?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-500">
                  {processedRequests?.filter(r => 
                    r.approval_status === 'approved' && 
                    new Date(r.approved_at!).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-2xl font-bold text-destructive">
                  {processedRequests?.filter(r => 
                    r.approval_status === 'rejected' && 
                    new Date(r.approved_at!).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-orange-500">
                  {pendingRequests?.filter(r => r.risk_score >= 60).length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[500px]">
                {pendingRequests && pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {pendingRequests.map(request => {
                      const risk = getRiskLevel(request.risk_score);
                      return (
                        <div 
                          key={request.id}
                          className="p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(request.priority) as any}>
                                {request.priority}
                              </Badge>
                              <Badge variant="outline">{request.action_type}</Badge>
                              <Badge variant={risk.color as any}>Risk: {risk.label}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="font-medium mb-1">{request.action_target}</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Role: {request.user_role}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <span className={request.otp_verified ? 'text-green-500' : 'text-muted-foreground'}>
                              {request.otp_verified ? '✓ OTP' : '○ OTP'}
                            </span>
                            <span className={request.password_verified ? 'text-green-500' : 'text-muted-foreground'}>
                              {request.password_verified ? '✓ Password' : '○ Password'}
                            </span>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveRequest.mutate(request.id);
                              }}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(request);
                                setShowRejectDialog(true);
                              }}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(request);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No pending approval requests</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[500px]">
                {processedRequests && processedRequests.length > 0 ? (
                  <div className="space-y-2">
                    {processedRequests.map(request => (
                      <div 
                        key={request.id}
                        className="p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {request.approval_status === 'approved' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <Badge variant="outline">{request.action_type}</Badge>
                            <span className="text-sm">{request.action_target}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(request.approved_at!), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No processed requests
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review all information before approving or rejecting
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Action Type</p>
                  <Badge>{selectedRequest.action_type}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">User Role</p>
                  <Badge variant="outline">{selectedRequest.user_role}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant={getPriorityColor(selectedRequest.priority) as any}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <Badge variant={getRiskLevel(selectedRequest.risk_score).color as any}>
                    {selectedRequest.risk_score}/100
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Action Description</p>
                <p className="font-medium">{selectedRequest.action_target}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Lock className={`h-6 w-6 mx-auto mb-1 ${selectedRequest.otp_verified ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <p className="text-sm">OTP {selectedRequest.otp_verified ? 'Verified' : 'Not Verified'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Lock className={`h-6 w-6 mx-auto mb-1 ${selectedRequest.password_verified ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <p className="text-sm">Password {selectedRequest.password_verified ? 'Verified' : 'Not Verified'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Smartphone className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm truncate">{selectedRequest.device_fingerprint?.slice(0, 12) || 'Unknown'}...</p>
                </div>
              </div>

              {selectedRequest.ai_risk_assessment && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">AI Risk Assessment</p>
                  </div>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(selectedRequest.ai_risk_assessment, null, 2)}
                  </pre>
                </div>
              )}

              {selectedRequest.action_data && Object.keys(selectedRequest.action_data).length > 0 && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Action Data</p>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(selectedRequest.action_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => selectedRequest && approveRequest.mutate(selectedRequest.id)}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this action request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedRequest && rejectRequest.mutate({
                requestId: selectedRequest.id,
                reason: rejectionReason
              })}
              disabled={!rejectionReason}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}