import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Wallet, Target, MapPin,
  FileText, Clock, AlertTriangle, Zap, Award
} from 'lucide-react';
import { toast } from 'sonner';

const FranchiseDash = () => {
  const stats = [
    { label: 'Active Leads', value: '28', icon: Users, color: 'indigo', trend: '+5 today' },
    { label: 'Monthly Sales', value: '₹8.5L', icon: TrendingUp, color: 'emerald', trend: '85% of target' },
    { label: 'Commission Earned', value: '₹1.27L', icon: Wallet, color: 'purple', trend: 'This month' },
    { label: 'Conversion Rate', value: '68%', icon: Target, color: 'amber', trend: '+8% vs last month' },
  ];

  const recentLeads = [
    { id: 1, name: 'Raj Kumar', industry: 'Retail', status: 'contacted', score: 85, region: 'Mumbai' },
    { id: 2, name: 'Priya Singh', industry: 'Healthcare', status: 'demo_scheduled', score: 92, region: 'Pune' },
    { id: 3, name: 'Amit Patel', industry: 'Education', status: 'negotiation', score: 78, region: 'Ahmedabad' },
    { id: 4, name: 'Sneha Gupta', industry: 'Finance', status: 'new', score: 65, region: 'Mumbai' },
  ];

  const territories = [
    { name: 'Maharashtra', leads: 45, sales: '₹4.2L', exclusive: true },
    { name: 'Gujarat', leads: 28, sales: '₹2.8L', exclusive: false },
    { name: 'Rajasthan', leads: 15, sales: '₹1.5L', exclusive: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted': return 'text-cyan-400 bg-cyan-500/20';
      case 'demo_scheduled': return 'text-purple-400 bg-purple-500/20';
      case 'negotiation': return 'text-amber-400 bg-amber-500/20';
      case 'new': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Franchise Dashboard</h1>
          <p className="text-slate-400">Welcome back! Your territory is performing well.</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">KYC Verified</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-slate-500">{stat.trend}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Recent Leads
            </h2>
            <span className="text-xs text-slate-400">Updated just now</span>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <span className="text-indigo-400 font-semibold">{lead.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.industry} • {lead.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-indigo-400">Score: {lead.score}</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Territories */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-purple-400" />
            My Territories
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
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{territory.name}</h4>
                  {territory.exclusive && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                      Exclusive
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{territory.leads} leads</span>
                  <span className="text-emerald-400">{territory.sales}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.info('Opening 12 pending follow-ups...')}
          className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
        >
          <Clock className="w-6 h-6 text-indigo-400 mb-2" />
          <p className="text-sm font-medium text-white">Pending Follow-ups</p>
          <p className="text-xs text-slate-400 mt-1">12 due today</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.success('Contract active until Dec 2025')}
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-left"
        >
          <FileText className="w-6 h-6 text-emerald-400 mb-2" />
          <p className="text-sm font-medium text-white">Contract Status</p>
          <p className="text-xs text-slate-400 mt-1">Active until Dec 2025</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.warning('2 escalations require attention')}
          className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
        >
          <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
          <p className="text-sm font-medium text-white">Open Escalations</p>
          <p className="text-xs text-slate-400 mt-1">2 pending</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.success('Training progress: 92% complete - 1 module remaining')}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all text-left"
        >
          <Award className="w-6 h-6 text-purple-400 mb-2" />
          <p className="text-sm font-medium text-white">Training Score</p>
          <p className="text-xs text-slate-400 mt-1">92% complete</p>
        </motion.button>
      </div>
    </div>
  );
};

export default FranchiseDash;
