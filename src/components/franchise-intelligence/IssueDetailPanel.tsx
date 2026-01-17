import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertCircle, 
  User, 
  Calendar, 
  Clock, 
  Paperclip,
  Brain,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { FranchiseIssue } from './types';

interface IssueDetailPanelProps {
  issue: FranchiseIssue | null;
  onClose: () => void;
  onAction: (action: string, issueId: string) => void;
}

export function IssueDetailPanel({ issue, onClose, onAction }: IssueDetailPanelProps) {
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!issue) {
    return (
      <div className="w-96 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Select an issue to view details</p>
        </div>
      </div>
    );
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle };
      case 'high': return { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle };
      case 'medium': return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock };
      default: return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: AlertCircle };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { color: 'bg-blue-500/20 text-blue-400', label: 'Open' };
      case 'in_progress': return { color: 'bg-amber-500/20 text-amber-400', label: 'In Progress' };
      case 'escalated': return { color: 'bg-red-500/20 text-red-400', label: 'Escalated' };
      case 'resolved': return { color: 'bg-emerald-500/20 text-emerald-400', label: 'Resolved' };
      case 'closed': return { color: 'bg-muted text-muted-foreground', label: 'Closed' };
      default: return { color: 'bg-muted text-muted-foreground', label: status };
    }
  };

  const handleAction = async (action: string) => {
    setIsProcessing(true);
    try {
      // Log the action
      await supabase.from('audit_logs').insert({
        action: `franchise_issue_${action}`,
        module: 'franchise_intelligence',
        meta_json: {
          issue_id: issue.id,
          franchise_code: issue.franchiseCode,
          action_note: actionNote,
          previous_status: issue.status
        }
      });

      onAction(action, issue.id);
      toast.success(`Issue ${action} successfully`, {
        description: `Issue ${issue.id} has been ${action}`
      });
      setActionNote('');
    } catch (error) {
      toast.error('Action failed', { description: 'Please try again' });
    } finally {
      setIsProcessing(false);
    }
  };

  const priorityConfig = getPriorityConfig(issue.priority);
  const statusConfig = getStatusConfig(issue.status);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="w-96 bg-card border-l border-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Issue ID</p>
            <h3 className="font-semibold text-foreground">{issue.id}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={priorityConfig.color}>
            {issue.priority.toUpperCase()}
          </Badge>
          <Badge className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {issue.category}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Issue Details */}
          <div>
            <h4 className="font-medium text-foreground mb-2">{issue.title}</h4>
            <p className="text-sm text-muted-foreground">{issue.description}</p>
          </div>

          <Separator />

          {/* Meta Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Reported By</p>
                <p className="font-medium">{issue.reportedBy} ({issue.reportedByRole})</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Reported At</p>
                <p className="font-medium">{new Date(issue.reportedAt).toLocaleString()}</p>
              </div>
            </div>

            {issue.assignedTo && (
              <div className="flex items-center gap-3 text-sm">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{issue.assignedTo}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Attachments */}
          {issue.attachments && issue.attachments.length > 0 && (
            <>
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({issue.attachments.length})
                </h5>
                <div className="space-y-1">
                  {issue.attachments.map((attachment, index) => (
                    <div key={index} className="text-sm text-primary hover:underline cursor-pointer">
                      {attachment}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* AI Risk Assessment */}
          {issue.aiRiskAssessment && (
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-400 mb-1">AI Risk Assessment</p>
                    <p className="text-sm text-foreground">{issue.aiRiskAssessment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impact Estimate */}
          {issue.impactEstimate && (
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-1">Impact Estimate</p>
                    <p className="text-sm text-foreground">{issue.impactEstimate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Escalation History */}
          {issue.escalationHistory && issue.escalationHistory.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Escalation History
              </h5>
              <div className="space-y-2">
                {issue.escalationHistory.map((entry, index) => (
                  <div key={index} className="text-xs bg-muted/50 p-2 rounded-lg">
                    <p className="text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                    <p className="font-medium">{entry.from} → {entry.to}</p>
                    <p className="text-muted-foreground">{entry.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Action Note */}
          <div>
            <label className="text-sm font-medium mb-2 block">Action Note</label>
            <Textarea
              placeholder="Add notes for this action..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Inline Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('assign')}
            disabled={isProcessing}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
            onClick={() => handleAction('escalate')}
            disabled={isProcessing}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Escalate
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('request_info')}
            disabled={isProcessing}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Request Info
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => handleAction('resolve')}
            disabled={isProcessing}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Resolve
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('close')}
            disabled={isProcessing}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Close
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleAction('mark_critical')}
            disabled={isProcessing}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Mark Critical
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
