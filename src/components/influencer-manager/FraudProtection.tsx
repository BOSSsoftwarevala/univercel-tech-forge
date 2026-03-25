import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Bot, Globe, AlertTriangle, Ban,
  CheckCircle, Eye, TrendingDown, Zap, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fraudAlerts = [
  { id: 1, type: 'Bot Traffic', influencer: 'user_789', severity: 'high', clicks: 4500, flagged: 3200, timestamp: '5 min ago', action: 'auto-blocked' },
  { id: 2, type: 'Repeated IP', influencer: 'promo_user', severity: 'medium', clicks: 890, flagged: 450, timestamp: '23 min ago', action: 'under review' },
  { id: 3, type: 'Click Farming', influencer: 'influencer_x', severity: 'high', clicks: 12000, flagged: 8900, timestamp: '1 hour ago', action: 'payout frozen' },
  { id: 4, type: 'Suspicious Pattern', influencer: 'new_creator', severity: 'low', clicks: 250, flagged: 45, timestamp: '2 hours ago', action: 'monitoring' },
];

const protectionStats = [
  { label: 'Clean Traffic', value: '97.3%', icon: CheckCircle, color: 'emerald' },
  { label: 'Bot Blocked', value: '245K', icon: Bot, color: 'red' },
  { label: 'Fraud Prevented', value: '₹12.4L', icon: Lock, color: 'purple' },
  { label: 'Active Monitors', value: '156', icon: Eye, color: 'cyan' },
];

const ipPatterns = [
  { region: 'Mumbai', clean: 89, suspicious: 11 },
  { region: 'Delhi', clean: 94, suspicious: 6 },
  { region: 'Bangalore', clean: 92, suspicious: 8 },
  { region: 'Chennai', clean: 96, suspicious: 4 },
  { region: 'Hyderabad', clean: 91, suspicious: 9 },
];

const FraudProtection = () => {
  const [autoBlock, setAutoBlock] = useState(true);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'auto-blocked': return 'text-red-400';
      case 'payout frozen': return 'text-orange-400';
      case 'under review': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Fraud & Abuse Protection Center</h2>
          <p className="text-slate-400 mt-1">AI-powered detection for bot traffic, fake clicks, and payout fraud</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-sm text-slate-400">Auto-Block:</span>
            <button
              onClick={() => setAutoBlock(!autoBlock)}
              className={`relative w-12 h-6 rounded-full transition-colors ${autoBlock ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <motion.div
                animate={{ x: autoBlock ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Run Deep Scan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {protectionStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Fraud Alerts */}
        <div className="col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-red-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Active Fraud Alerts
              </h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {fraudAlerts.length} Active
              </Badge>
            </div>

            <div className="space-y-3">
              {fraudAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.severity === 'high' ? 'bg-red-500/20' : 
                        alert.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                      }`}>
                        {alert.type === 'Bot Traffic' ? <Bot className="w-5 h-5 text-red-400" /> :
                         alert.type === 'Repeated IP' ? <Globe className="w-5 h-5 text-yellow-400" /> :
                         <AlertTriangle className="w-5 h-5 text-orange-400" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{alert.type}</div>
                        <div className="text-xs text-slate-400">@{alert.influencer} • {alert.timestamp}</div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-slate-400">Total Clicks:</span>
                        <span className="text-white ml-2">{alert.clicks.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Flagged:</span>
                        <span className="text-red-400 ml-2">{alert.flagged.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Action:</span>
                        <span className={`ml-2 font-medium ${getActionColor(alert.action)}`}>
                          {alert.action}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-8">
                        <Ban className="w-4 h-4 mr-1" />
                        Block
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detection Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4">AI Detection Rules</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { rule: 'Bot Pattern Detection', status: 'active', accuracy: '99.2%' },
                { rule: 'Click Velocity Limiter', status: 'active', accuracy: '97.8%' },
                { rule: 'Geo-Anomaly Detection', status: 'active', accuracy: '95.4%' },
                { rule: 'Device Fingerprinting', status: 'active', accuracy: '98.1%' },
                { rule: 'Referrer Validation', status: 'active', accuracy: '96.7%' },
                { rule: 'Time-Based Analysis', status: 'active', accuracy: '94.5%' },
              ].map((rule) => (
                <div
                  key={rule.rule}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-sm text-white">{rule.rule}</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">{rule.accuracy}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Regional Traffic Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Regional Traffic Health
            </h3>
            <div className="space-y-3">
              {ipPatterns.map((region) => (
                <div key={region.region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{region.region}</span>
                    <span className="text-emerald-400">{region.clean}% clean</span>
                  </div>
                  <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.clean}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.suspicious}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Blocked Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30"
          >
            <TrendingDown className="w-8 h-8 text-red-400 mb-3" />
            <h4 className="font-semibold text-white mb-2">Fraud Prevented Today</h4>
            <div className="text-3xl font-bold text-white mb-1">₹2.4L</div>
            <p className="text-sm text-slate-400">
              Blocked 12,450 fake clicks and 23 suspicious payouts
            </p>
          </motion.div>

          {/* Payout Freeze List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-orange-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-400" />
              Frozen Payouts
            </h3>
            <div className="space-y-2">
              {[
                { user: 'influencer_x', amount: '₹45,000' },
                { user: 'promo_bot_23', amount: '₹28,500' },
                { user: 'fake_clicks_99', amount: '₹12,000' },
              ].map((payout) => (
                <div
                  key={payout.user}
                  className="flex items-center justify-between p-2 rounded bg-slate-900/30"
                >
                  <span className="text-sm text-slate-300">@{payout.user}</span>
                  <span className="text-sm text-orange-400 font-medium">{payout.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FraudProtection;
