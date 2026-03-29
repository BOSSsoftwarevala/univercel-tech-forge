import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, Plus, Calendar, Users, TrendingUp, 
  Play, Pause, BarChart3, Target, Clock
} from 'lucide-react';
import { toast } from 'sonner';

const campaigns = [
  {
    id: 1,
    name: 'Back to School Promo',
    product: 'School ERP Suite',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    reach: 45000,
    clicks: 3200,
    conversions: 89,
    budget: 50000,
    spent: 32000,
  },
  {
    id: 2,
    name: 'Hospital Digitization',
    product: 'Hospital CRM',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-03-15',
    reach: 28000,
    clicks: 1800,
    conversions: 45,
    budget: 35000,
    spent: 18000,
  },
  {
    id: 3,
    name: 'POS Flash Sale',
    product: 'POS System Pro',
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    reach: 62000,
    clicks: 4500,
    conversions: 156,
    budget: 40000,
    spent: 40000,
  },
];

const CampaignManager = () => {
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Campaign Manager</h2>
          <p className="text-slate-400 mt-1">Create and manage your promotional campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowNewCampaign(true);
            toast.info("Create New Campaign", { description: "Campaign creation wizard coming soon" });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-5 h-5" />
          New Campaign
        </motion.button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', value: '2', icon: Megaphone, color: 'violet' },
          { label: 'Total Reach', value: '135K', icon: Users, color: 'cyan' },
          { label: 'Conversions', value: '290', icon: Target, color: 'emerald' },
          { label: 'ROI', value: '285%', icon: TrendingUp, color: 'amber' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-3`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 ${
              campaign.status === 'active' 
                ? 'border-violet-500/30' 
                : 'border-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              {/* Campaign Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                    <p className="text-sm text-slate-400">{campaign.product}</p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-lg text-xs font-medium ${
                    campaign.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {campaign.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <p className="text-xs text-slate-500">Reach</p>
                    <p className="text-lg font-semibold text-white">{campaign.reach.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <p className="text-xs text-slate-500">Clicks</p>
                    <p className="text-lg font-semibold text-cyan-400">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <p className="text-xs text-slate-500">Conversions</p>
                    <p className="text-lg font-semibold text-emerald-400">{campaign.conversions}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <p className="text-xs text-slate-500">Budget Used</p>
                    <p className="text-lg font-semibold text-amber-400">
                      ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Budget Progress</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {campaign.startDate}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {campaign.endDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (campaign.status === 'active') {
                      toast.warning(`Campaign "${campaign.name}" paused`, { description: "You can resume it anytime" });
                    } else {
                      toast.success(`Campaign "${campaign.name}" resumed`, { description: "Campaign is now active" });
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    campaign.status === 'active'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info(`Analytics for "${campaign.name}"`, { 
                    description: `Reach: ${campaign.reach.toLocaleString()} | Clicks: ${campaign.clicks.toLocaleString()} | Conversions: ${campaign.conversions}` 
                  })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampaignManager;
