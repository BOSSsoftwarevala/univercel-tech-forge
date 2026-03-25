import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRiskLevelColor, getRiskLevelBgColor } from '@/hooks/useRiskEngine';

interface RiskScoreDisplayProps {
  score: number;
  level: 'normal' | 'caution' | 'watch' | 'high' | 'critical';
  showDetails?: boolean;
  breakdown?: {
    login: number;
    device: number;
    transaction: number;
    behavior: number;
    commission: number;
    lead: number;
  };
  compact?: boolean;
}

export function RiskScoreDisplay({ 
  score, 
  level, 
  showDetails = false,
  breakdown,
  compact = false 
}: RiskScoreDisplayProps) {
  const getIcon = () => {
    switch (level) {
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'caution':
      case 'watch':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getMessage = () => {
    switch (level) {
      case 'normal':
        return 'Your account is in good standing';
      case 'caution':
        return 'Some activity requires attention';
      case 'watch':
        return 'Elevated risk detected';
      case 'high':
        return 'High risk activity detected';
      case 'critical':
        return 'Critical risk - immediate action required';
      default:
        return '';
    }
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg", getRiskLevelBgColor(level))}>
        {getIcon()}
        <div>
          <div className="text-sm font-medium">{score}</div>
          <div className={cn("text-xs capitalize", getRiskLevelColor(level))}>{level}</div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border", getRiskLevelBgColor(level))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getIcon()}
            Risk Score
          </span>
          <Badge variant="outline" className={cn("capitalize", getRiskLevelColor(level))}>
            {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className={cn("text-4xl font-bold", getRiskLevelColor(level))}>
              {score}
            </span>
            <span className="text-muted-foreground text-sm mb-1">/ 100</span>
          </div>

          <Progress 
            value={score} 
            className="h-2"
          />

          <p className="text-sm text-muted-foreground">
            {getMessage()}
          </p>

          {showDetails && breakdown && (
            <div className="pt-4 border-t space-y-2">
              <h4 className="text-sm font-medium">Score Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Login Pattern</span>
                  <span className="font-medium">{breakdown.login}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-medium">{breakdown.device}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction</span>
                  <span className="font-medium">{breakdown.transaction}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Behavior</span>
                  <span className="font-medium">{breakdown.behavior}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Commission</span>
                  <span className="font-medium">{breakdown.commission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lead</span>
                  <span className="font-medium">{breakdown.lead}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}