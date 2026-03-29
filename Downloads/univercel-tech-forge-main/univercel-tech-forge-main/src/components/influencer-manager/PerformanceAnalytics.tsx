import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, MousePointer, ShoppingCart, 
  DollarSign, Users, Star, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const metrics = [
  { label: 'Total Clicks', value: '2.4M', change: '+18.5%', trend: 'up', icon: MousePointer },
  { label: 'Conversions', value: '84,200', change: '+12.3%', trend: 'up', icon: ShoppingCart },
  { label: 'Revenue Generated', value: '₹4.2Cr', change: '+24.1%', trend: 'up', icon: DollarSign },
  { label: 'Active Influencers', value: '2,847', change: '+8.7%', trend: 'up', icon: Users },
  { label: 'Avg CTR', value: '3.52%', change: '+0.8%', trend: 'up', icon: Target },
  { label: 'Audience Quality', value: '8.4/10', change: '-0.2', trend: 'down', icon: Star },
];

const topInfluencers = [
  { name: 'Neha Singh', clicks: 245000, conversions: 4520, revenue: 1250000, tier: 'Elite' },
  { name: 'Vikram Das', clicks: 189000, conversions: 3890, revenue: 980000, tier: 'Gold' },
  { name: 'Priya Sharma', clicks: 156000, conversions: 3120, revenue: 780000, tier: 'Gold' },
  { name: 'Amit Kumar', clicks: 134000, conversions: 2680, revenue: 650000, tier: 'Silver' },
  { name: 'Rahul Verma', clicks: 112000, conversions: 2240, revenue: 540000, tier: 'Silver' },
];

const channelPerformance = [
  { channel: 'Instagram', clicks: 890000, conversion: 4.2, color: 'pink' },
  { channel: 'YouTube', clicks: 650000, conversion: 3.8, color: 'red' },
  { channel: 'Twitter', clicks: 420000, conversion: 2.9, color: 'cyan' },
  { channel: 'LinkedIn', clicks: 180000, conversion: 5.1, color: 'blue' },
  { channel: 'Telegram', clicks: 260000, conversion: 3.4, color: 'sky' },
];

const PerformanceAnalytics = () => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Elite': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Silver': return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
      default: return 'bg-amber-600/20 text-amber-400 border-amber-600/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Performance Analytics Suite</h2>
        <p className="text-slate-400 mt-1">Comprehensive insights into influencer performance and ROI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="w-5 h-5 text-purple-400" />
              <div className={`flex items-center gap-1 text-xs ${
                metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="text-xl font-bold text-white">{metric.value}</div>
            <div className="text-xs text-slate-400 mt-1">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Top Influencers */}
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              Top Performing Influencers
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Influencer</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Clicks</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Conversions</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {topInfluencers.map((influencer, index) => (
                    <motion.tr
                      key={influencer.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20"
                    >
                      <td className="py-3 px-4">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-slate-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-black' :
                          'bg-slate-700 text-white'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {influencer.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{influencer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {influencer.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {influencer.conversions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-medium">
                        ₹{(influencer.revenue / 100000).toFixed(1)}L
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getTierColor(influencer.tier)}`}>
                          {influencer.tier}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Channel Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Channel Performance
          </h3>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <motion.div
                key={channel.channel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">{channel.channel}</span>
                  <span className="text-xs text-slate-400">
                    {(channel.clicks / 1000).toFixed(0)}K clicks • {channel.conversion}% conv
                  </span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(channel.clicks / 890000) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full bg-${channel.color}-500`}
                    style={{
                      background: channel.color === 'pink' ? '#ec4899' :
                                  channel.color === 'red' ? '#ef4444' :
                                  channel.color === 'cyan' ? '#06b6d4' :
                                  channel.color === 'blue' ? '#3b82f6' : '#0ea5e9'
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trends (Last 30 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${30 + Math.random() * 70}%` }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
              className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-400">
          <span>30 days ago</span>
          <span>15 days ago</span>
          <span>Today</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceAnalytics;
