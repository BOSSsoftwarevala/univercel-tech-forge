import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Users, Award, Medal,
  Star, Zap, ArrowUp, ArrowDown, MapPin
} from 'lucide-react';

const FranchisePerformanceBoard = () => {
  const performanceData = {
    rank: 3,
    totalFranchises: 45,
    monthlyTarget: 1000000,
    achieved: 850000,
    leadsConverted: 42,
    totalLeads: 50,
    avgDealSize: 20238,
  };

  const leaderboard = [
    { rank: 1, name: 'Franchise Alpha (Delhi)', sales: '₹12.5L', leads: 58, badge: 'gold' },
    { rank: 2, name: 'Franchise Beta (Bangalore)', sales: '₹10.2L', leads: 52, badge: 'silver' },
    { rank: 3, name: 'Your Franchise (Mumbai)', sales: '₹8.5L', leads: 42, badge: 'bronze', isYou: true },
    { rank: 4, name: 'Franchise Gamma (Chennai)', sales: '₹7.8L', leads: 38, badge: null },
    { rank: 5, name: 'Franchise Delta (Kolkata)', sales: '₹6.5L', leads: 35, badge: null },
  ];

  const territories = [
    { name: 'Maharashtra', leads: 45, conversions: 38, revenue: '₹4.2L', growth: 15 },
    { name: 'Gujarat', leads: 28, conversions: 22, revenue: '₹2.8L', growth: 8 },
    { name: 'Rajasthan', leads: 15, conversions: 12, revenue: '₹1.5L', growth: -3 },
  ];

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'gold': return 'bg-amber-500 text-white';
      case 'silver': return 'bg-slate-400 text-white';
      case 'bronze': return 'bg-orange-600 text-white';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  const targetProgress = (performanceData.achieved / performanceData.monthlyTarget) * 100;
  const conversionRate = (performanceData.leadsConverted / performanceData.totalLeads) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance & Scoreboard</h1>
          <p className="text-slate-400">Track your performance and compare with other franchises</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg">
          <Medal className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-medium">Rank #{performanceData.rank}</span>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-400">Monthly Target</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{(performanceData.monthlyTarget / 100000).toFixed(1)}L</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-emerald-400">{targetProgress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${targetProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Conversion Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate.toFixed(0)}%</p>
          <p className="text-xs text-slate-400 mt-2">
            {performanceData.leadsConverted} / {performanceData.totalLeads} leads
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">Avg Deal Size</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{performanceData.avgDealSize.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUp className="w-3 h-3" /> +12% vs last month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Achieved</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{(performanceData.achieved / 100000).toFixed(1)}L</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-amber-400" />
            Franchise Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.map((franchise, index) => (
              <motion.div
                key={franchise.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  franchise.isYou 
                    ? 'bg-indigo-500/10 border border-indigo-500/30' 
                    : 'bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBadgeColor(franchise.badge)}`}>
                    {franchise.rank}
                  </div>
                  <div>
                    <p className={`font-medium ${franchise.isYou ? 'text-indigo-400' : 'text-white'}`}>
                      {franchise.name}
                      {franchise.isYou && <span className="ml-2 text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-slate-400">{franchise.leads} leads converted</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-400">{franchise.sales}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Territory Heatmap */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-purple-400" />
            Territory Performance
          </h2>
          <div className="space-y-4">
            {territories.map((territory, index) => (
              <motion.div
                key={territory.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{territory.name}</h4>
                  <div className={`flex items-center gap-1 text-sm ${territory.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {territory.growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {Math.abs(territory.growth)}%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Leads</p>
                    <p className="font-semibold text-white">{territory.leads}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Conversions</p>
                    <p className="font-semibold text-white">{territory.conversions}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Revenue</p>
                    <p className="font-semibold text-emerald-400">{territory.revenue}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(territory.conversions / territory.leads) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Performance Insights</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">🎯 Focus Area</p>
            <p className="text-white">Rajasthan territory needs attention. Consider more demos.</p>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">📈 Growth Opportunity</p>
            <p className="text-white">Healthcare leads have 85% conversion - prioritize this segment.</p>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">⚠️ Prediction Alert</p>
            <p className="text-white">8 leads at risk of going cold. Follow up within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisePerformanceBoard;
