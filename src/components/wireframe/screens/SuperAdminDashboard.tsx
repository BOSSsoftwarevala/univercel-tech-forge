import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Code2, Clock, Building2, Users, Headphones, 
  DollarSign, Globe, TrendingUp, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CommandCenterHeader } from '../components/CommandCenterHeader';
import { RoleActivityCard } from '../components/RoleActivityCard';
import { BuzzerAlert } from '../components/BuzzerAlert';
import { ParticleBackground } from '../components/ParticleBackground';

interface RoleData {
  id: string;
  title: string;
  icon: any;
  stats: {
    pending: number;
    active: number;
    done: number;
  };
}

export function SuperAdminDashboard() {
  const isDark = true;

  const roleModules: RoleData[] = [
    { id: '1', title: 'Leads', icon: Target, stats: { pending: 45, active: 128, done: 892 } },
    { id: '2', title: 'Developers', icon: Code2, stats: { pending: 12, active: 38, done: 156 } },
    { id: '3', title: 'Tasks', icon: Clock, stats: { pending: 67, active: 23, done: 445 } },
    { id: '4', title: 'Franchise', icon: Building2, stats: { pending: 8, active: 45, done: 12 } },
    { id: '5', title: 'Resellers', icon: Users, stats: { pending: 15, active: 89, done: 234 } },
    { id: '6', title: 'Support', icon: Headphones, stats: { pending: 23, active: 12, done: 567 } },
    { id: '7', title: 'Finance', icon: DollarSign, stats: { pending: 5, active: 2, done: 89 } },
    { id: '8', title: 'SEO', icon: Globe, stats: { pending: 3, active: 15, done: 45 } },
    { id: '9', title: 'Performance', icon: TrendingUp, stats: { pending: 0, active: 21, done: 21 } },
    { id: '10', title: 'Demos', icon: Zap, stats: { pending: 4, active: 67, done: 0 } },
  ];

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Command Center Header */}
        <CommandCenterHeader />

        {/* Buzzer Alert */}
        <BuzzerAlert
          type="lead"
          title="Hot Lead Waiting"
          description="Lead #L-2847 from Mumbai region needs immediate attention"
          priority="high"
          countdown={45}
          isDark={isDark}
        />

        {/* Developer Timer Preview */}
        <motion.div 
          className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-400" />
              Active Developer Timers
            </h3>
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">12 Running</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'DEV***042', task: 'API Integration', time: '02:34:12', progress: 65 },
              { name: 'DEV***018', task: 'UI Fixes', time: '01:15:45', progress: 40 },
              { name: 'DEV***089', task: 'Bug Fix', time: '00:45:30', progress: 80 },
              { name: 'DEV***034', task: 'Feature Dev', time: '03:12:00', progress: 25 },
              { name: 'DEV***056', task: 'Testing', time: '00:30:15', progress: 90 },
              { name: 'DEV***071', task: 'Documentation', time: '01:00:00', progress: 55 },
            ].map((dev, idx) => (
              <motion.div 
                key={idx} 
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-600/50 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <p className="text-xs text-slate-400 truncate">{dev.name}</p>
                <p className="text-sm font-mono text-teal-400">{dev.time}</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${dev.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{dev.task}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role Modules Section Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h2 className="text-xl font-bold text-white">Role Modules • Live Activity</h2>
            <p className="text-sm text-slate-400">Real-time monitoring across all departments</p>
          </div>
          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
            <span className="h-2 w-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
            Live Updates
          </Badge>
        </motion.div>

        {/* 2x2 Role Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roleModules.map((role, idx) => (
            <RoleActivityCard
              key={role.id}
              title={role.title}
              icon={role.icon}
              stats={role.stats}
              index={idx}
            />
          ))}
        </div>

        {/* AI Insights Section */}
        <motion.div 
          className="p-6 rounded-2xl bg-slate-800/60 border border-teal-500/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            boxShadow: '0 8px 32px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Insights</h3>
              <p className="text-xs text-slate-400">Powered by Vala Intelligence</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { insight: 'Lead conversion rate up 15% this week', type: 'positive' },
              { insight: '3 developers approaching SLA deadline', type: 'warning' },
              { insight: 'Mumbai region showing highest growth', type: 'info' },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  item.type === 'positive' 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : item.type === 'warning' 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-teal-500/10 border-teal-500/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <div className="flex items-start gap-2">
                  {item.type === 'positive' && <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5" />}
                  {item.type === 'warning' && <Clock className="h-4 w-4 text-amber-400 mt-0.5" />}
                  {item.type === 'info' && <Globe className="h-4 w-4 text-teal-400 mt-0.5" />}
                  <p className="text-sm text-slate-200">{item.insight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
