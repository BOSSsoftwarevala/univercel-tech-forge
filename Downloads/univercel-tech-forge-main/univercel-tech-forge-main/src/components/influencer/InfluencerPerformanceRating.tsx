import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Award, AlertTriangle, Star,
  BarChart3, PieChart, Globe, Smartphone, Monitor,
  ArrowUp, ArrowDown, Zap, Shield, Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const performanceData = {
  overallScore: 8.4,
  rank: 127,
  totalInfluencers: 2500,
  tier: 'Gold',
  nextTier: 'Platinum',
  tierProgress: 72,
  fraudScore: 2.3,
  conversionRate: 4.8,
  avgCTR: 3.2,
  totalClicks: 45280,
  totalConversions: 2174,
  earnings30Days: 45280
};

const weeklyMetrics = [
  { week: 'Week 1', clicks: 8500, conversions: 408, earnings: 8160 },
  { week: 'Week 2', clicks: 11200, conversions: 537, earnings: 10740 },
  { week: 'Week 3', clicks: 12800, conversions: 614, earnings: 12280 },
  { week: 'Week 4', clicks: 12780, conversions: 615, earnings: 12100 }
];

const platformBreakdown = [
  { platform: 'Instagram', percentage: 45, clicks: 20376, color: 'bg-pink-500' },
  { platform: 'YouTube', percentage: 30, clicks: 13584, color: 'bg-red-500' },
  { platform: 'Facebook', percentage: 15, clicks: 6792, color: 'bg-blue-500' },
  { platform: 'TikTok', percentage: 10, clicks: 4528, color: 'bg-cyan-400' }
];

const topProducts = [
  { name: 'CRM Pro Suite', conversions: 542, revenue: 27100 },
  { name: 'E-Commerce Builder', conversions: 384, revenue: 19200 },
  { name: 'Marketing Automation', conversions: 298, revenue: 14900 },
  { name: 'HR Management', conversions: 215, revenue: 10750 }
];

const InfluencerPerformanceRating = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/20">
            <BarChart3 className="w-6 h-6 text-violet-400" />
          </div>
          Performance & Ratings
        </h2>
        <p className="text-slate-400 mt-1">Track your performance metrics, tier progress, and rankings</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-4">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-1 p-5 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/30"
        >
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke="url(#scoreGradient)" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (performanceData.overallScore / 10) * 251.2}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{performanceData.overallScore}</span>
                <span className="text-xs text-slate-400">/10</span>
              </div>
            </div>
            <p className="text-sm text-violet-400 mt-2">Performance Score</p>
          </div>
        </motion.div>

        {/* Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-slate-400">Rank</span>
          </div>
          <p className="text-3xl font-bold text-white">#{performanceData.rank}</p>
          <p className="text-xs text-slate-400">of {performanceData.totalInfluencers.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
            <ArrowUp className="w-3 h-3" />
            <span>+15 this week</span>
          </div>
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">{performanceData.tier}</span>
            </div>
            <Badge className="bg-violet-500/20 text-violet-400 text-xs">→ {performanceData.nextTier}</Badge>
          </div>
          <Progress value={performanceData.tierProgress} className="h-2 mt-3" />
          <p className="text-xs text-slate-400 mt-2">{performanceData.tierProgress}% to {performanceData.nextTier}</p>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Conversion Rate</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{performanceData.conversionRate}%</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
            <ArrowUp className="w-3 h-3" />
            <span>+0.8% vs last month</span>
          </div>
        </motion.div>

        {/* Fraud Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Fraud Score</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{performanceData.fraudScore}%</p>
          <p className="text-xs text-emerald-400 mt-2">Excellent - Low risk</p>
        </motion.div>
      </div>

      {/* Weekly Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          Weekly Performance Trend
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {weeklyMetrics.map((week, i) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-slate-900/50"
            >
              <p className="text-sm text-slate-400 mb-3">{week.week}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Clicks</span>
                  <span className="text-sm font-medium text-white">{week.clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Conversions</span>
                  <span className="text-sm font-medium text-cyan-400">{week.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Earnings</span>
                  <span className="text-sm font-medium text-emerald-400">₹{week.earnings.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-16 mt-3 flex items-end gap-1">
                {[...Array(7)].map((_, j) => (
                  <div
                    key={j}
                    className="flex-1 bg-gradient-to-t from-violet-500 to-cyan-500 rounded-t opacity-60"
                    style={{ height: `${40 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Platform & Product Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Platform Breakdown
          </h3>
          <div className="space-y-4">
            {platformBreakdown.map((platform, i) => (
              <motion.div
                key={platform.platform}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{platform.platform}</span>
                  <span className="text-sm text-slate-400">{platform.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${platform.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${platform.percentage}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{platform.percentage}% of total</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Top Performing Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.conversions} conversions</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">₹{product.revenue.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          AI Performance Insights
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Strength</span>
            </div>
            <p className="text-sm text-slate-300">Your Instagram content converts 2.3x better than average. Focus more on this platform.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Opportunity</span>
            </div>
            <p className="text-sm text-slate-300">YouTube engagement is 15% below your potential. Consider more video tutorials.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-2 text-violet-400 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Goal</span>
            </div>
            <p className="text-sm text-slate-300">28 more conversions needed to reach Platinum tier this month.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerPerformanceRating;