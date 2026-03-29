import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/ui/empty-state";

export const BillingUsageView = () => {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<{ provider: string; cost: number; percent: number }[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data } = await supabase.from('ai_usage_logs').select('provider, final_cost, base_cost').gte('created_at', monthStart);

        const providerMap: Record<string, number> = {};
        let total = 0;
        (data || []).forEach(log => {
          const cost = Number(log.final_cost || log.base_cost || 0);
          providerMap[log.provider] = (providerMap[log.provider] || 0) + cost;
          total += cost;
        });

        const breakdown = Object.entries(providerMap)
          .map(([provider, cost]) => ({ provider, cost, percent: total > 0 ? Math.round((cost / total) * 100) : 0 }))
          .sort((a, b) => b.cost - a.cost);

        setUsageData(breakdown);
        setTotalCost(total);
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Billing & Usage
          </h1>
          <p className="text-sm text-slate-400 mt-1">AI API billing and cost tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-slate-400">Total This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{usageData.length}</p>
            <p className="text-xs text-slate-400">Active Providers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Cost by Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageData.length === 0 ? (
            <EmptyState title="No billing data" description="API usage costs will appear here when AI services are used" />
          ) : (
            usageData.map((item) => (
              <div key={item.provider} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{item.provider}</span>
                  <span className="text-slate-400">${item.cost.toFixed(2)} ({item.percent}%)</span>
                </div>
                <Progress value={item.percent} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
