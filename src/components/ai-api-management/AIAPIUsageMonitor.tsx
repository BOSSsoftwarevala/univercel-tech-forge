/**
 * AI API Usage & Cost Monitor
 * Live cost tracking with limit alerts
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, AlertTriangle, RefreshCw, 
  Calendar, BarChart3, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIAPIManagement } from '@/hooks/useAIAPIManagement';
import { cn } from '@/lib/utils';

interface UsageMonitorProps {
  monthlyBudget?: number;
}

export function AIAPIUsageMonitor({ monthlyBudget = 1000 }: UsageMonitorProps) {
  const { fetchUsageLogs, checkCostLimits, usageLogs, loading } = useAIAPIManagement();
  const [costData, setCostData] = useState({
    currentSpend: 0,
    percentUsed: 0,
    shouldWarn: false,
    shouldStop: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    await fetchUsageLogs();
    const costs = await checkCostLimits(monthlyBudget);
    setCostData(costs);
    setRefreshing(false);
  }, [fetchUsageLogs, checkCostLimits, monthlyBudget]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate stats from logs
  const todayLogs = usageLogs.filter(log => {
    const logDate = new Date(log.created_at);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  const todaySpend = todayLogs.reduce((sum, log) => sum + (log.final_cost || 0), 0);
  const todayRequests = todayLogs.reduce((sum, log) => sum + (log.request_count || 0), 0);
  const todayTokens = todayLogs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);

  const percentUsed = costData.percentUsed * 100;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            AI/API Usage & Costs
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-1", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Budget Usage</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-semibold",
                costData.shouldStop && "text-destructive",
                costData.shouldWarn && !costData.shouldStop && "text-amber-400",
                !costData.shouldWarn && "text-emerald-400"
              )}>
                ${costData.currentSpend.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/ ${monthlyBudget}</span>
            </div>
          </div>
          <Progress 
            value={Math.min(percentUsed, 100)} 
            className={cn(
              "h-3",
              costData.shouldStop && "[&>div]:bg-destructive",
              costData.shouldWarn && !costData.shouldStop && "[&>div]:bg-amber-500",
            )}
          />
          {costData.shouldStop && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Budget exceeded! Auto-stop triggered.</span>
            </div>
          )}
          {costData.shouldWarn && !costData.shouldStop && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Approaching budget limit ({percentUsed.toFixed(1)}% used)</span>
            </div>
          )}
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="bg-muted/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Today's Spend
            </div>
            <div className="text-xl font-bold text-emerald-400">
              ${todaySpend.toFixed(2)}
            </div>
          </motion.div>

          <motion.div 
            className="bg-muted/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              Requests Today
            </div>
            <div className="text-xl font-bold text-primary">
              {todayRequests.toLocaleString()}
            </div>
          </motion.div>

          <motion.div 
            className="bg-muted/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <BarChart3 className="w-3 h-3" />
              Tokens Used
            </div>
            <div className="text-xl font-bold text-violet-400">
              {(todayTokens / 1000).toFixed(1)}K
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Recent Activity</h4>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : usageLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No usage logs yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {usageLogs.slice(0, 10).map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between py-2 px-3 bg-muted/10 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {log.module}
                    </Badge>
                    <span className="text-muted-foreground">
                      {log.provider}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {log.tokens_used?.toLocaleString() || 0} tokens
                    </span>
                    <span className="text-emerald-400 font-medium">
                      ${(log.final_cost || 0).toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
