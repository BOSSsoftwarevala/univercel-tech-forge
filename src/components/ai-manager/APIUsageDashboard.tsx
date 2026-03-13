/**
 * APIUsageDashboard – Real-time usage monitoring
 * Shows usage graphs per service, cost breakdown, monthly billing summary.
 */

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import {
  getUsageSummary,
  getCostBreakdown,
  getCostAlerts,
} from '@/routes/ai-usage';
import type { MonthlyCostSummary, CostAlert } from '@/lib/ai-orchestration/usage-tracker';

const ALERT_COLORS: Record<CostAlert['level'], string> = {
  warn_75: 'bg-amber-500/10 text-amber-400 border-amber-500/50',
  warn_90: 'bg-orange-500/10 text-orange-400 border-orange-500/50',
  exceeded_100: 'bg-red-500/10 text-red-400 border-red-500/50',
};

export const APIUsageDashboard = () => {
  const [summaries, setSummaries] = useState<MonthlyCostSummary[]>([]);
  const [alerts, setAlerts] = useState<CostAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [s, a] = await Promise.all([getUsageSummary(), getCostAlerts()]);
    setSummaries(s);
    setAlerts(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalCost = summaries.reduce((acc, s) => acc + s.totalCost, 0);
  const totalCalls = summaries.reduce((acc, s) => acc + s.totalCalls, 0);
  const failedCalls = summaries.reduce((acc, s) => acc + s.failedCalls, 0);

  const chartData = summaries.map(s => ({
    name: s.serviceName ?? s.serviceId.substring(0, 8),
    cost: Number(s.totalCost.toFixed(4)),
    calls: s.totalCalls,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            API Usage Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Real-time cost & usage monitoring</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetch} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-1', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-400">${totalCost.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Cost This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">{totalCalls.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total API Calls</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-400">{failedCalls.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Failed Calls</div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Cost Threshold Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.serviceId} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <div>
                  <span className="text-sm font-medium">{alert.serviceName ?? alert.serviceId}</span>
                  <div className="text-xs text-muted-foreground">
                    ${alert.currentCost.toFixed(2)} / ${alert.maxMonthlyCost.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={Math.min(alert.thresholdPercent, 100)} className="w-24 h-1.5" />
                  <Badge variant="outline" className={cn('text-[10px]', ALERT_COLORS[alert.level])}>
                    {alert.thresholdPercent}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cost Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Cost by Service (Current Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No usage data for this month</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Service Usage Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Breakdown by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summaries.map(s => (
              <div key={s.serviceId} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <div className="text-sm font-medium">{s.serviceName ?? s.serviceId.substring(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">{s.totalCalls} calls · {s.failedCalls} failed</div>
                </div>
                <div className="text-sm font-medium text-emerald-400">${s.totalCost.toFixed(4)}</div>
              </div>
            ))}
            {summaries.length === 0 && !loading && (
              <p className="text-center text-muted-foreground text-sm py-4">No usage recorded this month</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIUsageDashboard;
