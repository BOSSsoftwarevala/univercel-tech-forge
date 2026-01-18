import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  CheckCircle2, XCircle, Clock, AlertCircle, Rocket, GitBranch,
  Cpu, Shield, User, Calendar, MessageSquare, AlertTriangle
} from 'lucide-react';

interface PMApprovalFlowProps {
  approvalType: string;
}

const mockApprovals = [
  { 
    id: 'APR-001', 
    type: 'deployment', 
    title: 'Deploy ERP Suite v3.2.1 to Production', 
    requestedBy: 'John Dev', 
    requestedAt: '2024-01-15 10:00',
    status: 'pending',
    priority: 'high',
    details: 'Critical bug fixes and new feature deployment'
  },
  { 
    id: 'APR-002', 
    type: 'version', 
    title: 'Approve CRM Pro v2.9.0 Release', 
    requestedBy: 'Sarah PM', 
    requestedAt: '2024-01-15 09:30',
    status: 'pending',
    priority: 'medium',
    details: 'New dashboard analytics and performance improvements'
  },
  { 
    id: 'APR-003', 
    type: 'module', 
    title: 'Enable AI Assistant Module', 
    requestedBy: 'Mike Tech', 
    requestedAt: '2024-01-14 16:00',
    status: 'approved',
    priority: 'low',
    details: 'Optional AI module for customer support'
  },
  { 
    id: 'APR-004', 
    type: 'deployment', 
    title: 'Deploy HR System Hotfix', 
    requestedBy: 'Lisa Support', 
    requestedAt: '2024-01-14 14:00',
    status: 'rejected',
    priority: 'high',
    details: 'Emergency fix for payroll calculation issue'
  },
];

const PMApprovalFlow: React.FC<PMApprovalFlowProps> = ({ approvalType }) => {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<typeof mockApprovals[0] | null>(null);
  const [comment, setComment] = useState('');

  const getTitle = () => {
    switch (approvalType) {
      case 'deployment-approval': return 'Deployment Approval';
      case 'version-approval': return 'Version Approval';
      case 'module-approval': return 'Module Approval';
      case 'emergency-override': return 'Emergency Override';
      default: return 'Approval Flow';
    }
  };

  const getFilteredApprovals = () => {
    switch (approvalType) {
      case 'deployment-approval': return approvals.filter(a => a.type === 'deployment');
      case 'version-approval': return approvals.filter(a => a.type === 'version');
      case 'module-approval': return approvals.filter(a => a.type === 'module');
      default: return approvals;
    }
  };

  const handleApprove = (approvalId: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId ? { ...a, status: 'approved' } : a
    ));
    const approval = approvals.find(a => a.id === approvalId);
    toast.success('Approval granted', {
      description: approval?.title
    });
    setSelectedApproval(null);
    setComment('');
  };

  const handleReject = (approvalId: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId ? { ...a, status: 'rejected' } : a
    ));
    const approval = approvals.find(a => a.id === approvalId);
    toast.error('Approval rejected', {
      description: approval?.title
    });
    setSelectedApproval(null);
    setComment('');
  };

  const handleEmergencyOverride = () => {
    toast.warning('Emergency Override Activated', {
      description: 'All pending approvals bypassed. This action has been logged.'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deployment': return Rocket;
      case 'version': return GitBranch;
      case 'module': return Cpu;
      default: return CheckCircle2;
    }
  };

  const filteredApprovals = getFilteredApprovals();

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
                onClick={handleEmergencyOverride}
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
                  <span className="text-sm">{approval.title}</span>
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {approval.priority}
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
                          <p className="font-medium text-sm truncate">{approval.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            <span>{approval.requestedBy}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>{approval.requestedAt}</span>
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
                  <h3 className="font-semibold">{selectedApproval.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedApproval.details}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Requested By</span>
                    <p className="font-medium">{selectedApproval.requestedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority</span>
                    <p className="font-medium capitalize">{selectedApproval.priority}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">{selectedApproval.type}</p>
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
                        onClick={() => handleApprove(selectedApproval.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleReject(selectedApproval.id)}
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
                <p>Select an approval to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMApprovalFlow;
