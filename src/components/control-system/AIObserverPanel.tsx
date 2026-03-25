/**
 * AI Observer Panel - READ ONLY
 * 
 * AI Rules:
 * - AI observes silently
 * - AI cannot execute, approve, or edit
 * - AI generates behavior score & risk flag
 * - AI submits report upward only
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle, TrendingUp, Eye, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AIObserverPanelProps {
  behaviorScore: number; // 0-100
  riskFlags: string[];
  anomalyCount: number;
  observationCount: number;
}

export function AIObserverPanel({
  behaviorScore = 85,
  riskFlags = [],
  anomalyCount = 0,
  observationCount = 0
}: AIObserverPanelProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (score >= 50) return { level: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { level: 'High', color: 'text-destructive', bg: 'bg-destructive/20' };
  };

  const risk = getRiskLevel(behaviorScore);

  return (
    <Card className="glass-panel border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-base">
            <Bot className="w-5 h-5 text-primary" />
            AI Observer
            <Badge variant="outline" className="text-xs font-mono ml-2">READ-ONLY</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="font-mono">Silent Mode</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Behavior Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-mono">Behavior Score</span>
            <span className={cn('font-mono font-bold', risk.color)}>{behaviorScore}/100</span>
          </div>
          <Progress value={behaviorScore} className="h-2" />
          <Badge className={cn('text-xs font-mono', risk.bg, risk.color)}>
            {risk.level} Risk
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/30 text-center">
            <Activity className="w-4 h-4 mx-auto text-primary mb-1" />
            <div className="text-lg font-mono font-bold">{observationCount}</div>
            <div className="text-xs text-muted-foreground">Observations</div>
          </div>
          <div className="p-3 rounded-lg bg-background/30 text-center">
            <AlertTriangle className={cn('w-4 h-4 mx-auto mb-1', anomalyCount > 0 ? 'text-amber-400' : 'text-muted-foreground')} />
            <div className="text-lg font-mono font-bold">{anomalyCount}</div>
            <div className="text-xs text-muted-foreground">Anomalies</div>
          </div>
        </div>

        {/* Risk Flags */}
        {riskFlags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">Risk Flags</div>
            <div className="flex flex-wrap gap-1">
              {riskFlags.map((flag, i) => (
                <Badge key={i} variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/50">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Notice */}
        <div className="text-xs text-muted-foreground text-center font-mono pt-2 border-t border-border/50">
          <Shield className="w-3 h-3 inline-block mr-1" />
          AI cannot execute • Reports upward only
        </div>
      </CardContent>
    </Card>
  );
}

export default AIObserverPanel;
