import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, PhoneCall, CheckCircle, XCircle, 
  Clock, TrendingUp, RefreshCw, Eye 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { ResellerAccountData } from '@/hooks/useResellerGuard';

interface LeadStatusOverviewProps {
  account: ResellerAccountData;
}

interface LeadStats {
  submitted: number;
  contacted: number;
  converted: number;
  rejected: number;
}

interface RecentLead {
  id: string;
  lead_name: string;
  status: string;
  created_at: string;
  industry: string | null;
}

const statusConfig = {
  submitted: {
    icon: Send,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Submitted'
  },
  contacted: {
    icon: PhoneCall,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    label: 'Contacted'
  },
  converted: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    label: 'Converted'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Rejected'
  }
};

export const LeadStatusOverview = ({ account }: LeadStatusOverviewProps) => {
  const [stats, setStats] = useState<LeadStats>({ submitted: 0, contacted: 0, converted: 0, rejected: 0 });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeadData = async () => {
    setLoading(true);
    try {
      // Fetch lead stats
      const { data: leads, error } = await supabase
        .from('reseller_leads')
        .select('status')
        .eq('reseller_id', account.id);

      if (error) throw error;

      const newStats: LeadStats = { submitted: 0, contacted: 0, converted: 0, rejected: 0 };
      leads?.forEach(lead => {
        const status = lead.status?.toLowerCase() as keyof LeadStats;
        if (status in newStats) {
          newStats[status]++;
        }
      });
      setStats(newStats);

      // Fetch recent leads
      const { data: recent, error: recentError } = await supabase
        .from('reseller_leads')
        .select('id, lead_name, status, created_at, industry')
        .eq('reseller_id', account.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentLeads(recent || []);
    } catch (error) {
      console.error('Failed to fetch lead data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [account.id]);

  const getStatusConfig = (status: string) => {
    return statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.submitted;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const totalLeads = stats.submitted + stats.contacted + stats.converted + stats.rejected;
  const conversionRate = totalLeads > 0 ? ((stats.converted / totalLeads) * 100).toFixed(1) : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Lead Status Overview</h3>
            <p className="text-xs text-slate-400">Track your submitted leads • View only</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchLeadData}
          disabled={loading}
          className="text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const StatusIcon = config.icon;
          const count = stats[key as keyof LeadStats];
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl ${config.bg} border ${config.border} text-center`}
            >
              <StatusIcon className={`w-5 h-5 ${config.color} mx-auto mb-1`} />
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-[10px] text-slate-400">{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Conversion Rate */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-300">Conversion Rate</span>
          </div>
          <span className="text-2xl font-bold text-emerald-400">{conversionRate}%</span>
        </div>
        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${conversionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Leads</h4>
        <div className="space-y-2">
          {recentLeads.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
              <p className="text-sm text-slate-400">No leads submitted yet</p>
            </div>
          ) : (
            recentLeads.map((lead, index) => {
              const config = getStatusConfig(lead.status || 'submitted');
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${config.bg}`}>
                      <StatusIcon className={`w-3 h-3 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{lead.lead_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {lead.industry || 'No product'} • {formatDate(lead.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${config.bg} ${config.color} ${config.border} text-[10px]`}>
                    {config.label}
                  </Badge>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Notice */}
      <p className="text-[10px] text-slate-500 mt-4 text-center">
        Lead status is managed by the system. Resellers cannot edit status.
      </p>
    </motion.div>
  );
};

export default LeadStatusOverview;
