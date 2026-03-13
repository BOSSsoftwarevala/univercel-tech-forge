import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, Eye, Heart, Share2, 
  Star, Zap, Crown, Award, Info, ChevronRight, Gift
} from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    icon: Star,
    color: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-500/30',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-400',
    followers: '0 - 1K',
    requirements: 'Sign up & get verified',
    perks: [
      { metric: 'Per Valid Lead', rate: '₹50', icon: Users },
      { metric: 'Per Conversion', rate: '₹500', icon: TrendingUp },
      { metric: 'Monthly Bonus', rate: '—', icon: Gift },
    ],
  },
  {
    name: 'Rising',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    followers: '1K - 10K',
    requirements: '10+ conversions/month',
    perks: [
      { metric: 'Per Valid Lead', rate: '₹75', icon: Users },
      { metric: 'Per Conversion', rate: '₹750', icon: TrendingUp },
      { metric: 'Monthly Bonus', rate: '₹2,000', icon: Gift },
    ],
  },
  {
    name: 'Pro',
    icon: Zap,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    followers: '10K - 100K',
    requirements: '50+ conversions/month',
    perks: [
      { metric: 'Per Valid Lead', rate: '₹100', icon: Users },
      { metric: 'Per Conversion', rate: '₹1,200', icon: TrendingUp },
      { metric: 'Monthly Bonus', rate: '₹10,000', icon: Gift },
    ],
    popular: true,
  },
  {
    name: 'Elite',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    followers: '100K+',
    requirements: '200+ conversions/month',
    perks: [
      { metric: 'Per Valid Lead', rate: '₹150', icon: Users },
      { metric: 'Per Conversion', rate: '₹2,000', icon: TrendingUp },
      { metric: 'Monthly Bonus', rate: '₹50,000', icon: Gift },
    ],
  },
];

const bonusRules = [
  { label: 'First 10 Conversions Bonus', value: '₹1,000', icon: Award },
  { label: 'Weekly Top 3 Leaderboard', value: '₹5,000', icon: Crown },
  { label: 'Monthly Target Achiever', value: '2x Rate', icon: Zap },
  { label: 'Festival Season Multiplier', value: '3x Rate', icon: Star },
  { label: 'Referral Chain Bonus (L2)', value: '5% of sub-referral', icon: Share2 },
];

const contentRates = [
  { type: 'Instagram Reel/Post', views: '1K-10K', rate: '₹200-₹500' },
  { type: 'YouTube Short', views: '1K-10K', rate: '₹300-₹800' },
  { type: 'Blog/Article', views: '500+', rate: '₹500-₹1,500' },
  { type: 'Twitter/X Thread', views: '1K+', rate: '₹150-₹400' },
  { type: 'WhatsApp Status (verified)', views: 'Per valid lead', rate: '₹50' },
];

const InfluencerRateChart = () => {
  const [activeTier, setActiveTier] = useState(2); // Pro default

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Rate Chart
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              META-STYLE
            </span>
          </h2>
          <p className="text-slate-400 mt-1">Earn like a creator — transparent, tier-based payouts</p>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, idx) => {
          const Icon = tier.icon;
          const isActive = activeTier === idx;
          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveTier(idx)}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                isActive
                  ? `${tier.borderColor} ${tier.bgColor} shadow-lg`
                  : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white">{tier.name}</h3>
              <p className={`text-xs ${tier.textColor} mb-3`}>{tier.followers} followers</p>
              
              <div className="space-y-2">
                {tier.perks.map((perk) => {
                  const PerkIcon = perk.icon;
                  return (
                    <div key={perk.metric} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <PerkIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-400">{perk.metric}</span>
                      </div>
                      <span className={`text-sm font-bold ${tier.textColor}`}>{perk.rate}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-700/30">
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {tier.requirements}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Creation Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Content Creation Rates
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-700/30">
          <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-slate-800/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Content Type</span>
            <span>Min Views/Reach</span>
            <span>Payout Range</span>
          </div>
          {contentRates.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 px-4 py-3 border-t border-slate-700/20 hover:bg-slate-800/20 transition-colors">
              <span className="text-sm text-slate-300">{item.type}</span>
              <span className="text-sm text-slate-400">{item.views}</span>
              <span className="text-sm font-semibold text-emerald-400">{item.rate}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bonus Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400" />
          Bonus & Multipliers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bonusRules.map((rule, idx) => {
            const RuleIcon = rule.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-amber-500/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <RuleIcon className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{rule.label}</p>
                  <p className="text-sm font-bold text-amber-400">{rule.value}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Rules Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-violet-300">Rules & Guidelines (Meta-Standard)</p>
            <p>• Fake leads, bot traffic, or duplicate accounts = instant ban + earnings forfeited</p>
            <p>• AI Fraud Guard monitors all clicks & conversions in real-time</p>
            <p>• Payouts processed weekly (every Monday) to your verified wallet</p>
            <p>• Minimum payout threshold: ₹500 | Boss approval required for all withdrawals</p>
            <p>• Rate chart subject to revision — active influencers get 30-day advance notice</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerRateChart;
