import { motion } from 'framer-motion';
import { 
  Target, ArrowRight, DollarSign, Users, TrendingUp,
  Eye, MousePointer, ShoppingCart, CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const conversionPaths = [
  { 
    influencer: 'Priya Sharma',
    steps: ['Link Click', 'Product View', 'Add to Cart', 'Purchase'],
    value: 45600,
    commission: 4560,
    status: 'completed',
    timestamp: '2h ago'
  },
  { 
    influencer: 'Rahul Verma',
    steps: ['Link Click', 'Demo Request', 'Sales Call', 'Subscription'],
    value: 125000,
    commission: 12500,
    status: 'completed',
    timestamp: '4h ago'
  },
  { 
    influencer: 'Sneha Patel',
    steps: ['Link Click', 'Product View', 'Add to Cart'],
    value: 0,
    commission: 0,
    status: 'pending',
    timestamp: '1h ago'
  },
];

const topPerformers = [
  { name: 'Neha Singh', conversions: 234, revenue: 1250000, roi: 24.5 },
  { name: 'Vikram Das', conversions: 189, revenue: 980000, roi: 21.2 },
  { name: 'Priya Sharma', conversions: 156, revenue: 780000, roi: 19.8 },
  { name: 'Amit Kumar', conversions: 134, revenue: 650000, roi: 18.4 },
];

const attributionModels = [
  { model: 'First Touch', percentage: 35 },
  { model: 'Last Touch', percentage: 45 },
  { model: 'Linear', percentage: 12 },
  { model: 'Time Decay', percentage: 8 },
];

const ConversionAttribution = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Conversion Attribution Engine</h2>
        <p className="text-slate-400 mt-1">Track visitor journeys from click to sale with AI-powered attribution</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Conversions', value: '8,420', icon: CheckCircle, change: '+18%', color: 'emerald' },
          { label: 'Revenue Generated', value: '₹4.2Cr', icon: DollarSign, change: '+24%', color: 'purple' },
          { label: 'Avg. Commission', value: '₹5,600', icon: TrendingUp, change: '+12%', color: 'pink' },
          { label: 'Attribution Accuracy', value: '96.8%', icon: Target, change: '+2.1%', color: 'cyan' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className="text-xs text-emerald-400">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Conversion Paths */}
        <div className="col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Conversion Paths</h3>
            <div className="space-y-4">
              {conversionPaths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {path.influencer.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{path.influencer}</div>
                        <div className="text-xs text-slate-400">{path.timestamp}</div>
                      </div>
                    </div>
                    <Badge className={path.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }>
                      {path.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>

                  {/* Journey Steps */}
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                    {path.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center">
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                          stepIndex === path.steps.length - 1 && path.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {step}
                        </div>
                        {stepIndex < path.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-500 mx-1 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {path.status === 'completed' && (
                    <div className="flex items-center gap-6 pt-2 border-t border-slate-700/50">
                      <div>
                        <span className="text-xs text-slate-400">Sale Value:</span>
                        <span className="text-white font-medium ml-2">₹{path.value.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Commission:</span>
                        <span className="text-emerald-400 font-medium ml-2">₹{path.commission.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Funnel Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {[
                { stage: 'Link Clicks', value: 245000, icon: MousePointer, percentage: 100 },
                { stage: 'Product Views', value: 89000, icon: Eye, percentage: 36.3 },
                { stage: 'Add to Cart', value: 24500, icon: ShoppingCart, percentage: 10 },
                { stage: 'Purchases', value: 8420, icon: CheckCircle, percentage: 3.4 },
              ].map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <stage.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{stage.stage}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white font-medium">{stage.value.toLocaleString()}</span>
                      <span className="text-slate-400 ml-2">({stage.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-900/50 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              Top Converters
            </h3>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-slate-400 text-black' :
                        index === 2 ? 'bg-amber-600 text-black' :
                        'bg-slate-600 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-white font-medium">{performer.name}</span>
                    </div>
                    <span className="text-xs text-emerald-400">{performer.roi}% ROI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Conv:</span>
                      <span className="text-white ml-1">{performer.conversions}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Rev:</span>
                      <span className="text-white ml-1">₹{(performer.revenue / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Attribution Models */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Attribution Models</h3>
            <div className="space-y-3">
              {attributionModels.map((model) => (
                <div key={model.model}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{model.model}</span>
                    <span className="text-white font-medium">{model.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${model.percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConversionAttribution;
