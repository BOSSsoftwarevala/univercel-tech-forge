import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import {
  TrendingDown,
  Shield,
  RefreshCcw,
  MessageSquare,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
} from 'lucide-react';

interface Issue {
  id: string;
  type: 'sales_drop' | 'compliance_missing' | 'high_refund' | 'customer_complaints' | 'payment_delay';
  resellerId: string;
  resellerName: string;
  reason: string;
  impact: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiSuggestion: string;
  createdAt: string;
  status: 'open' | 'in_progress' | 'resolved';
}

const mockIssues: Issue[] = [
  { id: 'I001', type: 'sales_drop', resellerId: '3', resellerName: 'CloudFirst IT', reason: 'Sales dropped 45% this week', impact: 'Revenue loss ₹2.5L expected', severity: 'high', aiSuggestion: 'Schedule call with reseller. Review territory performance.', createdAt: '2024-01-18T10:30:00Z', status: 'open' },
  { id: 'I002', type: 'compliance_missing', resellerId: '5', resellerName: 'BritTech Partners', reason: 'KYC documents expired', impact: 'Operations suspended', severity: 'critical', aiSuggestion: 'Send reminder email. Consider suspension if not resolved in 48h.', createdAt: '2024-01-17T14:00:00Z', status: 'in_progress' },
  { id: 'I003', type: 'high_refund', resellerId: '2', resellerName: 'Digital Dreams', reason: 'Refund rate increased to 12%', impact: 'Quality concern flagged', severity: 'medium', aiSuggestion: 'Review client feedback. May need additional training.', createdAt: '2024-01-16T09:15:00Z', status: 'open' },
  { id: 'I004', type: 'customer_complaints', resellerId: '1', resellerName: 'TechSoft Solutions', reason: '3 complaints in last 7 days', impact: 'Client satisfaction at risk', severity: 'medium', aiSuggestion: 'Review complaint details. Schedule quality review meeting.', createdAt: '2024-01-15T16:45:00Z', status: 'open' },
  { id: 'I005', type: 'payment_delay', resellerId: '4', resellerName: 'StartupBoost LLC', reason: 'Delayed payment by 15 days', impact: 'Cash flow impact ₹1.25L', severity: 'high', aiSuggestion: 'Send formal reminder. Consider commission hold if not resolved.', createdAt: '2024-01-14T11:00:00Z', status: 'open' },
];

const issueIcons: Record<string, any> = {
  sales_drop: TrendingDown,
  compliance_missing: Shield,
  high_refund: RefreshCcw,
  customer_complaints: MessageSquare,
  payment_delay: Clock,
};

const issueLabels: Record<string, string> = {
  sales_drop: 'Sales Drop',
  compliance_missing: 'Compliance Missing',
  high_refund: 'High Refund Rate',
  customer_complaints: 'Customer Complaints',
  payment_delay: 'Payment Delay',
};

export function IssuesEscalationsView() {
  const { logToAudit, resolve, escalate } = useGlobalActions();
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const handleResolve = async (issue: Issue) => {
    await resolve('ticket', issue.id, `Issue resolved for ${issue.resellerName}`);
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: 'resolved' } : i));
  };

  const handleEscalate = async (issue: Issue) => {
    await escalate('ticket', issue.id, 2, 'Escalated to senior management');
    toast.success(`Issue escalated to senior management`);
  };

  const handleViewDetails = async (issue: Issue) => {
    await logToAudit('view_issue', 'ticket', { issueId: issue.id, resellerId: issue.resellerId });
    toast.info(`Viewing details for ${issue.resellerName}`);
  };

  const handleAcceptAISuggestion = async (issue: Issue) => {
    await logToAudit('accept_ai_suggestion', 'ticket', { issueId: issue.id, suggestion: issue.aiSuggestion });
    toast.success('AI suggestion accepted and action initiated');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const openIssues = issues.filter(i => i.status !== 'resolved');
  const criticalCount = issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Issues & Escalations</h2>
          <p className="text-sm text-slate-400">Auto-detected and flagged issues</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-slate-400">
            {openIssues.length} Open Issues
          </Badge>
          {criticalCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </div>

      {/* Issue Cards */}
      <div className="space-y-3">
        {issues.map((issue) => {
          const IssueIcon = issueIcons[issue.type] || AlertTriangle;
          
          return (
            <Card 
              key={issue.id} 
              className={`bg-slate-900/50 border-slate-700/50 ${issue.status === 'resolved' ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    issue.severity === 'critical' ? 'bg-red-500/20' :
                    issue.severity === 'high' ? 'bg-orange-500/20' :
                    issue.severity === 'medium' ? 'bg-amber-500/20' : 'bg-slate-500/20'
                  }`}>
                    <IssueIcon className={`w-5 h-5 ${
                      issue.severity === 'critical' ? 'text-red-400' :
                      issue.severity === 'high' ? 'text-orange-400' :
                      issue.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{issue.resellerName}</span>
                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <Badge variant="outline" className="text-slate-400 border-slate-600">
                        {issueLabels[issue.type]}
                      </Badge>
                      {issue.status === 'resolved' && (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Resolved</Badge>
                      )}
                    </div>

                    <p className="text-sm text-white mb-1">{issue.reason}</p>
                    <p className="text-xs text-red-400 mb-2">Impact: {issue.impact}</p>

                    {/* AI Suggestion */}
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold text-purple-400">AI Suggestion</span>
                      </div>
                      <p className="text-sm text-slate-300">{issue.aiSuggestion}</p>
                    </div>

                    {/* Actions */}
                    {issue.status !== 'resolved' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleViewDetails(issue)} variant="outline" className="gap-1">
                          <Eye className="w-3 h-3" /> View Details
                        </Button>
                        <Button size="sm" onClick={() => handleAcceptAISuggestion(issue)} variant="secondary" className="gap-1">
                          <Brain className="w-3 h-3" /> Accept AI Suggestion
                        </Button>
                        <Button size="sm" onClick={() => handleResolve(issue)} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </Button>
                        {issue.severity === 'critical' && (
                          <Button size="sm" onClick={() => handleEscalate(issue)} variant="destructive" className="gap-1">
                            <ArrowRight className="w-3 h-3" /> Escalate
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default IssuesEscalationsView;
