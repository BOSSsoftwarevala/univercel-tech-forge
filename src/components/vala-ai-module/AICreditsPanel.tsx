/**
 * AI CREDITS PANEL - DB-Driven
 */

import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, AlertTriangle, CreditCard, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';

export const AICreditsPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ current: 0, todayUsage: 0, monthUsage: 0 });
  const [usageLogs, setUsageLogs] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<{ module: string; cost: number; percent: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        const [logsRes, todayRes, monthRes] = await Promise.all([
          supabase.from('ai_usage_logs').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('ai_usage_logs').select('final_cost').gte('created_at', today),
          supabase.from('ai_usage_logs').select('final_cost, module').gte('created_at', monthStart),
        ]);

        const todayTotal = (todayRes.data || []).reduce((s, r) => s + (Number(r.final_cost) || 0), 0);
        const monthTotal = (monthRes.data || []).reduce((s, r) => s + (Number(r.final_cost) || 0), 0);

        // Build breakdown by module
        const moduleMap: Record<string, number> = {};
        (monthRes.data || []).forEach(r => {
          const mod = r.module || 'other';
          moduleMap[mod] = (moduleMap[mod] || 0) + (Number(r.final_cost) || 0);
        });
        const breakdownArr = Object.entries(moduleMap)
          .map(([module, cost]) => ({ module, cost, percent: monthTotal > 0 ? Math.round((cost / monthTotal) * 100) : 0 }))
          .sort((a, b) => b.cost - a.cost);

        setBalance({ current: 0, todayUsage: todayTotal, monthUsage: monthTotal });
        setUsageLogs(logsRes.data || []);
        setBreakdown(breakdownArr);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            AI Credits & Usage
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track AI costs and usage</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <ArrowDownRight className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-rose-500">-${balance.todayUsage.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Today's Usage</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-500">${balance.monthUsage.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-500">{usageLogs.length}</p>
            <p className="text-xs text-muted-foreground">Recent Transactions</p>
          </CardContent>
        </Card>
      </div>

      {breakdown.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Usage Breakdown (This Month)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.module} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{item.module}</span>
                  <span className="text-muted-foreground">${item.cost.toFixed(2)} ({item.percent}%)</span>
                </div>
                <Progress value={item.percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Recent Usage Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {usageLogs.length === 0 ? (
            <EmptyState title="No usage logs" description="AI usage transactions will appear here" />
          ) : (
            usageLogs.map((log, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-500/20">
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.module} - {log.purpose || log.provider}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">-${Number(log.final_cost || log.base_cost || 0).toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">{log.tokens_used || 0} tokens</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
