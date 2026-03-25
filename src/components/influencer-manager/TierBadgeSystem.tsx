import { motion } from 'framer-motion';
import { 
  Award, Crown, Star, Zap, TrendingUp, 
  Gift, DollarSign, Users, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiers = [
  { 
    name: 'Bronze',
    icon: Award,
    color: 'amber-600',
    gradient: 'from-amber-600 to-amber-800',
    requirements: { conversions: 10, revenue: 50000 },
    benefits: ['5% Base Commission', 'Basic Analytics', 'Email Support'],
    multiplier: 1.0,
    members: 1245
  },
  { 
    name: 'Silver',
    icon: Star,
    color: 'slate-400',
    gradient: 'from-slate-300 to-slate-500',
    requirements: { conversions: 50, revenue: 250000 },
    benefits: ['7% Base Commission', 'Advanced Analytics', 'Priority Support', 'Monthly Bonuses'],
    multiplier: 1.2,
    members: 892
  },
  { 
    name: 'Gold',
    icon: Crown,
    color: 'yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
    requirements: { conversions: 200, revenue: 1000000 },
    benefits: ['10% Base Commission', 'Full Analytics Suite', 'Dedicated Manager', 'Exclusive Campaigns', 'Early Access'],
    multiplier: 1.5,
    members: 423
  },
  { 
    name: 'Elite',
    icon: Zap,
    color: 'purple-500',
    gradient: 'from-purple-400 to-pink-500',
    requirements: { conversions: 500, revenue: 5000000 },
    benefits: ['15% Base Commission', 'Custom Dashboard', 'VIP Manager', 'Brand Collaborations', 'Revenue Share', 'Annual Retreat'],
    multiplier: 2.0,
    members: 87
  },
];

const topEarners = [
  { name: 'Neha Singh', tier: 'Elite', earnings: 1250000, multiplier: 2.0 },
  { name: 'Vikram Das', tier: 'Gold', earnings: 980000, multiplier: 1.5 },
  { name: 'Priya Sharma', tier: 'Gold', earnings: 780000, multiplier: 1.5 },
  { name: 'Amit Kumar', tier: 'Silver', earnings: 450000, multiplier: 1.2 },
];

const TierBadgeSystem = () => {
  const getTierStyles = (tier: string) => {
    switch (tier) {
      case 'Elite': return 'border-purple-500/50 bg-purple-500/10';
      case 'Gold': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'Silver': return 'border-slate-400/50 bg-slate-400/10';
      default: return 'border-amber-600/50 bg-amber-600/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Tier & Badge System</h2>
        <p className="text-slate-400 mt-1">Performance-based tiers with exclusive benefits and payout multipliers</p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-4 gap-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-xl border backdrop-blur-sm overflow-hidden ${getTierStyles(tier.name)}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5`} />
            
            <div className="relative z-10">
              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center shadow-lg`}>
                  <tier.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <span className="text-xs text-slate-400">{tier.members} members</span>
                </div>
              </div>

              {/* Multiplier */}
              <div className="mb-4 p-3 rounded-lg bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Payout Multiplier</span>
                  <span className={`text-xl font-bold text-${tier.color}`}>{tier.multiplier}x</span>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Requirements</span>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Target className="w-3 h-3" />
                    {tier.requirements.conversions}+ conversions/month
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <DollarSign className="w-3 h-3" />
                    ₹{(tier.requirements.revenue / 100000).toFixed(0)}L+ revenue
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Benefits</span>
                <ul className="mt-2 space-y-1">
                  {tier.benefits.slice(0, 4).map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${tier.color}`} />
                      {benefit}
                    </li>
                  ))}
                  {tier.benefits.length > 4 && (
                    <li className="text-xs text-slate-400">+{tier.benefits.length - 4} more</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Monthly Evaluation */}
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              Monthly Tier Evaluation
            </h3>
            <div className="space-y-4">
              {[
                { influencer: 'Sneha Patel', current: 'Silver', progress: 78, target: 'Gold' },
                { influencer: 'Ravi Kumar', current: 'Bronze', progress: 92, target: 'Silver' },
                { influencer: 'Meera Reddy', current: 'Gold', progress: 45, target: 'Elite' },
              ].map((item, index) => (
                <motion.div
                  key={item.influencer}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {item.influencer.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.influencer}</div>
                        <div className="text-xs text-slate-400">
                          {item.current} → {item.target}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      item.progress >= 90 ? 'text-emerald-400' :
                      item.progress >= 70 ? 'text-yellow-400' : 'text-slate-400'
                    }`}>
                      {item.progress}% to {item.target}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${
                        item.progress >= 90 ? 'bg-emerald-500' :
                        item.progress >= 70 ? 'bg-yellow-500' : 'bg-purple-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Earners by Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            Top Earners This Month
          </h3>
          <div className="space-y-3">
            {topEarners.map((earner, index) => (
              <div
                key={earner.name}
                className={`p-3 rounded-lg border ${getTierStyles(earner.tier)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{earner.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      earner.tier === 'Elite' ? 'bg-purple-500/20 text-purple-400' :
                      earner.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-400/20 text-slate-300'
                    }`}>
                      {earner.tier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Earnings:</span>
                  <span className="text-emerald-400 font-medium">
                    ₹{(earner.earnings / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Multiplier:</span>
                  <span className="text-purple-400 font-medium">{earner.multiplier}x</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TierBadgeSystem;
