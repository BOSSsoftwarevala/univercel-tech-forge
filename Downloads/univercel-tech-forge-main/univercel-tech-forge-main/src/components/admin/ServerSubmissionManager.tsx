import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Server, Shield, CheckCircle, XCircle, Clock, AlertTriangle, 
  Brain, Eye, ThumbsUp, ThumbsDown
} from "lucide-react";

interface SubmissionRequest {
  id: string;
  user_id: string;
  user_role: string;
  server_name: string;
  server_type: string;
  ip_address: string | null;
  hostname: string | null;
  provider: string | null;
  region: string | null;
  purpose: string | null;
  expected_usage: string | null;
  additional_notes: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  rejection_reason: string | null;
  ai_pre_check_result: any;
  ai_risk_assessment: any;
  created_at: string;
}

export function ServerSubmissionManager() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<SubmissionRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['server-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_submission_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SubmissionRequest[];
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const request = submissions?.find(s => s.id === requestId);
      if (!request) throw new Error('Request not found');

      // Create the server instance
      const { data: server, error: serverError } = await supabase
        .from('server_instances')
        .insert([{
          server_name: request.server_name,
          server_code: `SRV-${Date.now()}`,
          server_type: request.server_type,
          ip_address: request.ip_address,
          region: request.region || 'us-east',
          status: 'provisioning',
          submitted_by: request.user_id,
          is_user_submitted: true,
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          protection_enabled: true,
          protection_level: 'standard'
        }])
        .select()
        .single();

      if (serverError) throw serverError;

      // Update the submission request
      const { error: updateError } = await supabase
        .from('server_submission_requests')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
          created_server_id: server.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Trigger initial AI analysis
      await supabase.functions.invoke('ai-server-analyzer', {
        body: { action: 'full_analysis', serverId: server.id }
      });

      return server;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server approved and created successfully');
      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes("");
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('server_submission_requests')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-submissions'] });
      toast.success('Server submission rejected');
      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(`Failed to reject: ${error.message}`);
    }
  });

  const runAIPreCheck = useMutation({
    mutationFn: async (request: SubmissionRequest) => {
      const { data, error } = await supabase.functions.invoke('ai-server-analyzer', {
        body: { 
          action: 'pre_check_submission',
          serverData: {
            server_name: request.server_name,
            server_type: request.server_type,
            ip_address: request.ip_address,
            hostname: request.hostname,
            provider: request.provider,
            region: request.region,
            purpose: request.purpose,
            expected_usage: request.expected_usage
          }
        }
      });

      if (error) throw error;

      // Update the request with AI results
      await supabase
        .from('server_submission_requests')
        .update({
          ai_pre_check_result: data,
          status: 'under_review'
        })
        .eq('id', request.id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-submissions'] });
      toast.success('AI pre-check completed');
    },
    onError: (error) => {
      toast.error(`AI pre-check failed: ${error.message}`);
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      under_review: { variant: "outline", icon: Eye },
      approved: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle },
      cancelled: { variant: "secondary", icon: XCircle }
    };
    const { variant, icon: Icon } = variants[status] || variants.pending;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-500/10 text-green-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-orange-500/10 text-orange-500",
      critical: "bg-red-500/10 text-red-500"
    };
    return (
      <Badge className={colors[riskLevel] || colors.low}>
        {riskLevel} risk
      </Badge>
    );
  };

  const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0;
  const reviewCount = submissions?.filter(s => s.status === 'under_review').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Server className="h-6 w-6" />
            Server Submission Requests
          </h2>
          <p className="text-muted-foreground">
            Review and approve user-submitted servers with AI-powered risk assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            {reviewCount} Under Review
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="under_review">Under Review ({reviewCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {['pending', 'under_review', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4">
              {submissions
                ?.filter(s => s.status === status)
                .map(request => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Server className="h-5 w-5" />
                          <div>
                            <CardTitle className="text-lg">{request.server_name}</CardTitle>
                            <CardDescription>
                              {request.server_type} • {request.provider || 'Unknown Provider'}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.ai_pre_check_result && getRiskBadge(request.ai_pre_check_result.riskLevel)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">IP Address:</span>
                          <p className="font-mono">{request.ip_address || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Region:</span>
                          <p>{request.region || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted by:</span>
                          <p>{request.user_role}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <p>{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {request.purpose && (
                        <div className="mb-4">
                          <span className="text-muted-foreground text-sm">Purpose:</span>
                          <p className="text-sm">{request.purpose}</p>
                        </div>
                      )}

                      {request.ai_pre_check_result && (
                        <div className="p-3 rounded-lg bg-muted/50 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">AI Pre-Check Results</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Risk Score: {request.ai_pre_check_result.riskScore}/100</div>
                            <div>Auto-Approved: {request.ai_pre_check_result.approved ? 'Yes' : 'No'}</div>
                          </div>
                          {request.ai_pre_check_result.warnings?.length > 0 && (
                            <div className="mt-2">
                              <span className="text-yellow-500 text-xs">Warnings:</span>
                              <ul className="text-xs text-muted-foreground">
                                {request.ai_pre_check_result.warnings.map((w: string, i: number) => (
                                  <li key={i}>• {w}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {request.rejection_reason && (
                        <div className="p-3 rounded-lg bg-destructive/10 mb-4">
                          <span className="text-destructive text-sm font-medium">Rejection Reason:</span>
                          <p className="text-sm">{request.rejection_reason}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => runAIPreCheck.mutate(request)}
                            disabled={runAIPreCheck.isPending}
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            Run AI Pre-Check
                          </Button>
                        )}
                        {(request.status === 'pending' || request.status === 'under_review') && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsReviewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {submissions?.filter(s => s.status === status).length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No {status.replace('_', ' ')} submissions
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Server Submission</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Server Name</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.server_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Server Type</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.server_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">IP Address</label>
                    <p className="font-mono text-sm">{selectedRequest.ip_address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hostname</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.hostname || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Provider</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.provider || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Region</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.region || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Purpose</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.purpose || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Expected Usage</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.expected_usage || 'Not specified'}</p>
                </div>

                {selectedRequest.additional_notes && (
                  <div>
                    <label className="text-sm font-medium">Additional Notes</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.additional_notes}</p>
                  </div>
                )}

                {selectedRequest.ai_pre_check_result && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Risk Level:</span>
                          <span className="ml-2">{getRiskBadge(selectedRequest.ai_pre_check_result.riskLevel)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Risk Score:</span>
                          <span className="ml-2 font-bold">{selectedRequest.ai_pre_check_result.riskScore}/100</span>
                        </div>
                      </div>
                      {selectedRequest.ai_pre_check_result.flags?.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-red-500">Red Flags:</span>
                          <ul className="text-sm">
                            {selectedRequest.ai_pre_check_result.flags.map((f: string, i: number) => (
                              <li key={i} className="text-red-500">• {f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedRequest.ai_pre_check_result.recommendations?.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">AI Recommendations:</span>
                          <ul className="text-sm text-muted-foreground">
                            {selectedRequest.ai_pre_check_result.recommendations.map((r: string, i: number) => (
                              <li key={i}>• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notes (for approval)</label>
                  <Textarea 
                    placeholder="Add notes about this approval..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason</label>
                  <Textarea 
                    placeholder="Explain why this server is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedRequest && rejectionReason) {
                  rejectMutation.mutate({ requestId: selectedRequest.id, reason: rejectionReason });
                } else {
                  toast.error('Please provide a rejection reason');
                }
              }}
              disabled={rejectMutation.isPending}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              onClick={() => {
                if (selectedRequest) {
                  approveMutation.mutate({ requestId: selectedRequest.id, notes: reviewNotes });
                }
              }}
              disabled={approveMutation.isPending}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Approve & Create Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
