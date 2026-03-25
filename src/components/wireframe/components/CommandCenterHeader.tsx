import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, TrendingUp, Users, DollarSign, 
  Zap, Shield, Clock, Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, subValue, icon, trend, trendUp }: StatCardProps) {
  return (
    <motion.div 
      className="relative p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm overflow-hidden group"
      whileHover={{ scale: 1.02, y: -2 }}
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-slate-700/50">
          {icon}
        </div>
        {trend && (
          <Badge 
            variant="outline" 
            className={`text-xs ${trendUp ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'}`}
          >
            {trendUp ? '↑' : '↓'} {trend}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <motion.p 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {value}
          </motion.p>
          {subValue && (
            <span className="text-sm text-slate-400">{subValue}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CommandCenterHeader() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              SUPER ADMIN COMMAND CENTER
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational • Live Monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-4 py-1.5">
            <Activity className="h-3 w-3 mr-1.5 animate-pulse" />
            LIVE
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-300 px-4 py-1.5">
            <Clock className="h-3 w-3 mr-1.5" />
            {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Booking Trajectory"
          value="1,950"
          subValue=".00"
          icon={<Target className="h-5 w-5 text-teal-400" />}
          trend="15%"
          trendUp={true}
        />
        <StatCard
          title="Active Value"
          value="₹890K"
          subValue="450K pending"
          icon={<DollarSign className="h-5 w-5 text-teal-400" />}
          trend="8%"
          trendUp={true}
        />
        <StatCard
          title="Sales Funnel"
          value="7.50%"
          subValue="4.39% prev"
          icon={<TrendingUp className="h-5 w-5 text-teal-400" />}
          trend="3.11%"
          trendUp={true}
        />
        <StatCard
          title="Growth Rate"
          value=".65%"
          subValue=".12% prev"
          icon={<Zap className="h-5 w-5 text-teal-400" />}
          trend="0.53%"
          trendUp={true}
        />
      </div>
    </motion.div>
  );
}
