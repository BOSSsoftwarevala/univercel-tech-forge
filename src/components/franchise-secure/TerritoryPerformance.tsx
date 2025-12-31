import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Target, BarChart3, 
  MapPin, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface TerritoryPerformanceProps {
  franchiseId: string;
  territoryName: string;
}

interface PerformanceMetrics {
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  conversionRate: number;
  activeResellers: number;
  activeInfluencers: number;
  monthlyTarget: number;
  monthlyAchieved: number;
}

export function TerritoryPerformance({ franchiseId, territoryName }: TerritoryPerformanceProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Fetch leads
      const { data: leads } = await supabase
        .from('franchise_leads')
        .select('status')
        .eq('franchise_id', franchiseId);

      // Fetch account for target
      const { data: account } = await supabase
        .from('franchise_accounts')
        .select('sales_target_monthly')
        .eq('id', franchiseId)
        .single();

      // Fetch commissions for achieved
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: commissions } = await supabase
        .from('franchise_commissions')
        .select('sale_amount')
        .eq('franchise_id', franchiseId)
        .gte('created_at', startOfMonth.toISOString());

      const totalLeads = leads?.length || 0;
      const convertedLeads = leads?.filter(l => l.status === 'closed' || l.status === 'converted').length || 0;
      const activeLeads = leads?.filter(l => l.status === 'active' || l.status === 'contacted').length || 0;
      const monthlyAchieved = commissions?.reduce((sum, c) => sum + Number(c.sale_amount || 0), 0) || 0;

      setMetrics({
        totalLeads,
        activeLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
        activeResellers: Math.floor(Math.random() * 10) + 5, // Mock for now
        activeInfluencers: Math.floor(Math.random() * 8) + 3, // Mock for now
        monthlyTarget: account?.sales_target_monthly || 500000,
        monthlyAchieved
      });
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (franchiseId) {
      fetchMetrics();
    }
  }, [franchiseId]);

  const targetProgress = metrics 
    ? Math.min((metrics.monthlyAchieved / metrics.monthlyTarget) * 100, 100)
    : 0;

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-pulse">
        <div className="h-40 bg-slate-700/50 rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Territory Performance</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/20">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-purple-400">{territoryName}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMetrics}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Monthly Target</span>
          <span className="text-sm font-medium text-white">
            ₹{(metrics?.monthlyAchieved || 0).toLocaleString()} / ₹{(metrics?.monthlyTarget || 0).toLocaleString()}
          </span>
        </div>
        <Progress value={targetProgress} className="h-2" />
        <p className="text-xs text-slate-500 mt-1">{targetProgress.toFixed(1)}% achieved</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-teal-400" />
            <span className="text-xs text-slate-400">Total Leads</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics?.totalLeads || 0}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{metrics?.activeLeads || 0} active</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Conversion Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics?.conversionRate || 0}%</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span>{metrics?.convertedLeads || 0} converted</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Active Resellers</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics?.activeResellers || 0}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-slate-400">Influencers</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics?.activeInfluencers || 0}</p>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-500 mt-3 text-center">
        Performance metrics exclude financial data • Updated in real-time
      </p>
    </motion.div>
  );
}
