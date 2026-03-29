import { motion } from "framer-motion";
import { Bell, Search, RefreshCw, DollarSign, Users, MousePointer, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";
import { toast } from "sonner";

const MarketingTopBar = () => {
  const { user } = useAuth();
  const system = useMarketingManagerSystem();
  const summary = system.dashboard?.summary;
  
  const metrics = [
    { label: "Ad Spend", value: `₹${Math.round(summary?.adSpend || 0).toLocaleString()}`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Leads", value: `${summary?.leadsToday || 0}`, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "CTR", value: `${summary?.conversionRate || 0}%`, icon: MousePointer, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Conversions", value: `${summary?.pendingApprovals || 0}`, icon: Target, color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  const handleRefresh = () => {
    void system.dashboardQuery.refetch().then(() => {
      toast.success("Marketing dashboard refreshed");
    });
  };

  const handleQuickCampaign = () => {
    system.createCampaignMutation.mutate({
      name: `Quick Launch ${new Date().toLocaleDateString()}`,
      channel: 'google_ads',
      platform: 'google_ads',
      budget: 15000,
      objective: 'lead_generation',
      channels: ['google_ads', 'email'],
      targetAudience: { segment: 'high_intent', region: 'India' },
      niche: 'growth',
      cta: 'Book free demo',
    }, {
      onSuccess: () => {
        toast.success('Quick campaign created');
      },
      onError: (error) => {
        toast.error(error.message || 'Unable to create quick campaign');
      },
    });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 bg-slate-900/80 backdrop-blur-xl border-b border-teal-500/20 px-6 flex items-center justify-between"
    >
      {/* Role Badge */}
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-[10px] px-2 py-0.5">
          MARKETING MANAGER
        </Badge>
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Live Tracking
        </Badge>
      </div>

      {/* Quick Metrics */}
      <div className="flex items-center gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${metric.bg} border border-slate-700/30`}
            >
              <Icon className={`w-4 h-4 ${metric.color}`} />
              <div className="text-right">
                <p className="text-xs text-slate-500">{metric.label}</p>
                <p className={`text-sm font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-56 h-10 pl-10 pr-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>

        {/* Refresh */}
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-teal-400 transition-colors"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>

        {/* Create Campaign */}
        <Button
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25"
          onClick={handleQuickCampaign}
          disabled={system.createCampaignMutation.isPending}
        >
          + New Campaign
        </Button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-teal-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
            7
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default MarketingTopBar;
