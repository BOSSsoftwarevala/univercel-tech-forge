import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, CheckCircle, Globe, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface AIInsight {
  id: string;
  scope: string;
  scope_value: string | null;
  related_role: string | null;
  issue_detected: string;
  suggested_action: string | null;
  confidence_score: number;
  is_acknowledged: boolean;
  created_at: string;
}

interface AIAdvisorViewProps {
  insights: AIInsight[];
  isLoading: boolean;
  onAcknowledge: (id: string) => Promise<boolean>;
}

const AIAdvisorView = ({ insights, isLoading, onAcknowledge }: AIAdvisorViewProps) => {
  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global':
        return <Globe className="w-4 h-4" />;
      case 'continent':
        return <Globe className="w-4 h-4" />;
      case 'country':
        return <Globe className="w-4 h-4" />;
      case 'role':
        return <Users className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const stats = {
    total: insights.length,
    global: insights.filter(i => i.scope === 'global').length,
    highConfidence: insights.filter(i => i.confidence_score >= 80).length,
    actionable: insights.filter(i => i.suggested_action).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Active Insights</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.global}</p>
              <p className="text-sm text-muted-foreground">Global Scope</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.highConfidence}</p>
              <p className="text-sm text-muted-foreground">High Confidence</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Lightbulb className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.actionable}</p>
              <p className="text-sm text-muted-foreground">Actionable</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Command Advisor
          </h3>
          <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
            Powered by AI
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          AI-generated insights for proactive decision making. These are suggestions based on pattern analysis and predictive models.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active insights at the moment</p>
            <p className="text-sm mt-1">AI is monitoring for patterns and anomalies</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-primary/5 to-transparent"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-muted">
                          {getScopeIcon(insight.scope)}
                          {insight.scope}
                          {insight.scope_value && `: ${insight.scope_value}`}
                        </span>
                        {insight.related_role && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                            {insight.related_role}
                          </span>
                        )}
                        <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence_score)}`}>
                          {insight.confidence_score}% confidence
                        </span>
                      </div>
                      
                      <h4 className="font-medium">{insight.issue_detected}</h4>
                      
                      {insight.suggested_action && (
                        <div className="mt-2 p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            <strong>Suggested Action:</strong> {insight.suggested_action}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Generated {format(new Date(insight.created_at), 'MMM d, yyyy HH:mm')}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAcknowledge(insight.id)}
                          className="text-green-500 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ AI insights are for guidance only. Always verify before taking action. AI does not execute actions automatically.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIAdvisorView;
