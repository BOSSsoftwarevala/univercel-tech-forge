import { motion } from 'framer-motion';
import { 
  Users, Clock, Megaphone, MousePointer, CheckCircle, ShieldAlert,
  Wallet, TrendingUp, Globe, UserX, AlertTriangle, Bot
} from 'lucide-react';

const kpiData = [
  { label: 'Active Influencers', value: '2,847', icon: Users, color: 'emerald', change: '+12%' },
  { label: 'Pending Approvals', value: '156', icon: Clock, color: 'yellow', change: '+8' },
  { label: 'Running Campaigns', value: '34', icon: Megaphone, color: 'blue', change: '+3' },
  { label: 'Leads Generated', value: '45.2K', icon: MousePointer, color: 'purple', change: '+18%' },
  { label: 'Valid Conversions', value: '8,934', icon: CheckCircle, color: 'emerald', change: '+15%' },
  { label: 'Fake Traffic Detected', value: '1,247', icon: ShieldAlert, color: 'red', change: '-23%' },
  { label: 'Payout Pending', value: '₹24.5L', icon: Wallet, color: 'orange', change: '89 requests' },
  { label: 'ROI Score', value: '4.2x', icon: TrendingUp, color: 'emerald', change: '+0.3' },
  { label: 'Country-wise Performance', value: '12', icon: Globe, color: 'cyan', change: 'countries' },
  { label: 'Suspended Influencers', value: '67', icon: UserX, color: 'red', change: '+5' },
  { label: 'High-Risk Accounts', value: '23', icon: AlertTriangle, color: 'orange', change: '-8' },
  { label: 'AI Alerts', value: '14', icon: Bot, color: 'purple', change: 'active' },
];

const IMDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Dashboard</h1>
        <div className="text-sm text-slate-400">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl bg-slate-800/50 border border-${kpi.color}-500/20 hover:bg-slate-800/70 transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${kpi.color}-500/20 flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full bg-${kpi.color}-500/10 text-${kpi.color}-400`}>
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-sm text-slate-400">{kpi.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IMDashboard;
