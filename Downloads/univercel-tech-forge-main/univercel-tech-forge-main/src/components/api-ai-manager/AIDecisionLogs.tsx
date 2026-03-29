import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, Clock, Filter, CheckCircle, XCircle, AlertTriangle, MessageSquare, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIDecision {
  id: string;
  modelName: string;
  decisionType: 'suggestion' | 'warning' | 'insight';
  input: string;
  output: string;
  confidence: number;
  humanAction: 'approved' | 'rejected' | 'pending' | 'modified';
  humanNote?: string;
  timestamp: string;
  processingTime: number;
}

const mockDecisions: AIDecision[] = [
  { id: '1', modelName: 'Fraud Detection AI', decisionType: 'warning', input: 'Transaction pattern analysis for user VL-7382916', output: 'High risk: 78% fraud probability. Unusual velocity detected.', confidence: 78, humanAction: 'approved', humanNote: 'Confirmed after manual review. Account flagged.', timestamp: '2024-01-15 16:45:22', processingTime: 120 },
  { id: '2', modelName: 'Lead Scoring AI', decisionType: 'insight', input: 'Lead qualification for 15 new signups', output: 'Top 3 leads identified. Priority: L-8923, L-8925, L-8927', confidence: 85, humanAction: 'approved', timestamp: '2024-01-15 16:30:18', processingTime: 340 },
  { id: '3', modelName: 'Content Moderation AI', decisionType: 'suggestion', input: 'Review promotional content from influencer VL-2918374', output: 'Suggest rejection: Contains unverified claims about product efficacy', confidence: 72, humanAction: 'modified', humanNote: 'Requested revision instead of rejection.', timestamp: '2024-01-15 15:22:45', processingTime: 280 },
  { id: '4', modelName: 'Fraud Detection AI', decisionType: 'warning', input: 'IP analysis for login attempts', output: 'Suspicious: 47 login attempts from datacenter IP range', confidence: 91, humanAction: 'approved', humanNote: 'IP range blocked.', timestamp: '2024-01-15 14:15:33', processingTime: 85 },
  { id: '5', modelName: 'SEO Optimizer AI', decisionType: 'suggestion', input: 'Keyword recommendations for landing page', output: 'Add keywords: "enterprise solution", "scalable platform"', confidence: 68, humanAction: 'pending', timestamp: '2024-01-15 13:45:12', processingTime: 450 },
  { id: '6', modelName: 'Behavior Analysis AI', decisionType: 'warning', input: 'User session analysis for anomaly detection', output: 'Low risk: Pattern within normal bounds', confidence: 45, humanAction: 'rejected', humanNote: 'False positive. User behavior explained by timezone change.', timestamp: '2024-01-15 12:30:00', processingTime: 560 },
];

export function AIDecisionLogs() {
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'modified': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'insight': return <Brain className="w-4 h-4 text-blue-400" />;
      default: return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-400';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const filteredDecisions = mockDecisions.filter(d => {
    if (filterModel !== 'all' && d.modelName !== filterModel) return false;
    if (filterAction !== 'all' && d.humanAction !== filterAction) return false;
    return true;
  });

  const uniqueModels = [...new Set(mockDecisions.map(d => d.modelName))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Decision Logs</h2>
          <p className="text-sm text-muted-foreground">All AI outputs reviewed • Human decisions logged</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          IMMUTABLE
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <Select value={filterModel} onValueChange={setFilterModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="modified">Modified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredDecisions.length} of {mockDecisions.length} decisions
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Decision Logs */}
      <div className="space-y-4">
        {filteredDecisions.map((decision, index) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getDecisionIcon(decision.decisionType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{decision.modelName}</span>
                      <Badge variant="outline">
                        {decision.decisionType.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getActionBadge(decision.humanAction)}>
                        {decision.humanAction === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {decision.humanAction === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {decision.humanAction.toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                        {decision.confidence}% confidence
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">AI Input:</p>
                        <p className="text-sm text-foreground">{decision.input}</p>
                      </div>
                      <div className="p-2 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">AI Output:</p>
                        <p className="text-sm text-foreground">{decision.output}</p>
                      </div>
                      {decision.humanNote && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Human Note:</p>
                          <p className="text-sm text-emerald-300">{decision.humanNote}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{decision.timestamp}</span>
                      </div>
                      <span>Processing: {decision.processingTime}ms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockDecisions.filter(d => d.humanAction === 'approved').length}
            </div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockDecisions.filter(d => d.humanAction === 'rejected').length}
            </div>
            <div className="text-xs text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockDecisions.filter(d => d.humanAction === 'modified').length}
            </div>
            <div className="text-xs text-muted-foreground">Modified</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockDecisions.filter(d => d.humanAction === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
