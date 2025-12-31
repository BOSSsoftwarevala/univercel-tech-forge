import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Check, X, MessageSquare, Eye, Globe, Users, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  valaId: string;
  platformLinks: string[];
  audienceType: string;
  region: string;
  followers: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
}

const mockApplications: Application[] = [
  { id: '1', valaId: 'VL-8472913', platformLinks: ['instagram.com/user1', 'youtube.com/c/user1'], audienceType: 'Tech & Gadgets', region: 'India - South', followers: '125K', appliedAt: '2024-01-15', status: 'pending' },
  { id: '2', valaId: 'VL-3829174', platformLinks: ['tiktok.com/@user2'], audienceType: 'Lifestyle', region: 'India - North', followers: '89K', appliedAt: '2024-01-14', status: 'pending' },
  { id: '3', valaId: 'VL-9281736', platformLinks: ['youtube.com/c/user3', 'twitter.com/user3'], audienceType: 'Finance', region: 'India - West', followers: '312K', appliedAt: '2024-01-14', status: 'pending' },
  { id: '4', valaId: 'VL-1827364', platformLinks: ['instagram.com/user4'], audienceType: 'Fashion', region: 'India - East', followers: '67K', appliedAt: '2024-01-13', status: 'info_requested' },
];

export function IMApplicationsQueue() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [infoRequest, setInfoRequest] = useState('');

  const handleApprove = (app: Application) => {
    // SECURITY: No auto-approve, no bulk approve - individual action only
    setApplications(prev => prev.map(a => 
      a.id === app.id ? { ...a, status: 'approved' as const } : a
    ));
    toast({
      title: "Application Approved",
      description: `Influencer ${app.valaId} has been approved. Action logged.`,
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Reason Required",
        description: "You must provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    if (selectedApp) {
      setApplications(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, status: 'rejected' as const } : a
      ));
      toast({
        title: "Application Rejected",
        description: `Influencer ${selectedApp.valaId} rejected. Reason logged.`,
      });
    }
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedApp(null);
  };

  const handleRequestInfo = () => {
    if (!infoRequest.trim()) {
      toast({
        title: "Message Required",
        description: "You must specify what information is needed.",
        variant: "destructive",
      });
      return;
    }

    if (selectedApp) {
      setApplications(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, status: 'info_requested' as const } : a
      ));
      toast({
        title: "Information Requested",
        description: `Request sent to ${selectedApp.valaId}. Action logged.`,
      });
    }
    setShowInfoDialog(false);
    setInfoRequest('');
    setSelectedApp(null);
  };

  const pendingApps = applications.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Applications Queue</h2>
          <p className="text-sm text-muted-foreground">Review influencer applications • No auto-approve • No bulk actions</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
          {pendingApps.length} Pending
        </Badge>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-amber-300">Auto-approve and bulk approve are BLOCKED. Each application requires individual review.</span>
      </div>

      <div className="space-y-4">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-foreground">{app.valaId}</p>
                        <p className="text-xs text-muted-foreground">Applied {app.appliedAt}</p>
                      </div>
                      <Badge variant={
                        app.status === 'pending' ? 'outline' :
                        app.status === 'approved' ? 'default' :
                        app.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{app.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{app.followers} followers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{app.audienceType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{app.platformLinks.length} platforms</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {app.platformLinks.map((link, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {link}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(app)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowRejectDialog(true);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowInfoDialog(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Request Info
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reject Dialog - Reason Mandatory */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Rejecting application for <span className="font-mono font-semibold">{selectedApp?.valaId}</span>
            </p>
            <div>
              <label className="text-sm font-medium">Rejection Reason (Required)</label>
              <Textarea
                placeholder="Provide a detailed reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Requesting info from <span className="font-mono font-semibold">{selectedApp?.valaId}</span>
            </p>
            <div>
              <label className="text-sm font-medium">Information Needed (Required)</label>
              <Textarea
                placeholder="Specify what additional information is required..."
                value={infoRequest}
                onChange={(e) => setInfoRequest(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestInfo}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
