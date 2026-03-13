/**
 * AI MODELS PANEL - DB-Driven
 */

import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';

interface ModelStats {
  totalModels: number;
  activeModels: number;
  idleModels: number;
  recentLogs: any[];
}

export const AIModelsPanel: React.FC = () => {
  const [stats, setStats] = useState<ModelStats>({ totalModels: 0, activeModels: 0, idleModels: 0, recentLogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: logs } = await supabase
          .from('ai_usage_logs')
          .select('provider, module, tokens_used, base_cost, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        const providers = new Set((logs || []).map(l => l.provider));
        const modules = new Set((logs || []).map(l => l.module));

        setStats({
          totalModels: providers.size + modules.size,
          activeModels: providers.size,
          idleModels: Math.max(0, modules.size - providers.size),
          recentLogs: logs || [],
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cpu className="w-6 h-6 text-primary" />
          AI Models Active
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor AI model performance and status</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalModels}</p>
            <p className="text-xs text-muted-foreground">Total Models</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">{stats.activeModels}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{stats.idleModels}</p>
            <p className="text-xs text-muted-foreground">Idle</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{stats.recentLogs.length}</p>
            <p className="text-xs text-muted-foreground">Recent Logs</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Recent AI Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.recentLogs.length === 0 ? (
            <EmptyState title="No AI usage logs" description="AI usage data will appear here when models are used" />
          ) : (
            stats.recentLogs.slice(0, 8).map((log, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{log.module}</p>
                      <p className="text-xs text-muted-foreground">{log.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      {log.tokens_used || 0} tokens
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(log.created_at).toLocaleDateString()}
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-500">logged</Badge>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Cost</span>
                    <span>${Number(log.base_cost || 0).toFixed(4)}</span>
                  </div>
                  <Progress value={Math.min(100, (log.tokens_used || 0) / 100)} className="h-2" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
