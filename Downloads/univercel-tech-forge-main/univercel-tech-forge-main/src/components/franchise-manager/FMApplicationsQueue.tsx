import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, MapPin, User, FileCheck, AlertTriangle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface FranchiseApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  requestedTerritory: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  appliedAt: string;
  businessType: string;
  investmentCapacity: string;
}

const mockApplications: FranchiseApplication[] = [
  {
    id: 'FA-001',
    businessName: 'TechVentures Mumbai',
    ownerName: 'Rajesh Kumar',
    email: 'r***@tech***.com',
    phone: '+91 98***54321',
    requestedTerritory: 'Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    experience: '5+ years in tech distribution',
    kycStatus: 'verified',
    appliedAt: '2024-01-15',
    businessType: 'Technology Distribution',
    investmentCapacity: '₹50L - ₹1Cr'
  },
  {
    id: 'FA-002',
    businessName: 'Digital Solutions Pune',
    ownerName: 'Priya Sharma',
    email: 'p***@digital***.com',
    phone: '+91 87***12345',
    requestedTerritory: 'Pune East',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    experience: '3 years in SaaS sales',
    kycStatus: 'pending',
    appliedAt: '2024-01-14',
    businessType: 'SaaS Reselling',
    investmentCapacity: '₹25L - ₹50L'
  }
];

export function FMApplicationsQueue() {
  const [applications] = useState<FranchiseApplication[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<FranchiseApplication | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showClarifyDialog, setShowClarifyDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [clarifyMessage, setClarifyMessage] = useState('');

  const handleApprove = (app: FranchiseApplication) => {
    if (app.kycStatus !== 'verified') {
      toast.error('Cannot Approve', {
        description: 'KYC must be verified before approval'
      });
      return;
    }
    toast.success('Franchise Approved', {
      description: `${app.businessName} has been approved for ${app.requestedTerritory}`
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Reason Required', {
        description: 'You must provide a reason for rejection'
      });
      return;
    }
    toast.success('Application Rejected', {
      description: 'Rejection reason has been recorded'
    });
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedApp(null);
  };

  const handleClarify = () => {
    if (!clarifyMessage.trim()) {
      toast.error('Message Required', {
        description: 'You must provide a clarification request'
      });
      return;
    }
    toast.success('Clarification Requested', {
      description: 'Request sent to applicant'
    });
    setShowClarifyDialog(false);
    setClarifyMessage('');
    setSelectedApp(null);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Franchise Applications Queue
          </CardTitle>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            Auto/Bulk Approve BLOCKED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{app.businessName}</span>
                      <Badge variant="outline" className="text-xs">{app.id}</Badge>
                      <Badge 
                        variant={app.kycStatus === 'verified' ? 'default' : 'secondary'}
                        className={app.kycStatus === 'verified' ? 'bg-green-500/20 text-green-400' : ''}
                      >
                        KYC: {app.kycStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {app.ownerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.requestedTerritory}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCheck className="h-3 w-3" />
                        {app.experience}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.city}, {app.state} • {app.businessType} • {app.investmentCapacity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowClarifyDialog(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Clarify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app)}
                      disabled={app.kycStatus !== 'verified'}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Reject Application
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Rejecting: <strong>{selectedApp?.businessName}</strong>
              </p>
              <Textarea
                placeholder="Reason for rejection (mandatory)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clarify Dialog */}
        <Dialog open={showClarifyDialog} onOpenChange={setShowClarifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Request Clarification
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Requesting clarification from: <strong>{selectedApp?.businessName}</strong>
              </p>
              <Textarea
                placeholder="What clarification do you need?..."
                value={clarifyMessage}
                onChange={(e) => setClarifyMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClarifyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleClarify}>
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
