import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Link2, Eye, MousePointer,
  DollarSign, Sparkles, ShieldCheck, ArrowUpRight, Loader2, AlertTriangle
} from 'lucide-react';
import { influencerApi, type InfluencerOverviewResponse } from '@/lib/api/influencer';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const InfluencerMetrics = () => {
  const [overview, setOverview] = useState<InfluencerOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await influencerApi.getOverview();
        if (mounted) {
          setOverview(response);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load influencer overview.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = overview?.summary;
  const metrics = summary ? [
    {
      label: 'Total Earnings',
      value: formatCurrency(overview?.wallet?.total_earned || summary.campaign_earnings + summary.referral_earnings),
      icon: DollarSign,
      change: `${formatCurrency(summary.campaign_earnings)} campaign + ${formatCurrency(summary.referral_earnings)} referral`,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Referral Earnings',
      value: formatCurrency(summary.referral_earnings),
      icon: Users,
      change: `${summary.active_referrals} direct and ${summary.indirect_referrals} second-level partners`,
      color: 'from-violet-500 to-fuchsia-500',
    },
    {
      label: 'Campaign Earnings',
      value: formatCurrency(summary.campaign_earnings),
      icon: TrendingUp,
      change: `${summary.total_conversions} conversions from ${summary.active_campaigns} active campaigns`,
      color: 'from-emerald-500 to-green-500',
    },
    {
      label: 'Real Reach',
      value: summary.real_reach.toLocaleString('en-IN'),
      icon: MousePointer,
      change: `${summary.unique_clicks.toLocaleString('en-IN')} unique clicks tracked`,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'AI Trust Score',
      value: `${summary.ai_trust_score}%`,
      icon: ShieldCheck,
      change: summary.open_fraud_flags > 0 ? `${summary.open_fraud_flags} fraud flags open` : 'No payout blockers detected',
      color: 'from-teal-500 to-emerald-500',
    },
    {
      label: 'Conversion Rate',
      value: `${summary.conversion_rate}%`,
      icon: Sparkles,
      change: `${summary.qualified_leads} qualified leads ready for follow-up`,
      color: 'from-indigo-500 to-violet-500',
    },
  ] : [];

  const topLinks = overview?.top_links || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Influencer Money Engine
          </h2>
          <p className="text-slate-400 mt-1">Live referral, campaign, trust, and payout performance from the edge API</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-400">{overview?.platform_rate?.platform || 'generic'} rate engine live</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-slate-900/60 p-5 text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          <span>Loading live influencer overview...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
          <div>
            <p className="font-semibold">Overview unavailable</p>
            <p className="text-sm text-red-200/80">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative group"
          >
            <div className="relative p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 group-hover:border-violet-500/30 transition-all duration-300">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
              <motion.span
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {metric.value}
              </motion.span>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                {metric.change}
              </p>

              {/* Animated Border */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Performing Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-400" />
          Top Performing Links
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Campaign</th>
                <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">Clicks</th>
                <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">Conversions</th>
                <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {topLinks.map((link, index) => (
                <motion.tr
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <span className="text-white font-medium">{link.campaign_name}</span>
                        <p className="text-xs text-slate-500">/{link.short_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-300">{link.clicks.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-emerald-400">{link.conversions}</td>
                  <td className="py-4 px-4 text-right text-amber-400 font-semibold">{formatCurrency(link.earnings)}</td>
                </motion.tr>
              ))}
              {topLinks.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-slate-500">
                    No tracked links have produced attributed earnings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Engine Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Money Engine Snapshot
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Available Balance', value: formatCurrency(summary?.available_balance || 0), text: 'Ready for payout or reinvestment' },
            { label: 'Qualified Leads', value: String(summary?.qualified_leads || 0), text: 'Influencer-sourced leads in the pipeline' },
            { label: 'Open Fraud Flags', value: String(summary?.open_fraud_flags || 0), text: 'Flags blocking unsafe payout routes' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + index * 0.08 }}
              className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">{item.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            Current payout basis: {overview?.platform_rate?.platform || 'generic'} real reach {formatCurrency(overview?.platform_rate?.rate_per_real_reach || 0)} per unit, engagement {formatCurrency(overview?.platform_rate?.rate_per_engagement || 0)} per unit.
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerMetrics;
