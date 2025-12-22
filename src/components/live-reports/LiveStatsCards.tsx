import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, AlertTriangle, CheckCircle, 
  XCircle, Clock, Power, UserCheck, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

function StatsCard({ title, value, icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        gradient
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/20">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface LiveStatsCardsProps {
  stats: {
    totalLogs: number;
    successCount: number;
    failCount: number;
    blockedCount: number;
    warningCount: number;
    onlineCount: number;
    offlineCount: number;
    pendingCount: number;
    forceLoggedOutCount: number;
  };
}

export function LiveStatsCards({ stats }: LiveStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard
        title="Online Now"
        value={stats.onlineCount}
        icon={<Users className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-amber-400 to-orange-500"
        delay={0}
      />
      <StatsCard
        title="Total Activities"
        value={stats.totalLogs}
        icon={<Activity className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-violet-400 to-purple-600"
        delay={0.1}
      />
      <StatsCard
        title="Successful"
        value={stats.successCount}
        icon={<CheckCircle className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-lime-300 to-green-500"
        delay={0.2}
      />
      <StatsCard
        title="Warnings"
        value={stats.warningCount}
        icon={<AlertTriangle className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-rose-400 to-pink-600"
        delay={0.3}
      />
      <StatsCard
        title="Failed"
        value={stats.failCount}
        icon={<XCircle className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-red-400 to-red-600"
        delay={0.4}
      />
      <StatsCard
        title="Blocked"
        value={stats.blockedCount}
        icon={<XCircle className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-orange-400 to-amber-600"
        delay={0.5}
      />
      <StatsCard
        title="Pending Approval"
        value={stats.pendingCount}
        icon={<UserCheck className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-yellow-300 to-amber-500"
        delay={0.6}
      />
      <StatsCard
        title="Force Logged Out"
        value={stats.forceLoggedOutCount}
        icon={<Power className="w-5 h-5 text-white" />}
        gradient="bg-gradient-to-br from-slate-500 to-slate-700"
        delay={0.7}
      />
    </div>
  );
}
