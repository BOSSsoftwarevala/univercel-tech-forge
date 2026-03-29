import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckSquare, X, Check, AlertTriangle, Clock, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ApprovalItem {
  id: string;
  requested_by_role: string;
  requested_by_id: string;
  action_type: string;
  action_payload: unknown;
  priority: string;
  status: string;
  review_notes: string | null;
  created_at: string;
}

interface ApprovalCenterViewProps {
  approvals: ApprovalItem[];
  isLoading: boolean;
  onApprove: (id: string, notes?: string) => Promise<boolean>;
  onReject: (id: string, notes: string) => Promise<boolean>;
}

const ApprovalCenterView = ({ approvals, isLoading, onApprove, onReject }: ApprovalCenterViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requested_by_role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const handleApprove = async (approval: ApprovalItem) => {
    setIsProcessing(true);
    await onApprove(approval.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectReason.trim()) return;
    
    setIsProcessing(true);
    await onReject(selectedApproval.id, rejectReason);
    setSelectedApproval(null);
    setRejectReason('');
    setIsProcessing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'normal':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const stats = {
    total: approvals.length,
    critical: approvals.filter(a => a.priority === 'critical').length,
    high: approvals.filter(a => a.priority === 'high').length,
    normal: approvals.filter(a => a.priority === 'normal' || a.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.high}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.normal}</p>
              <p className="text-sm text-muted-foreground">Normal</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {['all', 'critical', 'high', 'normal'].map((priority) => (
              <Button
                key={priority}
                variant={priorityFilter === priority ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Approval List */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Approval Queue
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredApprovals.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(approval.priority)}`}>
                          {approval.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          {approval.requested_by_role}
                        </span>
                      </div>
                      
                      <h4 className="font-medium">{approval.action_type}</h4>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        Requested {format(new Date(approval.created_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(approval)}
                        disabled={isProcessing}
                        className="text-green-500 hover:bg-green-500/10 hover:text-green-500"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApproval(approval)}
                        disabled={isProcessing}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Reject Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Approval Request</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this request:
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApproval(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim() || isProcessing}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalCenterView;
