import { motion } from 'framer-motion';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Target, 
  Bell, 
  Link,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ResellerDashProps {
  onSectionChange?: (section: string) => void;
}

const ResellerDash = ({ onSectionChange }: ResellerDashProps) => {
  const stats = [
    { label: 'Active Leads', value: '24', change: '+5', trend: 'up', icon: Users, color: 'emerald' },
    { label: 'Wallet Balance', value: '₹45,200', change: '+₹8,500', trend: 'up', icon: Wallet, color: 'teal' },
    { label: 'Conversion Rate', value: '32%', change: '+4%', trend: 'up', icon: TrendingUp, color: 'cyan' },
    { label: 'Monthly Target', value: '72%', change: '-8%', trend: 'down', icon: Target, color: 'amber' },
    { label: 'Total Clients', value: '28', change: '+3', trend: 'up', icon: Users, color: 'purple' },
    { label: 'Sales This Month', value: '₹4.2L', change: '+18%', trend: 'up', icon: TrendingUp, color: 'blue' },
    { label: 'Pending Commission', value: '₹45K', change: '+₹12K', trend: 'up', icon: Wallet, color: 'orange' },
    { label: 'Lead Quality Avg', value: '78', change: '+5', trend: 'up', icon: Target, color: 'pink' },
  ];

  const recentLeads = [
    { name: 'Tech Solutions Pvt', status: 'contacted', score: 85, time: '2h ago' },
    { name: 'Global Enterprises', status: 'demo_scheduled', score: 72, time: '4h ago' },
    { name: 'StartUp India Co', status: 'new', score: 90, time: '6h ago' },
    { name: 'Digital First Ltd', status: 'negotiating', score: 68, time: '1d ago' },
  ];

  const notifications = [
    { type: 'lead', message: 'New lead assigned: ABC Corp', time: '10m ago', urgent: true },
    { type: 'commission', message: 'Commission credited: ₹2,500', time: '1h ago', urgent: false },
    { type: 'demo', message: 'Demo clicked: Tech Solutions', time: '2h ago', urgent: false },
    { type: 'target', message: 'Weekly target 80% complete', time: '3h ago', urgent: false },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-emerald-500/20 text-emerald-400',
      contacted: 'bg-blue-500/20 text-blue-400',
      demo_scheduled: 'bg-purple-500/20 text-purple-400',
      negotiating: 'bg-amber-500/20 text-amber-400',
      converted: 'bg-green-500/20 text-green-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome back, Reseller! 💼
          </h1>
          <p className="text-slate-400">Here's your sales overview for today</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-slate-800/50 border border-emerald-500/20 text-emerald-400"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Recent Leads
            </CardTitle>
            <button 
              className="text-emerald-400 text-sm hover:underline"
              onClick={() => onSectionChange?.('leads')}
            >
              View All
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.map((lead, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
                    <span className="text-emerald-300 font-medium">{lead.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{lead.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500 text-xs">{lead.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{lead.score}</p>
                  <p className="text-slate-500 text-xs">Score</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Notifications
            </CardTitle>
            <button 
              className="text-emerald-400 text-sm hover:underline"
              onClick={() => onSectionChange?.('notifications')}
            >
              Mark All Read
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  notif.urgent 
                    ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/30'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${notif.urgent ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                  {notif.urgent ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{notif.message}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {notif.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Link, label: 'Get Demo Link', color: 'emerald', action: () => {
                navigator.clipboard.writeText('https://softwarevala.com/demo?ref=reseller');
                toast.success('Demo link copied to clipboard!');
              }},
              { icon: Users, label: 'Follow Up Lead', color: 'teal', action: () => onSectionChange?.('leads') },
              { icon: Wallet, label: 'Request Payout', color: 'cyan', action: () => onSectionChange?.('payouts') },
              { icon: AlertCircle, label: 'Raise Escalation', color: 'amber', action: () => {
                toast.info('Escalation form will open');
                onSectionChange?.('notifications');
              }},
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`p-4 rounded-xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/10 border border-${action.color}-500/30 hover:border-${action.color}-500/50 transition-all group`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-white text-sm font-medium">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerDash;
