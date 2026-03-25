import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AIInsight, FranchiseProfile } from './types';

interface AIInsightsPanelProps {
  franchise: FranchiseProfile | null;
  insights: AIInsight[];
  onAcknowledge: (insightId: string) => void;
}

export function AIInsightsPanel({ franchise, insights, onAcknowledge }: AIInsightsPanelProps) {
  if (!franchise) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="text-center">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Select a Franchise</h3>
          <p className="text-sm text-muted-foreground/70">AI insights will appear here</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <RefreshCw className="h-5 w-5" />;
      case 'prediction': return <TrendingDown className="h-5 w-5" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'warning': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' };
      default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };
    }
  };

  const handleRefresh = () => {
    toast.info('Refreshing AI Insights...', { description: 'Analyzing latest franchise data' });
    // AI refresh logic would go here
  };

  const weeklyHealthScore = Math.round(
    (franchise.complianceScore + franchise.performanceScore) / 2
  );

  return (
    <div className="flex-1 overflow-auto p-6 bg-background/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-7 w-7 text-purple-400" />
            AI Insights & Suggestions
          </h2>
          <p className="text-sm text-muted-foreground">
            {franchise.franchiseCode} • Powered by AI Analytics
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Weekly Health Score */}
      <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Weekly Franchise Health Score</h3>
              <p className="text-sm text-muted-foreground">AI-generated based on all metrics</p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-4xl font-bold",
                weeklyHealthScore >= 80 ? 'text-emerald-400' :
                weeklyHealthScore >= 60 ? 'text-amber-400' : 'text-red-400'
              )}>
                {weeklyHealthScore}%
              </p>
              <p className="text-sm text-muted-foreground">
                {weeklyHealthScore >= 80 ? 'Healthy' :
                 weeklyHealthScore >= 60 ? 'Needs Attention' : 'Critical'}
              </p>
            </div>
          </div>
          <Progress 
            value={weeklyHealthScore} 
            className="h-2 mt-4"
          />
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const colorConfig = getInsightColor(insight.severity);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full",
                colorConfig.bg,
                colorConfig.border,
                insight.acknowledged && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2 rounded-lg", colorConfig.bg)}>
                      <span className={colorConfig.text}>
                        {getInsightIcon(insight.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {insight.type}
                      </Badge>
                      <Badge className={cn(
                        "text-xs",
                        insight.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        insight.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {insight.severity}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-3">{insight.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(insight.generatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {insight.confidence}%
                      </span>
                      {!insight.acknowledged ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => onAcknowledge(insight.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Advisory Note */}
      <Card className="mt-6 bg-muted/30 border-muted">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Advisory</p>
              <p className="text-xs text-muted-foreground">
                AI provides insights and suggestions based on data patterns. All recommendations 
                are advisory only. Critical decisions require human approval. AI will never 
                execute destructive actions autonomously.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
