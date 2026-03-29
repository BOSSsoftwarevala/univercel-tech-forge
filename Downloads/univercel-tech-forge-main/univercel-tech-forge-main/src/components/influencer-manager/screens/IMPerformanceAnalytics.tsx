import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metrics = [
  { label: 'CTR', value: '4.8%', change: '+0.3%', color: 'blue' },
  { label: 'Conversion %', value: '12.4%', change: '+1.2%', color: 'emerald' },
  { label: 'Cost per Lead', value: '₹45', change: '-₹8', color: 'purple' },
  { label: 'ROI Score', value: '4.2x', change: '+0.5x', color: 'pink' },
];

const topInfluencers = [
  { name: 'Vik****_123', conversions: 342, revenue: '₹4.5L', roi: '5.2x' },
  { name: 'Raj****_456', conversions: 289, revenue: '₹3.8L', roi: '4.8x' },
  { name: 'Pri****_789', conversions: 234, revenue: '₹3.1L', roi: '4.5x' },
  { name: 'Anu****_012', conversions: 198, revenue: '₹2.6L', roi: '4.2x' },
];

const IMPerformanceAnalytics = () => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
        <span className="text-sm text-slate-400">(Read-only)</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="daily" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Calendar className="w-4 h-4 mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl bg-slate-800/50 border border-${metric.color}-500/20`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <span className="text-xs text-emerald-400">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Top Performers */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Influencers</h3>
            <div className="space-y-3">
              {topInfluencers.map((inf, index) => (
                <div key={inf.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-pink-400">#{index + 1}</span>
                    <span className="text-white">{inf.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-slate-400">{inf.conversions} conversions</div>
                    <div className="text-emerald-400">{inf.revenue}</div>
                    <div className="text-pink-400">{inf.roi} ROI</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IMPerformanceAnalytics;
