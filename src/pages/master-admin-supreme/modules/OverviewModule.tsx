import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Activity, Globe2, 
  Shield, CheckCircle, AlertTriangle, Clock, Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  delay: number;
}

const KPICard = ({ title, value, change, icon: Icon, trend, delay }: KPICardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -8, rotateX: 5, scale: 1.02 }}
    className="group"
    style={{ perspective: '1000px' }}
  >
    <Card className="relative p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Light reflection */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-white/50">{title}</p>
      </div>
    </Card>
  </motion.div>
);

export function OverviewModule() {
  const [healthRing, setHealthRing] = useState(94);
  const [activities, setActivities] = useState([
    { id: 1, action: 'Super Admin SA-0012 approved withdrawal', time: '2 min ago', type: 'success' },
    { id: 2, action: 'Security scan completed for Asia region', time: '5 min ago', type: 'info' },
    { id: 3, action: 'High-risk approval flagged for review', time: '8 min ago', type: 'warning' },
    { id: 4, action: 'Global rule #47 activated', time: '12 min ago', type: 'success' },
    { id: 5, action: 'New franchise onboarded: Mumbai Branch', time: '15 min ago', type: 'info' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthRing(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.min(100, Math.max(90, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { title: 'Total Revenue', value: '₹12.4M', change: '+12.5%', icon: DollarSign, trend: 'up' as const },
    { title: 'Active Users', value: '8,492', change: '+8.2%', icon: Users, trend: 'up' as const },
    { title: 'Pending Approvals', value: '23', change: '-5', icon: AlertTriangle, trend: 'down' as const },
    { title: 'Active Sessions', value: '1,247', change: '+15.3%', icon: Activity, trend: 'up' as const },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.title} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#healthGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={251}
                    animate={{ strokeDashoffset: 251 - (251 * healthRing) / 100 }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{healthRing.toFixed(0)}%</span>
                  <span className="text-xs text-white/50">Healthy</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {['CPU Usage', 'Memory', 'Network'].map((item, i) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{item}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={70 + i * 10} className="w-24 h-2" />
                    <span className="text-xs text-white/80 w-10">{70 + i * 10}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Live Activity Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Live Activity</h3>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Real-time</span>
              </div>
            </div>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'success' ? 'bg-green-500/20' :
                    activity.type === 'warning' ? 'bg-amber-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                     activity.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                     <Activity className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80">{activity.action}</p>
                  </div>
                  <span className="text-xs text-white/40">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Rental Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-300">Rental Features Active</h4>
                <p className="text-xs text-amber-200/60">Dashboard widgets • Time-based access • Premium modules</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/50">Time Remaining</p>
                <p className="text-lg font-bold text-amber-300">23:45:12</p>
              </div>
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
