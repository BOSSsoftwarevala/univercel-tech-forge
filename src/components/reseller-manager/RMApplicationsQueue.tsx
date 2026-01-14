import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Shield,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ResellerApplication {
  id: string;
  user_id: string;
  application_type: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  id_proof_uploaded: boolean;
  terms_accepted: boolean;
  promise_acknowledged: boolean;
  status: string;
  reviewer_id: string | null;
  reviewer_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export const RMApplicationsQueue: React.FC = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [clarificationRequest, setClarificationRequest] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
        return;
      }

      setApplications(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('reseller_applications')
        .update({ 
          status: 'approved',
          reviewer_id: session?.user?.id || null,
          reviewer_notes: 'Application approved'
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to approve application');
        return;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: 'approved' } : app
        )
      );
      toast.success('Reseller application approved');
      setSelectedApp(null);
    } catch (err) {
      toast.error('Error approving application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is mandatory');
      return;
    }

    setProcessingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('reseller_applications')
        .update({ 
          status: 'rejected',
          reviewer_id: session?.user?.id || null,
          rejection_reason: rejectReason
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to reject application');
        return;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: 'rejected' } : app
        )
      );
      toast.success('Application rejected with reason logged');
      setRejectReason('');
      setSelectedApp(null);
    } catch (err) {
      toast.error('Error rejecting application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestClarification = async (id: string) => {
    if (!clarificationRequest.trim()) {
      toast.error('Clarification request details required');
      return;
    }

    setProcessingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('reseller_applications')
        .update({ 
          status: 'info_requested',
          reviewer_id: session?.user?.id || null,
          reviewer_notes: clarificationRequest
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to request clarification');
        return;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: 'info_requested' } : app
        )
      );
      toast.success('Clarification request sent to applicant');
      setClarificationRequest('');
      setSelectedApp(null);
    } catch (err) {
      toast.error('Error requesting clarification');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingApps = applications.filter(app => app.status === 'pending' || app.status === 'info_requested');
  const approvedApps = applications.filter(app => app.status === 'approved');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Pending Review</Badge>;
      case 'info_requested':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Info Requested</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading applications...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            Reseller Applications Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchApplications}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <Shield className="h-3 w-3 mr-1" />
              Auto-Approve BLOCKED
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-muted-foreground">
            Pending: <strong className="text-yellow-500">{pendingApps.length}</strong>
          </span>
          <span className="text-muted-foreground">
            Approved: <strong className="text-green-500">{approvedApps.length}</strong>
          </span>
          <span className="text-muted-foreground">
            Rejected: <strong className="text-red-500">{rejectedApps.length}</strong>
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No applications received yet</p>
              <p className="text-xs mt-1">Applications will appear here when users apply</p>
            </div>
          ) : (
            applications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-border rounded-lg p-4 mb-4 bg-background"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">
                        {app.id.slice(0, 8).toUpperCase()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {app.application_type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-foreground">{app.full_name}</h4>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  {app.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{app.country}</span>
                    </div>
                  )}
                  {app.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{app.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{app.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="text-muted-foreground">
                    ID Proof: <strong className={app.id_proof_uploaded ? "text-green-500" : "text-red-500"}>
                      {app.id_proof_uploaded ? "Uploaded" : "Not Uploaded"}
                    </strong>
                  </span>
                  <span className="text-muted-foreground">
                    Terms: <strong className={app.terms_accepted ? "text-green-500" : "text-red-500"}>
                      {app.terms_accepted ? "Accepted" : "Not Accepted"}
                    </strong>
                  </span>
                </div>

                {app.status === 'pending' || app.status === 'info_requested' ? (
                  selectedApp === app.id ? (
                    <div className="space-y-4 border-t border-border pt-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Rejection Reason (mandatory for reject):
                        </label>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Provide detailed reason for rejection..."
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Request Clarification:
                        </label>
                        <Textarea
                          value={clarificationRequest}
                          onChange={(e) => setClarificationRequest(e.target.value)}
                          placeholder="What additional information do you need?"
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(app.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processingId === app.id}
                        >
                          {processingId === app.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(app.id)}
                          disabled={processingId === app.id}
                        >
                          {processingId === app.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRequestClarification(app.id)}
                          disabled={processingId === app.id}
                        >
                          {processingId === app.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4 mr-1" />
                          )}
                          Request Info
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedApp(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedApp(app.id)}
                    >
                      Review Application
                    </Button>
                  )
                ) : (
                  <div className="text-sm text-muted-foreground border-t border-border pt-2">
                    {app.status === 'approved' && (
                      <span className="text-green-500">✓ Application approved</span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="text-red-500">✗ Rejected: {app.rejection_reason || 'No reason provided'}</span>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <p className="text-xs text-yellow-500">
              Each application must be reviewed individually. Auto-approve and bulk actions are permanently disabled for compliance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};