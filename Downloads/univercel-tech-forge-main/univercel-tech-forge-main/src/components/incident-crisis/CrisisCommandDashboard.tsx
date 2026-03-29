import { motion } from 'framer-motion';
import { 
  AlertTriangle, Activity, Shield, Clock, 
  TrendingUp, Server, Zap, Bell, CheckCircle, 
  XCircle, AlertCircle, Radio
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const activeIncidents = [
  { 
    id: 1, 
    title: 'Database Connection Timeout', 
    severity: 'critical', 
    status: 'investigating',
    time: '5 mins ago',
    affected: 'Payment Gateway'
  },
  { 
    id: 2, 
    title: 'High API Latency Detected', 
    severity: 'warning', 
    status: 'monitoring',
    time: '12 mins ago',
    affected: 'User Dashboard'
  },
  { 
    id: 3, 
    title: 'Memory Usage Spike', 
    severity: 'warning', 
    status: 'resolving',
    time: '18 mins ago',
    affected: 'Analytics Service'
  },
];

const systemMetrics = [
  { label: 'CPU Usage', value: 67, status: 'normal', icon: Activity },
  { label: 'Memory', value: 78, status: 'warning', icon: Server },
  { label: 'Network', value: 45, status: 'normal', icon: Zap },
  { label: 'Disk I/O', value: 32, status: 'normal', icon: TrendingUp },
];

const recentAlerts = [
  { type: 'critical', message: 'Production server unresponsive', time: '2m ago' },
  { type: 'warning', message: 'SSL certificate expires in 7 days', time: '15m ago' },
  { type: 'info', message: 'Scheduled maintenance tomorrow', time: '1h ago' },
  { type: 'success', message: 'Backup completed successfully', time: '2h ago' },
];

const CrisisCommandDashboard = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-amber-500 text-black';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'monitoring': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'resolving': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: '3', change: '+1', icon: AlertTriangle, color: 'red', critical: true },
          { label: 'Avg Response Time', value: '2.3s', change: '-0.5s', icon: Clock, color: 'amber' },
          { label: 'Systems Online', value: '98.5%', change: '+0.2%', icon: Shield, color: 'green' },
          { label: 'Alerts Today', value: '24', change: '+8', icon: Bell, color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-slate-900/50 border-${stat.color}-500/20 ${stat.critical ? 'ring-2 ring-red-500/30 animate-pulse' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-xs ${stat.change.startsWith('+') ? stat.critical ? 'text-red-400' : 'text-green-400' : 'text-green-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-500">from last hour</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Active Incidents
                </CardTitle>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {activeIncidents.length} Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-red-500/10 hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-white">{incident.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Affected: {incident.affected}</span>
                        <span>{incident.time}</span>
                      </div>
                    </div>
                    <Badge className={`border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                      Escalate
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-green-500/30 text-green-400 hover:bg-green-500/10">
                      Resolve
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs text-slate-400">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Activity className="w-5 h-5" />
                System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <metric.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{metric.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      metric.status === 'warning' ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${metric.status === 'warning' ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'}`}
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Radio className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-slate-400">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{alert.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CrisisCommandDashboard;
