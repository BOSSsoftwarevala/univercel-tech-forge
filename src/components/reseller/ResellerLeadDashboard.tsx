import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Clock, Target, BarChart3, PieChart, 
  ArrowUpRight, ArrowDownRight, Filter, Calendar, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const leadStats = [
  { label: 'Total Leads', value: '156', change: '+12%', trend: 'up', icon: Users },
  { label: 'Qualified Leads', value: '89', change: '+8%', trend: 'up', icon: Target },
  { label: 'Conversion Rate', value: '32%', change: '+4%', trend: 'up', icon: TrendingUp },
  { label: 'Avg Response Time', value: '2.4h', change: '-15%', trend: 'up', icon: Clock },
];

const leadSources = [
  { source: 'Website', leads: 45, percentage: 29 },
  { source: 'Referral', leads: 38, percentage: 24 },
  { source: 'Social Media', leads: 32, percentage: 21 },
  { source: 'Direct', leads: 25, percentage: 16 },
  { source: 'Partner', leads: 16, percentage: 10 },
];

const recentLeadActivity = [
  { id: 1, action: 'Lead converted', lead: 'Tech Corp', time: '10 min ago', type: 'success' },
  { id: 2, action: 'Demo scheduled', lead: 'Global Enterprises', time: '30 min ago', type: 'info' },
  { id: 3, action: 'Follow-up due', lead: 'StartUp India', time: '1h ago', type: 'warning' },
  { id: 4, action: 'New lead assigned', lead: 'Digital First', time: '2h ago', type: 'new' },
  { id: 5, action: 'Lead scored', lead: 'Innovation Labs', time: '3h ago', type: 'info' },
];

const ResellerLeadDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Dashboard</h1>
          <p className="text-slate-400">Comprehensive lead analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Icon className="w-5 h-5 text-emerald-400" />
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
        {/* Lead Sources */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{source.source}</span>
                  <span className="text-emerald-400 font-medium">{source.leads} leads ({source.percentage}%)</span>
                </div>
                <Progress value={source.percentage} className="h-2 bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Recent Lead Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeadActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-slate-400 text-xs">{activity.lead}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.type === 'success' ? 'border-emerald-500/50 text-emerald-400' :
                      activity.type === 'warning' ? 'border-amber-500/50 text-amber-400' :
                      activity.type === 'new' ? 'border-purple-500/50 text-purple-400' :
                      'border-slate-500/50 text-slate-400'
                    }`}
                  >
                    {activity.time}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Lead Quality Score Distribution */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Lead Quality Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {[
              { score: '90-100', count: 12, label: 'Excellent', color: 'emerald' },
              { score: '70-89', count: 34, label: 'Good', color: 'teal' },
              { score: '50-69', count: 45, label: 'Average', color: 'amber' },
              { score: '30-49', count: 28, label: 'Low', color: 'orange' },
              { score: '0-29', count: 15, label: 'Poor', color: 'red' },
            ].map((item) => (
              <div key={item.score} className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className={`text-2xl font-bold text-${item.color}-400`}>{item.count}</p>
                <p className="text-xs text-slate-400 mt-1">{item.label}</p>
                <p className="text-xs text-slate-500">{item.score}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerLeadDashboard;
