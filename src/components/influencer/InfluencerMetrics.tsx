import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Link2, Eye, MousePointer, 
  DollarSign, Video, Share2, Zap, ArrowUpRight
} from 'lucide-react';

const metrics = [
  { 
    label: 'Total Followers', 
    value: '124.5K', 
    icon: Users, 
    change: '+8.2K this month',
    color: 'from-violet-500 to-purple-500',
  },
  { 
    label: 'Link Clicks', 
    value: '45,892', 
    icon: MousePointer, 
    change: '+2,340 this week',
    color: 'from-cyan-500 to-blue-500',
  },
  { 
    label: 'Conversions', 
    value: '1,247', 
    icon: TrendingUp, 
    change: '2.7% rate',
    color: 'from-emerald-500 to-green-500',
  },
  { 
    label: 'Total Earnings', 
    value: '₹2,45,680', 
    icon: DollarSign, 
    change: '+₹45,280 pending',
    color: 'from-amber-500 to-orange-500',
  },
  { 
    label: 'Video Views', 
    value: '892K', 
    icon: Video, 
    change: '+156K this week',
    color: 'from-pink-500 to-rose-500',
  },
  { 
    label: 'Social Shares', 
    value: '12,450', 
    icon: Share2, 
    change: 'Viral potential: High',
    color: 'from-indigo-500 to-violet-500',
  },
];

const topLinks = [
  { name: 'POS System Demo', clicks: 12450, conversions: 342, earnings: 45600 },
  { name: 'School ERP Promo', clicks: 8920, conversions: 234, earnings: 32400 },
  { name: 'Hospital CRM', clicks: 6780, conversions: 189, earnings: 28500 },
  { name: 'Real Estate Suite', clicks: 4560, conversions: 123, earnings: 18900 },
];

const InfluencerMetrics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Welcome, Influencer! 🌟
          </h2>
          <p className="text-slate-400 mt-1">Your real-time performance analytics & insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <Zap className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-400">Top 5% Performer</span>
        </div>
      </div>

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
                  key={link.name}
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
                      <span className="text-white font-medium">{link.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-300">{link.clicks.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-emerald-400">{link.conversions}</td>
                  <td className="py-4 px-4 text-right text-amber-400 font-semibold">₹{link.earnings.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Engagement Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Engagement Timeline
        </h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 92].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.5 }}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-violet-500 to-cyan-500 opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerMetrics;
