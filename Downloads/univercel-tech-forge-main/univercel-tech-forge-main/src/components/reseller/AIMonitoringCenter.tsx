import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, TrendingUp, Users, Target, Zap, 
  AlertTriangle, CheckCircle2, BarChart3, Eye,
  Brain, Radar, Globe, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useResellerAI } from '@/hooks/useResellerAI';
import { toast } from 'sonner';

const AIMonitoringCenter = () => {
  const { forecastSales, getMarketPulse, loading } = useResellerAI();
  const [forecast, setForecast] = useState<any>(null);
  const [marketPulse, setMarketPulse] = useState<any>(null);

  const liveMetrics = [
    { label: 'Active Sessions', value: '24', status: 'live', icon: Users, color: 'emerald' },
    { label: 'Conversion Rate', value: '32%', status: 'up', icon: TrendingUp, color: 'cyan' },
    { label: 'Demo Views', value: '156', status: 'live', icon: Eye, color: 'violet' },
    { label: 'Hot Leads', value: '8', status: 'alert', icon: Zap, color: 'amber' },
  ];

  const alerts = [
    { type: 'opportunity', message: 'Lead "Tech Corp" viewed demo 3 times', time: '2m ago', severity: 'high' },
    { type: 'warning', message: 'Conversion rate dipping in Mumbai region', time: '15m ago', severity: 'medium' },
    { type: 'success', message: 'New lead scored 92 - Hot prospect', time: '25m ago', severity: 'low' },
  ];

  const handleAnalyze = async () => {
    const forecastData = {
      pipelineValue: 450000,
      activeLeads: 24,
      conversionRate: 32,
      avgDealSize: 25000,
      monthlyTarget: 500000,
      daysRemaining: 12
    };

    const marketData = {
      industry: 'Technology',
      productCategory: 'SaaS',
      region: 'India',
      currentMonth: 'December',
      historicalData: { lastMonth: 420000, lastQuarter: 1200000 }
    };

    const [forecastResult, marketResult] = await Promise.all([
      forecastSales(forecastData),
      getMarketPulse(marketData)
    ]);

    if (forecastResult) setForecast(forecastResult);
    if (marketResult) setMarketPulse(marketResult);
    toast.success('AI Analysis Complete');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
          >
            <Radar className="w-6 h-6 text-emerald-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Monitoring Center</h2>
            <p className="text-sm text-slate-400">Real-time intelligence & predictive analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400">LIVE</span>
          </motion.div>
          <Button onClick={handleAnalyze} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500">
            <Brain className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {liveMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl bg-slate-800/50 border border-${metric.color}-500/20 relative overflow-hidden`}
          >
            <motion.div
              className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-${metric.color}-400`}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <metric.icon className={`w-5 h-5 text-${metric.color}-400 mb-2`} />
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-sm text-slate-400">{metric.label}</p>
            <Badge className={`mt-2 bg-${metric.color}-500/20 text-${metric.color}-400 border-0`}>
              {metric.status}
            </Badge>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Alerts */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Real-time Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                  alert.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-white">{alert.message}</p>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Forecast */}
        {forecast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              AI Sales Forecast
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">₹{(forecast.weeklyForecast || 45000).toLocaleString()}</p>
                <p className="text-xs text-slate-400">This Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">₹{(forecast.monthlyForecast || 180000).toLocaleString()}</p>
                <p className="text-xs text-slate-400">This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">{forecast.confidenceLevel || '78%'}</p>
                <p className="text-xs text-slate-400">Confidence</p>
              </div>
            </div>
            {forecast.recommendations && (
              <div className="space-y-2">
                {forecast.recommendations.slice(0, 3).map((rec: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Market Pulse */}
        {marketPulse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Market Pulse
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${
                marketPulse.marketSentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                marketPulse.marketSentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {marketPulse.marketSentiment || 'Neutral'}
              </Badge>
              <span className="text-sm text-slate-400">{marketPulse.demandForecast}</span>
            </div>
            {marketPulse.emergingOpportunities && (
              <div className="space-y-2">
                <p className="text-sm text-slate-400 mb-2">Emerging Opportunities:</p>
                {marketPulse.emergingOpportunities.slice(0, 3).map((opp: any, i: number) => (
                  <div key={i} className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-sm text-cyan-400">{opp.opportunity || opp}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-400" />
          Live Activity Stream
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-violet-500" />
          <div className="space-y-4 pl-10">
            {[
              { action: 'Lead scored', detail: 'ABC Corp - Score: 92', time: 'Just now', color: 'emerald' },
              { action: 'Demo clicked', detail: 'Tech Solutions viewed pricing', time: '2m ago', color: 'cyan' },
              { action: 'Call scheduled', detail: 'Global Enterprises - Tomorrow 3PM', time: '5m ago', color: 'violet' },
              { action: 'Commission earned', detail: '₹2,500 from Startup India', time: '10m ago', color: 'amber' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className={`absolute -left-8 w-4 h-4 rounded-full bg-${item.color}-500 border-2 border-slate-900`} />
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{item.action}</p>
                      <p className="text-sm text-slate-400">{item.detail}</p>
                    </div>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMonitoringCenter;
